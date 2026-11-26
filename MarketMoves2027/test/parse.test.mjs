import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEdgarFeed, parseForm4, form4Events, schedule13Event, parseArkHoldings, diffHoldings } from '../lib/parse.mjs';

const FEED = `<?xml version="1.0" encoding="ISO-8859-1" ?>
<feed xmlns="http://www.w3.org/2005/Atom">
<entry>
<title>4 - Acme Robotics, Inc. (0001111111) (Issuer)</title>
<link rel="alternate" type="text/html" href="https://www.sec.gov/Archives/edgar/data/1111111/000222222226000010/0002222222-26-000010-index.htm"/>
<summary type="html"> &lt;b&gt;Filed:&lt;/b&gt; 2026-11-25 &lt;b&gt;AccNo:&lt;/b&gt; 0002222222-26-000010</summary>
<updated>2026-11-25T16:31:02-05:00</updated>
<category scheme="https://www.sec.gov/" label="form type" term="4"/>
<id>urn:tag:sec.gov,2008:accession-number=0002222222-26-000010</id>
</entry>
<entry>
<title>4 - Big Fund Partners LP (0002222222) (Reporting)</title>
<link rel="alternate" type="text/html" href="https://www.sec.gov/Archives/edgar/data/2222222/000222222226000010/0002222222-26-000010-index.htm"/>
<updated>2026-11-25T16:31:02-05:00</updated>
<category scheme="https://www.sec.gov/" label="form type" term="4"/>
<id>urn:tag:sec.gov,2008:accession-number=0002222222-26-000010</id>
</entry>
<entry>
<title>SCHEDULE 13D/A - Smith &amp; Sons Corp (0003333333) (Subject)</title>
<link rel="alternate" type="text/html" href="https://www.sec.gov/Archives/edgar/data/3333333/000444444426000007/0004444444-26-000007-index.htm"/>
<updated>2026-11-25T17:01:00-05:00</updated>
<category scheme="https://www.sec.gov/" label="form type" term="SCHEDULE 13D/A"/>
<id>urn:tag:sec.gov,2008:accession-number=0004444444-26-000007</id>
</entry>
<entry>
<title>SCHEDULE 13D/A - Activist Capital (Master) Ltd (0004444444) (Filed by)</title>
<link rel="alternate" type="text/html" href="https://www.sec.gov/Archives/edgar/data/4444444/000444444426000007/0004444444-26-000007-index.htm"/>
<updated>2026-11-25T17:01:00-05:00</updated>
<category scheme="https://www.sec.gov/" label="form type" term="SCHEDULE 13D/A"/>
<id>urn:tag:sec.gov,2008:accession-number=0004444444-26-000007</id>
</entry>
</feed>`;

const FORM4 = `<SEC-DOCUMENT>junk<XML>
<?xml version="1.0"?>
<ownershipDocument>
  <issuer><issuerCik>0001111111</issuerCik><issuerName>Acme Robotics, Inc.</issuerName><issuerTradingSymbol>acme</issuerTradingSymbol></issuer>
  <reportingOwner>
    <reportingOwnerId><rptOwnerCik>0002222222</rptOwnerCik><rptOwnerName>Big Fund Partners LP</rptOwnerName></reportingOwnerId>
    <reportingOwnerRelationship><isDirector>0</isDirector><isOfficer>false</isOfficer><isTenPercentOwner>1</isTenPercentOwner></reportingOwnerRelationship>
  </reportingOwner>
  <nonDerivativeTable>
    <nonDerivativeTransaction>
      <securityTitle><value>Common Stock</value></securityTitle>
      <transactionDate><value>2026-11-23</value></transactionDate>
      <transactionCoding><transactionFormType>4</transactionFormType><transactionCode>P</transactionCode></transactionCoding>
      <transactionAmounts>
        <transactionShares><value>100000</value></transactionShares>
        <transactionPricePerShare><value>10.00</value></transactionPricePerShare>
        <transactionAcquiredDisposedCode><value>A</value></transactionAcquiredDisposedCode>
      </transactionAmounts>
      <postTransactionAmounts><sharesOwnedFollowingTransaction><value>5100000</value></sharesOwnedFollowingTransaction></postTransactionAmounts>
    </nonDerivativeTransaction>
    <nonDerivativeTransaction>
      <transactionDate><value>2026-11-24</value></transactionDate>
      <transactionCoding><transactionCode>P</transactionCode></transactionCoding>
      <transactionAmounts>
        <transactionShares><value>50000</value></transactionShares>
        <transactionPricePerShare><value>12.00</value><footnoteId id="F1"/></transactionPricePerShare>
      </transactionAmounts>
      <postTransactionAmounts><sharesOwnedFollowingTransaction><value>5150000</value></sharesOwnedFollowingTransaction></postTransactionAmounts>
    </nonDerivativeTransaction>
    <nonDerivativeTransaction>
      <transactionDate><value>2026-11-24</value></transactionDate>
      <transactionCoding><transactionCode>A</transactionCode></transactionCoding>
      <transactionAmounts><transactionShares><value>999</value></transactionShares><transactionPricePerShare><value>0</value></transactionPricePerShare></transactionAmounts>
    </nonDerivativeTransaction>
  </nonDerivativeTable>
</ownershipDocument>
</XML></SEC-DOCUMENT>`;

test('feed entries group by accession and expose parties', () => {
  const filings = parseEdgarFeed(FEED);
  assert.equal(filings.length, 2);
  const f4 = filings[0];
  assert.equal(f4.form, '4');
  assert.deepEqual(f4.parties.map((p) => p.role), ['Issuer', 'Reporting']);
  assert.equal(f4.textUrl, 'https://www.sec.gov/Archives/edgar/data/1111111/000222222226000010/0002222222-26-000010.txt');
  assert.equal(filings[1].parties[1].name, 'Activist Capital (Master) Ltd');
});

test('form 4 keeps only open-market trades and sums fills', () => {
  const filing = parseEdgarFeed(FEED)[0];
  const parsed = parseForm4(FORM4);
  assert.equal(parsed.ticker, 'ACME');
  assert.equal(parsed.trades.length, 2);
  const [ev] = form4Events(filing, parsed);
  assert.equal(ev.action, 'buy');
  assert.equal(ev.shares, 150000);
  assert.equal(ev.value, 1_600_000);
  assert.equal(ev.tenPct, true);
  assert.deepEqual(ev.tags, ['10% owner']);
  assert.equal(ev.tradeDate, '2026-11-24');
  assert.equal(form4Events(filing, parsed, { minValue: 2e6 }).length, 0);
});

test('schedule 13 row comes from the feed; stake size is optional enrichment', () => {
  const filing = parseEdgarFeed(FEED)[1];
  const bare = schedule13Event(filing);
  assert.equal(bare.company, 'Smith & Sons Corp');
  assert.equal(bare.actor, 'Activist Capital (Master) Ltd');
  assert.deepEqual(bare.tags, ['13D activist', 'Amended']);
  assert.equal(bare.pct, null);
  const rich = schedule13Event(filing, '<p:percentOfClass>7.4</p:percentOfClass><aggregateAmountOwned>1,250,000</aggregateAmountOwned><percentOfClass>2.1</percentOfClass>');
  assert.equal(rich.pct, 7.4);
  assert.equal(rich.shares, 1_250_000);
});

const csv = (date, rows) =>
  ['date,fund,company,ticker,cusip,shares,market value ($),weight (%)',
    ...rows.map(([t, sh, v]) => `${date},ARKK,${t} INC,${t},C${t},"${sh.toLocaleString('en-US')}","$${v.toLocaleString('en-US')}.00",1.00%`),
    '"Investors should carefully consider, etc."'].join('\n');

test('holdings diff ignores proportional fund flows', () => {
  const tickers = ['A', 'B', 'C', 'D', 'E', 'F'];
  const prev = parseArkHoldings(csv('11/24/2026', [...tickers.map((t) => [t, 1000, 10000]), ['OLD', 500, 5000]]));
  assert.equal(prev.date, '2026-11-24');
  assert.equal(prev.positions.length, 7);
  // Everything scales 2% (creations); A is also bought, F trimmed, NEW opened, OLD exited.
  const next = parseArkHoldings(csv('11/25/2026', [['A', 1530, 15300], ['B', 1020, 10200], ['C', 1020, 10200], ['D', 1020, 10200], ['E', 1020, 10200], ['F', 510, 5100], ['NEW', 300, 6000]]));
  const ev = Object.fromEntries(diffHoldings(prev, next).map((e) => [e.ticker, e]));
  assert.deepEqual(Object.keys(ev).sort(), ['A', 'F', 'NEW', 'OLD']);
  assert.equal(ev.A.action, 'buy');
  assert.equal(ev.A.shares, 510);
  assert.equal(ev.A.value, 5100);
  assert.equal(ev.F.action, 'sell');
  assert.deepEqual(ev.NEW.tags, ['New position']);
  assert.deepEqual(ev.OLD.tags, ['Exited']);
  assert.equal(diffHoldings(next, next).length, 0);
});
