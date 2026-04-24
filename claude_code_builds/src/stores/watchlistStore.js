import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      tickers: ['AAPL', 'MSFT', 'NVDA', 'AMZN'],

      addTicker: (ticker) =>
        set((s) => ({
          tickers: s.tickers.includes(ticker.toUpperCase())
            ? s.tickers
            : [...s.tickers, ticker.toUpperCase()],
        })),

      removeTicker: (ticker) =>
        set((s) => ({
          tickers: s.tickers.filter((t) => t !== ticker.toUpperCase()),
        })),

      hasTicker: (ticker) =>
        get().tickers.includes(ticker?.toUpperCase()),
    }),
    { name: 'watchlist' }
  )
);
