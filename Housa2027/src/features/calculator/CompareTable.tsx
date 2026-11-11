'use client';
import { Box, ButtonBase, Typography } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { HelpTip } from '@/components/HelpTip';
import { money } from '@/lib/money';
import type { GlossaryKey } from '@/lib/glossary';
import { pctText, type Scenario, type ScenarioKey } from './scenarios';

interface Row {
  key: string;
  label: string;
  help?: GlossaryKey;
  value: (s: Scenario) => React.ReactNode;
  sub?: (s: Scenario) => string | null;
  strong?: boolean;
  divider?: boolean;
}

/** Side-by-side breakdown. On phones each row's label sits above its three values. */
export function CompareTable({ scenarios, price, selected, onSelect }: {
  scenarios: Scenario[]; price: number; selected: ScenarioKey; onSelect: (k: ScenarioKey) => void;
}) {
  const rows: Row[] = [
    { key: 'agent', label: 'Your agent', help: 'listingFee', value: (s) => `− ${money(s.agent)}`, sub: (s) => (s.agentFee.kind === 'percent' ? pctText(s.agentFee.value) : 'flat fee') },
    { key: 'buyer', label: "Buyer's agent", help: 'buyerAgent', value: (s) => `− ${money(s.buyerAgent)}`, sub: (s) => pctText(s.buyerAgentPct) },
    { key: 'platform', label: 'Housa fee', help: 'platformFee', value: (s) => (s.platform ? `− ${money(s.platform)}` : '$0'), sub: (s) => (s.platform ? 'flat' : null) },
    { key: 'fees', label: 'Total fees', value: (s) => `− ${money(s.feesTotal)}`, sub: (s) => (s.platform ? `${pctText(s.agentPctTotal)} + $995` : pctText(s.agentPctTotal)), strong: true, divider: true },
    { key: 'price', label: 'Sale price', value: () => money(price), divider: true },
    { key: 'payoff', label: 'Mortgage payoff', help: 'payoff', value: (s) => `− ${money(s.payoff)}` },
    { key: 'other', label: 'Title & closing (about 1%)', help: 'closingCosts', value: (s) => `− ${money(s.otherClosing)}` },
    { key: 'keep', label: 'You keep', help: 'youKeep', value: (s) => money(s.youKeep), strong: true, divider: true },
    {
      key: 'more', label: 'More than 6%',
      value: (s) => (s.key === 'traditional' ? '—' : <Box component="span" sx={{ color: s.vsTraditional >= 0 ? 'success.main' : 'error.main' }}>{s.vsTraditional >= 0 ? '+' : '−'}{money(Math.abs(s.vsTraditional))}</Box>),
      strong: true,
    },
  ];
  const cols = { xs: 'repeat(3, minmax(0, 1fr))', md: 'minmax(150px, 1.2fr) repeat(3, minmax(0, 1fr))' };

  return (
    <Box role="table" aria-label="Fee options side by side" sx={{ display: 'grid', gridTemplateColumns: cols, columnGap: { xs: 1, sm: 2 } }}>
      {/* Header row: each option is a button that puts it in the headline */}
      <Box role="row" sx={{ display: 'contents' }}>
        <Box role="columnheader" sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', overflow: 'hidden' }}><Box component="span" sx={visuallyHidden}>Item</Box></Box>
        {scenarios.map((s) => {
          const on = s.key === selected;
          return (
            <Box role="columnheader" key={s.key} aria-sort={undefined}>
              <ButtonBase
                onClick={() => onSelect(s.key)}
                aria-pressed={on}
                sx={{
                  width: '100%', minHeight: 56, px: 1, py: 1, borderRadius: 2, flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right',
                  bgcolor: on ? 'm3.secondaryContainer' : 'transparent', color: on ? 'm3.onSecondaryContainer' : 'text.primary',
                  border: 1, borderColor: on ? 'transparent' : 'divider',
                }}
              >
                <Typography variant="subtitle2" component="span" sx={{ lineHeight: 1.2, whiteSpace: 'nowrap' }}>{s.shortName}</Typography>
                <Typography variant="caption" component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'inherit', opacity: on ? 1 : 0.8 }}>
                  {on ? <><CheckCircle sx={{ fontSize: 14 }} aria-hidden />Shown</> : 'Show'}
                </Typography>
              </ButtonBase>
            </Box>
          );
        })}
      </Box>

      {rows.map((r) => (
        <Box role="row" key={r.key} sx={{ display: 'contents' }}>
          <Box
            role="rowheader"
            sx={{
              gridColumn: { xs: '1 / -1', md: 'auto' }, display: 'flex', alignItems: 'center', gap: 0.5,
              pt: { xs: r.divider ? 2 : 1.5, md: r.divider ? 2 : 1.25 }, pb: { xs: 0, md: 1.25 },
              borderTop: { md: r.divider ? 1 : 0 }, borderColor: { md: 'divider' },
            }}
          >
            <Typography variant={r.strong ? 'subtitle1' : 'body2'} component="span" sx={{ fontWeight: r.strong ? 700 : 400 }}>{r.label}</Typography>
            {r.help && <HelpTip k={r.help} />}
          </Box>
          {scenarios.map((s) => (
            <Box
              role="cell"
              key={s.key}
              sx={{
                textAlign: 'right', py: { xs: 0.5, md: 1.25 }, pt: { md: r.divider ? 2 : 1.25 },
                borderTop: { md: r.divider ? 1 : 0 }, borderColor: { md: 'divider' },
                bgcolor: s.key === selected ? 'm3.surfaceContainerHigh' : undefined, px: 1,
                borderRadius: 0,
              }}
            >
              <Typography
                variant={r.strong ? 'h6' : 'body1'}
                component="span"
                sx={{ display: 'block', fontVariantNumeric: 'tabular-nums', fontWeight: r.strong ? 700 : 400, fontSize: r.key === 'keep' ? { xs: '1.0625rem', sm: '1.375rem' } : undefined, whiteSpace: 'nowrap' }}
              >
                {r.value(s)}
              </Typography>
              {r.sub?.(s) && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{r.sub(s)}</Typography>}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

const visuallyHidden = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const;
