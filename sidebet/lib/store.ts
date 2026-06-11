import { nanoid } from "nanoid";
import type { Bet, User, FeedItem } from "./types";

// In-memory store. Persists for the lifetime of the dev server process.
// (For prod, swap with SQLite / Postgres — same interface.)

type DB = {
  users: Map<string, User>;
  bets: Map<string, Bet>;
  feed: FeedItem[];
};

declare global {
  // eslint-disable-next-line no-var
  var __sidebet_db: DB | undefined;
}

function seed(): DB {
  const users: User[] = [
    { id: "u_me",      name: "You",            handle: "@you",    walletUsd: 166, avatarUrl: avatar("you", "#4ADE80") },
    { id: "u_randy",   name: "Randy Jackson",  handle: "@randy",  walletUsd: 240, avatarUrl: avatar("RJ", "#F59E0B") },
    { id: "u_mike",    name: "Michael Reginelli", handle: "@mike", walletUsd: 89,  avatarUrl: avatar("MR", "#3B82F6") },
    { id: "u_maggie",  name: "Maggie Chen",    handle: "@maggie", walletUsd: 312, avatarUrl: avatar("MC", "#EC4899") },
    { id: "u_dre",     name: "Andre Soto",     handle: "@dre",    walletUsd: 48,  avatarUrl: avatar("AS", "#10B981") },
    { id: "u_tay",     name: "Taylor Park",    handle: "@tay",    walletUsd: 510, avatarUrl: avatar("TP", "#A855F7") },
  ];

  const u = Object.fromEntries(users.map((x) => [x.id, x]));

  const bets: Bet[] = [
    {
      id: "b_blazers",
      title: "Trailblazers to win +5",
      category: "sports",
      description: "Spread bet on Blazers vs Pelicans, NBA",
      sideA: { label: "Trailblazers", sublabel: "(47-34)", logo: "🏀" },
      sideB: { label: "Pelicans",     sublabel: "(42-39)", logo: "🦅" },
      spread: 5,
      creatorId: "u_me",
      visibility: "public",
      status: "resolved",
      positions: [
        { userId: "u_me",    side: "a", stake: { kind: "cash" }, createdAt: now(-86400 * 2) },
        { userId: "u_randy", side: "b", stake: { kind: "cash", amountUsd: 10 }, createdAt: now(-86400 * 2) },
        { userId: "u_mike",  side: "b", stake: { kind: "cash", amountUsd: 5  }, createdAt: now(-86400 * 2) },
      ],
      resolution: { winningSide: "a", resolvedAt: now(-3600), rationale: "Final: Trailblazers 132 – Pelicans 98." },
      context: "Final score: Trailblazers 132, Pelicans 98. Date Apr 4, 2018.",
      createdAt: now(-86400 * 2),
      eventAt: now(-3600),
    },
    {
      id: "b_pelicans_draft",
      title: "Pelicans to win outright",
      category: "sports",
      sideA: { label: "Pelicans",     sublabel: "(42-39)", logo: "🦅" },
      sideB: { label: "Field",        sublabel: "anyone else", logo: "🏆" },
      creatorId: "u_me",
      visibility: "private",
      status: "draft",
      positions: [
        { userId: "u_me", side: "a", stake: { kind: "cash" }, createdAt: now(-3600) },
      ],
      createdAt: now(-3600),
    },
    {
      id: "b_raiders",
      title: "Raiders to win outright",
      category: "sports",
      sideA: { label: "Raiders", logo: "🏴‍☠️" },
      sideB: { label: "Field",   logo: "🏆" },
      creatorId: "u_randy",
      visibility: "private",
      status: "open",
      positions: [
        { userId: "u_randy", side: "a", stake: { kind: "cash", amountUsd: 20 }, createdAt: now(-1800) },
      ],
      createdAt: now(-1800),
    },
    {
      id: "b_beer",
      title: "Beer Challenge",
      category: "goofy",
      description: "Most beers in 20 minutes.",
      sideA: { label: "Dre",  emoji: "🍺" },
      sideB: { label: "Tay",  emoji: "🍺" },
      creatorId: "u_dre",
      visibility: "private",
      status: "active",
      positions: [
        { userId: "u_dre", side: "a", stake: { kind: "dinner", description: "Loser buys dinner" }, createdAt: now(-7200) },
        { userId: "u_tay", side: "b", stake: { kind: "dinner", description: "Loser buys dinner" }, createdAt: now(-7200) },
      ],
      createdAt: now(-7200),
    },
    {
      id: "b_armoury",
      title: "Beer Challenge at Armoury",
      category: "goofy",
      description: "Fastest guzzle.",
      sideA: { label: "Mike", emoji: "🍺" },
      sideB: { label: "Randy", emoji: "🍺" },
      creatorId: "u_mike",
      visibility: "public",
      status: "open",
      positions: [
        { userId: "u_mike", side: "a", stake: { kind: "favor", description: "Piggyback ride across the street" }, createdAt: now(-1200) },
      ],
      createdAt: now(-1200),
    },
    {
      id: "b_btc",
      title: "BTC > $80k by Friday",
      category: "stocks",
      sideA: { label: "Yes, > $80k", emoji: "📈" },
      sideB: { label: "No, ≤ $80k",  emoji: "📉" },
      creatorId: "u_tay",
      visibility: "public",
      status: "open",
      positions: [
        { userId: "u_tay", side: "a", stake: { kind: "crypto", amountUsd: 25, description: "0.0003 BTC" }, createdAt: now(-600) },
      ],
      createdAt: now(-600),
    },
    {
      id: "b_puddle",
      title: "Can Jordan clear the puddle?",
      category: "goofy",
      description: "Single-leg jump over the giant puddle on Main St.",
      sideA: { label: "Clears it", emoji: "🦘" },
      sideB: { label: "Splash",    emoji: "💦" },
      creatorId: "u_maggie",
      visibility: "public",
      status: "open",
      positions: [
        { userId: "u_maggie", side: "b", stake: { kind: "favor", description: "Loser does the dishes for a week" }, createdAt: now(-300) },
      ],
      createdAt: now(-300),
    },
  ];

  const feed: FeedItem[] = [
    {
      id: "f1",
      type: "news",
      title: "Trail Blazers Sign Rookie Gary Trent Jr",
      body: "PORTLAND, Ore. — The Portland Trail Blazers have signed guard Gary Trent Jr., it was announced today by president of basketball operations…",
      date: "Jul 06, 2018",
      tags: ["Trail Blazers", "Gary Trent Jr"],
    },
    {
      id: "f2",
      type: "news",
      title: "David Vanterpool Joins USA Basketball Minicamp",
      body: "USA Basketball announced today that Trail Blazers assistant coach David Vanterpool will join the coaching staff for the upcoming minicamp…",
      date: "Jul 05, 2018",
      tags: ["Lillard", "McCollum", "Trail Blazers"],
    },
    {
      id: "f3",
      type: "news",
      title: "Trail Blazers Sign Guard Nik Stauskas",
      body: "The Portland Trail Blazers have signed free agent guard Nik Stauskas, it was announced today by president of basketball operations…",
      date: "Jul 05, 2018",
      tags: ["Trail Blazers", "Nik Stauskas"],
    },
  ];

  return {
    users: new Map(users.map((x) => [x.id, x])),
    bets: new Map(bets.map((x) => [x.id, x])),
    feed,
  };

  function now(deltaSec = 0) { return Date.now() + deltaSec * 1000; }
}

function avatar(label: string, color: string) {
  // SVG data-uri avatar — no external network required.
  const initials = label.slice(0, 2).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
    <rect width='80' height='80' rx='40' fill='${color}'/>
    <text x='50%' y='54%' text-anchor='middle' font-family='sans-serif' font-size='30' font-weight='700' fill='white' dominant-baseline='middle'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getDb(): DB {
  if (!globalThis.__sidebet_db) globalThis.__sidebet_db = seed();
  return globalThis.__sidebet_db;
}

export const ME = "u_me";

export function currentUser(): User {
  return getDb().users.get(ME)!;
}

export function getUser(id: string) {
  return getDb().users.get(id);
}

export function listUsers() {
  return Array.from(getDb().users.values());
}

export function listBets() {
  return Array.from(getDb().bets.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function listBetsForUser(userId: string) {
  return listBets().filter(
    (b) =>
      b.creatorId === userId ||
      b.positions.some((p) => p.userId === userId),
  );
}

export function listPublicMarketplace() {
  return listBets().filter((b) => b.visibility === "public" && b.status !== "draft");
}

export function getBet(id: string) {
  return getDb().bets.get(id);
}

export function createBet(input: Omit<Bet, "id" | "createdAt" | "positions" | "status"> & { initialStake?: import("./types").Stake; takeSide?: "a" | "b" }): Bet {
  const id = `b_${nanoid(8)}`;
  const bet: Bet = {
    ...input,
    id,
    status: "draft",
    positions: input.takeSide
      ? [{ userId: input.creatorId, side: input.takeSide, stake: input.initialStake ?? { kind: "cash" }, createdAt: Date.now() }]
      : [],
    createdAt: Date.now(),
  };
  getDb().bets.set(id, bet);
  return bet;
}

export function updateBet(id: string, patch: Partial<Bet>): Bet | undefined {
  const b = getDb().bets.get(id);
  if (!b) return undefined;
  const next = { ...b, ...patch };
  getDb().bets.set(id, next);
  return next;
}

export function addPosition(betId: string, position: import("./types").Position) {
  const b = getDb().bets.get(betId);
  if (!b) return undefined;
  b.positions = [...b.positions, position];
  if (b.status === "draft") b.status = "open";
  return b;
}

export function listFeed() { return getDb().feed; }
