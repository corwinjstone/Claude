import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioSummary } from '../components/portfolio/PortfolioSummary';
import { HoldingsTable } from '../components/portfolio/HoldingsTable';
import { TransactionHistory } from '../components/portfolio/TransactionHistory';
import { usePortfolioStore } from '../stores/portfolioStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { RotateCcw, Settings } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function Portfolio() {
  const [activeTab, setActiveTab] = useState('holdings');
  const [showReset, setShowReset] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const { resetPortfolio, setStartingBalance, startingBalance, holdings } = usePortfolioStore();

  const tabs = ['holdings', 'history'];

  function handleReset() {
    resetPortfolio();
    setShowReset(false);
  }

  function handleBalanceSave() {
    const amount = parseFloat(newBalance);
    if (amount >= 100) {
      setStartingBalance(amount);
      setNewBalance('');
      setShowSettings(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">Paper trading — no real money involved</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
            <Settings size={14} />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowReset(true)}>
            <RotateCcw size={14} />
            Reset
          </Button>
        </div>
      </div>

      <PortfolioSummary />

      {holdings.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-gray-400 mb-1">Your portfolio is empty</p>
          <p className="text-sm text-gray-500 mb-4">Search for a stock and click "Trade" to start investing.</p>
          <Link to="/">
            <Button variant="primary">Browse Stocks</Button>
          </Link>
        </Card>
      )}

      {holdings.length > 0 && (
        <>
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
                {tab === 'holdings' ? 'Holdings' : 'Transaction History'}
              </button>
            ))}
          </div>
          <Card>
            {activeTab === 'holdings' ? <HoldingsTable /> : <TransactionHistory />}
          </Card>
        </>
      )}

      {/* Reset confirm */}
      <Modal open={showReset} onClose={() => setShowReset(false)} title="Reset Portfolio">
        <p className="text-sm text-gray-400 mb-4">
          This will clear all your holdings and transactions and restore your cash to {formatCurrency(startingBalance)}.
          This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setShowReset(false)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleReset}>Reset Portfolio</Button>
        </div>
      </Modal>

      {/* Settings */}
      <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Portfolio Settings">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Starting Balance (resets portfolio)</label>
            <input
              type="number"
              min="100"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder={formatCurrency(startingBalance, 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-600 mt-1">Min $100. This will also reset your current holdings.</p>
          </div>
          <Button onClick={handleBalanceSave} disabled={parseFloat(newBalance) < 100} className="w-full">
            Save & Reset Portfolio
          </Button>
        </div>
      </Modal>
    </div>
  );
}
