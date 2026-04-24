import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useStockQuote } from '../../hooks/useStockQuote';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { formatCurrency } from '../../utils/formatters';
import { CheckCircle, AlertCircle } from 'lucide-react';

export function TradeModal({ open, onClose, symbol, name, initialMode = 'buy' }) {
  const [mode, setMode] = useState(initialMode);
  const [shares, setShares] = useState('');
  const [result, setResult] = useState(null);

  const { data: quote, isLoading } = useStockQuote(symbol);
  const { buyStock, sellStock, cash, holdings } = usePortfolioStore();

  const price = quote?.c ?? 0;
  const quantity = parseFloat(shares) || 0;
  const total = quantity * price;

  const holding = holdings.find((h) => h.ticker === symbol);
  const maxSell = holding?.shares ?? 0;

  function handleTrade() {
    const payload = { ticker: symbol, shares: quantity, price, name };
    const res = mode === 'buy' ? buyStock(payload) : sellStock(payload);
    setResult(res);
    if (res.ok) {
      setTimeout(() => { setResult(null); setShares(''); onClose(); }, 1500);
    }
  }

  function handleClose() {
    setResult(null);
    setShares('');
    onClose();
  }

  const canSubmit = quantity > 0 && price > 0 &&
    (mode === 'buy' ? total <= cash : quantity <= maxSell);

  return (
    <Modal open={open} onClose={handleClose} title={`${symbol} — ${name}`}>
      {/* Mode toggle */}
      <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
        {['buy', 'sell'].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null); setShares(''); }}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
              mode === m
                ? m === 'buy' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Price */}
      <div className="flex justify-between text-sm mb-4">
        <span className="text-gray-400">Market Price</span>
        <span className="font-semibold text-white">{isLoading ? '…' : formatCurrency(price)}</span>
      </div>

      {/* Shares input */}
      <div className="mb-3">
        <label className="text-xs text-gray-500 mb-1 block">Number of Shares</label>
        <input
          type="number"
          min="0"
          step="0.0001"
          value={shares}
          onChange={(e) => { setShares(e.target.value); setResult(null); }}
          placeholder="0"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Order summary */}
      {quantity > 0 && (
        <div className="bg-gray-800/60 rounded-lg p-3 mb-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Shares</span>
            <span className="text-white">{quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Est. Total</span>
            <span className="font-semibold text-white">{formatCurrency(total)}</span>
          </div>
          {mode === 'buy' && (
            <div className="flex justify-between">
              <span className="text-gray-400">Cash After</span>
              <span className={total > cash ? 'text-red-400' : 'text-green-400'}>{formatCurrency(cash - total)}</span>
            </div>
          )}
          {mode === 'sell' && holding && (
            <div className="flex justify-between">
              <span className="text-gray-400">Shares Owned</span>
              <span className="text-white">{maxSell.toFixed(4)}</span>
            </div>
          )}
        </div>
      )}

      {/* Result feedback */}
      {result && (
        <div className={`flex items-center gap-2 text-sm p-3 rounded-lg mb-3 ${result.ok ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
          {result.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {result.ok ? `${mode === 'buy' ? 'Bought' : 'Sold'} ${quantity} share(s) of ${symbol}!` : result.error}
        </div>
      )}

      <Button
        className="w-full"
        variant={mode === 'buy' ? 'success' : 'danger'}
        disabled={!canSubmit}
        onClick={handleTrade}
      >
        {mode === 'buy' ? `Buy ${quantity || '—'} share(s)` : `Sell ${quantity || '—'} share(s)`}
      </Button>

      <p className="text-xs text-gray-600 text-center mt-3">
        This is a simulation. No real money is used.
      </p>
    </Modal>
  );
}
