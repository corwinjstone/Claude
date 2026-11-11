'use client';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { money } from '@/lib/money';
import { pctText, type Scenario } from '@/features/calculator/scenarios';

type Part = 'agent' | 'buyerAgent' | 'platform';
const FEES: { key: Part; label: string }[] = [
  { key: 'agent', label: 'Your agent' },
  { key: 'buyerAgent', label: "Buyer's agent" },
  { key: 'platform', label: 'Housa fee' },
];
const DARK = '#111318';
const lightOnDark = { color: '#fff', '[class~="dark"] &': { color: DARK } };

/**
 * Fees only, from $0, so every bar is honest and the gaps are large.
 * Each row is as long as the costliest option. The colored part is what you pay in fees;
 * the green part is the money that stays with you instead.
 */
export function KeptBars({ rows }: { rows: { label: string; s: Scenario; highlight?: boolean }[] }) {
  const max = Math.max(...rows.map((r) => r.s.feesTotal));
  const base = rows[0].s; // traditional
  return (
    <Box>
      <Stack direction="row" component="ul" aria-label="Legend" sx={{ listStyle: 'none', p: 0, m: 0, mb: 2.5, columnGap: 2, rowGap: 1, flexWrap: 'wrap' }}>
        {[...FEES.map((f) => ({ ...f, color: `chart.${f.key}` })), { key: 'kept', label: 'Stays in your pocket', color: 'chart.cash' }].map((l) => (
          <Stack key={l.key} component="li" direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: l.color }} aria-hidden />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: l.key === 'kept' ? 700 : 400 }}>{l.label}</Typography>
          </Stack>
        ))}
      </Stack>

      <Stack spacing={3}>
        {rows.map(({ label, s, highlight }) => {
          const kept = Math.max(0, base.feesTotal - s.feesTotal);
          const fees = FEES.map((f) => ({ ...f, amount: s[f.key] })).filter((f) => f.amount > 0);
          return (
            <Box key={s.key}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1} sx={{ mb: 0.75 }}>
                <Typography variant="subtitle1" component="p" sx={{ fontWeight: highlight ? 700 : 500 }}>{label}</Typography>
                <Typography variant="body2" component="p" sx={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                  Fees <Box component="strong" sx={{ fontSize: '1rem' }}>{money(s.feesTotal)}</Box>
                </Typography>
              </Stack>
              <Box role="group" aria-label={`${label}: fees ${money(s.feesTotal)}${kept ? `, ${money(kept)} stays in your pocket` : ''}`} sx={{ display: 'flex', gap: '2px', height: 40, width: `${((s.feesTotal + kept) / max) * 100}%` }}>
                {fees.map((f) => (
                  <Tooltip key={f.key} describeChild title={`${f.label}: ${money(f.amount)}`}>
                    <Box role="img" tabIndex={0} aria-label={`${f.label}: ${money(f.amount)}`} sx={{ flexGrow: f.amount, flexBasis: 0, minWidth: 4, borderRadius: '4px', bgcolor: `chart.${f.key}` }} />
                  </Tooltip>
                ))}
                {kept > 0 && (
                  <Tooltip describeChild title={`Stays in your pocket: ${money(kept)}`}>
                    <Box
                      role="img"
                      tabIndex={0}
                      aria-label={`Stays in your pocket: ${money(kept)}`}
                      sx={{ flexGrow: kept, flexBasis: 0, minWidth: 4, borderRadius: '4px', bgcolor: 'chart.cash', display: 'flex', alignItems: 'center', px: 1.25, ...lightOnDark }}
                    >
                      {kept / max > 0.17 && (
                        <Typography component="span" sx={{ color: 'inherit', fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' }, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                          +{money(kept)}
                        </Typography>
                      )}
                    </Box>
                  </Tooltip>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                {s.platform ? `${pctText(s.agentPctTotal)} to agents + ${money(s.platform)} Housa fee` : `${pctText(s.agentPctTotal)} to agents`}
                {kept > 0 ? <> · <Box component="strong" sx={{ color: 'success.main' }}>{money(kept)} more cash for you</Box></> : s.key === 'traditional' ? ' · nothing saved' : ''}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
