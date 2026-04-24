import { usePortfolioStore } from '../../stores/portfolioStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

export function TransactionHistory() {
  const { transactions } = usePortfolioStore();

  if (!transactions.length) {
    return <p className="text-sm text-gray-500 text-center py-6">No transactions yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
            <th className="pb-2 font-medium">Date</th>
            <th className="pb-2 font-medium">Type</th>
            <th className="pb-2 font-medium">Stock</th>
            <th className="pb-2 font-medium text-right">Shares</th>
            <th className="pb-2 font-medium text-right">Price</th>
            <th className="pb-2 font-medium text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-800/20">
              <td className="py-2.5 text-gray-400">{formatDate(tx.date, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
              <td className="py-2.5">
                <Badge variant={tx.type === 'BUY' ? 'positive' : 'negative'}>{tx.type}</Badge>
              </td>
              <td className="py-2.5">
                <div className="font-bold text-white">{tx.ticker}</div>
                <div className="text-xs text-gray-500 truncate max-w-[120px]">{tx.name}</div>
              </td>
              <td className="py-2.5 text-right text-gray-300">{tx.shares.toFixed(4)}</td>
              <td className="py-2.5 text-right text-gray-300">{formatCurrency(tx.price)}</td>
              <td className="py-2.5 text-right font-medium text-white">{formatCurrency(tx.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
