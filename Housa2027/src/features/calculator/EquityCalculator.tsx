'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Card, CardContent, Chip, Container, Grid, InputAdornment,
  Skeleton, Slider, Stack, Table, TableBody, TableCell, TableRow, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditOutlined from '@mui/icons-material/EditOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import NotificationsActiveOutlined from '@mui/icons-material/NotificationsActiveOutlined';
import { AddressSearch } from '@/components/AddressSearch';
import { HelpTip } from '@/components/HelpTip';
import { netSheet, PLATFORM_FEE, type NetSheet } from '@/lib/fees';
import { about, money, pct } from '@/lib/money';
import type { AddressSuggestion, Fee, HomeEstimate } from '@/lib/types';
import { SaveHomeDialog } from './SaveHomeDialog';

const OTHER_CLOSING_PCT = 1;
type ScenarioKey = 'traditional' | 'housa' | 'custom';

export interface Sample { id: string; label: string; secondary: string }

export function EquityCalculator({ typical, samples }: { typical: { value: number; sampleSize: number }; samples: Sample[] }) {
  const router = useRouter();
  const [estimate, setEstimate] = useState<HomeEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState(0);
  const [payoff, setPayoff] = useState(0);
  const [buyerPct, setBuyerPct] = useState(3);
  const [customKind, setCustomKind] = useState<Fee['kind']>('percent');
  const [customPct, setCustomPct] = useState(1.25);
  const [customFlat, setCustomFlat] = useState(6000);
  const [detail, setDetail] = useState<ScenarioKey>('housa');
  const [saveOpen, setSaveOpen] = useState(false);

  async function choose(s: AddressSuggestion) {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ id: s.id, label: [s.label, s.secondary].filter(Boolean).join(', ') });
      if (s.zip) qs.set('zip', s.zip);
      const res = await fetch(`/api/estimate?${qs}`);
      if (!res.ok) throw new Error();
      const e = (await res.json()) as HomeEstimate;
      setEstimate(e);
      setPrice(e.mid);
      setPayoff(e.payoffGuess);
    } catch {
      setError('We could not look up that address. Check it and try again.');
    } finally {
      setLoading(false);
    }
  }

  // Carry the numbers to the seller request without putting the address in the URL.
  useEffect(() => {
    if (!estimate) return;
    try {
      sessionStorage.setItem('housa.calc', JSON.stringify({ estimate, price, payoff, buyerPct }));
    } catch { /* storage blocked */ }
  }, [estimate, price, payoff, buyerPct]);

  const sheets = useMemo(() => {
    if (!estimate) return null;
    const base = { salePrice: price, payoff, otherClosingPct: OTHER_CLOSING_PCT };
    const buyerAgent: Fee = { kind: 'percent', value: buyerPct };
    const customFee: Fee = customKind === 'percent' ? { kind: 'percent', value: customPct } : { kind: 'flat', value: customFlat };
    return {
      traditional: netSheet({ ...base, listingFee: { kind: 'percent', value: 3 }, buyerAgent: { kind: 'percent', value: 3 }, platformFee: 0 }),
      housa: netSheet({ ...base, listingFee: { kind: 'percent', value: typical.value }, buyerAgent, platformFee: PLATFORM_FEE }),
      custom: netSheet({ ...base, listingFee: customFee, buyerAgent, platformFee: PLATFORM_FEE }),
    } satisfies Record<ScenarioKey, NetSheet>;
  }, [estimate, price, payoff, buyerPct, customKind, customPct, customFlat, typical.value]);

  // ---------- Step 1: address ----------
  if (!estimate) {
    return (
      <Container maxWidth="md" sx={{ pt: { xs: 4, md: 8 } }}>
        <Typography variant="overline" color="primary" component="p">Free · No sign-up · Dallas–Fort Worth</Typography>
        <Typography variant="h1" sx={{ mt: 1, fontSize: { xs: '2rem', md: '2.8125rem' }, lineHeight: 1.2 }}>
          How much would you keep if you sold your home?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4, maxWidth: 560 }}>
          Enter your address. We will show your home’s value, what you owe, and the cash you could keep at different agent fees.
        </Typography>
        <Card sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'm3.surfaceContainer' }}>
          <AddressSearch onSelect={choose} />
          {loading && <Skeleton variant="rounded" height={48} sx={{ mt: 2 }} aria-label="Looking up your home" />}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, mb: 1 }} id="samples-label">
            Just looking? Try a sample home:
          </Typography>
          <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} role="group" aria-labelledby="samples-label">
            {samples.map((s) => (
              <Chip key={s.id} label={s.label} variant="outlined" onClick={() => choose({ ...s, source: 'housa' })} sx={{ minHeight: 40 }} />
            ))}
          </Stack>
        </Card>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 3, color: 'text.secondary' }}>
          <LockOutlined fontSize="small" aria-hidden />
          <Typography variant="body2">Your address stays private. Agents only see it if you accept their bid.</Typography>
        </Stack>
      </Container>
    );
  }

  // ---------- Step 2: results ----------
  const s = sheets!;
  const sliderMin = Math.round((estimate.low * 0.85) / 5000) * 5000;
  const sliderMax = Math.round((estimate.high * 1.15) / 5000) * 5000;
  const payoffMax = Math.max(sliderMax, payoff);
  const extra = s.housa.youKeep - s.traditional.youKeep;

  const scenarios: { key: ScenarioKey; title: string; sub: string; help: 'traditional' | 'typicalHousa' | 'listingFee' }[] = [
    { key: 'traditional', title: 'Traditional 6%', sub: "3% to your agent, 3% to the buyer's agent", help: 'traditional' },
    { key: 'housa', title: 'Typical Housa bid', sub: `${pct(typical.value)} to your agent + ${money(PLATFORM_FEE)} Housa fee`, help: 'typicalHousa' },
    {
      key: 'custom', title: 'Your own fee',
      sub: `${customKind === 'percent' ? pct(customPct) : money(customFlat)} to your agent + ${money(PLATFORM_FEE)} Housa fee`, help: 'listingFee',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 4 } }}>
      {/* Address bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', py: '12px !important' }}>
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography variant="subtitle1" component="h1">{estimate.label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {estimate.details?.beds
                ? `${estimate.details.beds} beds · ${estimate.details.baths} baths · ${estimate.details.sqft.toLocaleString()} sq ft · ${estimate.details.neighborhood}`
                : estimate.details?.neighborhood ?? 'Dallas–Fort Worth'}
            </Typography>
          </Box>
          <Button startIcon={<EditOutlined />} onClick={() => setEstimate(null)}>Change address</Button>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'grid', gap: 3, alignItems: 'start',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 7fr) minmax(0, 5fr)' },
          gridTemplateAreas: { xs: '"hero" "controls" "compare"', md: '"hero controls" "compare controls"' },
          gridTemplateRows: { md: 'auto 1fr' },
        }}
      >
        {/* Big answer first */}
        <Box sx={{ gridArea: 'hero' }}>
          <Card sx={{ bgcolor: 'm3.primaryContainer', color: 'm3.onPrimaryContainer', border: 0 }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography variant="body1" component="p" aria-live="polite">
                If you sold for about <strong>{about(price)}</strong> with a typical Housa bid, you could keep about
              </Typography>
              <Typography variant="moneyHero" component="p" sx={{ my: 1, fontSize: { xs: '2.75rem', sm: '3.5625rem' } }} aria-live="polite">
                {about(s.housa.youKeep)}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="body1" component="p">
                  That is <strong>{money(extra)} more</strong> than the traditional 6%.
                </Typography>
                <HelpTip k="youKeep" />
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ gridArea: 'compare' }}>
          {/* Three scenarios */}
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Compare three fee levels</Typography>
          <Grid container spacing={2} role="list">
            {scenarios.map((sc) => {
              const sheet = s[sc.key];
              const diff = sheet.youKeep - s.traditional.youKeep;
              const selected = detail === sc.key;
              return (
                <Grid size={{ xs: 12, sm: 4 }} key={sc.key} role="listitem">
                  <Card
                    sx={{
                      height: '100%', borderWidth: selected ? 2 : 1,
                      borderColor: selected ? 'primary.main' : 'divider',
                      bgcolor: sc.key === 'housa' ? 'm3.surfaceContainer' : undefined,
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1" component="h3">{sc.title}</Typography>
                        <HelpTip k={sc.help} />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>{sc.sub}</Typography>
                      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 2 }}>You keep</Typography>
                      <Typography variant="h3" component="p" sx={{ fontVariantNumeric: 'tabular-nums' }}>{money(sheet.youKeep)}</Typography>
                      <Typography variant="body2" sx={{ color: diff > 0 ? 'success.main' : 'text.secondary', fontWeight: 500, minHeight: 20 }}>
                        {sc.key === 'traditional' ? 'The old standard' : diff >= 0 ? `+${money(diff)} vs. 6%` : `${money(diff)} vs. 6%`}
                      </Typography>
                      <Button size="small" sx={{ mt: 1, ml: -1 }} onClick={() => setDetail(sc.key)} aria-pressed={selected}>
                        {selected ? 'Showing the math' : 'Show the math'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* The math */}
          <Accordion
            disableGutters
            defaultExpanded
            sx={{ mt: 2, borderRadius: 3, '&::before': { display: 'none' }, border: 1, borderColor: 'divider', bgcolor: 'm3.surfaceContainerLow' }}
            elevation={0}
          >
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 56 }}>
              <Typography variant="subtitle1" component="h2">The math: {scenarios.find((x) => x.key === detail)!.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table size="small" aria-label={`Costs for ${scenarios.find((x) => x.key === detail)!.title}`}>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">Sale price</TableCell>
                    <TableCell align="right">{money(price)}</TableCell>
                  </TableRow>
                  {s[detail].lines.map((l) => (
                    <TableRow key={l.key}>
                      <TableCell component="th" scope="row">
                        {l.label} {l.help && <HelpTip k={l.help as never} />}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>− {money(l.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 700, borderBottom: 0 }}>You keep</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, borderBottom: 0 }}>{money(s[detail].youKeep)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Controls */}
        <Box sx={{ gridArea: 'controls', alignSelf: 'stretch' }}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
            <Card>
              <CardContent sx={{ display: 'grid', gap: 3, p: { xs: 2.5, sm: 3 } }}>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle1" component="h2" id="value-label">Home value range</Typography>
                    <HelpTip k="homeValue" />
                  </Stack>
                  <Typography variant="h4" component="p" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                    {money(estimate.low)} – {money(estimate.high)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {estimate.source === 'housa-record'
                      ? 'From Housa’s home records (sample data).'
                      : estimate.source === 'zip-estimate'
                        ? `A rough guess from homes in ${estimate.zip}. Agents will give you a real price.`
                        : 'A rough Dallas–Fort Worth guess. Agents will give you a real price.'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" component="h2" id="price-label">Sale price: {money(price)}</Typography>
                  <Slider
                    aria-labelledby="price-label"
                    getAriaValueText={(v) => money(v)}
                    value={price}
                    min={sliderMin}
                    max={sliderMax}
                    step={5000}
                    marks={[{ value: estimate.low, label: 'Low' }, { value: estimate.mid, label: 'Mid' }, { value: estimate.high, label: 'High' }]}
                    onChange={(_, v) => setPrice(v as number)}
                  />
                </Box>

                <Box>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle1" component="h2" id="payoff-label">What you still owe</Typography>
                    <HelpTip k="payoff" />
                  </Stack>
                  <TextField
                    sx={{ mt: 1 }}
                    label="Mortgage payoff"
                    value={payoff ? payoff.toLocaleString('en-US') : '0'}
                    onChange={(e) => {
                      const n = Number(e.target.value.replace(/[^0-9]/g, ''));
                      if (Number.isFinite(n)) setPayoff(Math.min(n, 10_000_000));
                    }}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> }, htmlInput: { inputMode: 'numeric' } }}
                    helperText={estimate.payoffKnown ? 'From your sample record. Change it if it’s wrong.' : 'This is a guess. Change it to match your loan, or 0 if you own it outright.'}
                  />
                  <Slider
                    aria-label="Mortgage payoff"
                    getAriaValueText={(v) => money(v)}
                    value={Math.min(payoff, payoffMax)}
                    min={0}
                    max={payoffMax}
                    step={5000}
                    onChange={(_, v) => setPayoff(v as number)}
                  />
                </Box>

                <Box>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle1" component="h2" id="custom-label">Try your own agent fee</Typography>
                    <HelpTip k="listingFee" />
                  </Stack>
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={customKind}
                    onChange={(_, v) => v && setCustomKind(v)}
                    aria-label="Fee type"
                    sx={{ mt: 1, mb: 1 }}
                  >
                    <ToggleButton value="percent" sx={{ px: 2.5, borderRadius: '999px 0 0 999px' }}>Percent</ToggleButton>
                    <ToggleButton value="flat" sx={{ px: 2.5, borderRadius: '0 999px 999px 0' }}>Flat fee</ToggleButton>
                  </ToggleButtonGroup>
                  {customKind === 'percent' ? (
                    <>
                      <Typography variant="body1" id="custom-pct">{pct(customPct)} = {money((price * customPct) / 100)}</Typography>
                      <Slider aria-labelledby="custom-pct" getAriaValueText={(v) => `${v}%`} value={customPct} min={0.5} max={3} step={0.05} onChange={(_, v) => setCustomPct(v as number)} />
                    </>
                  ) : (
                    <>
                      <Typography variant="body1" id="custom-flat">{money(customFlat)} flat</Typography>
                      <Slider aria-labelledby="custom-flat" getAriaValueText={(v) => money(v)} value={customFlat} min={1000} max={20000} step={250} onChange={(_, v) => setCustomFlat(v as number)} />
                    </>
                  )}
                </Box>

                <Box>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle1" component="h2" id="buyer-label">Offer to the buyer’s agent: {pct(buyerPct)}</Typography>
                    <HelpTip k="buyerAgent" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{buyerPct === 0 ? '$0. The buyer pays their own agent.' : `${money((price * buyerPct) / 100)}. Used for the Housa and custom fees.${buyerPct === 3 ? ' At 3%, this matches the traditional split.' : ''}`}</Typography>
                  <Slider
                    aria-labelledby="buyer-label"
                    getAriaValueText={(v) => `${v}%`}
                    value={buyerPct}
                    min={0}
                    max={3}
                    step={0.25}
                    marks={[{ value: 0, label: '$0' }, { value: 3, label: '3%' }]}
                    onChange={(_, v) => setBuyerPct(v as number)}
                  />
                </Box>
              </CardContent>
            </Card>

            <Stack spacing={1.5} sx={{ mt: 3 }}>
              <Button variant="contained" size="large" onClick={() => router.push('/sell?from=calculator')}>
                Get offers from local agents
              </Button>
              <Button variant="outlined" size="large" startIcon={<NotificationsActiveOutlined />} onClick={() => setSaveOpen(true)}>
                Email me a monthly update
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                These are estimates, not an appraisal or an offer. Housa does not set agent fees; agents set their own when they bid.
                The typical Housa bid is the middle of {typical.sampleSize} sample full-service bids.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>

      <SaveHomeDialog open={saveOpen} onClose={() => setSaveOpen(false)} estimate={estimate} youKeep={s.housa.youKeep} onStartRequest={() => router.push('/sell?from=calculator')} />
    </Container>
  );
}
