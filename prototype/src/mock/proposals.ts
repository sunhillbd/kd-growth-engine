import { Proposal } from '../types';

export const initialProposals: Proposal[] = [
  {
    id: 'prop-1',
    suggestion: 'Pause funding-news source collector to conserve outreach credits',
    evidence: 'Generated 40 leads across PitchBook/TechCrunch with 0 replies in the last 45 days (sample N=40).',
    sampleSize: 40,
    status: 'pending',
    actionType: 'pause_source',
    targetEntity: 'Funding News (TechCrunch & PitchBook)',
    date: '2026-10-27'
  },
  {
    id: 'prop-2',
    suggestion: 'Double outreach quota on Hacker News Ask HN logistics queries',
    evidence: 'Hacker News logistics signals yield a 28.5% positive reply rate across 14 contacted companies (sample N=14).',
    sampleSize: 14,
    status: 'pending',
    actionType: 'increase_budget',
    targetEntity: 'Hacker News (Ask HN & Who is Hiring)',
    date: '2026-10-26'
  },
  {
    id: 'prop-3',
    suggestion: 'Create new Brain proof case study for LegalTech contract automation',
    evidence: '4 inbound inquiries received in the last 14 days mentioning contract review without an approved public case study (sample N=4).',
    sampleSize: 4,
    status: 'pending',
    actionType: 'create_proof',
    targetEntity: 'LegalTech ICP',
    date: '2026-10-25'
  },
  {
    id: 'prop-4',
    suggestion: 'Adjust email subject line for Funded SaaS ICP from "Figma to Launch" to "January launch deadline"',
    evidence: 'Deadline-framed subject lines had a 24.1% open-to-reply rate vs 9.2% for design-framed subject lines (sample N=29).',
    sampleSize: 29,
    status: 'pending',
    actionType: 'adjust_copy',
    targetEntity: 'Funded SaaS startup needing an MVP',
    date: '2026-10-24'
  },
  {
    id: 'prop-5',
    suggestion: 'Exclude companies with <$10k budget from Non-technical founder queue',
    evidence: '12 out of 12 inbound non-technical founder inquiries under $10k disqualified at scoping phase (sample N=12).',
    sampleSize: 12,
    status: 'pending',
    actionType: 'refine_icp',
    targetEntity: 'Non-technical founder with an idea',
    date: '2026-10-23'
  },
  {
    id: 'prop-6',
    suggestion: 'Reschedule LinkedIn agency posts from Friday afternoon to Tuesday morning',
    evidence: 'Tuesday morning posts generate 3.4x more DM inquiries from agency heads than Friday slots (sample N=18 posts).',
    sampleSize: 18,
    status: 'pending',
    actionType: 'adjust_copy',
    targetEntity: 'LinkedIn Agency Distribution',
    date: '2026-10-22'
  }
];

export const proposalDecisionHistory = [
  {
    id: 'hist-1',
    date: '2026-10-18',
    suggestion: 'Add Portline Freight case study to all logistics lead emails',
    decision: 'Accepted',
    actor: 'Alex Mercer',
    outcome: 'Reply rate jumped from 8.5% to 22.4% over subsequent 18 days.'
  },
  {
    id: 'hist-2',
    date: '2026-10-10',
    suggestion: 'Auto-reject leads from public WordPress agency directories',
    decision: 'Accepted',
    actor: 'Samira Khan',
    outcome: 'Eliminated ~40 low-ticket noise signals per week without losing qualified pipeline.'
  },
  {
    id: 'hist-3',
    date: '2026-09-28',
    suggestion: 'Lower score threshold from 70 to 60 for early stage startups',
    decision: 'Rejected',
    actor: 'Alex Mercer',
    outcome: 'Maintained 70 threshold to prevent founder fatigue on unqualified calls.'
  },
  {
    id: 'hist-4',
    date: '2026-09-14',
    suggestion: 'Increase follow-up sequence from 2 steps to 3 steps with 14-day delay',
    decision: 'Accepted',
    actor: 'David Chen',
    outcome: 'Captured 2 additional booked discovery calls from Step 3 touchpoints.'
  }
];
