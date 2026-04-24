import { useBasicFinancials } from '../../hooks/useCompanyProfile';
import { useStockQuote } from '../../hooks/useStockQuote';
import { formatCurrency, formatPercent, formatLargeNumber, formatNumber } from '../../utils/formatters';
import { Tooltip } from '../ui/Tooltip';
import { LoadingCard } from '../ui/LoadingSpinner';

const tips = {
  'P/E Ratio': "Price-to-Earnings ratio. How much investors pay per $1 of profit. A lower P/E may mean the stock is cheaper relative to earnings.",
  'Market Cap': "Total value of all the company's shares combined. 'Large cap' usually means over $10 billion.",
  'EPS': "Earnings Per Share — the company's profit divided by number of shares. Higher is generally better.",
  '52W High': "The highest price the stock traded at in the past 52 weeks (1 year).",
  '52W Low': "The lowest price the stock traded at in the past 52 weeks (1 year).",
  'Div. Yield': "Annual dividend payments as a percentage of the stock price. Like a 'yield' on a savings account — paid just for holding the stock.",
  'Beta': "How much the stock moves compared to the broader market. Beta > 1 means it swings more than the market; < 1 means it's more stable.",
  'Volume': "How many shares were traded today. Higher volume often signals strong investor interest or big news.",
};

function Stat({ label, value, tooltip }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-3">
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
        {label}
        {tooltip && <Tooltip content={tooltip} />}
      </div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

export function StockFundamentals({ symbol }) {
  const { data: fin, isLoading } = useBasicFinancials(symbol);
  const { data: quote } = useStockQuote(symbol);

  if (isLoading) return <LoadingCard rows={4} />;

  const m = fin?.metric ?? {};

  const stats = [
    { label: 'P/E Ratio',  value: m.peBasicExclExtraTTM ? formatNumber(m.peBasicExclExtraTTM, 1) : '—' },
    { label: 'Market Cap', value: m.marketCapitalization ? formatLargeNumber(m.marketCapitalization * 1e6) : '—' },
    { label: 'EPS',        value: m.epsBasicExclExtraItemsTTM ? formatCurrency(m.epsBasicExclExtraItemsTTM) : '—' },
    { label: '52W High',   value: m['52WeekHigh'] ? formatCurrency(m['52WeekHigh']) : '—' },
    { label: '52W Low',    value: m['52WeekLow']  ? formatCurrency(m['52WeekLow'])  : '—' },
    { label: 'Div. Yield', value: m.dividendYieldIndicatedAnnual ? formatPercent(m.dividendYieldIndicatedAnnual, 2) : 'N/A' },
    { label: 'Beta',       value: m.beta ? formatNumber(m.beta, 2) : '—' },
    { label: 'Volume',     value: quote?.v ? formatNumber(quote.v, 0) : '—' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {stats.map((s) => (
        <Stat key={s.label} {...s} tooltip={tips[s.label]} />
      ))}
    </div>
  );
}
