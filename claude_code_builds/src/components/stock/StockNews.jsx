import { useStockNews } from '../../hooks/useStockNews';
import { NewsCard } from '../news/NewsCard';
import { LoadingCard } from '../ui/LoadingSpinner';

export function StockNews({ symbol }) {
  const { data: articles, isLoading } = useStockNews(symbol);

  if (isLoading) return <LoadingCard rows={3} />;

  const items = (articles ?? []).slice(0, 10);
  if (!items.length) return <p className="text-gray-500 text-sm">No recent news found.</p>;

  return (
    <div className="space-y-3">
      {items.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
