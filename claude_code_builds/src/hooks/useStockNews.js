import { useQuery } from '@tanstack/react-query';
import { finnhub } from '../services/finnhub';
import { format, subDays } from 'date-fns';

function dateStr(d) {
  return format(d, 'yyyy-MM-dd');
}

export function useStockNews(symbol) {
  const to = dateStr(new Date());
  const from = dateStr(subDays(new Date(), 7));

  return useQuery({
    queryKey: ['stock-news', symbol],
    queryFn: () => finnhub.companyNews(symbol, from, to),
    enabled: !!symbol,
    staleTime: 60_000,
  });
}

export function useMarketNews(category = 'general') {
  return useQuery({
    queryKey: ['market-news', category],
    queryFn: () => finnhub.marketNews(category),
    staleTime: 60_000,
  });
}
