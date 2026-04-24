import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, LineStyle } from 'lightweight-charts';
import { useStockCandles } from '../../hooks/useStockCandles';
import { CHART_RESOLUTIONS } from '../../utils/constants';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function PriceChart({ symbol }) {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const seriesRef = useRef(null);
  const [range, setRange] = useState('1M');

  const { data: candles, isLoading, isError } = useStockCandles(symbol, range);

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#1f2937', style: LineStyle.Dotted },
        horzLines: { color: '#1f2937', style: LineStyle.Dotted },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: '#374151' },
      timeScale: { borderColor: '#374151', timeVisible: true },
      width: containerRef.current.clientWidth,
      height: 300,
    });

    const series = chart.addAreaSeries({
      lineColor: '#3b82f6',
      topColor: 'rgba(59,130,246,0.3)',
      bottomColor: 'rgba(59,130,246,0.01)',
      lineWidth: 2,
      priceLineVisible: false,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: containerRef.current.clientWidth });
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, []);

  // Update data when candles change
  useEffect(() => {
    if (!seriesRef.current || !candles?.length) return;
    const chartData = candles.map((c) => ({ time: c.time, value: c.close }));
    seriesRef.current.setData(chartData);
    chartRef.current?.timeScale().fitContent();

    // Color series based on performance
    const first = chartData[0]?.value;
    const last = chartData[chartData.length - 1]?.value;
    const isUp = last >= first;
    seriesRef.current.applyOptions({
      lineColor: isUp ? '#22c55e' : '#ef4444',
      topColor: isUp ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
      bottomColor: isUp ? 'rgba(34,197,94,0.01)' : 'rgba(239,68,68,0.01)',
    });
  }, [candles]);

  return (
    <div>
      {/* Range tabs */}
      <div className="flex gap-1 mb-3">
        {CHART_RESOLUTIONS.map(({ label }) => (
          <button
            key={label}
            onClick={() => setRange(label)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              range === label
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative">
        <div ref={containerRef} className="w-full" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950/60">
            <LoadingSpinner />
          </div>
        )}
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            Unable to load chart data
          </div>
        )}
      </div>
    </div>
  );
}
