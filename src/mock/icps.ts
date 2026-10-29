import { Icp } from '../types';

export const initialIcps: Icp[] = [
  {
    id: 'funded-saas',
    name: 'Funded SaaS startup needing an MVP',
    offerId: 'mvp-6-weeks',
    countries: ['United States', 'United Kingdom', 'Germany', 'Netherlands'],
    roles: ['Founder', 'Co-Founder & CEO', 'Chief Product Officer', 'Head of Engineering'],
    leadsCount: 38,
    replyRate: 15.8,
    callsCount: 6,
    winsCount: 2,
    companyType: 'B2B SaaS / Tech',
    companySize: '2 - 25 employees',
    industries: ['B2B Software', 'Fintech', 'LegalTech', 'Supply Chain Tech', 'HealthTech'],
    buyingTriggers: [
      'Announced pre-seed or seed round ($500k - $3M)',
      'Job posting for Founding Engineer or Senior Full-Stack open for >45 days',
      'Recent launch announcement on Product Hunt with v1 user feedback requesting custom features',
      'CTO or tech lead departure mention on LinkedIn'
    ],
    pains: [
      'Burning runway while searching for full-time senior engineers in competitive markets',
      'Existing v0 prototype built by outsourced freelancer is unmaintainable and buggy',
      'Investors expect customer validation and MRR within 6 months of funding',
      'Non-technical co-founders struggling to scope technical milestones accurately'
    ],
    objections: [
      {
        objection: 'Agencies are too slow and lack startup urgency.',
        answer: 'We operate on fixed 6-week milestones with daily async updates in your Slack, committing production code from week 1.'
      },
      {
        objection: 'We want in-house IP and equity-aligned engineers.',
        answer: 'You retain 100% intellectual property rights from day one; we document and onboard your first in-house hires seamlessly during handoff.'
      },
      {
        objection: 'Fixed price agencies often hit you with surprise change-order fees.',
        answer: 'We provide a strict weekly sprint backlog with clear trade-offs: if priority features shift, we swap scope rather than billing extras.'
      }
    ],
    disqualifiers: [
      'Bootstrapped consumer apps with under $10,000 budget',
      'Founders seeking sweat-equity compensation',
      'Heavily regulated medical devices requiring FDA 510(k) software clearance',
      'Projects requiring native desktop or legacy enterprise on-premise Windows apps'
    ],
    monthlyPerformance: [
      { month: 'Jul 2026', leads: 8, replies: 1, calls: 1, wins: 0 },
      { month: 'Aug 2026', leads: 11, replies: 2, calls: 2, wins: 1 },
      { month: 'Sep 2026', leads: 9, replies: 1, calls: 1, wins: 0 },
      { month: 'Oct 2026', leads: 10, replies: 2, calls: 2, wins: 1 }
    ],
    history: [
      { date: '2026-10-04', who: 'Alex Mercer', what: 'Tightened disqualifiers to filter out unbacked consumer concepts' },
      { date: '2026-08-15', who: 'Samira Khan', what: 'Added LegalTech and Supply Chain to target industries' }
    ]
  },
  {
    id: 'smb-ai-automation',
    name: 'SMB needing AI workflow automation',
    offerId: 'ai-sprint',
    countries: ['United States', 'United Kingdom', 'Canada', 'Ireland'],
    roles: ['Managing Director', 'Chief Operating Officer', 'VP of Operations', 'Partner'],
    leadsCount: 32,
    replyRate: 18.7,
    callsCount: 6,
    winsCount: 2,
    companyType: 'Professional Services / Mid-Market Operations',
    companySize: '15 - 150 employees',
    industries: ['Accounting & Audit', 'Logistics & Freight', 'Insurance Brokerage', 'Real Estate Asset Management'],
    buyingTriggers: [
      'Complaints about manual data entry or document reconciliation bottlenecks',
      'Hiring junior administrative or operations staff specifically for processing receipts/invoices',
      'Executive post on LinkedIn asking for tool recommendations to parse incoming PDF contracts',
      'Recent migration to modern ERP/CRM (HubSpot, Salesforce, NetSuite)'
    ],
    pains: [
      'Staff spending 20+ hours weekly manually extracting data from unstructured supplier PDFs',
      'Customer quote turnarounds take 48-72 hours, resulting in lost deals to faster competitors',
      'Generic off-the-shelf AI tools (ChatGPT Enterprise) lack connectors to internal systems',
      'Security concerns preventing them from using consumer cloud AI tools with client data'
    ],
    objections: [
      {
        objection: 'Will this compromise confidential customer financial records?',
        answer: 'All pipelines use zero-data-retention enterprise API endpoints or local private VPC embeddings with strict role-based encryption.'
      },
      {
        objection: 'Our staff will reject tools that make mistakes without human oversight.',
        answer: 'We build human-in-the-loop exception queues: AI drafts and scores confidence, humans approve with 1 click.'
      }
    ],
    disqualifiers: [
      'Businesses without existing digital workflows (paper-based archives)',
      'Sub-$5,000 one-off Zapier configuration requests',
      'Clients expecting custom trained foundation models from scratch'
    ],
    monthlyPerformance: [
      { month: 'Jul 2026', leads: 6, replies: 1, calls: 1, wins: 0 },
      { month: 'Aug 2026', leads: 8, replies: 2, calls: 2, wins: 1 },
      { month: 'Sep 2026', leads: 9, replies: 1, calls: 1, wins: 0 },
      { month: 'Oct 2026', leads: 9, replies: 2, calls: 2, wins: 1 }
    ],
    history: [
      { date: '2026-09-18', who: 'David Chen', what: 'Refined objection handling for SOC2 and data compliance' }
    ]
  },
  {
    id: 'agency-whitelabel',
    name: 'Marketing agency needing white-label devs',
    offerId: 'whitelabel-dev',
    countries: ['United States', 'United Kingdom', 'Netherlands'],
    roles: ['Head of Digital', 'Technical Director', 'Agency Owner', 'VP Client Services'],
    leadsCount: 14,
    replyRate: 14.2,
    callsCount: 2,
    winsCount: 1,
    companyType: 'Digital & Creative Agency',
    companySize: '10 - 60 employees',
    industries: ['Brand & Design Agencies', 'Performance Marketing', 'Web Design Studios'],
    buyingTriggers: [
      'Agency won a large retainer client requiring complex React web apps beyond WordPress/Webflow',
      'Public job listing for freelance or contract full-stack developer',
      'Agency principal complaining on X/Threads about unreliable freelancers ghosting client launches',
      'New agency service tier announced: Digital Products or Custom Portals'
    ],
    pains: [
      'Turning away lucrative web app builds because their in-house team only knows Webflow or Shopify',
      'Freelancers vanishing right before client presentation deadlines',
      'Full-time senior hires too expensive during seasonal revenue dips',
      'QA failures embarrassing the agency in front of enterprise client stakeholders'
    ],
    objections: [
      {
        objection: 'How do we know you won’t poach our clients?',
        answer: 'Strict white-label non-solicitation covenants in our standard MSA, white-labeled GitHub repos, and communications under your email domain.'
      },
      {
        objection: 'Timezone delays cause bottlenecks when our clients demand same-day revisions.',
        answer: 'Our core hours overlap with US East and UK business hours daily with dedicated Slack standby.'
      }
    ],
    disqualifiers: [
      'Agencies seeking $20/hr offshore body-shopping',
      'One-off 5-hour WordPress bug fixes',
      'Agencies with zero technical PM leadership'
    ],
    monthlyPerformance: [
      { month: 'Jul 2026', leads: 3, replies: 0, calls: 0, wins: 0 },
      { month: 'Aug 2026', leads: 4, replies: 1, calls: 1, wins: 0 },
      { month: 'Sep 2026', leads: 4, replies: 1, calls: 1, wins: 1 },
      { month: 'Oct 2026', leads: 3, replies: 0, calls: 0, wins: 0 }
    ],
    history: [
      { date: '2026-10-01', who: 'Alex Mercer', what: 'Set 3-month retainer minimum into qualification rules' }
    ]
  },
  {
    id: 'nontech-founder',
    name: 'Non-technical founder with an idea',
    offerId: 'mvp-6-weeks',
    countries: ['United States', 'United Kingdom', 'Canada', 'Germany'],
    roles: ['Solo Founder', 'Managing Director', 'Domain Specialist / Founder'],
    leadsCount: 12,
    replyRate: 8.3,
    callsCount: 1,
    winsCount: 0,
    companyType: 'Early Stage Stealth / Domain Spin-out',
    companySize: '1 - 3 employees',
    industries: ['B2B Services', 'PropTech', 'Health & Wellness', 'EdTech'],
    buyingTriggers: [
      'Domain expert leaving corporate role to launch software product',
      'Post in founder communities (Indie Hackers, YC Co-Founder Match, Reddit r/startups)',
      'Figma prototype completed by independent designer looking for development partner',
      'Accepted into accelerator program without technical co-founder'
    ],
    pains: [
      'Inability to evaluate code quality, tech stacks, or engineering quotes from random agencies',
      'Fear of spending life savings on an app that does not work or cannot scale',
      'Uncertainty about how to define an MVP vs nice-to-have features for v1 launch'
    ],
    objections: [
      {
        objection: 'I need to find a technical co-founder for equity instead of paying cash.',
        answer: 'Top technical co-founders join validated products; an MVP built in 6 weeks gets you real paying users, making co-founder recruitment 10x easier.'
      }
    ],
    disqualifiers: [
      'Budget under $15,000 without external funding',
      'Idea-stage pitch decks without customer research or industry domain background'
    ],
    monthlyPerformance: [
      { month: 'Jul 2026', leads: 3, replies: 0, calls: 0, wins: 0 },
      { month: 'Aug 2026', leads: 3, replies: 0, calls: 0, wins: 0 },
      { month: 'Sep 2026', leads: 3, replies: 1, calls: 1, wins: 0 },
      { month: 'Oct 2026', leads: 3, replies: 0, calls: 0, wins: 0 }
    ],
    history: [
      { date: '2026-08-01', who: 'David Chen', what: 'Created initial non-technical founder definition' }
    ]
  }
];

export const samplePreviewSignals = [
  {
    id: 'prev-1',
    company: 'Veloce Logistics (London, UK)',
    snippet: 'Managing 400+ freight manifests weekly via email PDF attachments. Looking for an automated parser or custom backend to feed CargoWise.',
    source: 'Reddit r/logistics',
    score: 88
  },
  {
    id: 'prev-2',
    company: 'Apex Accounting Group (Austin, TX)',
    snippet: 'Hiring full-time data reconciler. Would love to automate bank statement cross-referencing into QuickBooks before Q4 tax rush.',
    source: 'Indeed Hiring Feed',
    score: 84
  },
  {
    id: 'prev-3',
    company: 'Clarity Claims (Manchester, UK)',
    snippet: 'Our adjusters spend 3 hours per claim transcribing police accident reports. Need a vetted AI extraction tool that keeps data in the UK.',
    source: 'Hacker News Ask HN',
    score: 81
  },
  {
    id: 'prev-4',
    company: 'Oakhaven Capital (New York, NY)',
    snippet: 'Evaluating LLM document extraction tools for real estate offering memorandums. Current manual analyst process is our primary bottleneck.',
    source: 'LinkedIn Feed',
    score: 79
  },
  {
    id: 'prev-5',
    company: 'Nautical Ship Supply (Rotterdam, NL)',
    snippet: 'Looking for a dev team to connect supplier quote emails with our ERP inventory system. 2 week sprint budget allocated.',
    source: 'Agency RFP Feed',
    score: 76
  }
];
