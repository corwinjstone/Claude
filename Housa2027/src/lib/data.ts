// Server-side data access. Swap these for SQLite or an API later; callers stay the same.
import 'server-only';
import zips from '@data/zips.json';
import properties from '@data/properties.json';
import agents from '@data/agents.json';
import brokerages from '@data/brokerages.json';
import teams from '@data/teams.json';
import requests from '@data/requests.json';
import bids from '@data/bids.json';
import titleBranches from '@data/titleBranches.json';
import closings from '@data/closings.json';
import milestones from '@data/milestones.json';
import viewLogs from '@data/viewLogs.json';
import fairShare from '@data/fairShare.json';
import type * as T from './types';

export const db = {
  zips: zips as T.Zip[],
  properties: properties as T.Property[],
  agents: agents as T.Agent[],
  brokerages: brokerages as T.Brokerage[],
  teams: teams as T.Team[],
  requests: requests as T.SellerRequest[],
  bids: bids as T.Bid[],
  titleBranches: titleBranches as T.TitleBranch[],
  closings: closings as T.Closing[],
  milestones: milestones as T.Milestones[],
  viewLogs: viewLogs as T.ViewLog[],
  fairShare: fairShare as T.FairShareRules,
};

/** Median full-service percent across sample bids, rounded to 0.05. Shown as "typical", never as a set rate. */
export function typicalHousaPercent(): { value: number; sampleSize: number } {
  const v = db.bids.filter((b) => b.package === 'full-service' && b.fee.kind === 'percent').map((b) => b.fee.value).sort((a, b) => a - b);
  const mid = v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
  return { value: Math.round(mid * 20) / 20, sampleSize: v.length };
}
