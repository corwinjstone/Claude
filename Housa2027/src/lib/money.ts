const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });

export const money = (n: number) => usd.format(Math.round(n));
export const moneyCompact = (n: number) => compact.format(n);
/** Round to a friendly number for "about $X" headlines. */
export const about = (n: number) => money(Math.round(n / 1000) * 1000);
export const pct = (n: number, digits = 2) => `${Number(n.toFixed(digits))}%`;
