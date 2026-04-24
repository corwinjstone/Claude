/**
 * Calculate investment return from historical candle data.
 * candles: array of { t (unix timestamp), c (close price) }
 */
export function calculateInvestmentReturn(candles, investedAmount) {
  if (!candles || candles.length < 2) return null;

  const startPrice = candles[0].c;
  const endPrice = candles[candles.length - 1].c;

  if (!startPrice || !endPrice) return null;

  const shares = investedAmount / startPrice;
  const currentValue = shares * endPrice;
  const gain = currentValue - investedAmount;
  const percentReturn = ((currentValue - investedAmount) / investedAmount) * 100;

  // Annualized return (CAGR)
  const startDate = new Date(candles[0].t * 1000);
  const endDate = new Date(candles[candles.length - 1].t * 1000);
  const years = (endDate - startDate) / (365.25 * 24 * 3600 * 1000);
  const annualizedReturn = years > 0
    ? ((currentValue / investedAmount) ** (1 / years) - 1) * 100
    : percentReturn;

  return {
    investedAmount,
    currentValue,
    gain,
    percentReturn,
    annualizedReturn,
    shares,
    startPrice,
    endPrice,
    startDate,
    endDate,
  };
}

/**
 * Calculate total portfolio market value from holdings and current prices.
 * holdings: [{ ticker, shares, avgCost }]
 * prices: { AAPL: 180.5, MSFT: 320.1, ... }
 */
export function calculatePortfolioValue(holdings, prices) {
  return holdings.reduce((total, h) => {
    const price = prices[h.ticker] ?? h.avgCost;
    return total + h.shares * price;
  }, 0);
}

/**
 * Calculate unrealized P&L for a single holding.
 */
export function calcPnL(holding, currentPrice) {
  const marketValue = holding.shares * currentPrice;
  const costBasis = holding.shares * holding.avgCost;
  const pnl = marketValue - costBasis;
  const pnlPercent = (pnl / costBasis) * 100;
  return { marketValue, costBasis, pnl, pnlPercent };
}
