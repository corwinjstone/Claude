import { usePortfolioStore } from '../../stores/portfolioStore';
import { useQueries } from '@tanstack/react-query';
import { finnhub } from '../../services/finnhub';
import { formatCurrency, formatPercent, changeColor } from '../../utils/formatters';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function PortfolioSummary() {
  const { cash, holdings, startingBalance } = usePortfolioStore();

  const priceResults = useQueries({
    queries: holdings.map((h) => ({
      queryKey: ['quote', h.ticker],
      queryFn: () => finnhub.quote(h.ticker),
      staleTime: 30_000,
      refetchInterval: 30_000,
    })),
  });

  const marketValue = holdings.reduce((sum, h, i) => {
    const price = priceResults[i]?.data?.c ?? h.avgCost;
    return sum + h.shares * price;
  }, 0);

  const totalValue = marketValue + cash;
  const totalReturn = totalValue - startingBalance;
  const totalReturnPct = (totalReturn / startingBalance) * 100;
  const isPos = totalReturn >= 0;

  const stats = [
    { label: 'Total Value',    value: formatCurrency(totalValue), icon: DollarSign,   color: 'text-blue-400' },
    { label: 'Invested',       value: formatCurrency(marketValue), icon: TrendingUp,  color: 'text-purple-400' },
    { label: 'Cash Available', value: formatCurrency(cash),        icon: DollarSign,   color: 'text-gray-400' },
    {
      label: 'Total Return',
      value: `${formatCurrency(totalReturn)} (${formatPercent(totalReturnPct)})`,
      icon: isPos ? TrendingUp : TrendingDown,
      color: changeColor(totalReturn),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className={`mb-2 ${color}`}><Icon size={16} /></div>
          <div className="text-xs text-gray-500 mb-1">{label}</div>
          <div className={`text-sm font-bold ${label === 'Total Return' ? changeColor(totalReturn) : 'text-white'}`}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
