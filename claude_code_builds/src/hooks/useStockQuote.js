import { useQuery } from '@tanstack/react-query';
import { finnhub } from '../services/finnhub';

export function useStockQuote(symbol) {
  return useQuery({
    queryKey: ['quote', symbol],
    queryFn: () => finnhub.quote(symbol),
    enabled: !!symbol,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}
