import { IdeaItem } from '../types';

export const IDEAS_INITIAL: IdeaItem[] = [
  {
    id: 'idea-1',
    title: 'What an MVP actually costs in 2026: An agency vs studio breakdown',
    shortNotes: 'Contrast bloated $80k traditional dev agency quotes with 6-week studio fixed-scope delivery.',
    painAddressed: 'Founders overspending runway on bloated agency retainers before validating product demand.',
    targetKeyword: 'MVP build cost 2026',
    pattern: 'Cost dissection',
    source: 'Weekly questions',
    tag: 'Founder Strategy',
    targetChannelId: 'linkedin_personal',
    suggestedDraft: 'What does a production MVP actually cost in 2026?\n\nWe break down where founders overspend on bloated agency retainers vs how modern studios ship in 6 weeks.'
  },
  {
    id: 'idea-2',
    title: 'How we cut invoice processing from 36 hours to 4 minutes',
    shortNotes: 'Engineering teardown of our AWS Lambda + pydantic worker for a Series B logistics scale-up.',
    painAddressed: 'Manual invoice entry causing 3-day approval bottlenecks and vendor payment delays.',
    targetKeyword: 'invoice automation worker',
    pattern: 'Before/After benchmark',
    source: 'Lead signals',
    tag: 'Engineering',
    targetChannelId: 'linkedin_personal',
    suggestedDraft: 'Most B2B SaaS teams spend 36 hours manually reviewing invoices each week.\n\nWe engineered an event-driven worker that validates documents in 4 minutes flat.'
  },
  {
    id: 'idea-3',
    title: 'The $28k migration from Zapier to custom background jobs',
    shortNotes: 'When to stick with no-code and when custom background workers save thousands in API task limits.',
    painAddressed: 'Brittle Zapier task limits failing silently during high-volume end-of-month billing cycles.',
    targetKeyword: 'Zapier custom workers',
    pattern: 'Founder lesson',
    source: 'Weekly questions',
    tag: 'Engineering',
    targetChannelId: 'x_profile',
    suggestedDraft: 'The $28k mistake founders make when migrating from Zapier to custom code: trying to rewrite all 100 zaps instead of the 3 that actually cause 80% of task failures.'
  },
  {
    id: 'idea-4',
    title: 'Why your AI wrapper will churn in 90 days (and how to fix it)',
    shortNotes: 'Deconstruct why generic chat interfaces fail to retain B2B users without deep system integration.',
    painAddressed: 'Low user retention on superficial AI interfaces that don’t integrate into core operational workflows.',
    targetKeyword: 'AI wrapper retention',
    pattern: 'Contrarian breakdown',
    source: 'Agent plan',
    tag: 'AI Automation',
    targetChannelId: 'linkedin_personal',
    suggestedDraft: 'Why 80% of AI wrappers churn within 90 days:\n\nThey solve a generic interface problem instead of integrating into an existing high-frequency back-office bottleneck.'
  },
  {
    id: 'idea-5',
    title: 'Deploying self-healing background workers: When to automate vs human gate',
    shortNotes: 'Practical rules on error thresholds, human-in-the-loop Slack modals, and retry budgets.',
    painAddressed: 'Silent failure states in background jobs eroding customer trust and data integrity.',
    targetKeyword: 'self-healing workers',
    pattern: 'Step-by-step framework',
    source: 'Agent plan',
    tag: 'Architecture',
    targetChannelId: 'website_blog',
    suggestedDraft: 'Deploying self-healing AI workers: A blueprint for deciding when to automate and when to route into a human review gate.'
  },
  {
    id: 'idea-6',
    title: 'The micro-SaaS tech stack in 2026: Postgres, React, and fast Node background queues',
    shortNotes: 'Why boring technology delivers 10x higher uptime and lower maintenance costs for boutique studios.',
    painAddressed: 'Resume-driven development causing microservice bloat and maintenance overhead for early-stage teams.',
    targetKeyword: 'boring technology stack',
    pattern: 'Architecture teardown',
    source: 'Manual',
    tag: 'Architecture',
    targetChannelId: 'x_profile',
    suggestedDraft: 'A clean relational schema > 10 microservices for an early-stage startup. Do not let resume-driven development kill your company.'
  },
  {
    id: 'idea-7',
    title: 'Zero-downtime database migrations with Laravel and Postgres',
    shortNotes: 'Step-by-step checklist for column additions, indexing concurrently, and multi-phase deployments.',
    painAddressed: 'Table locks causing customer-facing 500 errors during daytime schema deployments.',
    targetKeyword: 'zero downtime migrations',
    pattern: 'Step-by-step framework',
    source: 'Lead signals',
    tag: 'Engineering',
    targetChannelId: 'website_blog',
    suggestedDraft: 'Running database migrations with zero lock contention: How we structure multi-step column additions in production.'
  },
  {
    id: 'idea-8',
    title: 'Hiring a 5-person dev team vs hiring a 6-week studio build',
    shortNotes: 'Financial and velocity comparison for founders deciding between full-time hires and studio delivery.',
    painAddressed: '6-month recruiting cycles eating into runway before shipping first production release.',
    targetKeyword: 'startup engineering team vs studio',
    pattern: 'Cost dissection',
    source: 'Agent plan',
    tag: 'Founder Strategy',
    targetChannelId: 'linkedin_personal',
    suggestedDraft: 'Hiring a 5-person engineering team for an unvalidated MVP is the fastest way to burn your seed round. A boutique studio can ship the production version in 6 weeks.'
  }
];
