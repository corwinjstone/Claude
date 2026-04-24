import { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { GLOSSARY } from '../utils/constants';
import { Card } from '../components/ui/Card';

const GUIDES = [
  {
    title: 'What is a Stock?',
    body: `A stock (also called a "share") represents a small piece of ownership in a company. When you buy one share of Apple (AAPL), you literally own a tiny fraction of Apple Inc.

Companies sell stocks to raise money. In return, as the company grows and becomes more valuable, so does your share. If Apple doubles in value, your share doubles too.

Most stocks also pay dividends — a portion of the company's profits sent directly to shareholders, usually every 3 months. It's like getting a small paycheck just for owning the stock.

The price of a stock changes constantly based on what people are willing to pay for it. If more people want to buy than sell, the price goes up. If more want to sell, it goes down.`,
  },
  {
    title: 'How Do I Read a Stock Chart?',
    body: `A stock price chart shows how the price of a stock has moved over time. Here's how to read it:

• The Y-axis (vertical) shows the price in dollars.
• The X-axis (horizontal) shows time — days, months, or years.
• A line going up means the stock price increased during that period.
• A line going down means the price fell.

The timeframe buttons (1D, 1W, 1M, 1Y) let you zoom in or out. "1D" shows today's price movement; "1Y" shows how it moved over the past year.

When you hover over the chart, you'll see the exact price at that point in time.

Green usually means the stock is up today. Red means it's down.`,
  },
  {
    title: 'What is the S&P 500?',
    body: `The S&P 500 is an index — a benchmark that tracks 500 of the largest companies in the United States by market cap. Companies like Apple, Microsoft, Amazon, and many others are included.

When people say "the market went up today," they usually mean the S&P 500 went up.

The S&P 500 is widely considered the best single measure of how the US stock market is doing. Over the past 50+ years, it has averaged about 10% return per year — though individual years can vary wildly.

Many financial advisors suggest that for a beginner investor, simply buying an S&P 500 index fund (like SPY or VOO) is one of the smartest long-term strategies because it automatically diversifies you across 500 major companies.`,
  },
  {
    title: 'What is Paper Trading?',
    body: `Paper trading means practicing investing with fake money. You make all the same decisions — picking stocks, buying shares, setting prices — but no real money changes hands.

The name "paper trading" comes from before computers, when investors would write their trades on paper to track how they would have performed.

Paper trading is a great way to:
• Learn how buying and selling works without risking money
• Test your investing strategy before using real dollars
• Get comfortable with market volatility (watching prices go up and down)
• Understand how fees and taxes affect returns

Use the Portfolio section in this app to start paper trading with $10,000 in virtual money.`,
  },
  {
    title: 'What is Diversification?',
    body: `Diversification means spreading your investments across many different stocks, sectors, and asset types — rather than putting all your money into one company.

The classic saying is: "Don't put all your eggs in one basket."

Why it matters: If you put all your money into one company and that company has a bad quarter or bad news (like a CEO resigning), your entire portfolio can drop significantly. But if your money is spread across 20 different companies in different industries, one bad performer won't ruin you.

Easy ways to diversify:
• Buy an ETF like SPY or QQQ that automatically includes hundreds of companies
• Buy stocks across different sectors (tech, healthcare, financials, energy)
• Include some bonds or international stocks alongside US stocks

You don't need to own 50 stocks. Even 8–12 different stocks across different sectors provides meaningful diversification.`,
  },
  {
    title: 'How Does Compound Growth Work?',
    body: `Compound growth is often called "the eighth wonder of the world." It's the process where your investment returns themselves earn returns — creating a snowball effect over time.

Simple example:
• You invest $1,000
• It earns 10% in Year 1 → now worth $1,100
• That $1,100 earns 10% in Year 2 → now worth $1,210
• And so on...

After 10 years at 10% annual return, your $1,000 becomes $2,594.
After 30 years, it becomes $17,449.

The key insight: time is your most powerful tool. Starting early — even with small amounts — beats starting late with larger amounts.

Use the Investment Simulator in this app to see exactly how compound growth would have worked on any stock over any time period.`,
  },
];

export function Learn() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openGuide, setOpenGuide] = useState(null);
  const [openTerm, setOpenTerm] = useState(null);

  const filteredGlossary = GLOSSARY.filter(
    (item) =>
      item.term?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <BookOpen size={20} className="text-green-400" />
        <h1 className="text-2xl font-bold text-white">Investor Education</h1>
      </div>
      <p className="text-sm text-gray-400 -mt-4">
        Plain-English guides and a glossary to help you understand how investing works — no finance degree needed.
      </p>

      {/* Beginner Guides */}
      <section>
        <h2 className="text-base font-semibold text-gray-300 mb-3">Beginner Guides</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GUIDES.map((guide, i) => (
            <Card
              key={i}
              hover
              onClick={() => setOpenGuide(openGuide === i ? null : i)}
              className={openGuide === i ? 'border-blue-600' : ''}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-white leading-snug">{guide.title}</h3>
                <span className="text-gray-500 text-lg shrink-0">{openGuide === i ? '−' : '+'}</span>
              </div>
              {openGuide === i && (
                <div className="mt-3 text-sm text-gray-400 leading-relaxed whitespace-pre-line border-t border-gray-800 pt-3">
                  {guide.body}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Glossary */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-300">Investing Glossary</h2>
          <span className="text-xs text-gray-500">{filteredGlossary.length} terms</span>
        </div>

        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search terms…"
            className="w-full max-w-xs bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          {filteredGlossary.map((item) => (
            <div key={item.term} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenTerm(openTerm === item.term ? null : item.term)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-sm font-semibold text-white">{item.term}</span>
                <span className="text-gray-500">{openTerm === item.term ? '−' : '+'}</span>
              </button>
              {openTerm === item.term && (
                <div className="px-4 pb-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800 pt-3">
                  {item.definition}
                </div>
              )}
            </div>
          ))}

          {filteredGlossary.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No terms matching "{searchTerm}"</p>
          )}
        </div>
      </section>
    </div>
  );
}
