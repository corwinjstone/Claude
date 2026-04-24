import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStockQuote } from '../../hooks/useStockQuote';
import { formatCurrency, formatPercent, changeColor } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { LoadingCard } from '../ui/LoadingSpinner';

export function StockCard({ symbol, name }) {
  const navigate = useNavigate();
  const { data: quote, isLoading } = useStockQuote(symbol);

  const change = quote?.dp ?? 0;
  const isPositive = change >= 0;

  return (
    <Card hover onClick={() => navigate(`/stock/${symbol}`)}>
      {isLoading ? (
        <LoadingCard rows={2} />
      ) : (
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{symbol}</span>
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5">{name ?? quote?.name ?? ''}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-semibold text-white text-sm">{formatCurrency(quote?.c)}</div>
            <div className={`flex items-center justify-end gap-1 text-xs mt-0.5 ${changeColor(change)}`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {formatPercent(change)}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
