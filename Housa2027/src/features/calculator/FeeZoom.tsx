'use client';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { money, moneyCompact } from '@/lib/money';
import { PLATFORM_FEE_NAME } from '@/lib/fees';
import { pctText, type Scenario, type ScenarioKey } from './scenarios';

type Fee = 'agent' | 'buyerAgent' | 'platform' | 'closing';
const FEES: { key: Fee; label: string }[] = [
  { key: 'agent', label: 'Your agent' },
  { key: 'buyerAgent', label: "Buyer's agent" },
  { key: 'platform', label: 'Platform fee' },
  { key: 'closing', label: 'Estimated closing costs' },
];
const feeAmount = (s: Scenario, k: Fee) => (k === 'closing' ? s.otherClosing : s[k]);

/** Pick a clean tick step that gives 4–7 gridlines. */
function niceStep(range: number) {
  const raw = range / 5;
  const mag = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => range / s <= 7)!;
}

/**
 * Zoomed view of the top of your equity. Position, not bar length, carries the value:
 * the green dot is your cash at close, and the colored span from it to the equity line is
 * everything fees eat. The axis is labeled, so the zoom is never hidden.
 */
export function FeeZoom({ scenarios, selected }: { scenarios: Scenario[]; selected: ScenarioKey }) {
  const equity = scenarios[0].equity;
  const lowest = Math.min(...scenarios.map((s) => s.youKeep));
  const span = Math.max(equity - lowest, 1);
  const step = niceStep(span * 1.35);
  const min = Math.floor((lowest - span * 0.3) / step) * step;
  const max = equity + span * 0.04;
  const x = (v: number) => ((v - min) / (max - min)) * 100;
  const ticks: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= equity; t += step) ticks.push(t);
  const trad = scenarios.find((s) => s.key === 'traditional')!;
  const LABEL_W = { xs: 0, sm: 128 };

  if (equity <= 0 || lowest <= 0) {
    return <Typography color="text.secondary">Fees would eat all of your equity at this price. Try a higher price or a lower payoff.</Typography>;
  }

  return (
    <Box>
      <Box sx={{ position: 'relative', pl: { xs: 0, sm: `${LABEL_W.sm}px` } }}>
        {/* Gridlines, tick labels and the equity line live in one layer behind the rows */}
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, left: { xs: 0, sm: LABEL_W.sm }, pointerEvents: 'none' }}>
          {ticks.map((t) => (
            <Box key={t} sx={{ position: 'absolute', left: `${x(t)}%`, top: 24, bottom: 24, borderLeft: '1px dashed', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', bottom: -24, transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                {moneyCompact(t)}
              </Typography>
            </Box>
          ))}
          <Box sx={{ position: 'absolute', left: `${x(equity)}%`, top: 0, bottom: 24, borderLeft: 2, borderColor: 'text.primary' }}>
            <Typography variant="caption" sx={{ position: 'absolute', top: 0, right: 6, whiteSpace: 'nowrap', fontWeight: 700 }}>
              Your equity {moneyCompact(equity)}
            </Typography>
          </Box>
        </Box>

        <Stack sx={{ pt: 4, pb: 4 }} spacing={{ xs: 1.5, sm: 2.5 }}>
          {scenarios.map((s) => {
            const fees = FEES.map((f) => ({ ...f, amount: feeAmount(s, f.key) })).filter((f) => f.amount > 0);
            const more = s.youKeep - trad.youKeep;
            const on = s.key === selected;
            return (
              <Box key={s.key} sx={{ position: 'relative' }}>
                <Typography
                  variant="subtitle2"
                  component="p"
                  sx={{
                    fontWeight: on ? 700 : 500,
                    position: { sm: 'absolute' }, left: { sm: -LABEL_W.sm }, width: { sm: LABEL_W.sm - 12 }, top: { sm: 30 },
                    mb: { xs: 0.5, sm: 0 },
                  }}
                >
                  {s.name}
                </Typography>
                <Box sx={{ position: 'relative', height: 64 }}>
                  {/* Labels above the row: cash (left of the dot) and fees eaten (over the span) */}
                  <Box sx={{ position: 'absolute', top: 0, left: { xs: 0, sm: 'auto' }, right: { sm: `${100 - x(s.youKeep)}%` }, pr: { sm: 1.5 }, textAlign: { sm: 'right' }, whiteSpace: 'nowrap' }}>
                    <Typography component="span" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.125rem' }, fontVariantNumeric: 'tabular-nums' }}>
                      {money(s.youKeep)}
                    </Typography>
                    {s.key !== 'traditional' && (
                      <Typography component="span" variant="caption" sx={{ ml: 0.75, fontWeight: 600, color: 'success.main' }}>
                        +{moneyCompact(more)}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ position: 'absolute', top: 4, left: `${x(s.youKeep)}%`, width: `${x(s.youKeep + s.feesTotal) - x(s.youKeep)}%`, textAlign: 'center', color: 'text.secondary', whiteSpace: 'nowrap', fontWeight: 600 }}
                  >
                    −{moneyCompact(s.feesTotal)} fees
                  </Typography>

                  {/* Dashed guide from the axis start to the cash dot */}
                  <Box aria-hidden sx={{ position: 'absolute', left: 0, width: `${x(s.youKeep)}%`, top: 43, borderTop: '3px dotted', borderColor: 'chart.cash', opacity: 0.55 }} />

                  {/* What fees eat: from the cash dot to the equity line */}
                  <Box
                    role="group"
                    aria-label={`${s.name}: cash at close ${money(s.youKeep)}; fees eat ${money(s.feesTotal)}, title and closing ${money(s.otherClosing)}`}
                    sx={{ position: 'absolute', top: 34, height: 20, left: `${x(s.youKeep)}%`, width: `${x(equity) - x(s.youKeep)}%`, display: 'flex', gap: '2px' }}
                  >
                    {fees.map((f) => (
                      <Tooltip key={f.key} describeChild title={`${f.key === 'platform' ? PLATFORM_FEE_NAME : f.label}: ${money(f.amount)}${f.key === 'agent' ? ` (${pctText(s.agentPctTotal - s.buyerAgentPct)} of the price)` : f.key === 'buyerAgent' ? ` (${pctText(s.buyerAgentPct)} of the price)` : ''}`}>
                        <Box
                          role="img"
                          tabIndex={0}
                          aria-label={`${f.key === 'platform' ? PLATFORM_FEE_NAME : f.label}: ${money(f.amount)}`}
                          sx={{ flexGrow: f.amount, flexBasis: 0, minWidth: 4, borderRadius: '4px', bgcolor: `chart.${f.key}` }}
                        />
                      </Tooltip>
                    ))}
                  </Box>

                  {/* Cash dot */}
                  <Tooltip describeChild title={`Cash at close: ${money(s.youKeep)}`}>
                    <Box
                      role="img"
                      tabIndex={0}
                      aria-label={`Cash at close: ${money(s.youKeep)}`}
                      sx={{
                        position: 'absolute', top: 32, left: `${x(s.youKeep)}%`, width: 24, height: 24, ml: '-12px', borderRadius: '50%',
                        bgcolor: 'chart.cash', border: '3px solid', borderColor: 'background.paper', boxSizing: 'border-box',
                      }}
                    />
                  </Tooltip>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>

      <Stack direction="row" component="ul" aria-label="Legend" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1, columnGap: 2, rowGap: 1, flexWrap: 'wrap' }}>
        <Stack component="li" direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'chart.cash' }} aria-hidden />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Cash at close</Typography>
        </Stack>
        {FEES.map((f) => (
          <Stack key={f.key} component="li" direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: `chart.${f.key}` }} aria-hidden />
            <Typography variant="body2" color="text.secondary">{f.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
