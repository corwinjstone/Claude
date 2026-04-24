import { useQuery } from '@tanstack/react-query';
import { finnhub } from '../services/finnhub';

export function useCompanyProfile(symbol) {
  return useQuery({
    queryKey: ['profile', symbol],
    queryFn: () => finnhub.companyProfile(symbol),
    enabled: !!symbol,
    staleTime: 3_600_000,
  });
}

export function useBasicFinancials(symbol) {
  return useQuery({
    queryKey: ['financials', symbol],
    queryFn: () => finnhub.basicFinancials(symbol),
    enabled: !!symbol,
    staleTime: 3_600_000,
  });
}
