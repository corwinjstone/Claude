'use client';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { money } from '@/lib/money';
import { pctText, type Scenario, type ScenarioKey } from './scenarios';

type Part = 'agent' | 'buyerAgent' | 'platform';
const PARTS: { key: Part; label: string }[] = [
  { key: 'agent', label: 'Your agent' },
  { key: 'buyerAgent', label: "Buyer's agent" },
  { key: 'platform', label: 'Housa fee' },
];
// Text set inside a fill: white on the dark light-mode blue, near-black everywhere else.
const insideText = (part: Part) => (part === 'agent' ? { color: '#fff', '[class~="dark"] &': { color: '#111318' } } : { color: '#111318' });
const partPct = (s: Scenario, p: Part) =>
  p === 'agent' ? (s.agent / (s.agent + s.buyerAgent || 1)) * s.agentPctTotal : p === 'buyerAgent' ? s.buyerAgentPct : null;

/** Total fees per option, one tall segmented bar each, all on the same dollar scale. */
export function FeeBars({ scenarios, selected }: { scenarios: Scenario[]; selected: ScenarioKey }) {
  const max = Math.max(...scenarios.map((s) => s.feesTotal));
  return (
    <Box>
      <Stack direction="row" component="ul" aria-label="Legend" sx={{ listStyle: 'none', p: 0, m: 0, mb: 2, gap: 2, flexWrap: 'wrap' }}>
        {PARTS.map((p) => (
          <Stack key={p.key} component="li" direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: `chart.${p.key}` }} aria-hidden />
            <Typography variant="body2" color="text.secondary">{p.label}</Typography>
          </Stack>
        ))}
      </Stack>
      <Stack spacing={2.5}>
        {scenarios.map((s) => {
          const totalLabel = s.platform
            ? `${pctText(s.agentPctTotal)} of the price + ${money(s.platform)} Housa fee`
            : `${pctText(s.agentPctTotal)} of the price`;
          const parts = PARTS.map((p) => ({ ...p, amount: s[p.key] })).filter((p) => p.amount > 0);
          return (
            <Box key={s.key}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1} sx={{ mb: 0.75 }}>
                <Typography variant="subtitle1" component="p" sx={{ fontWeight: s.key === selected ? 700 : 500 }}>
                  {s.name}
                </Typography>
                <Typography variant="subtitle1" component="p" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {money(s.feesTotal)}
                </Typography>
              </Stack>
              <Box
                role="group"
                aria-label={`${s.name}: total fees ${money(s.feesTotal)}`}
                sx={{ display: 'flex', gap: '2px', width: `${(s.feesTotal / max) * 100}%`, height: 28 }}
              >
                {parts.map((p) => {
                  const share = p.amount / max;
                  const pp = partPct(s, p.key);
                  return (
                    <Tooltip key={p.key} describeChild title={`${p.label}: ${money(p.amount)}${pp != null ? ` (${pctText(pp)})` : ''}`}>
                      <Box
                        tabIndex={0}
                        role="img"
                        aria-label={`${p.label}: ${money(p.amount)}${pp != null ? `, ${pctText(pp)}` : ''}`}
                        sx={{
                          flexGrow: p.amount, flexBasis: 0, minWidth: 4, borderRadius: '4px',
                          bgcolor: `chart.${p.key}`, display: 'flex', alignItems: 'center', px: 1, overflow: 'visible',
                          ...insideText(p.key),
                        }}
                      >
                        {/* Only label a block wide enough to hold its text. */}
                        {pp != null && share > 0.16 && (
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'inherit', whiteSpace: 'nowrap' }}>{pctText(pp)}</Typography>
                        )}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{totalLabel}</Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
