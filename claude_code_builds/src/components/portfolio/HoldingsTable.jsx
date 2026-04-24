import { useNavigate } from 'react-router-dom';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { useQueries } from '@tanstack/react-query';
import { finnhub } from '../../services/finnhub';
import { formatCurrency, formatPercent, changeColor } from '../../utils/formatters';
import { calcPnL } from '../../utils/calculator';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { TradeModal } from './TradeModal';

export function HoldingsTable() {
  const navigate = useNavigate();
  const { holdings } = usePortfolioStore();
  const [tradeTarget, setTradeTarget] = useState(null);

  const priceResults = useQueries({
    queries: holdings.map((h) => ({
      queryKey: ['quote', h.ticker],
      queryFn: () => finnhub.quote(h.ticker),
      staleTime: 30_000,
      refetchInterval: 30_000,
    })),
  });

  if (!holdings.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No positions yet</p>
        <p className="text-sm">Search for a stock and click "Buy" to start building your portfolio.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
              <th className="pb-2 font-medium">Stock</th>
              <th className="pb-2 font-medium text-right">Shares</th>
              <th className="pb-2 font-medium text-right">Avg Cost</th>
              <th className="pb-2 font-medium text-right">Current</th>
              <th className="pb-2 font-medium text-right">Mkt Value</th>
              <th className="pb-2 font-medium text-right">P&amp;L</th>
              <th className="pb-2 font-medium text-right">Return</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {holdings.map((h, i) => {
              const currentPrice = priceResults[i]?.data?.c ?? h.avgCost;
              const { marketValue, pnl, pnlPercent } = calcPnL(h, currentPrice);
              return (
                <tr key={h.ticker} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-3">
                    <button onClick={() => navigate(`/stock/${h.ticker}`)} className="text-left">
                      <div className="font-bold text-white">{h.ticker}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px]">{h.name}</div>
                    </button>
                  </td>
                  <td className="py-3 text-right text-gray-300">{h.shares.toFixed(4)}</td>
                  <td className="py-3 text-right text-gray-300">{formatCurrency(h.avgCost)}</td>
                  <td className="py-3 text-right text-white">{formatCurrency(currentPrice)}</td>
                  <td className="py-3 text-right text-white">{formatCurrency(marketValue)}</td>
                  <td className={`py-3 text-right ${changeColor(pnl)}`}>{formatCurrency(pnl)}</td>
                  <td className={`py-3 text-right ${changeColor(pnlPercent)}`}>{formatPercent(pnlPercent)}</td>
                  <td className="py-3 text-right">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setTradeTarget({ ticker: h.ticker, name: h.name, mode: 'sell' })}
                    >
                      Sell
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {tradeTarget && (
        <TradeModal
          open
          symbol={tradeTarget.ticker}
          name={tradeTarget.name}
          initialMode={tradeTarget.mode}
          onClose={() => setTradeTarget(null)}
        />
      )}
    </>
  );
}
