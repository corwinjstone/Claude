// Seeded dummy-data generator for the Housa prototype. Run: npm run seed
// Output is deterministic, so the JSON in /data can be regenerated at any time.
// Every person, address, brokerage and title company here is fictional.
import { writeFileSync, mkdirSync } from 'node:fs';

let seed = 20271111;
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (a) => a[Math.floor(rand() * a.length)];
const int = (lo, hi) => Math.floor(lo + rand() * (hi - lo + 1));
const round = (n, to) => Math.round(n / to) * to;
const pad = (n, w = 3) => String(n).padStart(w, '0');

// DFW zip codes (real zips; values are rough illustrative $/sqft, not market data).
const zips = [
  { zip: '75204', city: 'Dallas', neighborhood: 'Uptown', ppsf: 395, lat: 32.8031, lng: -96.7958 },
  { zip: '75206', city: 'Dallas', neighborhood: 'Lower Greenville', ppsf: 360, lat: 32.8307, lng: -96.7701 },
  { zip: '75214', city: 'Dallas', neighborhood: 'Lakewood', ppsf: 385, lat: 32.8237, lng: -96.7486 },
  { zip: '75218', city: 'Dallas', neighborhood: 'White Rock', ppsf: 300, lat: 32.8443, lng: -96.6994 },
  { zip: '75230', city: 'Dallas', neighborhood: 'Preston Hollow North', ppsf: 340, lat: 32.8999, lng: -96.7897 },
  { zip: '75208', city: 'Dallas', neighborhood: 'Bishop Arts', ppsf: 310, lat: 32.7495, lng: -96.8389 },
  { zip: '75024', city: 'Plano', neighborhood: 'Legacy', ppsf: 255, lat: 33.0775, lng: -96.8086 },
  { zip: '75093', city: 'Plano', neighborhood: 'Willow Bend', ppsf: 245, lat: 33.0350, lng: -96.8050 },
  { zip: '75034', city: 'Frisco', neighborhood: 'Starwood', ppsf: 260, lat: 33.1508, lng: -96.8290 },
  { zip: '75070', city: 'McKinney', neighborhood: 'Stonebridge Ranch', ppsf: 225, lat: 33.1720, lng: -96.6815 },
  { zip: '75013', city: 'Allen', neighborhood: 'Twin Creeks', ppsf: 220, lat: 33.1146, lng: -96.6650 },
  { zip: '75019', city: 'Coppell', neighborhood: 'Old Coppell', ppsf: 255, lat: 32.9668, lng: -96.9800 },
  { zip: '76092', city: 'Southlake', neighborhood: 'Timarron', ppsf: 330, lat: 32.9576, lng: -97.1497 },
  { zip: '76107', city: 'Fort Worth', neighborhood: 'Arlington Heights', ppsf: 280, lat: 32.7393, lng: -97.3830 },
  { zip: '76109', city: 'Fort Worth', neighborhood: 'Tanglewood', ppsf: 290, lat: 32.7037, lng: -97.3870 },
  { zip: '76116', city: 'Fort Worth', neighborhood: 'Ridglea', ppsf: 215, lat: 32.7260, lng: -97.4416 },
  { zip: '76012', city: 'Arlington', neighborhood: 'Central Arlington', ppsf: 185, lat: 32.7536, lng: -97.1340 },
  { zip: '75062', city: 'Irving', neighborhood: 'Valley Ranch', ppsf: 205, lat: 32.8487, lng: -96.9745 },
  { zip: '75040', city: 'Garland', neighborhood: 'Firewheel', ppsf: 180, lat: 32.9260, lng: -96.6150 },
  { zip: '76248', city: 'Keller', neighborhood: 'Keller Town Center', ppsf: 235, lat: 32.9300, lng: -97.2290 },
];

const streets = ['Mockingbird Ln', 'Bluebonnet Dr', 'Live Oak St', 'Pecan Valley Rd', 'Cedar Springs Ct', 'Prairie Wind Way', 'Magnolia Ave', 'Trinity Bend Dr', 'Post Oak Pl', 'Lone Star Trl', 'Willow Creek Dr', 'Brazos Ct', 'Sycamore Ln', 'Red Bud Dr', 'Highland Park Way', 'Mesquite Hollow Rd', 'Lakeshore Dr', 'Ranch View Ct', 'Cottonwood Ln', 'Shady Grove St'];
const first = ['Maria', 'James', 'Aisha', 'Wei', 'Carlos', 'Priya', 'Daniel', 'Grace', 'Luis', 'Hannah', 'Omar', 'Emily', 'Jamal', 'Sofia', 'Nguyen', 'Rachel', 'Diego', 'Keisha', 'Tom', 'Fatima', 'Ben', 'Ana', 'Marcus', 'Leah', 'Raj', 'Olivia', 'Andre', 'Mei', 'Tyler', 'Yesenia', 'Noah', 'Chloe', 'Samuel', 'Isabel', 'Kevin', 'Zara'];
const last = ['Garcia', 'Johnson', 'Patel', 'Nguyen', 'Williams', 'Chen', 'Martinez', 'Brown', 'Okafor', 'Davis', 'Hernandez', 'Kim', 'Wilson', 'Lopez', 'Thompson', 'Ramirez', 'Washington', 'Singh', 'Moore', 'Rivera', 'Anderson', 'Tran', 'Jackson', 'Flores', 'Clark', 'Ali', 'Lewis', 'Reyes', 'Walker', 'Cooper'];
const usedNames = new Set();
const person = () => {
  let n;
  do n = `${pick(first)} ${pick(last)}`; while (usedNames.has(n));
  usedNames.add(n);
  return n;
};

// ---------- Properties (40) ----------
const timelines = ['asap', '1-3-months', '3-6-months', '6-12-months'];
const conditions = ['move-in-ready', 'needs-minor-updates', 'needs-major-work'];
const properties = Array.from({ length: 40 }, (_, i) => {
  const z = zips[i % zips.length];
  const beds = int(2, 5);
  const baths = Math.min(beds, int(1, 4)) + (rand() < 0.4 ? 0.5 : 0);
  const sqft = round(900 + beds * 420 + int(-200, 900), 10);
  const value = round(sqft * z.ppsf * 0.8 * (0.88 + rand() * 0.24), 1000);
  const owner = person();
  return {
    id: `prop-${pad(i + 1)}`,
    address: { street: `${int(100, 9899)} ${pick(streets)}`, city: z.city, state: 'TX', zip: z.zip },
    neighborhood: z.neighborhood,
    // Real location is kept private; agents only see a blurred circle around the zip center.
    location: { lat: +(z.lat + (rand() - 0.5) * 0.02).toFixed(5), lng: +(z.lng + (rand() - 0.5) * 0.02).toFixed(5) },
    beds, baths, sqft,
    yearBuilt: int(1948, 2021),
    lotSqft: round(sqft * (1.6 + rand() * 2.5), 50),
    condition: pick(conditions),
    estValue: { low: round(value * 0.94, 5000), mid: value, high: round(value * 1.06, 5000) },
    mortgagePayoff: rand() < 0.15 ? 0 : round(value * (0.18 + rand() * 0.5), 1000),
    owner: { name: owner, email: `${owner.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`, phone: `(214) 555-${pad(int(100, 9999), 4)}` },
    interiorPhotos: int(4, 12),
  };
});

// ---------- Brokerages, teams, agents (30) ----------
const brokerages = [
  { id: 'brk-01', name: 'Lone Star Realty Partners', office: 'Uptown Dallas', broker: 'Patricia Holloway' },
  { id: 'brk-02', name: 'Trinity Cloud Realty', office: 'Remote / DFW', broker: 'Marcus Bell' },
  { id: 'brk-03', name: 'Bluebonnet Home Group', office: 'Plano', broker: 'Elena Cho' },
  { id: 'brk-04', name: 'Cowtown Property Co.', office: 'Fort Worth', broker: 'Wade Pruitt' },
  { id: 'brk-05', name: 'North Texas Keystone Realty', office: 'Frisco', broker: 'Dana Whitfield' },
  { id: 'brk-06', name: 'Metroplex Modern Brokerage', office: 'Irving', broker: 'Samir Haddad' },
];
const teams = [
  { id: 'team-01', name: 'The Holloway Group', brokerageId: 'brk-01', licensedMembers: 5 },
  { id: 'team-02', name: 'Frisco Home Collective', brokerageId: 'brk-05', licensedMembers: 4 },
];
const packageNames = ['full-service', 'list-negotiate', 'price-negotiate', 'contract-to-close', 'pricing-consult'];
const agents = Array.from({ length: 30 }, (_, i) => {
  const top = i < 9; // 9 top producers, 21 rising/newer agents
  const sides = top ? int(18, 60) : int(0, 14);
  const team = top && i < 5 ? teams[i < 3 ? 0 : 1] : null;
  const brokerage = team ? brokerages.find((b) => b.id === team.brokerageId) : pick(brokerages);
  const licensedSince = top ? int(2006, 2016) : int(2016, 2025);
  const name = person();
  return {
    id: `agt-${pad(i + 1)}`,
    name,
    licenseNumber: `TX-${int(500000, 799999)}`,
    licenseVerified: true,
    licensedSince,
    brokerageId: brokerage.id,
    teamId: team?.id ?? null,
    tier: sides >= 15 ? 'top-producer' : 'rising',
    sidesLast12Months: sides,
    zipsServed: Array.from(new Set([pick(zips).zip, pick(zips).zip, pick(zips).zip])),
    rating: +(top ? 4.5 + rand() * 0.5 : 4.0 + rand() * 1.0).toFixed(1),
    reviewCount: top ? int(40, 220) : int(0, 30),
    avgResponseHours: +(top ? 2 + rand() * 10 : 0.5 + rand() * 6).toFixed(1),
    saleToListPct: +(96 + rand() * 4.5).toFixed(1),
    medianDaysOnMarket: int(9, 45),
    onTimeReportRate: +(0.85 + rand() * 0.15).toFixed(2),
    releasesLast12Months: rand() < 0.1 ? 1 : 0,
    activeHousaClients: top ? int(2, 6) : int(0, 3),
    bidsThisWeek: int(0, 7),
    bio: top
      ? `${licensedSince < 2012 ? 'Veteran' : 'Experienced'} listing agent with a full-time team. Known for pricing and staging.`
      : `Licensed since ${licensedSince}. Full-time, with time for every client. I answer the same day.`,
    packagePrices: Object.fromEntries(packageNames.map((p) => [p, null])),
  };
});
// Default package prices each agent sets
for (const a of agents) {
  const f = a.tier === 'top-producer' ? 1.15 : 0.9;
  a.packagePrices = {
    'full-service': { kind: 'percent', value: +(a.tier === 'top-producer' ? 1.75 + rand() * 0.75 : 1.25 + rand() * 0.5).toFixed(2) },
    'list-negotiate': { kind: 'flat', value: round(4500 * f + int(-500, 500), 100) },
    'price-negotiate': { kind: 'flat', value: round(2500 * f + int(-300, 300), 100) },
    'contract-to-close': { kind: 'flat', value: round(1500 * f + int(-200, 200), 100) },
    'pricing-consult': { kind: 'flat', value: round(400 * f + int(-50, 50), 25) },
  };
}

// ---------- Seller requests (14) ----------
const statuses = ['open', 'open', 'open', 'open', 'open', 'bidding', 'bidding', 'bidding', 'bidding', 'accepted', 'under-contract', 'under-contract', 'closed', 'closed'];
const servicesAll = ['pricing', 'photos', 'mls-listing', 'showings', 'offers-negotiation', 'paperwork-to-close', 'staging-advice'];
const now = Date.parse('2026-11-11T15:00:00Z');
const hours = (h) => new Date(now - h * 3600e3).toISOString();
const requests = statuses.map((status, i) => {
  const p = properties[i];
  const posted = status === 'open' ? int(1, 30) : status === 'bidding' ? int(20, 70) : int(200, 2000);
  const pkg = pick(['full-service', 'full-service', 'list-negotiate', 'price-negotiate']);
  return {
    id: `req-${pad(i + 1)}`,
    propertyId: p.id,
    sellerName: p.owner.name,
    status,
    postedAt: hours(posted),
    ownershipVerified: true,
    timeline: pick(timelines),
    condition: p.condition,
    conditionNotes: pick(['New roof in 2023.', 'Kitchen updated 2019; original baths.', 'Foundation repaired with transferable warranty.', 'Pool needs resurfacing.', 'Fresh paint and new carpet upstairs.']),
    feePreference: pick([{ kind: 'percent', maxPercent: 1.5 }, { kind: 'flat', maxFlat: 8000 }, { kind: 'open' }]),
    packageWanted: pkg,
    servicesWanted: pkg === 'full-service' ? servicesAll : servicesAll.filter(() => rand() < 0.6),
    buyerAgentOffer: pick([{ kind: 'percent', value: 2.5 }, { kind: 'percent', value: 2 }, { kind: 'flat', value: 0 }]),
    sellerGoalPrice: p.estValue.mid,
    // Rising-agent window: first 12 hours only rising agents may bid
    risingWindowEndsAt: new Date(Date.parse(hours(posted)) + 12 * 3600e3).toISOString(),
    acceptedBidId: null,
  };
});

// ---------- Bids ----------
const bids = [];
let bidN = 1;
for (const r of requests.filter((r) => r.status !== 'open')) {
  const p = properties.find((x) => x.id === r.propertyId);
  const count = int(3, 7);
  const usedTeams = new Set();
  const chosen = [];
  for (const a of [...agents].sort(() => rand() - 0.5)) {
    if (chosen.length >= count) break;
    const teamKey = a.teamId ?? a.id;
    if (usedTeams.has(teamKey)) continue; // one bid per team
    usedTeams.add(teamKey);
    chosen.push(a);
  }
  for (const a of chosen) {
    const pkg = rand() < 0.7 ? 'full-service' : pick(['list-negotiate', 'price-negotiate']);
    const fee = pkg === 'full-service'
      ? (rand() < 0.65 ? { kind: 'percent', value: a.packagePrices['full-service'].value } : { kind: 'flat', value: round(p.estValue.mid * 0.012, 250) })
      : a.packagePrices[pkg];
    const suggested = round(p.estValue.mid * (0.96 + rand() * 0.09), 5000);
    bids.push({
      id: `bid-${pad(bidN++)}`,
      requestId: r.id,
      agentId: a.id,
      package: pkg,
      fee,
      coversPlatformFee: rand() < 0.15,
      suggestedListPrice: suggested,
      priceRange: { low: round(suggested * 0.97, 5000), high: round(suggested * 1.03, 5000) },
      plan: pick([
        'Pro photos and a 3D tour in week 1. Live on the MLS by day 4. Open house the first weekend. Weekly written report every Monday.',
        'Price it right from day one using 6 recent nearby sales. Pre-listing inspection so buyers have fewer surprises. I reply within 2 hours.',
        'Light staging advice, twilight photos, and targeted social ads to buyers in your zip. Weekly reports by email and text.',
        'I handle every showing and screen buyers for financing before they tour. You get a written update every Friday.',
      ]),
      brokerApproved: rand() < 0.9,
      submittedAt: new Date(Date.parse(r.postedAt) + int(1, 40) * 3600e3).toISOString(),
      status: 'active',
      counterRound: 0,
    });
  }
  if (['accepted', 'under-contract', 'closed'].includes(r.status)) {
    const win = bids.filter((b) => b.requestId === r.id)[0];
    win.status = 'accepted';
    r.acceptedBidId = win.id;
  }
}

// ---------- Title company directory (fictional DFW branches) ----------
const titleCompanies = ['Prairie Land Title', 'Trinity Abstract & Title', 'Lone Star Escrow & Title', 'Red River Title Co.', 'Metroplex Title Group'];
const branchAreas = ['Uptown', 'Preston Center', 'Plano Legacy', 'Frisco', 'Fort Worth Sundance', 'Southlake', 'Arlington', 'McKinney', 'Las Colinas', 'Lakewood'];
const titleBranches = [];
titleCompanies.forEach((c, ci) => {
  branchAreas.filter((_, bi) => (bi + ci) % 2 === 0).forEach((area, bi) => {
    const slug = c.toLowerCase().replace(/[^a-z]+/g, '');
    titleBranches.push({
      id: `ttl-${pad(titleBranches.length + 1)}`,
      company: c,
      branch: area,
      displayName: `${c} – ${area}`,
      intakeEmail: `${area.toLowerCase().replace(/[^a-z]+/g, '')}.intake@${slug}.example.com`,
      phone: `(972) 555-${pad(int(1000, 9999), 4)}`,
      escrowOfficers: [person(), person()].map((name) => ({ name, email: `${name.split(' ')[0].toLowerCase()}@${slug}.example.com` })),
    });
  });
});

// ---------- Closings / fee status ----------
const closings = requests.filter((r) => ['under-contract', 'closed'].includes(r.status)).map((r, i) => {
  const t = titleBranches[i * 3 % titleBranches.length];
  const closed = r.status === 'closed';
  return {
    id: `cls-${pad(i + 1)}`,
    requestId: r.id,
    bidId: r.acceptedBidId,
    titleBranchId: t.id,
    escrowOfficer: t.escrowOfficers[0],
    gfNumber: closed || i % 2 === 0 ? `GF-${int(2600000, 2699999)}` : null,
    contractUploaded: true,
    packetSentAt: hours(int(100, 600)),
    salePrice: closed ? round(properties.find((p) => p.id === r.propertyId).estValue.mid * 1.01, 1000) : null,
    closingDate: closed ? hours(int(24, 400)).slice(0, 10) : '2026-12-12',
    platformFee: 995,
    feeStatus: closed ? (i % 2 ? 'paid' : 'overdue') : 'pending',
    feePaidAt: closed && i % 2 ? hours(20) : null,
  };
});

// ---------- Milestones ----------
const milestoneOrder = ['signed', 'listed', 'under-contract', 'inspection', 'appraisal', 'clear-to-close', 'closed'];
const milestones = requests.filter((r) => r.acceptedBidId).map((r) => {
  const reached = r.status === 'accepted' ? 1 : r.status === 'under-contract' ? 4 : 7;
  return {
    requestId: r.id,
    steps: milestoneOrder.map((key, i) => ({ key, done: i < reached, at: i < reached ? hours((reached - i) * 120) : null })),
  };
});

// ---------- View logs (both directions) ----------
const viewLogs = [];
for (let i = 0; i < 80; i++) {
  const r = pick(requests);
  if (rand() < 0.65) {
    viewLogs.push({ id: `log-${pad(i + 1, 4)}`, at: hours(int(1, 700)), direction: 'agent-viewed-request', agentId: pick(agents).id, requestId: r.id, stage: pick([1, 1, 1, 2, 2]), attributionSigned: rand() < 0.5 });
  } else {
    const b = bids.filter((x) => x.requestId === r.id);
    const bid = b.length ? pick(b) : null;
    viewLogs.push({ id: `log-${pad(i + 1, 4)}`, at: hours(int(1, 700)), direction: 'seller-viewed-agent', requestId: r.id, agentId: bid ? bid.agentId : pick(agents).id, bidId: bid?.id ?? null, stage: null, attributionSigned: null });
  }
}
viewLogs.sort((a, b) => b.at.localeCompare(a.at));

const fairShare = {
  risingAgentWindowHours: 12,
  risingAgentMaxSides: 15,
  bidSlotsPerRequest: 8,
  reservedRisingSlots: 3,
  bidsPerTeamPerRequest: 1,
  activeClientCap: { solo: 6, perTeamMember: 3, teamMax: 15 },
  weeklyBidCap: 10,
  marketShareCapPct: 10,
  releasesBeforePause: 2,
  pauseDays: 90,
};

const out = { zips, properties, brokerages, teams, agents, requests, bids, titleBranches, closings, milestones, viewLogs, fairShare };
mkdirSync(new URL('../data/', import.meta.url), { recursive: true });
for (const [k, v] of Object.entries(out)) writeFileSync(new URL(`../data/${k}.json`, import.meta.url), JSON.stringify(v, null, 2) + '\n');
console.log(Object.entries(out).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length : 'object'}`).join('\n'));
