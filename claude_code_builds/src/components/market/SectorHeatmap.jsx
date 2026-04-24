import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { finnhub } from '../../services/finnhub';
import { SECTOR_ETFS } from '../../utils/constants';
import { formatPercent } from '../../utils/formatters';

function heatColor(change) {
  if (change >= 2)   return 'bg-green-700 hover:bg-green-600';
  if (change >= 0.5) return 'bg-green-800 hover:bg-green-700';
  if (change >= 0)   return 'bg-green-900/60 hover:bg-green-900';
  if (change >= -0.5) return 'bg-red-900/60 hover:bg-red-900';
  if (change >= -2)  return 'bg-red-800 hover:bg-red-700';
  return 'bg-red-700 hover:bg-red-600';
}

export function SectorHeatmap() {
  const navigate = useNavigate();

  const results = useQueries({
    queries: SECTOR_ETFS.map(({ symbol }) => ({
      queryKey: ['quote', symbol],
      queryFn: () => finnhub.quote(symbol),
      staleTime: 60_000,
    })),
  });

  const sectors = SECTOR_ETFS.map((s, i) => ({
    ...s,
    change: results[i].data?.dp ?? null,
    isLoading: results[i].isLoading,
  }));

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {sectors.map(({ symbol, label, change, isLoading }) => (
        <button
          key={symbol}
          onClick={() => navigate(`/stock/${symbol}`)}
          className={`rounded-xl p-3 transition-colors text-left ${
            isLoading || change === null ? 'bg-gray-800' : heatColor(change)
          }`}
        >
          <div className="text-xs font-medium text-white/90 leading-tight">{label}</div>
          {!isLoading && change !== null && (
            <div className="text-sm font-bold text-white mt-1">{formatPercent(change)}</div>
          )}
          {isLoading && <div className="h-3 w-12 bg-white/20 rounded animate-pulse mt-1" />}
          <div className="text-xs text-white/50 mt-0.5">{symbol}</div>
        </button>
      ))}
    </div>
  );
}
