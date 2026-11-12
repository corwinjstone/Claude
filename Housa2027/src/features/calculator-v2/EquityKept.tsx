'use client';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { money, moneyCompact } from '@/lib/money';
import { pctText, type Scenario } from '@/features/calculator/scenarios';
import { PLATFORM_FEE_NAME } from '@/lib/fees';

const DARK = '#111318';
const onCash = { color: '#fff', '[class~="dark"] &': { color: DARK } };
const hatch = (c: string) => `repeating-linear-gradient(135deg, ${c} 0 5px, transparent 5px 10px)`;

type Row = { label: string; s: Scenario; highlight?: boolean; warn?: boolean };

/**
 * Compact rows on a 0–100% scale of your equity: label, bar, amount.
 * Solid green is the cash you keep, the striped part is agent fees, the small violet bar is the platform fee,
 * and the gray end is estimated closing costs.
 */
export function EquityKept({ equity, rows, zoom = true }: { equity: number; rows: Row[]; zoom?: boolean }) {
  if (equity <= 0) return <Typography color="text.secondary">You owe more than this price, so there is no equity to show. Try a higher price or a lower mortgage balance.</Typography>;
  // Zoomed: the scale starts a little below the smallest cash amount instead of $0, so gaps between options grow.
  const minCash = Math.max(0, Math.min(...rows.map((r) => r.s.youKeep)));
  const step = 5000;
  const lo = zoom ? Math.max(0, Math.floor((minCash - (equity - minCash) * 0.3) / step) * step) : 0;
  const span = equity - lo;
  const pos = (v: number) => Math.max(0, Math.min(100, ((v - lo) / span) * 100));
  const tickStep = (() => { const raw = span / 4; const mag = 10 ** Math.floor(Math.log10(raw)); return [1, 2, 2.5, 5, 10].map((m) => m * mag).find((x) => span / x <= 5)!; })();
  const ticks: number[] = [];
  if (zoom) for (let t = Math.ceil(lo / tickStep) * tickStep; t < equity - tickStep * 0.4; t += tickStep) ticks.push(t);
  const rowGrid = { display: 'grid', alignItems: 'center', columnGap: 2, rowGap: 0.75, gridTemplateColumns: { xs: '1fr auto', md: '168px minmax(0, 1fr) 150px' } } as const;
  const track = { position: 'relative', display: 'flex', height: { xs: 32, md: 40 }, p: '3px', borderRadius: 999, bgcolor: 'm3.surfaceContainerHighest', overflow: 'hidden', gridColumn: { xs: '1 / -1', md: 'auto' }, order: { xs: 3, md: 0 } } as const;
  const amount = (n: number) => (
    <Typography component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', textAlign: 'right', lineHeight: 1.2 }}>
      {money(n)} <Box component="span" sx={{ fontWeight: 400, fontSize: '0.8125rem', color: 'text.secondary' }}>({Math.round((n / equity) * 100)}%)</Box>
    </Typography>
  );

  return (
    <Box>
      <Box aria-hidden sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '168px minmax(0, 1fr) 150px', columnGap: 2, color: 'text.secondary', mb: 1 }}>
        <span />
        <Box sx={{ position: 'relative', height: 18, mx: '3px' }}>
          {zoom ? (
            <>
              <Typography variant="caption" sx={{ position: 'absolute', left: 0, fontWeight: 600 }}>{moneyCompact(lo)}</Typography>
              {ticks.filter((t) => t > lo).map((t) => (
                <Typography key={t} variant="caption" sx={{ position: 'absolute', left: `${pos(t)}%`, transform: 'translateX(-50%)', fontWeight: 600 }}>{moneyCompact(t)}</Typography>
              ))}
            </>
          ) : (
            ['0%', '25%', '50%', '75%'].map((t, i) => <Typography key={t} variant="caption" sx={{ position: 'absolute', left: `${i * 25}%`, transform: i ? 'translateX(-50%)' : undefined, fontWeight: 600 }}>{t}</Typography>)
          )}
          <Typography variant="caption" sx={{ position: 'absolute', right: 0, fontWeight: 700, color: 'text.primary' }}>{moneyCompact(equity)}{zoom ? '' : ' (100%)'}</Typography>
        </Box>
        <span />
      </Box>

      <Stack spacing={{ xs: 2.5, md: 2 }}>
        <Box sx={rowGrid}>
          <Typography variant="subtitle2" component="h3" sx={{ lineHeight: 1.4 }}>Your equity<Box component="span" sx={{ display: 'block', fontWeight: 400, color: 'text.secondary', fontSize: '0.75rem' }}>price − mortgage</Box></Typography>
          <Box sx={{ ...track, gridColumn: { xs: '1 / -1', md: 'auto' }, order: { xs: 3, md: 0 } }}>
            <Box sx={{ flex: 1, borderRadius: 999, bgcolor: 'm3.primaryContainer', color: 'm3.onPrimaryContainer', display: 'flex', alignItems: 'center', px: 2 }}>
              <Typography component="span" sx={{ color: 'inherit', fontWeight: 700, fontSize: '0.8125rem' }}>Full equity</Typography>
            </Box>
          </Box>
          {amount(equity)}
        </Box>

        {rows.map(({ label, s, highlight, warn }) => {
          const cash = Math.max(0, s.youKeep);
          return (
            <Box key={s.key} sx={rowGrid}>
              <Typography variant="subtitle2" component="h3" sx={{ lineHeight: 1.4, fontWeight: highlight ? 700 : 500 }}>
                {label}
                <Box component="span" sx={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: warn ? 'error.main' : 'text.secondary' }}>−{money(s.agentDollarsTotal)} agent fees</Box>
              </Typography>
              <Box sx={track} role="group" aria-label={`${label}: cash at close ${money(s.youKeep)}, agent fees ${money(s.agentDollarsTotal)}${s.platform ? `, platform fee ${money(s.platform)}` : ''}, estimated closing costs ${money(s.otherClosing)}`}>
                    <Tooltip describeChild title={`Cash at close: ${money(s.youKeep)}`}>
                  <Box role="img" tabIndex={0} aria-label={`Cash at close: ${money(s.youKeep)}`} sx={{ width: `${pos(cash)}%`, borderRadius: '999px 4px 4px 999px', bgcolor: 'chart.cash', display: 'flex', alignItems: 'center', px: 1.5, minWidth: 0, overflow: 'hidden', ...onCash }}>
                    {/* On phones, only name the bar when it is wide enough to hold the words; the amount is printed above it. */}
                    <Typography component="span" sx={{ display: { xs: pos(cash) >= 38 ? 'inline' : 'none', md: 'inline' }, color: 'inherit', fontWeight: 700, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Cash at close</Typography>
                  </Box>
                </Tooltip>
                <Tooltip describeChild title={`Agent fees: ${money(s.agentDollarsTotal)} (${pctText(s.agentPctTotal)} of the price)`}>
                  <Box
                    role="img" tabIndex={0} aria-label={`Agent fees: ${money(s.agentDollarsTotal)}`}
                    sx={(t) => ({
                      width: `${(s.agentDollarsTotal / span) * 100}%`, ml: '2px', borderRadius: '4px', minWidth: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundImage: hatch(warn ? `color-mix(in srgb, ${t.vars!.palette.error.main} 45%, transparent)` : `color-mix(in srgb, ${t.vars!.palette.text.secondary} 40%, transparent)`),
                      bgcolor: warn ? 'm3.errorContainer' : 'transparent',
                    })}
                  >
                    {s.agentDollarsTotal / span > 0.09 && (
                      <Typography component="span" sx={{ display: { xs: 'none', md: 'inline' }, fontWeight: 700, fontSize: '0.75rem', px: 0.5, borderRadius: 0.5, whiteSpace: 'nowrap', bgcolor: warn ? 'm3.errorContainer' : 'm3.surfaceContainerHighest', color: warn ? 'm3.onErrorContainer' : 'text.primary' }}>
                        −{moneyCompact(s.agentDollarsTotal)}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
                {s.platform > 0 && (
                  <Tooltip describeChild title={`${PLATFORM_FEE_NAME}: ${money(s.platform)}`}>
                    <Box role="img" tabIndex={0} aria-label={`${PLATFORM_FEE_NAME}: ${money(s.platform)}`} sx={{ width: `${(s.platform / span) * 100}%`, ml: '2px', borderRadius: '4px', bgcolor: 'chart.platform', minWidth: 6 }} />
                  </Tooltip>
                )}
                <Tooltip describeChild title={`Estimated closing costs: ${money(s.otherClosing)}`}>
                  <Box role="img" tabIndex={0} aria-label={`Estimated closing costs: ${money(s.otherClosing)}`} sx={{ flex: 1, ml: '2px', borderRadius: '4px 999px 999px 4px', bgcolor: 'chart.closing', minWidth: 4 }} />
                </Tooltip>
              </Box>
              {amount(s.youKeep)}
            </Box>
          );
        })}
      </Stack>

      <Stack direction="row" component="ul" aria-label="Legend" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2.5, columnGap: 2.5, rowGap: 1, flexWrap: 'wrap' }}>
        {[
          { label: 'Cash at close', sx: { bgcolor: 'chart.cash' } },
          { label: 'Agent fees', sx: { backgroundImage: hatch('currentColor'), color: 'text.secondary' } },
          { label: 'Platform fee ($995)', sx: { bgcolor: 'chart.platform' } },
          { label: 'Estimated closing costs', sx: { bgcolor: 'chart.closing' } },
        ].map((l) => (
          <Stack key={l.label} component="li" direction="row" alignItems="center" spacing={0.75}>
            <Box aria-hidden sx={{ width: 14, height: 10, borderRadius: 0.5, ...l.sx }} />
            <Typography variant="caption" color="text.secondary">{l.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
