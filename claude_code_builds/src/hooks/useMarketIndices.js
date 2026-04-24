import { useQueries } from '@tanstack/react-query';
import { finnhub } from '../services/finnhub';
import { INDEX_TICKERS } from '../utils/constants';

export function useMarketIndices() {
  const results = useQueries({
    queries: INDEX_TICKERS.map(({ symbol }) => ({
      queryKey: ['quote', symbol],
      queryFn: () => finnhub.quote(symbol),
      staleTime: 30_000,
      refetchInterval: 30_000,
    })),
  });

  return INDEX_TICKERS.map((index, i) => ({
    ...index,
    data: results[i].data,
    isLoading: results[i].isLoading,
    isError: results[i].isError,
  }));
}
