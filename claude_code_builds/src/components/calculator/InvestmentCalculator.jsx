import { useState } from 'react';
import { useStockCandles } from '../../hooks/useStockCandles';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';
import { calculateInvestmentReturn } from '../../utils/calculator';
import { formatCurrency, formatPercent, formatDate, changeColor } from '../../utils/formatters';
import { StockSearch } from '../stock/StockSearch';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import { fetchYahooCandlesByDays } from '../../services/yahoo';
import { useQuery } from '@tanstack/react-query';

const PRESETS = [
  { label: '6 Months', days: 182 },
  { label: '1 Year',   days: 365 },
  { label: '3 Years',  days: 1095 },
  { label: '5 Years',  days: 1825 },
];

export function InvestmentCalculator() {
  const [ticker, setTicker] = useState('');
  const [amount, setAmount] = useState('1000');
  const [days, setDays] = useState(365);
  const [submitted, setSubmitted] = useState(false);

  const { data: candles, isFetching } = useQuery({
    queryKey: ['calc-candles', ticker, days],
    queryFn: () => fetchYahooCandlesByDays(ticker, days),
    enabled: submitted && !!ticker,
    staleTime: 300_000,
  });

  // Also fetch S&P 500 for comparison
  const { data: spyCandles } = useQuery({
    queryKey: ['calc-candles', 'SPY', days],
    queryFn: () => fetchYahooCandlesByDays('SPY', days),
    enabled: submitted && !!ticker,
    staleTime: 300_000,
  });

  const result = submitted && candles?.length ? calculateInvestmentReturn(candles, parseFloat(amount)) : null;
  const spyResult = submitted && spyCandles?.length ? calculateInvestmentReturn(spyCandles, parseFloat(amount)) : null;

  function handleCalculate() {
    setSubmitted(true);
  }

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Stock</label>
            <StockSearch
              placeholder="Search ticker…"
              onSelect={(sym) => { setTicker(sym); setSubmitted(false); }}
            />
            {ticker && <div className="text-xs text-blue-400 mt-1">Selected: {ticker}</div>}
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Amount Invested ($)</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setSubmitted(false); }}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Time Period</label>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setDays(p.days); setSubmitted(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    days === p.days ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          disabled={!ticker || !parseFloat(amount) || isFetching}
          className="mt-4"
          variant="primary"
        >
          <Calculator size={15} />
          {isFetching ? 'Calculating…' : 'Calculate Return'}
        </Button>
      </Card>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Main result */}
          <Card className={`border-2 ${result.gain >= 0 ? 'border-green-700' : 'border-red-700'}`}>
            <div className="flex items-center gap-2 mb-4">
              {result.gain >= 0
                ? <TrendingUp className="text-green-400" size={20} />
                : <TrendingDown className="text-red-400" size={20} />}
              <span className="text-base font-semibold text-white">
                {ticker} — {PRESETS.find((p) => p.days === days)?.label} Performance
              </span>
            </div>

            <div className="text-center py-4">
              <div className="text-4xl font-bold text-white mb-1">{formatCurrency(result.currentValue)}</div>
              <div className="text-sm text-gray-400">
                Your {formatCurrency(result.investedAmount)} investment is now worth
              </div>
              <div className={`text-2xl font-bold mt-3 ${changeColor(result.gain)}`}>
                {result.gain >= 0 ? '+' : ''}{formatCurrency(result.gain)} ({formatPercent(result.percentReturn)})
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Annualized return: {formatPercent(result.annualizedReturn)} / year
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-800">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-0.5">Shares Bought</div>
                <div className="text-sm font-semibold text-white">{result.shares.toFixed(4)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-0.5">Start Price</div>
                <div className="text-sm font-semibold text-white">{formatCurrency(result.startPrice)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-0.5">End Price</div>
                <div className="text-sm font-semibold text-white">{formatCurrency(result.endPrice)}</div>
              </div>
            </div>
          </Card>

          {/* S&P 500 comparison */}
          {spyResult && (
            <Card>
              <div className="text-xs text-gray-500 mb-2">Comparison: same {formatCurrency(parseFloat(amount))} in S&P 500 (SPY)</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">S&P 500 return</span>
                <div className="text-right">
                  <div className={`text-sm font-bold ${changeColor(spyResult.gain)}`}>
                    {formatPercent(spyResult.percentReturn)}
                  </div>
                  <div className="text-xs text-gray-500">{formatCurrency(spyResult.currentValue)}</div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-800 flex justify-between text-xs text-gray-500">
                <span>{ticker} beat the S&P 500 by:</span>
                <span className={changeColor(result.percentReturn - spyResult.percentReturn)}>
                  {formatPercent(result.percentReturn - spyResult.percentReturn, 1)}
                </span>
              </div>
            </Card>
          )}
        </div>
      )}

      {submitted && !isFetching && !result && (
        <Card>
          <p className="text-sm text-gray-500 text-center">
            Could not load historical data for {ticker}. Try a different ticker or time period.
          </p>
        </Card>
      )}
    </div>
  );
}
