import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercent, changeColor } from '../../utils/formatters';
import { POPULAR_TICKERS } from '../../utils/constants';
import { useQueries } from '@tanstack/react-query';
import { finnhub } from '../../services/finnhub';

export function MarketMovers() {
  const navigate = useNavigate();

  const results = useQueries({
    queries: POPULAR_TICKERS.map(({ symbol }) => ({
      queryKey: ['quote', symbol],
      queryFn: () => finnhub.quote(symbol),
      staleTime: 30_000,
      refetchInterval: 60_000,
    })),
  });

  const stocks = POPULAR_TICKERS.map((t, i) => ({
    ...t,
    quote: results[i].data,
    change: results[i].data?.dp ?? 0,
  })).filter((s) => s.quote);

  const gainers = [...stocks].sort((a, b) => b.change - a.change).slice(0, 5);
  const losers  = [...stocks].sort((a, b) => a.change - b.change).slice(0, 5);

  function MoverList({ items, label, icon: Icon, color }) {
    return (
      <div>
        <div className={`flex items-center gap-1.5 text-sm font-semibold mb-2 ${color}`}>
          <Icon size={15} />
          {label}
        </div>
        <div className="space-y-1">
          {items.map((s) => (
            <button
              key={s.symbol}
              onClick={() => navigate(`/stock/${s.symbol}`)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-800/60 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <div>
                <div className="text-xs font-bold text-white">{s.symbol}</div>
                <div className="text-xs text-gray-500 truncate max-w-[100px]">{s.name}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-300">{formatCurrency(s.quote.c)}</div>
                <div className={`text-xs ${changeColor(s.change)}`}>{formatPercent(s.change)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <MoverList items={gainers} label="Top Gainers" icon={TrendingUp} color="text-green-400" />
      <MoverList items={losers}  label="Top Losers"  icon={TrendingDown} color="text-red-400" />
    </div>
  );
}
