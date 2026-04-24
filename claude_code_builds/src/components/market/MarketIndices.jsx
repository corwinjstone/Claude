import { useMarketIndices } from '../../hooks/useMarketIndices';
import { formatCurrency, formatPercent, changeColor } from '../../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export function MarketIndices() {
  const indices = useMarketIndices();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {indices.map(({ symbol, label, description, data, isLoading }) => {
        const change = data?.dp ?? 0;
        const isPos = change >= 0;
        return (
          <div key={symbol} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-gray-400">{label}</span>
              <Tooltip content={description} />
            </div>
            {isLoading ? (
              <div className="h-4 bg-gray-800 rounded animate-pulse w-20" />
            ) : (
              <>
                <div className="text-base font-bold text-white">{formatCurrency(data?.c)}</div>
                <div className={`flex items-center gap-1 text-xs mt-0.5 ${changeColor(change)}`}>
                  {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {formatPercent(change)}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
