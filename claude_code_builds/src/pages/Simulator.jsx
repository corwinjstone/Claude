import { InvestmentCalculator } from '../components/calculator/InvestmentCalculator';
import { Calculator } from 'lucide-react';

export function Simulator() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Calculator size={20} className="text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Investment Simulator</h1>
        </div>
        <p className="text-sm text-gray-400">
          Curious how your money would have grown? Enter any stock, a dollar amount, and a time period to see the historical return.
          Great for learning how long-term investing works — no account needed.
        </p>
      </div>

      <InvestmentCalculator />

      <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl p-4 text-xs text-yellow-300/80">
        <strong>Disclaimer:</strong> Past performance does not guarantee future results. This tool is for educational purposes only.
        Always do your own research before investing real money.
      </div>
    </div>
  );
}
