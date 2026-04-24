import { useQuery } from '@tanstack/react-query';
import { fetchYahooCandles } from '../services/yahoo';

export function useStockCandles(symbol, rangeLabel = '1M') {
  return useQuery({
    queryKey: ['candles', symbol, rangeLabel],
    queryFn: () => fetchYahooCandles(symbol, rangeLabel),
    enabled: !!symbol,
    staleTime: 300_000,
  });
}
