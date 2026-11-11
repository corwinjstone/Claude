'use client';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { money } from '@/lib/money';
import { pctText, type Scenario, type ScenarioKey } from './scenarios';

type Part = 'cash' | 'agent' | 'buyerAgent' | 'platform' | 'closing';
const PARTS: { key: Part; label: string }[] = [
  { key: 'cash', label: 'Cash at close' },
  { key: 'agent', label: 'Your agent' },
  { key: 'buyerAgent', label: "Buyer's agent" },
  { key: 'platform', label: 'Housa fee' },
  { key: 'closing', label: 'Title & closing' },
];

// Text set inside a fill: white or near-black by the fill's lightness, per mode.
const DARK_TEXT = '#111318';
const insideText: Record<Part, object> = {
  cash: { color: '#fff', '[class~="dark"] &': { color: DARK_TEXT } },
  agent: { color: '#fff', '[class~="dark"] &': { color: DARK_TEXT } },
  buyerAgent: { color: DARK_TEXT },
  platform: { color: '#fff', '[class~="dark"] &': { color: DARK_TEXT } },
  closing: { color: DARK_TEXT, '[class~="dark"] &': { color: '#fff' } },
};

const amountOf = (s: Scenario, p: Part) =>
  p === 'cash' ? Math.max(0, s.youKeep) : p === 'closing' ? s.otherClosing : s[p];

/**
 * Each bar is your whole equity (sale price − payoff). Green is the cash you walk away with;
 * the colored blocks after it are the fees eating into it. Same length for every option, so the
 * green blocks compare directly.
 */
export function EquityBars({ scenarios, selected }: { scenarios: Scenario[]; selected: ScenarioKey }) {
  const equity = scenarios[0].equity;
  if (equity <= 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        At this price you owe more than the home sells for, so there is no equity to show. Try a higher price or a lower payoff.
      </Typography>
    );
  }
  const scale = Math.max(...scenarios.map((s) => Math.max(s.youKeep, 0) + s.feesTotal + s.otherClosing));
  const trad = scenarios.find((s) => s.key === 'traditional')!;

  return (
    <Box>
      <Stack direction="row" component="ul" aria-label="Legend" sx={{ listStyle: 'none', p: 0, m: 0, mb: 2.5, columnGap: 2, rowGap: 1, flexWrap: 'wrap' }}>
        {PARTS.map((p) => (
          <Stack key={p.key} component="li" direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: `chart.${p.key}` }} aria-hidden />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: p.key === 'cash' ? 700 : 400 }}>{p.label}</Typography>
          </Stack>
        ))}
      </Stack>

      <Stack spacing={3}>
        {scenarios.map((s) => {
          const parts = PARTS.map((p) => ({ ...p, amount: amountOf(s, p.key) })).filter((p) => p.amount > 0);
          const more = s.youKeep - trad.youKeep;
          const on = s.key === selected;
          return (
            <Box key={s.key}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1} sx={{ mb: 0.75 }}>
                <Typography variant="subtitle1" component="p" sx={{ fontWeight: on ? 700 : 500 }}>{s.name}</Typography>
                <Typography variant="body2" component="p" sx={{ whiteSpace: 'nowrap', color: s.key === 'traditional' ? 'text.secondary' : more >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                  {s.key === 'traditional' ? 'The old standard' : `${more >= 0 ? '+' : '−'}${money(Math.abs(more))} more cash`}
                </Typography>
              </Stack>
              <Box
                role="group"
                aria-label={`${s.name}: cash at close ${money(s.youKeep)} of ${money(equity)} equity`}
                sx={{ display: 'flex', gap: '2px', height: 44, width: `${(s.youKeep + s.feesTotal + s.otherClosing > 0 ? (Math.max(s.youKeep, 0) + s.feesTotal + s.otherClosing) / scale : 1) * 100}%` }}
              >
                {parts.map((p) => {
                  const share = p.amount / scale;
                  return (
                    <Tooltip key={p.key} describeChild title={`${p.label}: ${money(p.amount)} (${pctText((p.amount / equity) * 100)} of your equity)`}>
                      <Box
                        tabIndex={0}
                        role="img"
                        aria-label={`${p.label}: ${money(p.amount)}`}
                        sx={{
                          flexGrow: p.amount, flexBasis: 0, minWidth: 4, borderRadius: '4px', bgcolor: `chart.${p.key}`,
                          display: 'flex', alignItems: 'center', px: 1.5, ...insideText[p.key],
                        }}
                      >
                        {p.key === 'cash' && share > 0.35 && (
                          <Typography component="span" sx={{ color: 'inherit', fontWeight: 700, fontSize: { xs: '1rem', sm: '1.25rem' }, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                            {money(s.youKeep)}
                          </Typography>
                        )}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                Fees eat <Box component="strong" sx={{ color: 'text.primary' }}>{money(s.feesTotal)}</Box>
                {' '}({s.platform ? `${pctText(s.agentPctTotal)} + ${money(s.platform)} Housa fee` : pctText(s.agentPctTotal)})
                {s.youKeep < 0 && ' · more than your equity'}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
