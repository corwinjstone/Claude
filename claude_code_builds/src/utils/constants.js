export const INDEX_TICKERS = [
  { symbol: 'SPY',  label: 'S&P 500',  description: 'Tracks the 500 largest US companies' },
  { symbol: 'DIA',  label: 'Dow Jones', description: '30 major US blue-chip companies' },
  { symbol: 'QQQ',  label: 'NASDAQ',   description: 'Top 100 tech-heavy NASDAQ companies' },
  { symbol: 'IWM',  label: 'Russell 2000', description: '2000 small-cap US companies' },
];

export const SECTOR_ETFS = [
  { symbol: 'XLK',  label: 'Technology' },
  { symbol: 'XLF',  label: 'Financials' },
  { symbol: 'XLV',  label: 'Health Care' },
  { symbol: 'XLY',  label: 'Consumer Disc.' },
  { symbol: 'XLP',  label: 'Consumer Staples' },
  { symbol: 'XLE',  label: 'Energy' },
  { symbol: 'XLI',  label: 'Industrials' },
  { symbol: 'XLU',  label: 'Utilities' },
  { symbol: 'XLRE', label: 'Real Estate' },
  { symbol: 'XLB',  label: 'Materials' },
  { symbol: 'XLC',  label: 'Comm. Services' },
];

export const CHART_RESOLUTIONS = [
  { label: '1D',  resolution: '5',   days: 1 },
  { label: '1W',  resolution: '15',  days: 7 },
  { label: '1M',  resolution: '60',  days: 30 },
  { label: '3M',  resolution: 'D',   days: 90 },
  { label: '1Y',  resolution: 'D',   days: 365 },
  { label: '5Y',  resolution: 'W',   days: 1825 },
];

export const GLOSSARY = [
  { term: 'Stock', definition: 'A share of ownership in a company. When you buy stock, you own a small piece of that business.' },
  { term: 'Market Cap', definition: 'The total value of a company\'s shares. Calculated by multiplying the share price by the number of shares outstanding.' },
  { term: 'P/E Ratio', definition: 'Price-to-Earnings Ratio. Tells you how much investors pay per $1 of a company\'s earnings. A lower P/E can mean the stock is cheaper relative to profits.' },
  { term: 'EPS', definition: 'Earnings Per Share — how much profit a company makes for each share of stock. Higher EPS usually means a healthier company.' },
  { term: 'Dividend', definition: 'A portion of a company\'s profits paid directly to shareholders, usually quarterly. Like getting a small paycheck just for owning the stock.' },
  { term: 'Dividend Yield', definition: 'The annual dividend payment divided by the stock price, shown as a percentage. A 3% yield means you\'d earn $3 per year on every $100 invested.' },
  { term: '52-Week High/Low', definition: 'The highest and lowest price a stock has traded at over the past year. Helps you see where the current price sits in its recent range.' },
  { term: 'Volume', definition: 'How many shares were traded in a given day. High volume can signal big news or strong investor interest.' },
  { term: 'Bull Market', definition: 'A market where prices are rising or expected to rise. Investors are optimistic. The opposite of a bear market.' },
  { term: 'Bear Market', definition: 'A market where prices are falling 20% or more from recent highs. Investors are pessimistic.' },
  { term: 'Portfolio', definition: 'The collection of all investments you own. Diversifying your portfolio across different stocks and sectors can reduce risk.' },
  { term: 'Index', definition: 'A benchmark that tracks a group of stocks. The S&P 500 tracks 500 large US companies. When "the market" goes up, it usually means an index went up.' },
  { term: 'ETF', definition: 'Exchange-Traded Fund. A basket of stocks you can buy as one investment. Like buying a little bit of hundreds of companies at once.' },
  { term: 'Volatility', definition: 'How much a stock\'s price swings up and down. High volatility means bigger price swings — more risk, but potentially more reward.' },
  { term: 'Market Order', definition: 'Buy or sell a stock immediately at the current market price. Fast but you may not get the exact price you wanted.' },
  { symbol: 'Limit Order', definition: 'An order to buy or sell only at a specific price or better. More control, but the trade might not execute if the price never reaches your target.' },
  { term: 'Paper Trading', definition: 'Practicing investing with fake money. No real money at risk — perfect for learning before you invest your own dollars.' },
  { term: 'CAGR', definition: 'Compound Annual Growth Rate. The smoothed annual growth rate of an investment over time. Useful for comparing how well different investments grew.' },
  { term: 'Analyst Rating', definition: 'A recommendation from a Wall Street analyst: Buy (they think the stock will rise), Hold (they think it\'ll stay flat), or Sell (they think it\'ll fall).' },
  { term: 'Earnings', definition: 'A company\'s profit over a period. Companies report earnings quarterly. Strong earnings often push stock prices up; weak earnings can push them down.' },
];

export const POPULAR_TICKERS = [
  { symbol: 'AAPL',  name: 'Apple Inc.' },
  { symbol: 'MSFT',  name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN',  name: 'Amazon.com Inc.' },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.' },
  { symbol: 'META',  name: 'Meta Platforms' },
  { symbol: 'TSLA',  name: 'Tesla Inc.' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway' },
  { symbol: 'JPM',   name: 'JPMorgan Chase' },
  { symbol: 'V',     name: 'Visa Inc.' },
];
