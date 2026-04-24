import { useState } from 'react';
import { useMarketNews, useStockNews } from '../hooks/useStockNews';
import { useWatchlistStore } from '../stores/watchlistStore';
import { NewsCard } from '../components/news/NewsCard';
import { LoadingCard } from '../components/ui/LoadingSpinner';
import { Newspaper } from 'lucide-react';

const CATEGORIES = [
  { id: 'general', label: 'All News' },
  { id: 'forex',   label: 'Forex' },
  { id: 'crypto',  label: 'Crypto' },
  { id: 'merger',  label: 'M&A' },
];

function WatchlistNews() {
  const { tickers } = useWatchlistStore();
  // Fetch news for first ticker as representative — Finnhub limits
  const { data, isLoading } = useStockNews(tickers[0]);
  if (!tickers.length) return <p className="text-sm text-gray-500">Add stocks to your watchlist to see relevant news.</p>;
  if (isLoading) return <LoadingCard rows={5} />;
  const items = data ?? [];
  if (!items.length) return <p className="text-sm text-gray-500">No recent news for your watchlist.</p>;
  return (
    <div className="space-y-2">
      {items.slice(0, 20).map((a) => <NewsCard key={a.id} article={a} />)}
    </div>
  );
}

export function News() {
  const [tab, setTab] = useState('market');
  const [category, setCategory] = useState('general');

  const { data: marketNews, isLoading } = useMarketNews(category);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Newspaper size={20} className="text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Market News</h1>
      </div>

      {/* Source tabs */}
      <div className="flex gap-1 border-b border-gray-800">
        {[{ id: 'market', label: 'All Market News' }, { id: 'watchlist', label: 'My Watchlist' }].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id ? 'text-white border-blue-500' : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'market' && (
        <>
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === c.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <LoadingCard rows={6} />
          ) : (
            <div className="space-y-2">
              {(marketNews ?? []).slice(0, 30).map((a) => <NewsCard key={a.id} article={a} />)}
              {!marketNews?.length && <p className="text-sm text-gray-500">No news available.</p>}
            </div>
          )}
        </>
      )}

      {tab === 'watchlist' && <WatchlistNews />}
    </div>
  );
}
