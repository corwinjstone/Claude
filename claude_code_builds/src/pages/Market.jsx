import { BarChart2 } from 'lucide-react';
import { MarketIndices } from '../components/market/MarketIndices';
import { MarketMovers } from '../components/market/MarketMovers';
import { SectorHeatmap } from '../components/market/SectorHeatmap';
import { Card } from '../components/ui/Card';
import { Tooltip } from '../components/ui/Tooltip';

export function Market() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <BarChart2 size={20} className="text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Market Overview</h1>
      </div>

      {/* Indices */}
      <section>
        <h2 className="text-base font-semibold text-gray-300 mb-3">
          Major Indices
          <Tooltip content="These are the most-watched benchmarks for the US stock market. When people say 'the market is up today', they usually mean one of these." />
        </h2>
        <MarketIndices />
      </section>

      {/* Sector heatmap */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-base font-semibold text-gray-300">Sector Performance</h2>
          <Tooltip content="The US stock market is divided into 11 sectors. Seeing which sectors are up or down helps you understand where money is flowing." />
        </div>
        <div className="mb-2 flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-700" /> Strong gain</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-900/60" /> Slight gain</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-900/60" /> Slight loss</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-700" /> Strong loss</span>
        </div>
        <SectorHeatmap />
      </section>

      {/* Market Movers */}
      <section>
        <h2 className="text-base font-semibold text-gray-300 mb-3">Today's Biggest Movers</h2>
        <Card>
          <MarketMovers />
        </Card>
      </section>

      {/* Educational context */}
      <section>
        <Card className="border-blue-900/40 bg-blue-950/20">
          <h3 className="text-sm font-semibold text-blue-300 mb-2">How to Read This Page</h3>
          <ul className="text-sm text-gray-400 space-y-1.5 list-disc list-inside">
            <li><strong className="text-gray-300">Indices</strong> show how the overall market is doing. Green = stocks mostly rose today.</li>
            <li><strong className="text-gray-300">Sector heatmap</strong> shows which parts of the economy are performing. Click any sector to see its ETF details.</li>
            <li><strong className="text-gray-300">Top Gainers/Losers</strong> show individual stocks with the biggest daily price changes.</li>
            <li>Prices refresh every 30 seconds during market hours (9:30 AM – 4:00 PM ET).</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
