import { Offer } from '../types';

export const initialOffers: Offer[] = [
  {
    id: 'ai-sprint',
    name: 'AI Automation Sprint',
    targetIcps: ['SMB needing AI workflow automation', 'Funded SaaS startup needing an MVP'],
    priceRange: '$6,000 - $12,000',
    timeline: '2 weeks',
    proofCount: 3,
    promise: 'Deploy a production-grade LLM workflow, agent, or automated document pipeline integrated into existing business tools within 10 business days.',
    deliverables: [
      'Discovery & system architecture diagram',
      'API connectors (OpenAI, Anthropic, internal CRM/ERP)',
      'Human-in-the-loop review interface',
      'Automated fallback handling & monitoring dashboard',
      'Handover video documentation & code repository ownership'
    ],
    history: [
      { date: '2026-10-12', who: 'Alex Mercer', what: 'Adjusted price floor from $5k to $6k based on Q3 pipeline velocity' },
      { date: '2026-09-01', who: 'Samira Khan', what: 'Added fallback handling to core deliverable checklist' }
    ]
  },
  {
    id: 'mvp-6-weeks',
    name: 'MVP in 6 Weeks',
    targetIcps: ['Funded SaaS startup needing an MVP', 'Non-technical founder with an idea'],
    priceRange: '$18,000 - $35,000',
    timeline: '6 weeks',
    proofCount: 3,
    promise: 'Take early-stage products from Figma/specification to revenue-ready web or mobile app with auth, payments, database, and analytics.',
    deliverables: [
      'Interactive Figma click-through and database schema specification',
      'React / Next.js frontend with Tailwind design system',
      'Node.js / Python API backend with PostgreSQL / Supabase',
      'Stripe billing integration with tier limits',
      'Production deployment on AWS / Vercel with CI/CD pipeline'
    ],
    history: [
      { date: '2026-09-20', who: 'Alex Mercer', what: 'Standardized stack on Next.js + Supabase to reduce dev cycle by 1 week' },
      { date: '2026-07-15', who: 'David Chen', what: 'Initial offer definition committed' }
    ]
  },
  {
    id: 'whitelabel-dev',
    name: 'White-label Development',
    targetIcps: ['Marketing agency needing white-label devs'],
    priceRange: '$4,500 - $9,000 / month',
    timeline: 'Ongoing retainer (3 mo. min)',
    proofCount: 2,
    promise: 'Dedicated senior engineering capacity that plugs into agency client accounts under your brand without recruitment overhead.',
    deliverables: [
      'Direct Slack/Teams channel integration with agency PMs',
      'Weekly sprint demos and ticket management in Linear/Jira',
      'Rigorous PR review and QA testing prior to agency client preview',
      'Flexible overflow bandwidth for React, Vue, Python, and mobile'
    ],
    history: [
      { date: '2026-08-11', who: 'Alex Mercer', what: 'Set minimum commitment period to 3 months to reduce onboarding churn' }
    ]
  }
];
