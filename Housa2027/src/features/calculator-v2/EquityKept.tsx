'use client';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { money, moneyCompact } from '@/lib/money';
import { pctText, type Scenario } from '@/features/calculator/scenarios';

const DARK = '#111318';
const onCash = { color: '#fff', '[class~="dark"] &': { color: DARK } };
const hatch = (c: string) => `repeating-linear-gradient(135deg, ${c} 0 5px, transparent 5px 10px)`;

type Row = { label: string; s: Scenario; highlight?: boolean; warn?: boolean };

/**
 * Compact rows on a 0–100% scale of your equity: label, bar, amount.
 * Solid green is the cash you keep, the striped end is fees, the gray end is title and closing.
 */
export function EquityKept({ equity, rows }: { equity: number; rows: Row[] }) {
  if (equity <= 0) return <Typography color="text.secondary">You owe more than this price, so there is no equity to show. Try a higher price or a lower mortgage balance.</Typography>;
  const share = (n: number) => `${Math.max(0, Math.min(100, (n / equity) * 100))}%`;
  const rowGrid = { display: 'grid', alignItems: 'center', columnGap: 2, rowGap: 0.5, gridTemplateColumns: { xs: '1fr auto', md: '168px minmax(0, 1fr) 150px' } } as const;
  const track = { display: 'flex', height: { xs: 28, md: 32 }, p: '3px', borderRadius: 999, bgcolor: 'm3.surfaceContainerHighest', overflow: 'hidden', gridColumn: { xs: '1 / -1', md: 'auto' }, order: { xs: 3, md: 0 } } as const;
  const amount = (n: number) => (
    <Typography component="p" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', textAlign: 'right', lineHeight: 1.2 }}>
      {money(n)} <Box component="span" sx={{ fontWeight: 400, fontSize: '0.8125rem', color: 'text.secondary' }}>({Math.round((n / equity) * 100)}%)</Box>
    </Typography>
  );

  return (
    <Box>
      <Box aria-hidden sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '168px minmax(0, 1fr) 150px', columnGap: 2, color: 'text.secondary', mb: 0.5 }}>
        <span />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: '3px' }}>
          {['0%', '25%', '50%', '75%'].map((t) => <Typography key={t} variant="caption" sx={{ fontWeight: 600 }}>{t}</Typography>)}
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>{moneyCompact(equity)} (100%)</Typography>
        </Box>
        <span />
      </Box>

      <Stack spacing={{ xs: 1.5, md: 1 }}>
        <Box sx={rowGrid}>
          <Typography variant="subtitle2" component="h3" sx={{ lineHeight: 1.25 }}>Your equity<Box component="span" sx={{ display: 'block', fontWeight: 400, color: 'text.secondary', fontSize: '0.75rem' }}>price − mortgage</Box></Typography>
          <Box sx={{ ...track, gridColumn: { xs: '1 / -1', md: 'auto' }, order: { xs: 3, md: 0 } }}>
            <Box sx={{ flex: 1, borderRadius: 999, bgcolor: 'm3.successContainer', color: 'm3.onSuccessContainer', display: 'flex', alignItems: 'center', px: 2 }}>
              <Typography component="span" sx={{ color: 'inherit', fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.8125rem' }}>FULL EQUITY</Typography>
            </Box>
          </Box>
          {amount(equity)}
        </Box>

        {rows.map(({ label, s, highlight, warn }) => {
          const cash = Math.max(0, s.youKeep);
          return (
            <Box key={s.key} sx={rowGrid}>
              <Typography variant="subtitle2" component="h3" sx={{ lineHeight: 1.25, fontWeight: highlight ? 700 : 500 }}>
                {label}
                <Box component="span" sx={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: warn ? 'error.main' : 'text.secondary' }}>−{money(s.feesTotal)} fees</Box>
              </Typography>
              <Box sx={track} role="group" aria-label={`${label}: cash at close ${money(s.youKeep)}, fees ${money(s.feesTotal)}, title and closing ${money(s.otherClosing)}`}>
                <Tooltip describeChild title={`Cash at close: ${money(s.youKeep)}`}>
                  <Box role="img" tabIndex={0} aria-label={`Cash at close: ${money(s.youKeep)}`} sx={{ width: share(cash), borderRadius: '999px 4px 4px 999px', bgcolor: 'chart.cash', display: 'flex', alignItems: 'center', px: 1.5, minWidth: 0, ...onCash }}>
                    <Typography component="span" sx={{ color: 'inherit', fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>CASH AT CLOSE</Typography>
                  </Box>
                </Tooltip>
                <Tooltip describeChild title={`Fees: ${money(s.feesTotal)} (${s.platform ? `${pctText(s.agentPctTotal)} + ${money(s.platform)} Housa fee` : pctText(s.agentPctTotal)})`}>
                  <Box
                    role="img" tabIndex={0} aria-label={`Fees: ${money(s.feesTotal)}`}
                    sx={(t) => ({
                      width: share(s.feesTotal), ml: '2px', borderRadius: '4px', minWidth: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundImage: hatch(warn ? `color-mix(in srgb, ${t.vars!.palette.error.main} 45%, transparent)` : `color-mix(in srgb, ${t.vars!.palette.text.secondary} 40%, transparent)`),
                      bgcolor: warn ? 'm3.errorContainer' : 'transparent',
                    })}
                  >
                    {s.feesTotal / equity > 0.09 && (
                      <Typography component="span" sx={{ display: { xs: 'none', md: 'inline' }, fontWeight: 700, fontSize: '0.75rem', px: 0.5, borderRadius: 0.5, whiteSpace: 'nowrap', bgcolor: warn ? 'm3.errorContainer' : 'm3.surfaceContainerHighest', color: warn ? 'm3.onErrorContainer' : 'text.primary' }}>
                        −{moneyCompact(s.feesTotal)}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
                <Tooltip describeChild title={`Title & closing: ${money(s.otherClosing)}`}>
                  <Box role="img" tabIndex={0} aria-label={`Title and closing: ${money(s.otherClosing)}`} sx={{ flex: 1, ml: '2px', borderRadius: '4px 999px 999px 4px', bgcolor: 'chart.closing', minWidth: 4 }} />
                </Tooltip>
              </Box>
              {amount(s.youKeep)}
            </Box>
          );
        })}
      </Stack>

      <Stack direction="row" component="ul" aria-label="Legend" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1.5, columnGap: 2.5, rowGap: 0.5, flexWrap: 'wrap' }}>
        {[
          { label: 'Cash at close', sx: { bgcolor: 'chart.cash' } },
          { label: 'Agent and Housa fees', sx: { backgroundImage: hatch('currentColor'), color: 'text.secondary' } },
          { label: 'Title & closing (about 1%)', sx: { bgcolor: 'chart.closing' } },
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
