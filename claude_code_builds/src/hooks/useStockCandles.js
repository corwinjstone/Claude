import { useQuery } from '@tanstack/react-query';
import { finnhub } from '../services/finnhub';
import { CHART_RESOLUTIONS } from '../utils/constants';

function getFromTo(days) {
  const to = Math.floor(Date.now() / 1000);
  const from = to - days * 24 * 3600;
  return { from, to };
}

export function useStockCandles(symbol, rangeLabel = '1M') {
  const range = CHART_RESOLUTIONS.find((r) => r.label === rangeLabel) ?? CHART_RESOLUTIONS[2];
  const { from, to } = getFromTo(range.days);

  return useQuery({
    queryKey: ['candles', symbol, rangeLabel],
    queryFn: () => finnhub.candles(symbol, range.resolution, from, to),
    enabled: !!symbol,
    staleTime: 300_000,
    select: (data) => {
      if (!data?.t || data.s !== 'ok') return [];
      return data.t.map((t, i) => ({
        time: t,
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i],
        // alias for calculator
        t,
        c: data.c[i],
      }));
    },
  });
}
