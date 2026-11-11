'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Alert, Box, Button, Card, CardContent, Chip, Container, InputAdornment, Skeleton, Slider, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import LockOutlined from '@mui/icons-material/LockOutlined';
import NotificationsActiveOutlined from '@mui/icons-material/NotificationsActiveOutlined';
import { AddressSearch } from '@/components/AddressSearch';
import { HelpTip } from '@/components/HelpTip';
import { estimate as lookupEstimate } from '@/lib/addressService';
import type { GlossaryKey } from '@/lib/glossary';
import { money } from '@/lib/money';
import type { AddressSuggestion, HomeEstimate } from '@/lib/types';
import type { Sample } from '@/features/calculator/EquityCalculator';
import { SaveHomeDialog } from '@/features/calculator/SaveHomeDialog';
import { buildScenarios, pctText } from '@/features/calculator/scenarios';
import { EquityKept } from './EquityKept';

const r5k = (n: number) => Math.round(n / 5000) * 5000;

const valueBox = {
  minWidth: 112, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 1.5, borderRadius: 1.5, bgcolor: 'm3.surfaceContainerHighest',
  fontSize: '1rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2,
} as const;

/** A labeled slider: name and value on one line, the slider right under it. */
function Dial(p: {
  id: string; label: string; help?: GlossaryKey; box: React.ReactNode; value: number; min: number; max: number; step: number; onChange: (v: number) => void; text: (v: number) => string;
}) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ flexWrap: 'wrap', columnGap: 1, rowGap: 0.5 }}>
        <Stack direction="row" alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
          <Typography variant="subtitle2" component="h3" id={p.id} sx={{ whiteSpace: 'nowrap' }}>{p.label}</Typography>
          {p.help && <HelpTip k={p.help} />}
        </Stack>
        <Box sx={{ ml: 'auto' }}>{p.box}</Box>
      </Stack>
      <Slider aria-labelledby={p.id} getAriaValueText={p.text} value={p.value} min={p.min} max={p.max} step={p.step} onChange={(_, v) => p.onChange(v as number)} sx={{ display: 'block', mt: 1, mb: 0, py: '14px' }} />
    </Box>
  );
}

export function CalculatorV2({ typical, samples }: { typical: { value: number; sampleSize: number }; samples: Sample[] }) {
  const router = useRouter();
  const [estimate, setEstimate] = useState<HomeEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState(0);
  const [payoff, setPayoff] = useState(0);
  const [agentPct, setAgentPct] = useState(1.25);
  const [buyerPct, setBuyerPct] = useState(3);
  const [saveOpen, setSaveOpen] = useState(false);
  const [zoom, setZoom] = useState(true);

  async function choose(s: AddressSuggestion) {
    setLoading(true);
    setError(null);
    try {
      const e = await lookupEstimate(s);
      setEstimate(e);
      setPrice(e.mid);
      setPayoff(e.payoffGuess);
    } catch {
      setError('We could not look up that address. Check it and try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!estimate) return;
    try { sessionStorage.setItem('housa.calc', JSON.stringify({ estimate, price, payoff, buyerPct })); } catch { /* storage blocked */ }
  }, [estimate, price, payoff, buyerPct]);

  const sc = useMemo(
    () => (estimate ? buildScenarios({ price, payoff, buyerPct, typicalPct: typical.value, customFee: { kind: 'percent', value: agentPct } }) : null),
    [estimate, price, payoff, buyerPct, agentPct, typical.value],
  );

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 4 } }}>
      <Typography variant="h1" sx={{ fontSize: { xs: '1.375rem', md: '1.75rem' }, lineHeight: 1.2 }}>
        How much cash would you walk away with?
      </Typography>

      <Card sx={{ mt: 2.5, p: { xs: 2, sm: 3 }, bgcolor: 'm3.surfaceContainer' }}>
        <AddressSearch onSelect={choose} compact />
        {loading && <Skeleton variant="rounded" height={32} sx={{ mt: 1 }} aria-label="Looking up your home" />}
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        {!estimate ? (
          <Stack direction="row" useFlexGap flexWrap="wrap" alignItems="center" gap={1} sx={{ mt: 1.5 }} role="group" aria-label="Sample homes">
            <Typography variant="body2" color="text.secondary">Try a sample:</Typography>
            {samples.map((s) => <Chip key={s.id} label={s.label} variant="outlined" onClick={() => choose({ ...s, source: 'housa' })} sx={{ minHeight: 40 }} />)}
          </Stack>
        ) : (
          <Typography variant="body2" sx={{ mt: 2, lineHeight: 1.7 }}>
            <strong>{estimate.label}</strong>
            <Box component="span" sx={{ color: 'text.secondary' }}>
              {estimate.details?.beds ? ` · ${estimate.details.beds} bd/${estimate.details.baths} ba · ${estimate.details.sqft.toLocaleString()} sq ft` : ''}
              {` · worth about ${money(estimate.low)} – ${money(estimate.high)}`}
            </Box>
            <HelpTip k="homeValue" />
          </Typography>
        )}
      </Card>

      {!estimate && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, color: 'text.secondary' }}>
          <LockOutlined fontSize="small" aria-hidden />
          <Typography variant="body2">Free, no sign-up. Your address stays private. Agents only see it if you accept their bid.</Typography>
        </Stack>
      )}

      {estimate && sc && (() => {
        const you = sc.custom, trad = sc.traditional, mid = sc.housa;
        const min = r5k(estimate.low * 0.85), max = r5k(estimate.high * 1.15);
        const payoffMax = Math.max(max, payoff);
        const cols = [{ s: trad, name: 'Traditional 6%' }, { s: mid, name: 'Typical Housa' }, { s: you, name: 'Your terms' }];
        const cell = { py: 1.5, px: { xs: 0.5, sm: 2 }, textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } as const;
        return (
          <Box
            sx={{
              mt: 3, display: 'grid', gap: 3,
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 8fr) minmax(0, 4fr)' },
              gridTemplateAreas: { xs: '"hero" "inputs" "chart" "terms"', md: '"inputs hero" "chart chart" "terms terms"' },
            }}
          >
            {/* The answer */}
            <Card sx={{ gridArea: 'hero', bgcolor: 'm3.successContainer', color: 'm3.onSuccessContainer', border: 0 }}>
              <CardContent sx={{ p: { xs: 3, sm: 3.5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', textAlign: 'center', '&:last-child': { pb: { xs: 3, sm: 3.5 } } }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.25}>
                  <Typography variant="subtitle2" component="h2">Estimated cash at close</Typography>
                  <HelpTip k="cashAtClose" />
                </Stack>
                <Typography component="p" aria-live="polite" sx={{ fontSize: { xs: '2.75rem', sm: '3.5rem' }, lineHeight: 1.15, my: 1, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {money(you.youKeep)}
                </Typography>
                <Typography variant="body1" component="p" sx={{ fontWeight: 600, lineHeight: 1.6 }}>
                  {you.vsTraditional >= 0 ? `${money(you.vsTraditional)} more` : `${money(-you.vsTraditional)} less`} than a traditional 6% sale
                </Typography>
                <Typography variant="body2" component="p" sx={{ mt: 1, lineHeight: 1.7 }}>
                  Your fees {money(you.feesTotal)} ({pctText(you.agentPctTotal)} + $995) instead of <s>{money(trad.feesTotal)}</s>
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={() => router.push('/sell?from=calculator')}>Get offers from local agents</Button>
                  <Button variant="text" color="inherit" aria-label="Email me a monthly update" onClick={() => setSaveOpen(true)} sx={{ minWidth: 48, px: 1.5 }}>
                    <NotificationsActiveOutlined />
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* The dials, two across on wide screens */}
            <Card sx={{ gridArea: 'inputs' }}>
              <CardContent sx={{ p: { xs: 3, sm: 3.5 }, '&:last-child': { pb: { xs: 3, sm: 3.5 } } }}>
                <Box sx={{ display: 'grid', columnGap: 4, rowGap: 3, gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' } }}>
                  <Dial id="v2-price" label="Home sale price" value={price} min={min} max={max} step={5000} onChange={setPrice} text={money} box={<Box sx={valueBox}>{money(price)}</Box>} />
                  <Dial
                    id="v2-payoff" label="Mortgage balance" help="payoff" value={Math.min(payoff, payoffMax)} min={0} max={payoffMax} step={5000} onChange={setPayoff} text={money}
                    box={
                      <TextField
                        size="small" value={payoff.toLocaleString('en-US')} fullWidth={false}
                        onChange={(e) => setPayoff(Math.min(Number(e.target.value.replace(/[^0-9]/g, '')) || 0, 10_000_000))}
                        sx={{ width: 148, '& .MuiOutlinedInput-root': { minHeight: 40, height: 40, fontWeight: 700, pr: 0.5 }, '& input': { textAlign: 'right', py: 0, pr: 1 } }}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start" sx={{ mr: 0.25 }}>$</InputAdornment> }, htmlInput: { inputMode: 'numeric', 'aria-label': 'Mortgage balance in dollars' } }}
                      />
                    }
                  />
                  <Dial id="v2-agent" label={`Your agent · ${pctText(agentPct)}`} help="listingFee" value={agentPct} min={0.5} max={3} step={0.05} onChange={setAgentPct} text={(v) => `${v}%`} box={<Box sx={valueBox}>{money(you.agent)}</Box>} />
                  <Dial id="v2-buyer" label={`Buyer’s agent · ${pctText(buyerPct)}`} help="buyerAgent" value={buyerPct} min={0} max={3} step={0.25} onChange={setBuyerPct} text={(v) => `${v}%`} box={<Box sx={valueBox}>{money(you.buyerAgent)}</Box>} />
                </Box>
                <Box role="status" sx={{ mt: 3, borderRadius: 2, px: 2.5, py: 1.75, bgcolor: 'm3.secondaryContainer', color: 'm3.onSecondaryContainer', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="body2">Total to agents: <strong>{pctText(you.agentPctTotal)}</strong> (traditional: 6%)</Typography>
                  <Typography variant="subtitle1" component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {money(you.agentDollarsTotal)} <Box component="s" sx={{ fontWeight: 400, fontSize: '0.875rem', ml: 0.5 }}>{money(trad.agentDollarsTotal)}</Box>
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* The picture */}
            <Card sx={{ gridArea: 'chart' }}>
              <CardContent sx={{ p: { xs: 3, sm: 3.5 }, '&:last-child': { pb: { xs: 3, sm: 3.5 } } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-start' }} spacing={1.5}>
                  <Box>
                    <Typography variant="h6" component="h2">How much of your {money(you.equity)} equity you keep</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.7 }}>
                      Green is your cash at close. The striped end is what fees take.
                      {zoom ? <> <strong>Zoomed in: the bars start at the break mark, not at $0.</strong></> : null}
                    </Typography>
                  </Box>
                  <ToggleButtonGroup exclusive size="small" value={zoom ? 'zoom' : 'full'} onChange={(_, v) => v && setZoom(v === 'zoom')} aria-label="Chart scale" sx={{ flexShrink: 0 }}>
                    <ToggleButton value="zoom" sx={{ px: 2, borderRadius: '999px 0 0 999px' }}>Zoom in</ToggleButton>
                    <ToggleButton value="full" sx={{ px: 2, borderRadius: '0 999px 999px 0' }}>Full scale</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
                <Box sx={{ mt: 3 }} />
                <EquityKept zoom={zoom} equity={you.equity} rows={[{ label: 'Your terms', s: you, highlight: true }, { label: 'Typical Housa bid', s: mid }, { label: 'Traditional 6%', s: trad, warn: true }]} />
              </CardContent>
            </Card>

            {/* The terms, side by side */}
            <Card sx={{ gridArea: 'terms' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3.5 }, '&:last-child': { pb: { xs: 2.5, sm: 3.5 } } }}>
                <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>Three ways to sell, side by side</Typography>
                <Table size="small" aria-label="Three ways to sell, side by side" sx={{ tableLayout: 'fixed', width: '100%', '& td, & th': { borderColor: 'divider' } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ py: 0.5, px: 0, width: { xs: '25%', sm: '28%' } }}><Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Item</Box></TableCell>
                      {cols.map((c) => <TableCell key={c.name} sx={{ ...cell, whiteSpace: { xs: 'normal', sm: 'nowrap' }, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, py: 0.5, fontWeight: 700, verticalAlign: 'bottom', lineHeight: 1.2, color: c.s.key === 'custom' ? 'success.main' : 'text.primary' }}>{c.name}</TableCell>)}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { k: 'Cash at close', strong: true, v: (s: typeof you) => money(s.youKeep) },
                      { k: 'Total fees', sub: (s: typeof you) => (s.platform ? `${pctText(s.agentPctTotal)} + $995` : pctText(s.agentPctTotal)), v: (s: typeof you) => money(s.feesTotal) },
                      { k: 'Your agent', v: (s: typeof you) => `${money(s.agent)}` },
                      { k: "Buyer's agent", v: (s: typeof you) => `${money(s.buyerAgent)}` },
                      { k: 'Housa fee', v: (s: typeof you) => (s.platform ? money(s.platform) : '$0') },
                    ].map((r) => (
                      <TableRow key={r.k}>
                        <TableCell component="th" scope="row" sx={{ py: 1.5, px: 0, fontWeight: r.strong ? 700 : 400, fontSize: r.strong ? { xs: '0.875rem', sm: '1rem' } : { xs: '0.8125rem', sm: '0.875rem' }, whiteSpace: { xs: 'normal', sm: 'nowrap' }, lineHeight: 1.2 }}>{r.k}</TableCell>
                        {cols.map((c) => (
                          <TableCell key={c.name} sx={{ ...cell, fontWeight: r.strong ? 700 : 400, fontSize: { xs: r.strong ? '0.875rem' : '0.75rem', sm: r.strong ? '1.125rem' : '0.875rem' }, color: r.strong && c.s.key !== 'traditional' ? 'success.main' : r.strong ? 'text.secondary' : 'text.primary' }}>
                            {r.v(c.s)}
                            {'sub' in r && r.sub && <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2, whiteSpace: 'normal' }}>{r.sub(c.s)}</Typography>}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 2.5, lineHeight: 1.7 }}>
                  Same in all three: mortgage {money(payoff)} and about {money(you.otherClosing)} for title and closing. Estimates only. Housa does not set agent fees.{' '}
                  <Link href="/">See the first design</Link>
                </Typography>
              </CardContent>
            </Card>

            <SaveHomeDialog open={saveOpen} onClose={() => setSaveOpen(false)} estimate={estimate} youKeep={you.youKeep} onStartRequest={() => router.push('/sell?from=calculator')} />
          </Box>
        );
      })()}
    </Container>
  );
}
