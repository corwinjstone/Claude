import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Star, Plus, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import { useStockQuote } from '../hooks/useStockQuote';
import { useCompanyProfile } from '../hooks/useCompanyProfile';
import { useWatchlistStore } from '../stores/watchlistStore';
import { formatCurrency, formatPercent, changeColor } from '../utils/formatters';
import { PriceChart } from '../components/stock/PriceChart';
import { StockFundamentals } from '../components/stock/StockFundamentals';
import { StockNews } from '../components/stock/StockNews';
import { TradeModal } from '../components/portfolio/TradeModal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Card } from '../components/ui/Card';

export function StockDetail() {
  const { ticker } = useParams();
  const symbol = ticker?.toUpperCase();
  const [tradeOpen, setTradeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');

  const { data: quote, isLoading: quoteLoading } = useStockQuote(symbol);
  const { data: profile, isLoading: profileLoading } = useCompanyProfile(symbol);
  const { hasTicker, addTicker, removeTicker } = useWatchlistStore();
  const inWatchlist = hasTicker(symbol);

  const change = quote?.dp ?? 0;
  const isPositive = change >= 0;

  const tabs = ['chart', 'fundamentals', 'news'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-4 justify-between">
        <div>
          {profileLoading ? (
            <div className="h-6 w-48 bg-gray-800 rounded animate-pulse mb-2" />
          ) : (
            <div className="flex items-center gap-3 mb-1">
              {profile?.logo && (
                <img src={profile.logo} alt={symbol} className="w-8 h-8 rounded-lg object-contain bg-white p-0.5" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">{symbol}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{profile?.name}</span>
                  {profile?.exchange && (
                    <Badge variant="neutral">{profile.exchange}</Badge>
                  )}
                  {profile?.finnhubIndustry && (
                    <Badge variant="blue">{profile.finnhubIndustry}</Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {quoteLoading ? (
            <div className="h-10 w-36 bg-gray-800 rounded animate-pulse" />
          ) : (
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">{formatCurrency(quote?.c)}</span>
              <div className={`flex items-center gap-1 text-lg font-semibold ${changeColor(change)}`}>
                {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                {formatPercent(change)}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => inWatchlist ? removeTicker(symbol) : addTicker(symbol)}
          >
            {inWatchlist ? <Minus size={14} /> : <Plus size={14} />}
            {inWatchlist ? 'Remove' : 'Watchlist'}
          </Button>
          <Button variant="success" onClick={() => setTradeOpen(true)}>
            <TrendingUp size={14} />
            Trade
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-white border-blue-500'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'chart' && (
        <Card>
          <PriceChart symbol={symbol} />
        </Card>
      )}

      {activeTab === 'fundamentals' && (
        <div className="space-y-4">
          <StockFundamentals symbol={symbol} />
          {profile?.description && (
            <Card>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">About {profile.name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-6">{profile.description}</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'news' && (
        <StockNews symbol={symbol} />
      )}

      <TradeModal
        open={tradeOpen}
        onClose={() => setTradeOpen(false)}
        symbol={symbol}
        name={profile?.name ?? symbol}
      />
    </div>
  );
}
