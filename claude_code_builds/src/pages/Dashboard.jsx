import { Link } from 'react-router-dom';
import { MarketIndices } from '../components/market/MarketIndices';
import { MarketMovers } from '../components/market/MarketMovers';
import { StockCard } from '../components/stock/StockCard';
import { StockSearch } from '../components/stock/StockSearch';
import { NewsCard } from '../components/news/NewsCard';
import { useWatchlistStore } from '../stores/watchlistStore';
import { useMarketNews } from '../hooks/useStockNews';
import { Calculator, Briefcase, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Dashboard() {
  const { tickers } = useWatchlistStore();
  const { data: news } = useMarketNews('general');

  return (
    <div className="space-y-8">
      {/* Hero search */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-white mb-2">Your Market Dashboard</h1>
        <p className="text-gray-400 text-sm mb-6">Real-time data · Paper trading · Investment simulator</p>
        <div className="max-w-lg mx-auto">
          <StockSearch placeholder="Search any stock, e.g. Apple, Tesla, NVDA…" className="text-left" />
        </div>
      </div>

      {/* Market indices */}
      <section>
        <h2 className="text-base font-semibold text-gray-300 mb-3">Major Indices</h2>
        <MarketIndices />
      </section>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Link to="/portfolio">
          <Card hover className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/40 rounded-lg"><Briefcase size={18} className="text-blue-400" /></div>
            <div>
              <div className="text-sm font-semibold text-white">Paper Trading</div>
              <div className="text-xs text-gray-500">Practice investing risk-free</div>
            </div>
          </Card>
        </Link>
        <Link to="/simulator">
          <Card hover className="flex items-center gap-3">
            <div className="p-2 bg-purple-900/40 rounded-lg"><Calculator size={18} className="text-purple-400" /></div>
            <div>
              <div className="text-sm font-semibold text-white">Investment Simulator</div>
              <div className="text-xs text-gray-500">See past performance of any investment</div>
            </div>
          </Card>
        </Link>
        <Link to="/market">
          <Card hover className="flex items-center gap-3">
            <div className="p-2 bg-green-900/40 rounded-lg"><TrendingUp size={18} className="text-green-400" /></div>
            <div>
              <div className="text-sm font-semibold text-white">Market Overview</div>
              <div className="text-xs text-gray-500">Sectors, movers, and economic data</div>
            </div>
          </Card>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Watchlist */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-300">My Watchlist</h2>
            <Link to="/watchlist" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
          </div>
          {tickers.length === 0 ? (
            <Card>
              <p className="text-sm text-gray-500 text-center py-4">
                No stocks in your watchlist yet.<br />Search for a stock and click "Add to Watchlist".
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {tickers.slice(0, 6).map((ticker) => (
                <StockCard key={ticker} symbol={ticker} />
              ))}
            </div>
          )}
        </section>

        {/* Market movers */}
        <section>
          <h2 className="text-base font-semibold text-gray-300 mb-3">Market Movers</h2>
          <Card>
            <MarketMovers />
          </Card>
        </section>
      </div>

      {/* News */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-300">Latest Market News</h2>
          <Link to="/news" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
        </div>
        <div className="space-y-2">
          {(news ?? []).slice(0, 5).map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
          {!news && (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
