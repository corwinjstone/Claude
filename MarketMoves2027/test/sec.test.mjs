import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDailyIndex, nyToIso, acceptanceTime, recentFilings, filingUrls, sectorOf, MAG7 } from '../lib/sec.mjs';

const IDX = `Description:           Daily Index of EDGAR Dissemination Feed by Form Type
Last Data Received:    November 24, 2026
Comments:              webmaster@sec.gov

Form Type   Company Name                                                  CIK         Date Filed  File Name
---------------------------------------------------------------------------------------------------------------------------------------------
10-K        ACME CORP                                                     1234567     20261124    edgar/data/1234567/0001234567-26-000123.txt
4           NVIDIA CORP                                                   1045810     20261124    edgar/data/1045810/0001045810-26-000201.txt
4           HUANG JEN HSUN                                                1197649     20261124    edgar/data/1197649/0001045810-26-000201.txt
4/A         SMITH  JOHN Q                                                 7654321     20261124    edgar/data/7654321/0001234567-26-000124.txt
SC 13G/A    VANGUARD GROUP INC                                            102909      20261124    edgar/data/102909/0000102909-26-001111.txt
`;

test('daily index rows parse, including multi-word form types', () => {
  const rows = parseDailyIndex(IDX);
  assert.equal(rows.length, 5);
  assert.deepEqual(rows[1], { form: '4', name: 'NVIDIA CORP', cik: '1045810', date: '20261124', path: 'edgar/data/1045810/0001045810-26-000201.txt', accession: '0001045810-26-000201' });
  assert.equal(rows[3].form, '4/A');
  assert.equal(rows[4].form, 'SC 13G/A');
  // issuer and owner rows share one accession
  assert.equal(new Set(rows.filter((r) => r.form === '4').map((r) => r.accession)).size, 1);
});

test('New York wall time converts with daylight saving', () => {
  assert.equal(nyToIso(2026, 11, 25, 16, 30, 18), '2026-11-25T21:30:18Z'); // EST
  assert.equal(nyToIso(2026, 7, 1, 9, 30, 0), '2026-07-01T13:30:00Z'); // EDT
  assert.equal(acceptanceTime('<SEC-HEADER>\n<ACCEPTANCE-DATETIME>20261125163018\nACCESSION NUMBER:'), '2026-11-25T21:30:18Z');
  assert.equal(acceptanceTime('no header'), null);
});

test('submissions JSON yields recent Form 4s', () => {
  const json = { filings: { recent: {
    accessionNumber: ['a-1', 'a-2', 'a-3', 'a-4'],
    form: ['4', '10-Q', '4/A', '4'],
    filingDate: ['2026-11-24', '2026-11-20', '2026-11-10', '2026-09-01'],
    acceptanceDateTime: ['2026-11-24T18:01:02.000Z', null, '2026-11-10T20:00:00.000Z', null],
  } } };
  assert.deepEqual(recentFilings(json, ['4', '4/A'], '2026-10-12').map((f) => f.accession), ['a-1', 'a-3']);
  assert.deepEqual(filingUrls('0001045810', '0001045810-26-000201'), {
    indexUrl: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000201/0001045810-26-000201-index.htm',
    textUrl: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000201/0001045810-26-000201.txt',
  });
});

test('sectors come from SIC codes, with semiconductors split out', () => {
  assert.equal(sectorOf(3674, 'NVDA'), 'Semiconductors');
  assert.equal(sectorOf(3559, 'LRCX'), 'Semiconductors'); // equipment maker named explicitly
  assert.equal(sectorOf(7370, 'GOOGL'), 'Technology');
  assert.equal(sectorOf(3711, 'TSLA'), 'Consumer discretionary');
  assert.equal(sectorOf(5961, 'AMZN'), 'Consumer discretionary');
  assert.equal(sectorOf(2834, 'LLY'), 'Health care');
  assert.equal(sectorOf(6022, 'JPM'), 'Financials');
  assert.equal(sectorOf(6798, 'O'), 'Real estate');
  assert.equal(sectorOf(6770, 'SSAC'), 'SPACs and shells');
  assert.equal(sectorOf(null, 'XYZ'), null);
  assert.equal(MAG7.length, 8); // Alphabet has two share classes
});
