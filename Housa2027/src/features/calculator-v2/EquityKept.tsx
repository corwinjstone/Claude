'use client';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { money, moneyCompact } from '@/lib/money';
import { pctText, type Scenario } from '@/features/calculator/scenarios';

const DARK = '#111318';
const onCash = { color: '#fff', '[class~="dark"] &': { color: DARK } };
const hatch = (c: string) => `repeating-linear-gradient(135deg, ${c} 0 6px, transparent 6px 12px)`;

/**
 * One row per option, on a 0–100% scale of your equity. The solid bar is the cash you keep;
 * the striped end is what fees take, and the plain gray end is title and closing costs.
 */
export function EquityKept({ equity, rows }: { equity: number; rows: { label: string; s: Scenario; highlight?: boolean; warn?: boolean }[] }) {
  if (equity <= 0) return <Typography color="text.secondary">You owe more than this price, so there is no equity to show. Try a higher price or a lower mortgage balance.</Typography>;
  const share = (n: number) => `${Math.max(0, Math.min(100, (n / equity) * 100))}%`;
  const track = { position: 'relative', display: 'flex', height: 56, p: '6px', borderRadius: 999, bgcolor: 'm3.surfaceContainerHighest', overflow: 'hidden' } as const;
  const head = (label: string, chip: React.ReactNode, amount: number, bold?: boolean) => (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 0.75, flexWrap: 'wrap', rowGap: 0.5 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: bold ? 700 : 500 }}>{label}</Typography>
        {chip}
      </Stack>
      <Typography component="p" sx={{ fontWeight: 700, fontSize: '1.125rem', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        {money(amount)} <Box component="span" sx={{ fontWeight: 400, fontSize: '0.875rem', color: 'text.secondary' }}>({Math.round((amount / equity) * 100)}%)</Box>
      </Typography>
    </Stack>
  );
  const chipSx = { px: 1.25, py: 0.25, borderRadius: 999, fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' } as const;

  return (
    <Box>
      {/* Scale */}
      <Box aria-hidden sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', mb: 1.5, px: '6px' }}>
        {['0%', '25%', '50%', '75%'].map((t) => <Typography key={t} variant="caption" sx={{ fontWeight: 600 }}>{t}</Typography>)}
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>{moneyCompact(equity)} (100%)</Typography>
      </Box>

      <Stack spacing={3}>
        <Box>
          {head('Your equity, before selling costs', <Box component="span" sx={{ ...chipSx, bgcolor: 'm3.successContainer', color: 'm3.onSuccessContainer', display: { xs: 'none', sm: 'inline' } }}>Price − mortgage</Box>, equity)}
          <Box sx={track}>
            <Box sx={{ flex: 1, borderRadius: 999, bgcolor: 'm3.successContainer', color: 'm3.onSuccessContainer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5 }}>
              <Typography component="span" sx={{ color: 'inherit', fontWeight: 700, letterSpacing: '0.04em', fontSize: { xs: '0.8125rem', sm: '1rem' } }}>FULL EQUITY</Typography>
              <Typography component="span" sx={{ color: 'inherit', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(equity)}</Typography>
            </Box>
          </Box>
        </Box>

        {rows.map(({ label, s, highlight, warn }) => {
          const cash = Math.max(0, s.youKeep);
          return (
            <Box key={s.key}>
              {head(
                label,
                <Box component="span" sx={{ ...chipSx, ...(warn ? { bgcolor: 'm3.errorContainer', color: 'm3.onErrorContainer' } : { bgcolor: 'm3.surfaceContainerHighest', color: 'text.primary' }) }}>
                  −{money(s.feesTotal)} fees
                </Box>,
                s.youKeep,
                highlight,
              )}
              <Box sx={track} role="group" aria-label={`${label}: cash at close ${money(s.youKeep)}, fees ${money(s.feesTotal)}, title and closing ${money(s.otherClosing)}`}>
                <Tooltip describeChild title={`Cash at close: ${money(s.youKeep)}`}>
                  <Box
                    role="img" tabIndex={0} aria-label={`Cash at close: ${money(s.youKeep)}`}
                    sx={{ width: share(cash), borderRadius: '999px 6px 6px 999px', bgcolor: 'chart.cash', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, minWidth: 0, ...onCash }}
                  >
                    <Typography component="span" sx={{ color: 'inherit', fontWeight: 700, letterSpacing: '0.04em', fontSize: { xs: '0.8125rem', sm: '1rem' }, whiteSpace: 'nowrap' }}>CASH AT CLOSE</Typography>
                    <Typography component="span" sx={{ color: 'inherit', fontWeight: 700, fontVariantNumeric: 'tabular-nums', display: { xs: 'none', sm: 'inline' } }}>{money(s.youKeep)}</Typography>
                  </Box>
                </Tooltip>
                <Tooltip describeChild title={`Fees: ${money(s.feesTotal)} (${s.platform ? `${pctText(s.agentPctTotal)} + ${money(s.platform)} Housa fee` : pctText(s.agentPctTotal)})`}>
                  <Box
                    role="img" tabIndex={0} aria-label={`Fees: ${money(s.feesTotal)}`}
                    sx={(t) => ({
                      width: share(s.feesTotal), ml: '2px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 4, overflow: 'hidden',
                      backgroundImage: hatch(warn ? `color-mix(in srgb, ${t.vars!.palette.error.main} 45%, transparent)` : `color-mix(in srgb, ${t.vars!.palette.text.secondary} 40%, transparent)`),
                      bgcolor: warn ? 'm3.errorContainer' : 'transparent',
                    })}
                  >
                    {s.feesTotal / equity > 0.07 && (
                      <Typography component="span" sx={{ display: { xs: 'none', md: 'inline' }, fontWeight: 700, fontSize: '0.875rem', fontVariantNumeric: 'tabular-nums', px: 0.75, borderRadius: 1, bgcolor: warn ? 'm3.errorContainer' : 'm3.surfaceContainerHighest', color: warn ? 'm3.onErrorContainer' : 'text.primary' }}>
                        −{moneyCompact(s.feesTotal)}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
                <Tooltip describeChild title={`Title & closing: ${money(s.otherClosing)}`}>
                  <Box role="img" tabIndex={0} aria-label={`Title and closing: ${money(s.otherClosing)}`} sx={{ flex: 1, ml: '2px', borderRadius: '6px 999px 999px 6px', bgcolor: 'chart.closing', minWidth: 4 }} />
                </Tooltip>
              </Box>
            </Box>
          );
        })}
      </Stack>

      <Stack direction="row" component="ul" aria-label="Legend" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2.5, columnGap: 2.5, rowGap: 1, flexWrap: 'wrap' }}>
        {[
          { label: 'Cash at close', sx: { bgcolor: 'chart.cash' } },
          { label: 'Agent and Housa fees', sx: { backgroundImage: hatch('currentColor'), color: 'text.secondary' } },
          { label: 'Title & closing (about 1%)', sx: { bgcolor: 'chart.closing' } },
        ].map((l) => (
          <Stack key={l.label} component="li" direction="row" alignItems="center" spacing={1}>
            <Box aria-hidden sx={{ width: 16, height: 12, borderRadius: 0.5, ...l.sx }} />
            <Typography variant="body2" color="text.secondary">{l.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
