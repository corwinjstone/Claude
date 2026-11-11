'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert, Box, Button, Card, CardContent, Chip, Container, InputAdornment,
  Skeleton, Slider, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import NotificationsActiveOutlined from '@mui/icons-material/NotificationsActiveOutlined';
import { AddressSearch } from '@/components/AddressSearch';
import { HelpTip } from '@/components/HelpTip';
import { PLATFORM_FEE } from '@/lib/fees';
import { about, money, pct } from '@/lib/money';
import type { AddressSuggestion, Fee, HomeEstimate } from '@/lib/types';
import { SaveHomeDialog } from './SaveHomeDialog';
import { buildScenarios, pctText, type ScenarioKey } from './scenarios';
import { EquityBars } from './EquityBars';
import { FeeZoom } from './FeeZoom';
import { CompareTable } from './CompareTable';
import { estimate as lookupEstimate } from '@/lib/addressService';


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
  const [headline, setHeadline] = useState<ScenarioKey>('housa');
  const [saveOpen, setSaveOpen] = useState(false);
  const [chartView, setChartView] = useState<'zoom' | 'whole'>('zoom');

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

  // Carry the numbers to the seller request without putting the address in the URL.
  useEffect(() => {
    if (!estimate) return;
    try {
      sessionStorage.setItem('housa.calc', JSON.stringify({ estimate, price, payoff, buyerPct }));
    } catch { /* storage blocked */ }
  }, [estimate, price, payoff, buyerPct]);

  const sc = useMemo(() => {
    if (!estimate) return null;
    const customFee: Fee = customKind === 'percent' ? { kind: 'percent', value: customPct } : { kind: 'flat', value: customFlat };
    return buildScenarios({ price, payoff, buyerPct, typicalPct: typical.value, customFee });
  }, [estimate, price, payoff, buyerPct, customKind, customPct, customFlat, typical.value]);

  // Adjusting your own fee puts it in the headline.
  const editCustom = <T,>(set: (v: T) => void) => (v: T) => { set(v); setHeadline('custom'); };

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
  const all = sc!;
  const list = [all.traditional, all.housa, all.custom];
  const h = all[headline];
  const t = all.traditional;
  const sliderMin = Math.round((estimate.low * 0.85) / 5000) * 5000;
  const sliderMax = Math.round((estimate.high * 1.15) / 5000) * 5000;
  const payoffMax = Math.max(sliderMax, payoff);
  const headlineName = headline === 'traditional' ? 'the traditional 6%' : headline === 'housa' ? 'a typical Housa bid' : 'your fee';

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
          gridTemplateAreas: { xs: '"hero" "chart" "controls" "table"', md: '"hero controls" "chart controls" "table controls"' },
          gridTemplateRows: { md: 'auto auto 1fr' },
        }}
      >
        {/* Headline: cash at close first, then where the rest of your equity went */}
        <Box sx={{ gridArea: 'hero' }}>
          <Card sx={{ bgcolor: 'm3.successContainer', color: 'm3.onSuccessContainer', border: 0 }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="body1" component="p">
                  Sell for <strong>{money(price)}</strong> with {headlineName}. Your <strong>cash at close</strong>:
                </Typography>
                <HelpTip k="cashAtClose" />
              </Stack>
              <Typography variant="moneyHero" component="p" aria-live="polite" sx={{ my: 1, fontSize: { xs: '3rem', sm: '4rem' }, lineHeight: 1.1 }}>
                {about(h.youKeep)}
              </Typography>
              <Box
                sx={{
                  mt: 2, pt: 2, display: 'grid', gap: 2, borderTop: 1, borderColor: 'm3.outlineVariant',
                  gridTemplateColumns: headline === 'traditional' ? '1fr 1fr' : { xs: '1fr 1fr', sm: '1fr 1fr 1fr' },
                }}
              >
                <Box>
                  <Typography variant="body2" component="p">Your equity</Typography>
                  <Typography variant="h5" component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(h.equity)}</Typography>
                  <Typography variant="body2">price − mortgage</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" component="p">Fees eat</Typography>
                  <Typography variant="h5" component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(h.feesTotal)}</Typography>
                  <Typography variant="body2">{h.platform ? `${pctText(h.agentPctTotal)} + ${money(h.platform)}` : pctText(h.agentPctTotal)}</Typography>
                  {headline !== 'traditional' && (
                    <Typography variant="body2">vs. <Box component="s" sx={{ textDecorationThickness: 2 }}>{money(t.feesTotal)}</Box> at 6%</Typography>
                  )}
                </Box>
                {headline !== 'traditional' && (
                  <Box sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }}>
                    <Typography variant="body2" component="p">More cash than 6%</Typography>
                    <Typography variant="h5" component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {h.vsTraditional >= 0 ? '+' : '−'}{money(Math.abs(h.vsTraditional))}
                    </Typography>
                    <Typography variant="body2">in your pocket</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ gridArea: 'chart' }}>
          <Card>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-start' }} spacing={1.5}>
                <Typography variant="h5" component="h2">How much fees eat your cash</Typography>
                <ToggleButtonGroup exclusive size="small" value={chartView} onChange={(_, v) => v && setChartView(v)} aria-label="Chart view">
                  <ToggleButton value="zoom" sx={{ px: 2, borderRadius: '999px 0 0 999px' }}>Zoom on fees</ToggleButton>
                  <ToggleButton value="whole" sx={{ px: 2, borderRadius: '0 999px 999px 0' }}>Whole equity</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                {chartView === 'zoom' ? (
                  <>Zoomed in on the top of your {money(all.traditional.equity)} equity. <Box component="strong" sx={{ color: 'text.primary' }}>The green dot is your cash at close.</Box> The colored span is what fees eat before you get paid. Further right means more cash.</>
                ) : (
                  <>Each bar is your whole {money(all.traditional.equity)} of equity. <Box component="strong" sx={{ color: 'text.primary' }}>Green is your cash at close.</Box> Everything after it is fees eating into it.</>
                )}
              </Typography>
              {chartView === 'zoom' ? <FeeZoom scenarios={list} selected={headline} /> : <EquityBars scenarios={list} selected={headline} />}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ gridArea: 'table' }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" component="h2">The math, line by line</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                Tap an option to show it in the headline.
              </Typography>
              <CompareTable scenarios={list} price={price} selected={headline} onSelect={setHeadline} />
            </CardContent>
          </Card>
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
                    <Typography variant="subtitle1" component="h2" id="custom-label">Your fee: your agent</Typography>
                    <HelpTip k="listingFee" />
                  </Stack>
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={customKind}
                    onChange={(_, v) => v && editCustom(setCustomKind)(v)}
                    aria-label="Fee type"
                    sx={{ mt: 1, mb: 1 }}
                  >
                    <ToggleButton value="percent" sx={{ px: 2.5, borderRadius: '999px 0 0 999px' }}>Percent</ToggleButton>
                    <ToggleButton value="flat" sx={{ px: 2.5, borderRadius: '0 999px 999px 0' }}>Flat fee</ToggleButton>
                  </ToggleButtonGroup>
                  {customKind === 'percent' ? (
                    <>
                      <Typography variant="body1" id="custom-pct">{pct(customPct)} = {money((price * customPct) / 100)}</Typography>
                      <Slider aria-labelledby="custom-pct" getAriaValueText={(v) => `${v}%`} value={customPct} min={0.5} max={3} step={0.05} onChange={(_, v) => editCustom(setCustomPct)(v as number)} />
                    </>
                  ) : (
                    <>
                      <Typography variant="body1" id="custom-flat">{money(customFlat)} flat</Typography>
                      <Slider aria-labelledby="custom-flat" getAriaValueText={(v) => money(v)} value={customFlat} min={1000} max={20000} step={250} onChange={(_, v) => editCustom(setCustomFlat)(v as number)} />
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

                <Box role="status" sx={{ bgcolor: 'm3.secondaryContainer', color: 'm3.onSecondaryContainer', borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle2" component="p">Your total fees</Typography>
                  <Typography variant="h5" component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {pctText(all.custom.agentPctTotal)} = {money(all.custom.agentDollarsTotal)}
                  </Typography>
                  <Typography variant="body2">
                    {customKind === 'percent' ? pctText(customPct) : money(customFlat)} to your agent + {pctText(buyerPct)} to the buyer’s agent, plus the {money(PLATFORM_FEE)} Housa fee.
                    {' '}At 6% you would pay {money(t.agentDollarsTotal)}.
                  </Typography>
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

      <SaveHomeDialog open={saveOpen} onClose={() => setSaveOpen(false)} estimate={estimate} youKeep={h.youKeep} onStartRequest={() => router.push('/sell?from=calculator')} />
    </Container>
  );
}
