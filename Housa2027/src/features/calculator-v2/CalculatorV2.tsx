'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, Card, CardContent, Chip, Container, InputAdornment, Skeleton, Slider, Stack, TextField, Typography } from '@mui/material';
import LockOutlined from '@mui/icons-material/LockOutlined';
import NotificationsActiveOutlined from '@mui/icons-material/NotificationsActiveOutlined';
import { AddressSearch } from '@/components/AddressSearch';
import { HelpTip } from '@/components/HelpTip';
import { estimate as lookupEstimate } from '@/lib/addressService';
import { PLATFORM_FEE } from '@/lib/fees';
import type { GlossaryKey } from '@/lib/glossary';
import { money } from '@/lib/money';
import type { AddressSuggestion, HomeEstimate } from '@/lib/types';
import type { Sample } from '@/features/calculator/EquityCalculator';
import { SaveHomeDialog } from '@/features/calculator/SaveHomeDialog';
import { buildScenarios, pctText, type Scenario } from '@/features/calculator/scenarios';
import { EquityKept } from './EquityKept';

const r5k = (n: number) => Math.round(n / 5000) * 5000;

/** A labeled slider with its value in a box on the right and min/max captions under the track. */
function Dial(p: {
  id: string; label: string; help?: GlossaryKey; box: React.ReactNode; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; text: (v: number) => string; captions: [string, string, string?];
}) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="subtitle1" component="h3" id={p.id}>{p.label}</Typography>
          {p.help && <HelpTip k={p.help} />}
        </Stack>
        {p.box}
      </Stack>
      <Slider aria-labelledby={p.id} getAriaValueText={p.text} value={p.value} min={p.min} max={p.max} step={p.step} onChange={(_, v) => p.onChange(v as number)} sx={{ mt: 0.5, mb: -1 }} />
      <Stack direction="row" justifyContent="space-between" sx={{ color: 'text.secondary' }}>
        <Typography variant="caption">{p.captions[0]}</Typography>
        {p.captions[2] && <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>{p.captions[2]}</Typography>}
        <Typography variant="caption">{p.captions[1]}</Typography>
      </Stack>
    </Box>
  );
}

const valueBox = {
  minWidth: 132, textAlign: 'right', px: 2, py: 1, borderRadius: 2, bgcolor: 'm3.surfaceContainerHighest',
  fontSize: '1.25rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.4,
} as const;

function TermsCard({ title, tag, s, price, muted, highlight }: { title: string; tag: string; s: Scenario; price: number; muted?: boolean; highlight?: boolean }) {
  const ink = muted ? 'text.secondary' : 'text.primary';
  const rows: [string, string][] = [
    ['Home price', money(price)],
    ['Your agent', `${money(s.agent)} · ${pctText(s.agentPctTotal - s.buyerAgentPct)}`],
    ["Buyer's agent", `${money(s.buyerAgent)} · ${pctText(s.buyerAgentPct)}`],
    ['Housa fee', s.platform ? money(s.platform) : '$0'],
    ['Mortgage balance', money(s.payoff)],
    ['Title & closing', money(s.otherClosing)],
  ];
  return (
    <Card sx={{ height: '100%', borderWidth: highlight ? 2 : 1, borderColor: highlight ? 'success.main' : 'divider', bgcolor: highlight ? 'm3.surfaceContainerHigh' : undefined }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, textAlign: 'center' }}>
        <Typography variant="overline" component="p" color="text.secondary">{tag}</Typography>
        <Typography variant="h6" component="h3" sx={{ color: ink }}>{title}</Typography>
        <Typography component="p" sx={{ mt: 2, fontSize: { xs: '2.25rem', md: '2.5rem' }, lineHeight: 1.1, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: muted ? 'text.secondary' : 'success.main' }}>
          {money(s.youKeep)}
        </Typography>
        <Typography variant="body2" color="text.secondary">Cash at close</Typography>
        <Box sx={{ mt: 2, py: 1.5, borderRadius: 2, bgcolor: 'm3.surfaceContainerHighest' }}>
          <Typography variant="caption" component="p" color="text.secondary">Total fees</Typography>
          <Typography variant="h5" component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: ink }}>{money(s.feesTotal)}</Typography>
          <Typography variant="body2" color="text.secondary">{s.platform ? `${pctText(s.agentPctTotal)} + ${money(s.platform)}` : pctText(s.agentPctTotal)}</Typography>
        </Box>
        <Box component="dl" sx={{ m: 0, mt: 2, display: 'grid', gridTemplateColumns: 'auto auto', rowGap: 1, columnGap: 2, textAlign: 'left' }}>
          {rows.map(([k, v]) => (
            <Box key={k} sx={{ display: 'contents' }}>
              <Typography component="dt" variant="body2" color="text.secondary">{k}</Typography>
              <Typography component="dd" variant="body2" sx={{ m: 0, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: ink, whiteSpace: 'nowrap' }}>{v}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
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
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
      <Typography variant="overline" color="primary" component="p">Free · No sign-up · Dallas–Fort Worth · Design B</Typography>
      <Typography variant="h1" sx={{ mt: 0.5, fontSize: { xs: '1.75rem', md: '2.25rem' }, lineHeight: 1.2 }}>
        How much cash would you walk away with?
      </Typography>

      {/* Address stays on top, so you can change it any time */}
      <Card sx={{ mt: 3, p: { xs: 2, sm: 3 }, bgcolor: 'm3.surfaceContainer' }}>
        <AddressSearch onSelect={choose} />
        {loading && <Skeleton variant="rounded" height={48} sx={{ mt: 2 }} aria-label="Looking up your home" />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {!estimate ? (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }} id="v2-samples">Just looking? Try a sample home:</Typography>
            <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} role="group" aria-labelledby="v2-samples">
              {samples.map((s) => <Chip key={s.id} label={s.label} variant="outlined" onClick={() => choose({ ...s, source: 'housa' })} sx={{ minHeight: 40 }} />)}
            </Stack>
          </>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>{estimate.label}</strong>
            <Box component="span" sx={{ color: 'text.secondary' }}>
              {estimate.details?.beds ? ` · ${estimate.details.beds} bd / ${estimate.details.baths} ba · ${estimate.details.sqft.toLocaleString()} sq ft` : ''}
              {` · worth about ${money(estimate.low)} – ${money(estimate.high)}`}
            </Box>
            <HelpTip k="homeValue" />
          </Typography>
        )}
      </Card>

      {!estimate && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 3, color: 'text.secondary' }}>
          <LockOutlined fontSize="small" aria-hidden />
          <Typography variant="body2">Your address stays private. Agents only see it if you accept their bid.</Typography>
        </Stack>
      )}

      {estimate && sc && (() => {
        const you = sc.custom, trad = sc.traditional;
        const min = r5k(estimate.low * 0.85), max = r5k(estimate.high * 1.15);
        const payoffMax = Math.max(max, payoff);
        return (
          <Box
            sx={{
              mt: 3, display: 'grid', gap: 3,
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
              gridTemplateAreas: { xs: '"hero" "inputs" "chart" "cards"', md: '"inputs hero" "chart chart" "cards cards"' },
            }}
          >
            {/* The answer */}
            <Card sx={{ gridArea: 'hero', bgcolor: 'm3.successContainer', color: 'm3.onSuccessContainer', border: 0, display: 'flex' }}>
              <CardContent sx={{ p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', textAlign: 'center' }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                  <Typography variant="subtitle1" component="h2">Estimated cash at close</Typography>
                  <HelpTip k="cashAtClose" />
                </Stack>
                <Typography component="p" aria-live="polite" sx={{ my: 1, fontSize: { xs: '3.25rem', sm: '4.5rem' }, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {money(you.youKeep)}
                </Typography>
                <Typography variant="h6" component="p">
                  {you.vsTraditional >= 0 ? `${money(you.vsTraditional)} more` : `${money(-you.vsTraditional)} less`} than a traditional 6% sale
                </Typography>
                <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, borderTop: 1, borderColor: 'm3.outlineVariant', pt: 2 }}>
                  <Box>
                    <Typography variant="body2" component="p">Your total fees</Typography>
                    <Typography variant="h5" component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(you.feesTotal)}</Typography>
                    <Typography variant="body2">{pctText(you.agentPctTotal)} + {money(PLATFORM_FEE)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" component="p">Traditional fees</Typography>
                    <Typography variant="h5" component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}><s>{money(trad.feesTotal)}</s></Typography>
                    <Typography variant="body2">6%</Typography>
                  </Box>
                </Box>
                <Stack spacing={1.5} sx={{ mt: 3 }}>
                  <Button variant="contained" size="large" onClick={() => router.push('/sell?from=calculator')}>Get offers from local agents</Button>
                  <Button variant="text" color="inherit" startIcon={<NotificationsActiveOutlined />} onClick={() => setSaveOpen(true)}>Email me a monthly update</Button>
                </Stack>
              </CardContent>
            </Card>

            {/* The dials */}
            <Card sx={{ gridArea: 'inputs' }}>
              <CardContent sx={{ display: 'grid', gap: 3, p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h5" component="h2">Your numbers</Typography>
                <Dial
                  id="v2-price" label="Home sale price" value={price} min={min} max={max} step={5000} onChange={setPrice} text={money}
                  box={<Box sx={valueBox}>{money(price)}</Box>} captions={[money(min), money(max)]}
                />
                <Dial
                  id="v2-payoff" label="Mortgage balance" help="payoff" value={Math.min(payoff, payoffMax)} min={0} max={payoffMax} step={5000} onChange={setPayoff} text={money}
                  captions={['$0', money(payoffMax)]}
                  box={
                    <TextField
                      size="small" fullWidth={false} value={payoff.toLocaleString('en-US')}
                      onChange={(e) => setPayoff(Math.min(Number(e.target.value.replace(/[^0-9]/g, '')) || 0, 10_000_000))}
                      sx={{ width: 150, '& .MuiOutlinedInput-root': { minHeight: 44, fontWeight: 700, fontSize: '1.125rem' }, '& input': { textAlign: 'right' } }}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> }, htmlInput: { inputMode: 'numeric', 'aria-label': 'Mortgage balance in dollars' } }}
                    />
                  }
                />
                <Dial
                  id="v2-agent" label="Fee to your agent" help="listingFee" value={agentPct} min={0.5} max={3} step={0.05} onChange={setAgentPct} text={(v) => `${v}%`}
                  box={<Box sx={valueBox}>{money(you.agent)}</Box>} captions={['0.5%', '3%', pctText(agentPct)]}
                />
                <Dial
                  id="v2-buyer" label="Offer to the buyer’s agent" help="buyerAgent" value={buyerPct} min={0} max={3} step={0.25} onChange={setBuyerPct} text={(v) => `${v}%`}
                  box={<Box sx={valueBox}>{money(you.buyerAgent)}</Box>} captions={['0%', '3%', pctText(buyerPct)]}
                />
                <Box role="status" sx={{ borderRadius: 2, p: 2, bgcolor: 'm3.secondaryContainer', color: 'm3.onSecondaryContainer', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', columnGap: 2 }}>
                  <Typography variant="body1">You offer a total of <strong>{pctText(you.agentPctTotal)}</strong> to agents</Typography>
                  <Typography variant="h5" component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(you.agentDollarsTotal)}</Typography>
                  <Typography variant="body2">A traditional sale is 6%</Typography>
                  <Typography variant="body1" sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}><s>{money(trad.agentDollarsTotal)}</s></Typography>
                </Box>
              </CardContent>
            </Card>

            {/* The picture */}
            <Card sx={{ gridArea: 'chart' }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h5" component="h2">How much of your equity you keep</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.5, maxWidth: 720 }}>
                  You have {money(you.equity)} of equity in this sale. <Box component="strong" sx={{ color: 'text.primary' }}>Green is the cash you walk away with.</Box> The striped end is what fees take.
                </Typography>
                <EquityKept
                  equity={you.equity}
                  rows={[{ label: 'Your terms', s: you, highlight: true }, { label: 'Typical Housa bid', s: sc.housa }, { label: 'Traditional 6%', s: trad, warn: true }]}
                />
              </CardContent>
            </Card>

            {/* The terms, side by side */}
            <Box sx={{ gridArea: 'cards' }}>
              <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Three ways to sell, side by side</Typography>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' } }}>
                <TermsCard tag="The old standard" title="Traditional 6%" s={trad} price={price} muted />
                <TermsCard tag={`Middle of ${typical.sampleSize} sample bids`} title="Typical Housa bid" s={sc.housa} price={price} />
                <TermsCard tag="Set with the sliders" title="Your terms" s={you} price={price} highlight />
              </Box>
              <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 2 }}>
                These are estimates, not an appraisal or an offer. Housa does not set agent fees; agents set their own when they bid. Title and closing costs are a rough 1% of the price.{' '}
                <Link href="/">See the first design</Link>
              </Typography>
            </Box>

            <SaveHomeDialog open={saveOpen} onClose={() => setSaveOpen(false)} estimate={estimate} youKeep={you.youKeep} onStartRequest={() => router.push('/sell?from=calculator')} />
          </Box>
        );
      })()}
    </Container>
  );
}
