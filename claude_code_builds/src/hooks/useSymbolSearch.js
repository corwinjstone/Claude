import { useQuery } from '@tanstack/react-query';
import { finnhub } from '../services/finnhub';

export function useSymbolSearch(query) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => finnhub.symbolSearch(query),
    enabled: query?.length >= 1,
    staleTime: 300_000,
    select: (data) =>
      (data?.result ?? [])
        .filter((r) => r.type === 'Common Stock' && !r.symbol.includes('.'))
        .slice(0, 8),
  });
}
