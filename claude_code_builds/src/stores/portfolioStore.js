import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_BALANCE = 10000;

export const usePortfolioStore = create(
  persist(
    (set, get) => ({
      cash: DEFAULT_BALANCE,
      startingBalance: DEFAULT_BALANCE,
      holdings: [],       // [{ ticker, shares, avgCost, name }]
      transactions: [],   // [{ id, type, ticker, shares, price, total, date, name }]

      setStartingBalance: (amount) =>
        set({ startingBalance: amount, cash: amount, holdings: [], transactions: [] }),

      buyStock: ({ ticker, shares, price, name }) => {
        const total = shares * price;
        const { cash, holdings } = get();
        if (total > cash) return { error: 'Insufficient funds' };

        const existing = holdings.find((h) => h.ticker === ticker);
        const newHoldings = existing
          ? holdings.map((h) =>
              h.ticker === ticker
                ? {
                    ...h,
                    shares: h.shares + shares,
                    avgCost: (h.avgCost * h.shares + price * shares) / (h.shares + shares),
                  }
                : h
            )
          : [...holdings, { ticker, shares, avgCost: price, name }];

        const tx = {
          id: Date.now(),
          type: 'BUY',
          ticker,
          name,
          shares,
          price,
          total,
          date: new Date().toISOString(),
        };

        set({ cash: cash - total, holdings: newHoldings, transactions: [tx, ...get().transactions] });
        return { ok: true };
      },

      sellStock: ({ ticker, shares, price }) => {
        const { cash, holdings } = get();
        const holding = holdings.find((h) => h.ticker === ticker);
        if (!holding || holding.shares < shares) return { error: 'Not enough shares' };

        const total = shares * price;
        const newHoldings =
          holding.shares === shares
            ? holdings.filter((h) => h.ticker !== ticker)
            : holdings.map((h) =>
                h.ticker === ticker ? { ...h, shares: h.shares - shares } : h
              );

        const tx = {
          id: Date.now(),
          type: 'SELL',
          ticker,
          name: holding.name,
          shares,
          price,
          total,
          date: new Date().toISOString(),
        };

        set({ cash: cash + total, holdings: newHoldings, transactions: [tx, ...get().transactions] });
        return { ok: true };
      },

      resetPortfolio: () => {
        const { startingBalance } = get();
        set({ cash: startingBalance, holdings: [], transactions: [] });
      },
    }),
    { name: 'portfolio' }
  )
);
