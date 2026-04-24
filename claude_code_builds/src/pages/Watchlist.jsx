import { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { useWatchlistStore } from '../stores/watchlistStore';
import { StockCard } from '../components/stock/StockCard';
import { StockSearch } from '../components/stock/StockSearch';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Watchlist() {
  const { tickers, addTicker, removeTicker } = useWatchlistStore();
  const [sortBy, setSortBy] = useState('default');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
          <p className="text-sm text-gray-500 mt-1">{tickers.length} stock{tickers.length !== 1 ? 's' : ''} saved</p>
        </div>
        <div className="w-full sm:w-72">
          <StockSearch
            placeholder="Add a stock to watchlist…"
            onSelect={(sym) => addTicker(sym)}
          />
        </div>
      </div>

      {tickers.length === 0 ? (
        <Card className="text-center py-12">
          <Star size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 mb-1">Your watchlist is empty</p>
          <p className="text-sm text-gray-600">Search for stocks above to start tracking them.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tickers.map((ticker) => (
              <div key={ticker} className="group relative">
                <div className="w-44">
                  <StockCard symbol={ticker} />
                </div>
                <button
                  onClick={() => removeTicker(ticker)}
                  className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
