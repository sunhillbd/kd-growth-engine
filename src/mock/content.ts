import { ContentItem, DestinationId } from '../types';

export const FIXED_TODAY_DATE = '2026-10-29'; // Thursday, 29 October 2026

export const initialContent: ContentItem[] = [
  // ==========================================
  // 6 IDEAS
  // ==========================================
  {
    id: 'idea-1',
    topic: 'Why seed founders burn $120k recruiting engineers before shipping MVP',
    format: 'LinkedIn post',
    painAddressed: 'Founders waiting 4 months for recruitment before speaking with actual customers',
    targetKeyword: 'hire founding engineer vs agency',
    pattern: 'Cost dissection',
    source: 'From weekly questions',
    author: 'Alex Mercer',
    whyThisIdea: 'Surfaced from weekly team retrospective: multiple discovery calls mentioned delaying launch while waiting for full-time hires.',
    baseText: 'Most seed founders spend their first 4 months doing the exact same thing: post a Founding Engineer job on LinkedIn, sift through 400 resumes, interview 25 candidates, and watch $120k of runway evaporate with zero customer validation.\n\nBuild the MVP in 6 weeks first. Get paying users. Then hire engineers who can scale what is already proven.',
    selectedDestinations: ['linkedin_personal', 'x_profile'],
    destinationSchedules: {},
    status: 'Idea',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-28 16:30', action: 'Created from weekly question retrospective', actor: 'human' }
    ]
  },
  {
    id: 'idea-2',
    topic: 'How we replaced a 14-step spreadsheet workflow with a 2-second background job',
    format: 'LinkedIn post',
    painAddressed: 'Operations teams losing 18 hours every week copying CSV rows between tools',
    targetKeyword: 'back-office workflow automation',
    pattern: 'Before/After benchmark',
    source: 'Client delivery outcome',
    author: 'Agent',
    whyThisIdea: 'Based on our production deployment for Apex Logistics. Real measurable 98% reduction in manual data processing time.',
    baseText: 'A client was spending 18 hours a week manually copy-pasting shipment manifests from email PDFs into an internal inventory sheet.\n\nWe deployed a webhook parser and queued background job in 10 days. The processing time went from 36 hours of human delay to 2.4 seconds per file.',
    selectedDestinations: ['linkedin_personal', 'facebook_page'],
    destinationSchedules: {},
    status: 'Idea',
    draftedByAgent: true,
    agentTaskId: '#T-142',
    auditTrail: [
      { date: '2026-10-27 11:20', action: 'Drafted by agent from case study metrics', actor: 'agent' }
    ]
  },
  {
    id: 'idea-3',
    topic: 'The hidden database deadlocks destroying B2B billing portals on the 1st of the month',
    format: 'Case study',
    painAddressed: 'Stripe webhook concurrency and race conditions causing subscription double-charges',
    targetKeyword: 'Stripe billing webhook idempotency',
    pattern: 'Architecture teardown',
    source: 'ClearSearch keyword trend',
    author: 'Sarah Connor',
    whyThisIdea: 'High search spike on Stripe webhook idempotency failure patterns among funded SaaS founders.',
    baseText: 'On the 1st of every month, Stripe fires 5,000 webhook events within 60 seconds. If your database transactions lack row-level locking and idempotent receipt tables, you get race conditions and double invoices.\n\nHere is the PostgreSQL transaction structure we use across our studio clients.',
    selectedDestinations: ['linkedin_personal', 'website_blog'],
    destinationSchedules: {},
    status: 'Idea',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-26 14:10', action: 'Created from ClearSearch keyword cluster', actor: 'human' }
    ]
  },
  {
    id: 'idea-4',
    topic: 'What an MVP actually costs in 2026: Real studio balance sheet breakdown',
    format: 'LinkedIn post',
    painAddressed: 'Founders expecting either a $3k freelancer template or a $150k traditional agency quote',
    targetKeyword: 'software studio MVP cost breakdown',
    pattern: 'Contrarian breakdown',
    source: 'Client discovery call',
    author: 'Alex Mercer',
    whyThisIdea: 'Answers the most frequent pricing objection raised by early-stage founders.',
    baseText: 'Early-stage founders get quoted two extremes: $3,000 from a freelancer who will disappear in 3 weeks, or $150,000 from a 40-person agency with 3 account managers.\n\nHere is an honest breakdown of what building a production-ready, security-cleared web and mobile MVP actually costs in 2026.',
    selectedDestinations: ['linkedin_personal', 'x_profile'],
    destinationSchedules: {},
    status: 'Idea',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-25 10:15', action: 'Created by Alex Mercer', actor: 'human' }
    ]
  },
  {
    id: 'idea-5',
    topic: 'Why 80% of internal AI chatbots get abandoned within 30 days of launch',
    format: 'LinkedIn post',
    painAddressed: 'Chatbots built on unstructured PDFs giving hallucinations and slow streaming answers',
    targetKeyword: 'enterprise RAG production pitfalls',
    pattern: 'Step-by-step framework',
    source: 'ClearSearch keyword trend',
    author: 'Agent',
    whyThisIdea: 'Surfaced from search queries tracking enterprise dissatisfaction with naive vector database implementations.',
    baseText: 'Most internal AI chatbots fail for one simple reason: developers dumped 500 pages of messy PDFs into a vector database without metadata filtering, deterministic routing, or guardrail evaluation.\n\nIf you want an internal agent people actually use every day, here are the 4 architectural layers required.',
    selectedDestinations: ['linkedin_personal', 'facebook_page', 'x_profile'],
    destinationSchedules: {},
    status: 'Idea',
    draftedByAgent: true,
    agentTaskId: '#T-148',
    auditTrail: [
      { date: '2026-10-24 18:00', action: 'Synthesized by agent', actor: 'agent' }
    ]
  },
  {
    id: 'idea-6',
    topic: 'The 3 technical compromises you should make before your first $50k in ARR',
    format: 'LinkedIn post',
    painAddressed: 'Engineers spending 6 weeks building microservice clusters before finding product-market fit',
    targetKeyword: 'monolithic architecture early stage startup',
    pattern: 'Founder lesson',
    source: 'Client discovery call',
    author: 'Alex Mercer',
    whyThisIdea: 'Contrarian engineering stance that demonstrates business pragmatism over architectural vanity.',
    baseText: 'Before your product reaches $50k in ARR, your biggest threat is not server scaling. It is running out of money before knowing what users actually want.\n\nHere are 3 deliberate technical compromises we recommend to every seed client:',
    selectedDestinations: ['linkedin_personal', 'x_profile'],
    destinationSchedules: {},
    status: 'Idea',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-23 09:30', action: 'Created from founder advisory notes', actor: 'human' }
    ]
  },

  // ==========================================
  // 4 DRAFTS
  // ==========================================
  {
    id: 'draft-1',
    topic: 'Stop building custom authentication for your B2B SaaS in 2026',
    format: 'LinkedIn post',
    painAddressed: 'Wasting 3 developer weeks rebuilding SSO, MFA, and session tokens',
    targetKeyword: 'B2B SaaS auth integration',
    pattern: 'Contrarian breakdown',
    author: 'Sarah Connor',
    baseText: 'Every year we see seed teams spend 3 full engineering sprints hand-rolling authentication. Custom password resets, session cookies, SAML SSO, and MFA.\n\nNone of your early enterprise prospects care how clever your bcrypt salt is. They care if you have Okta integration and audit logs.\n\nUse an established identity provider on Day 1. Spend your precious engineering hours on your core differentiator.',
    selectedDestinations: ['linkedin_personal', 'x_profile'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Draft',
        scheduledDate: '2026-11-04',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Wed in New York'
      },
      x_profile: {
        destinationId: 'x_profile',
        status: 'Draft',
        scheduledDate: '2026-11-04',
        scheduledTime: '19:00',
        audienceTimeInfo: '= 9:00 AM Wed in New York'
      }
    },
    status: 'Draft',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-28 11:00', action: 'Drafted by Sarah Connor', actor: 'human' }
    ]
  },
  {
    id: 'draft-2',
    topic: 'How we cut invoice processing from 36 hours to 4 minutes with a document pipeline',
    format: 'Website article',
    painAddressed: 'Accounts payable manually keying line-items from vendor PDF invoices',
    targetKeyword: 'automated invoice processing pipeline',
    pattern: 'Before/After benchmark',
    author: 'Agent',
    baseText: 'Manual invoice entry is the single largest hidden tax on mid-market operations.\n\nFor a European freight broker managing 800 supplier bills weekly, human verification caused a 36-hour delay and a 4.2% typo rate.\n\nBy chaining an OCR pre-filter, structured schema validation, and ERP auto-reconciliation, invoices now reconcile in 4 minutes with zero manual intervention.',
    selectedDestinations: ['linkedin_personal', 'facebook_page', 'website_blog'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Draft',
        scheduledDate: '2026-11-05',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Thu in New York'
      },
      facebook_page: {
        destinationId: 'facebook_page',
        status: 'Draft',
        scheduledDate: '2026-11-05',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Thu in New York'
      },
      website_blog: {
        destinationId: 'website_blog',
        status: 'Draft',
        scheduledDate: '2026-11-05',
        scheduledTime: '20:00',
        audienceTimeInfo: '= 10:00 AM Thu in New York'
      }
    },
    websiteData: {
      title: 'How we cut invoice processing from 36 hours to 4 minutes',
      slug: 'automated-invoice-processing-pipeline-case-study',
      metaDescription: 'Step-by-step architecture of the automated OCR and schema validation pipeline we deployed to eliminate manual AP data entry.',
      category: 'Automation Case Studies',
      targetKeyword: 'automated invoice processing pipeline',
      publishMode: 'cms_draft',
      seoChecklist: {
        keywordInTitle: true,
        oneH1: true,
        faqSection: true,
        schemaType: 'Article'
      }
    },
    status: 'Draft',
    draftedByAgent: true,
    agentTaskId: '#T-152',
    auditTrail: [
      { date: '2026-10-27 15:45', action: 'Drafted by agent with per-destination overrides', actor: 'agent' }
    ]
  },
  {
    id: 'draft-3',
    topic: 'Why your React dashboard feels sluggish at 10,000 rows (and the 4 CSS fixes)',
    format: 'LinkedIn post',
    painAddressed: 'Table rendering lag causing enterprise churn and support tickets',
    targetKeyword: 'React virtualized table performance',
    pattern: 'Step-by-step framework',
    author: 'Alex Mercer',
    baseText: 'If your React dashboard drops frames when scrolling a table of 10,000 rows, do not immediately rewrite it in Rust or install heavy state libraries.\n\nMost lag comes from DOM tree bloat and CSS layout thrashing. Here are 4 direct fixes we apply on client audits:\n\n1. Use content-visibility: auto on offscreen rows\n2. Strip expensive box-shadows inside repeating cells\n3. Enforce fixed table-layout: fixed\n4. Virtualize with tanstack-virtual',
    selectedDestinations: ['linkedin_personal', 'x_profile'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Draft',
        scheduledDate: '2026-11-06',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Fri in New York'
      },
      x_profile: {
        destinationId: 'x_profile',
        status: 'Draft',
        scheduledDate: '2026-11-06',
        scheduledTime: '19:00',
        audienceTimeInfo: '= 9:00 AM Fri in New York'
      }
    },
    status: 'Draft',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-28 09:20', action: 'Created by Alex Mercer', actor: 'human' }
    ]
  },
  {
    id: 'draft-4',
    topic: 'The 6-week MVP delivery playbook: Week-by-week studio milestones',
    format: 'LinkedIn post',
    painAddressed: 'Scope creep turning a simple product launch into a 9-month nightmare',
    targetKeyword: 'MVP development milestones',
    pattern: 'Founder lesson',
    author: 'Agent',
    baseText: 'Scope creep does not happen in Month 4. It happens on Day 3 when no one defined the single metric that validates the product.\n\nHere is how we structure every 6-week client engagement at Kinetik Dynamics:\n\nWeek 1: Core schema & high-fidelity interactive wireframes\nWeek 2: Auth, billing gateway, and primary CRUD flow\nWeek 3: Core secret sauce / automation engine\nWeek 4: End-to-end integration & security hardening\nWeek 5: Beta testing with 5 friendly prospective users\nWeek 6: Production deployment & telemetry review',
    selectedDestinations: ['linkedin_personal', 'website_blog'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Draft',
        scheduledDate: '2026-11-09',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Mon in New York'
      }
    },
    status: 'Draft',
    draftedByAgent: true,
    agentTaskId: '#T-159',
    auditTrail: [
      { date: '2026-10-27 17:10', action: 'Drafted by agent', actor: 'agent' }
    ]
  },

  // ==========================================
  // 3 NEEDS APPROVAL
  // ==========================================
  {
    id: 'approval-1',
    topic: 'The myth of the 10x engineer: Why team pipeline beats individual brilliance',
    format: 'LinkedIn post',
    painAddressed: 'Founders overpaying for celebrity developers who refuse to write documentation',
    targetKeyword: 'software development velocity pipeline',
    pattern: 'Contrarian breakdown',
    author: 'Agent',
    whyThisPost: 'Reframes engineering velocity around automated CI/CD and clear specifications. Targets CTOs and founders struggling with team output.',
    baseText: 'A so-called "10x engineer" who does not write tests, refactors working code on a whim, and keeps architecture in their head produces a 0.1x team.\n\nHigh-performing studios do not rely on lone geniuses. They rely on tight specs, automated linting, 20-minute CI/CD pipelines, and structured code reviews.\n\nSystems scale. Egos do not.',
    selectedDestinations: ['linkedin_personal', 'x_profile'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Pending approval',
        scheduledDate: '2026-10-30',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Fri in New York'
      },
      x_profile: {
        destinationId: 'x_profile',
        status: 'Pending approval',
        scheduledDate: '2026-10-30',
        scheduledTime: '19:00',
        audienceTimeInfo: '= 9:00 AM Fri in New York'
      }
    },
    status: 'Needs approval',
    scheduledDate: '2026-10-30',
    scheduledDay: 'Friday, Oct 30',
    scheduledTime: '18:30',
    draftedByAgent: true,
    agentTaskId: '#T-164',
    auditTrail: [
      { date: '2026-10-28 14:00', action: 'Drafted by agent and submitted for approval', actor: 'agent' }
    ]
  },
  {
    id: 'approval-2',
    topic: 'Zero-data AI architectures: How we automate HIPAA and GDPR client workflows',
    format: 'Case study',
    painAddressed: 'Healthcare and enterprise legal teams blocking AI automation due to privacy concerns',
    targetKeyword: 'HIPAA compliant AI automation architecture',
    pattern: 'Architecture teardown',
    author: 'Agent',
    whyThisPost: 'Directly addresses the #1 objection from enterprise and healthtech prospects on AI data privacy.',
    baseText: 'Whenever enterprise clients ask about AI automation, their Chief Information Security Officer immediately asks: "Will our customer data train public models?"\n\nThe answer must be an unequivocal no.\n\nHere is the zero-retention architecture we use for HIPAA-compliant workflows:\n• Ephemeral processing nodes with in-memory execution\n• Zero-data-retention enterprise API agreements\n• PII tokenization before payload serialization\n• Verifiable audit logs stored in append-only storage',
    selectedDestinations: ['linkedin_personal', 'facebook_page', 'website_blog'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Pending approval',
        scheduledDate: '2026-11-02',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Mon in New York'
      },
      facebook_page: {
        destinationId: 'facebook_page',
        status: 'Pending approval',
        scheduledDate: '2026-11-02',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Mon in New York'
      },
      website_blog: {
        destinationId: 'website_blog',
        status: 'Pending approval',
        scheduledDate: '2026-11-02',
        scheduledTime: '20:00',
        audienceTimeInfo: '= 10:00 AM Mon in New York'
      }
    },
    status: 'Needs approval',
    scheduledDate: '2026-11-02',
    scheduledDay: 'Monday, Nov 2',
    scheduledTime: '18:30',
    draftedByAgent: true,
    agentTaskId: '#T-168',
    auditTrail: [
      { date: '2026-10-28 17:30', action: 'Drafted by agent and queued for review', actor: 'agent' }
    ]
  },
  {
    id: 'approval-3',
    topic: 'Why seed-stage CTOs should write SQL migrations by hand instead of relying on ORMs',
    format: 'LinkedIn post',
    painAddressed: 'ORMs generating N+1 queries and accidental table locks in production',
    targetKeyword: 'PostgreSQL manual migrations vs ORM',
    pattern: 'Contrarian breakdown',
    author: 'Agent',
    whyThisPost: 'Establishes technical depth and authority. Appeals directly to technical co-founders and senior engineers evaluating studio competence.',
    baseText: 'ORMs are fantastic for prototyping queries on localhost. They are dangerous when running migrations on a live database with 500k active users.\n\nAn automated schema change that executes an unindexed ALTER TABLE with a DEFAULT value will lock the entire table and trigger a production outage.\n\nWrite your SQL migrations by hand. Understand the lock level of every statement.',
    selectedDestinations: ['linkedin_personal', 'x_profile'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Pending approval',
        scheduledDate: '2026-11-03',
        scheduledTime: '19:00',
        audienceTimeInfo: '= 9:00 AM Tue in New York'
      },
      x_profile: {
        destinationId: 'x_profile',
        status: 'Pending approval',
        scheduledDate: '2026-11-03',
        scheduledTime: '19:00',
        audienceTimeInfo: '= 9:00 AM Tue in New York'
      }
    },
    status: 'Needs approval',
    scheduledDate: '2026-11-03',
    scheduledDay: 'Tuesday, Nov 3',
    scheduledTime: '19:00',
    draftedByAgent: true,
    agentTaskId: '#T-171',
    auditTrail: [
      { date: '2026-10-29 08:45', action: 'Drafted by agent from studio best practices', actor: 'agent' }
    ]
  },

  // ==========================================
  // 7 SCHEDULED (All in future: Oct 30 - Nov 12, 2026)
  // ==========================================
  {
    id: 'sched-1',
    topic: 'Building a Multi-Tenant Billing Engine in 5 Weeks with Laravel & Stripe',
    format: 'Website article',
    painAddressed: 'SaaS teams struggling with complex seat-based and usage-metered billing',
    targetKeyword: 'multi-tenant billing engine architecture',
    pattern: 'Architecture teardown',
    author: 'Alex Mercer',
    baseText: 'Most SaaS products lose weeks building billing from scratch. We architected a production-ready multi-tenant billing engine for PayLedger in 5 weeks.\n\nRead our technical breakdown covering webhook handlers, usage metering, and tenant isolation.',
    selectedDestinations: ['linkedin_personal', 'website_blog'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Scheduled',
        scheduledDate: '2026-10-30',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Fri in New York'
      },
      website_blog: {
        destinationId: 'website_blog',
        status: 'Scheduled',
        scheduledDate: '2026-10-30',
        scheduledTime: '20:00',
        audienceTimeInfo: '= 10:00 AM Fri in New York'
      }
    },
    websiteData: {
      title: 'Building a Multi-Tenant Billing Engine in 5 Weeks with Laravel & Stripe',
      slug: 'multi-tenant-billing-engine-laravel-stripe',
      metaDescription: 'A technical deep-dive into building high-throughput billing systems with automated seat licensing and Stripe integration.',
      category: 'Architecture Deep Dives',
      targetKeyword: 'multi-tenant billing engine architecture',
      publishMode: 'cms_draft',
      seoChecklist: {
        keywordInTitle: true,
        oneH1: true,
        faqSection: true,
        schemaType: 'Article'
      }
    },
    status: 'Scheduled',
    scheduledDate: '2026-10-30',
    scheduledDay: 'Friday, Oct 30',
    scheduledTime: '18:30',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-28 10:30', action: 'Approved and scheduled by Alex Mercer', actor: 'human' }
    ]
  },
  {
    id: 'sched-2',
    topic: 'Why we rejected a $60k contract because the client didn’t need custom code',
    format: 'LinkedIn post',
    painAddressed: 'Unethical dev shops selling $60k custom software when off-the-shelf tools suffice',
    targetKeyword: 'custom software vs SaaS tools',
    pattern: 'Founder lesson',
    author: 'Alex Mercer',
    baseText: 'Last month a logistics founder came to us with a $60,000 budget to build a custom dispatch portal from scratch.\n\nAfter reviewing their operational requirements, we realized they could achieve 95% of their goals using off-the-shelf SaaS and two custom webhook automations.\n\nWe sent them to an existing provider and charged them zero dollars. A good studio tells you when NOT to write code.',
    selectedDestinations: ['linkedin_personal', 'x_profile'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Scheduled',
        scheduledDate: '2026-11-02',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Mon in New York'
      },
      x_profile: {
        destinationId: 'x_profile',
        status: 'Scheduled',
        scheduledDate: '2026-11-02',
        scheduledTime: '19:00',
        audienceTimeInfo: '= 9:00 AM Mon in New York'
      }
    },
    status: 'Scheduled',
    scheduledDate: '2026-11-02',
    scheduledDay: 'Monday, Nov 2',
    scheduledTime: '18:30',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-28 15:00', action: 'Scheduled by Alex Mercer', actor: 'human' }
    ]
  },
  {
    id: 'sched-3',
    topic: 'How to ship an AI automation proof-of-concept in 14 days without cloud vendor lock-in',
    format: 'LinkedIn post',
    painAddressed: 'Enterprises trapped in proprietary cloud AI ecosystems with soaring monthly tokens',
    targetKeyword: 'portable AI automation pipeline',
    pattern: 'Step-by-step framework',
    author: 'Sarah Connor',
    baseText: 'Cloud providers want you to build inside their proprietary orchestration platforms so switching models requires a complete rewrite.\n\nHere is how we build open, portable pipelines that switch from OpenAI to Claude to self-hosted Ollama with one environment variable change:',
    selectedDestinations: ['linkedin_personal', 'facebook_page'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Scheduled',
        scheduledDate: '2026-11-03',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Tue in New York'
      },
      facebook_page: {
        destinationId: 'facebook_page',
        status: 'Scheduled',
        scheduledDate: '2026-11-03',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Tue in New York'
      }
    },
    status: 'Scheduled',
    scheduledDate: '2026-11-03',
    scheduledDay: 'Tuesday, Nov 3',
    scheduledTime: '18:30',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-28 16:15', action: 'Approved and scheduled', actor: 'human' }
    ]
  },
  {
    id: 'sched-4',
    topic: 'PostgreSQL row-level security: The simplest multi-tenant architecture for early startups',
    format: 'Website article',
    painAddressed: 'Data leakage fears in multi-tenant B2B applications',
    targetKeyword: 'PostgreSQL row level security multitenancy',
    pattern: 'Architecture teardown',
    author: 'Agent',
    baseText: 'Before you spin up separate database instances for every customer, investigate PostgreSQL Row-Level Security (RLS).\n\nWith tenant context set on the connection pool, the database enforces data boundaries at the kernel level. Even if an application query forgets a WHERE tenant_id clause, zero data leaks.',
    selectedDestinations: ['linkedin_personal', 'x_profile', 'website_blog'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Scheduled',
        scheduledDate: '2026-11-04',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Wed in New York'
      },
      x_profile: {
        destinationId: 'x_profile',
        status: 'Scheduled',
        scheduledDate: '2026-11-04',
        scheduledTime: '19:00',
        audienceTimeInfo: '= 9:00 AM Wed in New York'
      },
      website_blog: {
        destinationId: 'website_blog',
        status: 'Scheduled',
        scheduledDate: '2026-11-04',
        scheduledTime: '20:00',
        audienceTimeInfo: '= 10:00 AM Wed in New York'
      }
    },
    status: 'Scheduled',
    scheduledDate: '2026-11-04',
    scheduledDay: 'Wednesday, Nov 4',
    scheduledTime: '18:30',
    draftedByAgent: true,
    agentTaskId: '#T-178',
    auditTrail: [
      { date: '2026-10-28 12:40', action: 'Approved by Alex Mercer', actor: 'human' }
    ]
  },
  {
    id: 'sched-5',
    topic: 'Why growth agencies lose margin on custom development (and how white-label solves it)',
    format: 'LinkedIn post',
    painAddressed: 'Agencies trying to build in-house engineering departments and burning cash',
    targetKeyword: 'agency white label development partnership',
    pattern: 'Cost dissection',
    author: 'Alex Mercer',
    baseText: 'Growth and design agencies excel at positioning, branding, and conversion rate optimization. But the moment they try to build internal engineering teams, margins plummet from 45% to 12%.\n\nRecruiting, code reviews, and DevOps overhead eat the retainer alive.\n\nHere is how top UK and US agencies partner with our dedicated white-label studio to protect their margins.',
    selectedDestinations: ['linkedin_personal', 'facebook_page'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Scheduled',
        scheduledDate: '2026-11-05',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Thu in New York'
      },
      facebook_page: {
        destinationId: 'facebook_page',
        status: 'Scheduled',
        scheduledDate: '2026-11-05',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Thu in New York'
      }
    },
    status: 'Scheduled',
    scheduledDate: '2026-11-05',
    scheduledDay: 'Thursday, Nov 5',
    scheduledTime: '18:30',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-27 19:00', action: 'Approved by Alex Mercer', actor: 'human' }
    ]
  },
  {
    id: 'sched-6',
    topic: 'The exact tech stack we use to build 6-week MVPs in 2026',
    format: 'LinkedIn post',
    painAddressed: 'Tech stack churn and decision paralysis for new product builds',
    targetKeyword: 'rapid MVP tech stack 2026',
    pattern: 'Step-by-step framework',
    author: 'Alex Mercer',
    baseText: 'We do not chase the trendy framework of the week. When delivering client MVPs in 6 weeks, predictability and battle-tested tooling beat novel syntax every single time.\n\nOur default production stack:\n• Frontend: Next.js + Tailwind CSS\n• Backend: Node / TypeScript or Laravel API\n• Database: Managed PostgreSQL\n• Auth & Billing: WorkOS + Stripe\n• Hosting: AWS ECS or Render with automated staging pipelines',
    selectedDestinations: ['linkedin_personal', 'x_profile'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Scheduled',
        scheduledDate: '2026-11-09',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Mon in New York'
      },
      x_profile: {
        destinationId: 'x_profile',
        status: 'Scheduled',
        scheduledDate: '2026-11-09',
        scheduledTime: '19:00',
        audienceTimeInfo: '= 9:00 AM Mon in New York'
      }
    },
    status: 'Scheduled',
    scheduledDate: '2026-11-09',
    scheduledDay: 'Monday, Nov 9',
    scheduledTime: '18:30',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-28 17:00', action: 'Approved by Alex Mercer', actor: 'human' }
    ]
  },
  {
    id: 'sched-7',
    topic: 'Automating lead enrichment with ClearSearch: A zero-scraper architectural pattern',
    format: 'Website article',
    painAddressed: 'IP bans and fragile browser scrapers breaking weekly outreach',
    targetKeyword: 'zero scraper lead enrichment pipeline',
    pattern: 'Architecture teardown',
    author: 'Agent',
    baseText: 'If your business relies on raw headless scrapers to harvest prospective buyer signals, you spend half your time fixing broken CSS selectors and rotating residential proxies.\n\nHere is how we use direct API indexing and search signals from ClearSearch to pipe qualified buying intent into customer CRM pipelines without touching fragile HTML scrapers.',
    selectedDestinations: ['linkedin_personal', 'website_blog'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Scheduled',
        scheduledDate: '2026-11-10',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Tue in New York'
      },
      website_blog: {
        destinationId: 'website_blog',
        status: 'Scheduled',
        scheduledDate: '2026-11-10',
        scheduledTime: '20:00',
        audienceTimeInfo: '= 10:00 AM Tue in New York'
      }
    },
    status: 'Scheduled',
    scheduledDate: '2026-11-10',
    scheduledDay: 'Tuesday, Nov 10',
    scheduledTime: '18:30',
    draftedByAgent: true,
    agentTaskId: '#T-182',
    auditTrail: [
      { date: '2026-10-29 09:15', action: 'Approved by Alex Mercer', actor: 'human' }
    ]
  },

  // ==========================================
  // 8 PUBLISHED (All in past: Oct 13 - Oct 28, 2026)
  // ==========================================
  {
    // Post with 3 destinations where X failed (Daily limit reached) - testing destination failure
    id: 'post-dest-fail',
    topic: 'Why seed startups burn $120k recruiting engineers before shipping MVP',
    format: 'LinkedIn post',
    painAddressed: 'Founders waiting months to recruit before customer validation',
    targetKeyword: 'hire founding engineer contractor',
    pattern: 'Cost dissection',
    author: 'Alex Mercer',
    baseText: 'Most seed founders spend their first 4 months doing the exact same thing:\n\n1. Post a Founding Engineer job on LinkedIn\n2. Sift through 400 resume submissions\n3. Interview 25 candidates\n4. Offer declined due to salary or equity mismatch\n5. Repeat\n\nMeanwhile, 4 months of runway has evaporated, and zero real customers have touched the product.\n\nFor PayLedger ($1.2M seed), we delivered their entire multi-tenant billing engine in 5 weeks. Validate your product with paying customers first.',
    selectedDestinations: ['linkedin_personal', 'facebook_page', 'x_profile'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Published',
        scheduledDate: '2026-10-28',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Wed in New York',
        livePostUrl: 'https://linkedin.com/in/alexmercer/post/7281928'
      },
      facebook_page: {
        destinationId: 'facebook_page',
        status: 'Published',
        scheduledDate: '2026-10-28',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Wed in New York',
        livePostUrl: 'https://facebook.com/kinetikdynamics/posts/102938'
      },
      x_profile: {
        destinationId: 'x_profile',
        status: 'Failed',
        scheduledDate: '2026-10-28',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Wed in New York',
        errorMessage: 'Daily limit reached: X API returned 429 Client Cap Exceeded (Maximum 50 tweets per 24h rolling window).'
      }
    },
    status: 'Published',
    scheduledDate: '2026-10-28',
    scheduledDay: 'Wednesday, Oct 28',
    scheduledTime: '18:30',
    publishedDate: '2026-10-28',
    impressions: 4890,
    engagements: 230,
    repliesOrDms: 8,
    linkedDeals: 28000,
    linkedDealCompany: 'PayLedger ($28k ARR)',
    draftedByAgent: true,
    agentTaskId: '#T-104',
    auditTrail: [
      { date: '2026-10-27 19:40', action: 'Drafted by agent with 3 destinations', actor: 'agent' },
      { date: '2026-10-28 09:15', action: 'Approved by Alex Mercer', actor: 'human' },
      { date: '2026-10-28 18:30', action: 'Published to LinkedIn and Facebook; X failed (429 Cap)', actor: 'system' }
    ]
  },
  {
    // Second item carrying linked deal value
    id: 'pub-2',
    topic: 'How MedFlow automated clinic triage paperwork in 10 business days',
    format: 'Case study',
    painAddressed: 'Staff burnout from manual patient intake and medical triage notes',
    targetKeyword: 'healthcare workflow automation case study',
    pattern: 'Before/After benchmark',
    author: 'Alex Mercer',
    baseText: 'MedFlow clinics were spending 45 minutes per patient simply re-keying intake forms and medication history into their EHR.\n\nIn 10 business days, we built and deployed a HIPAA-compliant voice-to-structured-schema pipeline. Intake time dropped from 45 minutes to 90 seconds.\n\nHere is how we verified medical record confidentiality while achieving 99.4% field accuracy.',
    selectedDestinations: ['linkedin_personal', 'facebook_page', 'website_blog'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Published',
        scheduledDate: '2026-10-26',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Mon in New York',
        livePostUrl: 'https://linkedin.com/in/alexmercer/post/7281014'
      },
      facebook_page: {
        destinationId: 'facebook_page',
        status: 'Published',
        scheduledDate: '2026-10-26',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Mon in New York',
        livePostUrl: 'https://facebook.com/kinetikdynamics/posts/102812'
      },
      website_blog: {
        destinationId: 'website_blog',
        status: 'Published',
        scheduledDate: '2026-10-26',
        scheduledTime: '20:00',
        audienceTimeInfo: '= 10:00 AM Mon in New York',
        livePostUrl: 'https://kinetikdynamics.com/case-studies/medflow-triage-automation'
      }
    },
    status: 'Published',
    scheduledDate: '2026-10-26',
    scheduledDay: 'Monday, Oct 26',
    scheduledTime: '18:30',
    publishedDate: '2026-10-26',
    impressions: 6420,
    engagements: 412,
    repliesOrDms: 14,
    linkedDeals: 45000,
    linkedDealCompany: 'MedFlow Systems ($45k contract)',
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-25 14:00', action: 'Approved by Alex Mercer', actor: 'human' },
      { date: '2026-10-26 18:30', action: 'Published across all 3 destinations', actor: 'system' }
    ]
  },
  {
    id: 'pub-3',
    topic: 'The real reason your background workers keep dying at 3 AM',
    format: 'LinkedIn post',
    painAddressed: 'Unmonitored Node.js memory leaks crashing message consumer queues',
    targetKeyword: 'Node.js background worker memory leak',
    pattern: 'Architecture teardown',
    author: 'Sarah Connor',
    baseText: 'If your Redis BullMQ workers silently stop consuming jobs in the middle of the night, it is almost certainly a memory leak inside an uncollected database cursor.\n\nHere are 3 production guardrails we place on every background worker queue:',
    selectedDestinations: ['linkedin_personal', 'x_profile'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Published',
        scheduledDate: '2026-10-23',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Fri in New York',
        livePostUrl: 'https://linkedin.com/in/alexmercer/post/7279021'
      },
      x_profile: {
        destinationId: 'x_profile',
        status: 'Published',
        scheduledDate: '2026-10-23',
        scheduledTime: '19:00',
        audienceTimeInfo: '= 9:00 AM Fri in New York',
        livePostUrl: 'https://x.com/kinetikdynamics/status/1892837'
      }
    },
    status: 'Published',
    scheduledDate: '2026-10-23',
    scheduledDay: 'Friday, Oct 23',
    scheduledTime: '18:30',
    publishedDate: '2026-10-23',
    impressions: 3120,
    engagements: 168,
    repliesOrDms: 9,
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-22 17:00', action: 'Approved by Alex Mercer', actor: 'human' },
      { date: '2026-10-23 18:30', action: 'Published to LinkedIn and X', actor: 'system' }
    ]
  },
  {
    id: 'pub-4',
    topic: 'Why we migrated our client pipeline off Zapier to a typed Node runner',
    format: 'LinkedIn post',
    painAddressed: 'Fragile no-code zaps silently failing on malformed JSON payloads',
    targetKeyword: 'typed serverless automations vs Zapier',
    pattern: 'Before/After benchmark',
    author: 'Alex Mercer',
    baseText: 'Zapier is great for testing an idea with 10 records. When you process 10,000 webhook payloads a week, paying $800/mo for a tool that cannot provide type-safety, version-controlled git branches, or retry queues is a bad trade.\n\nWe moved our internal growth pipeline to TypeScript serverless handlers. 99.98% reliability and zero subscription surprises.',
    selectedDestinations: ['linkedin_personal', 'facebook_page'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Published',
        scheduledDate: '2026-10-21',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Wed in New York',
        livePostUrl: 'https://linkedin.com/in/alexmercer/post/7277810'
      },
      facebook_page: {
        destinationId: 'facebook_page',
        status: 'Published',
        scheduledDate: '2026-10-21',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Wed in New York',
        livePostUrl: 'https://facebook.com/kinetikdynamics/posts/102601'
      }
    },
    status: 'Published',
    scheduledDate: '2026-10-21',
    scheduledDay: 'Wednesday, Oct 21',
    scheduledTime: '18:30',
    publishedDate: '2026-10-21',
    impressions: 2780,
    engagements: 142,
    repliesOrDms: 6,
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-20 16:30', action: 'Approved and published', actor: 'human' }
    ]
  },
  {
    id: 'pub-5',
    topic: 'What happens when your OpenAI rate limit hits during customer onboarding',
    format: 'LinkedIn post',
    painAddressed: 'Uncaught 429 rate limit exceptions breaking live user signup funnels',
    targetKeyword: 'LLM rate limit fallback architecture',
    pattern: 'Architecture teardown',
    author: 'Agent',
    baseText: 'During a live product launch for an agency client, their newly onboarded users hit a sudden 429 TPM limit from their primary AI provider.\n\nBecause we built a fallback router with Anthropic and local fallback heuristics, zero users saw an error screen.\n\nAlways design your AI wrappers with multi-provider circuit breakers.',
    selectedDestinations: ['linkedin_personal', 'x_profile'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Published',
        scheduledDate: '2026-10-20',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Tue in New York',
        livePostUrl: 'https://linkedin.com/in/alexmercer/post/7276512'
      },
      x_profile: {
        destinationId: 'x_profile',
        status: 'Published',
        scheduledDate: '2026-10-20',
        scheduledTime: '19:00',
        audienceTimeInfo: '= 9:00 AM Tue in New York',
        livePostUrl: 'https://x.com/kinetikdynamics/status/1891901'
      }
    },
    status: 'Published',
    scheduledDate: '2026-10-20',
    scheduledDay: 'Tuesday, Oct 20',
    scheduledTime: '18:30',
    publishedDate: '2026-10-20',
    impressions: 5110,
    engagements: 318,
    repliesOrDms: 12,
    draftedByAgent: true,
    agentTaskId: '#T-128',
    auditTrail: [
      { date: '2026-10-19 14:00', action: 'Approved by Alex Mercer', actor: 'human' },
      { date: '2026-10-20 18:30', action: 'Published to LinkedIn and X', actor: 'system' }
    ]
  },
  {
    id: 'pub-6',
    topic: 'Stop using microservices for simple CRUD applications',
    format: 'Website article',
    painAddressed: 'Excessive infrastructure complexity in early venture builds',
    targetKeyword: 'modular monolith vs microservices startup',
    pattern: 'Contrarian breakdown',
    author: 'Alex Mercer',
    baseText: 'If your SaaS does not yet have 10 separate engineering squads, splitting your codebase across 12 microservices with gRPC contracts is not good architecture. It is an operational tax.\n\nBuild a clean, modular monolith with distinct domain boundaries. Deploy to a single server. Scale when you actually need to.',
    selectedDestinations: ['linkedin_personal', 'website_blog'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Published',
        scheduledDate: '2026-10-19',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Mon in New York',
        livePostUrl: 'https://linkedin.com/in/alexmercer/post/7275020'
      },
      website_blog: {
        destinationId: 'website_blog',
        status: 'Published',
        scheduledDate: '2026-10-19',
        scheduledTime: '20:00',
        audienceTimeInfo: '= 10:00 AM Mon in New York',
        livePostUrl: 'https://kinetikdynamics.com/blog/stop-using-microservices-for-crud'
      }
    },
    status: 'Published',
    scheduledDate: '2026-10-19',
    scheduledDay: 'Monday, Oct 19',
    scheduledTime: '18:30',
    publishedDate: '2026-10-19',
    impressions: 4200,
    engagements: 254,
    repliesOrDms: 11,
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-18 11:30', action: 'Approved and published', actor: 'human' }
    ]
  },
  {
    id: 'pub-7',
    topic: 'The anatomy of an agency white-label SLA: What CTOs actually demand',
    format: 'LinkedIn post',
    painAddressed: 'Agencies entering white-label agreements without clear code ownership terms',
    targetKeyword: 'white label software agency agreement SLA',
    pattern: 'Founder lesson',
    author: 'Alex Mercer',
    baseText: 'When an agency brings us in as their white-label engineering arm, the contract never hinges on hourly rates. It hinges on code governance, intellectual property indemnification, and uptime warranties.\n\nHere are the 4 clauses every agency CTO must require before signing a development partnership.',
    selectedDestinations: ['linkedin_personal', 'facebook_page'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Published',
        scheduledDate: '2026-10-15',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Thu in New York',
        livePostUrl: 'https://linkedin.com/in/alexmercer/post/7271890'
      },
      facebook_page: {
        destinationId: 'facebook_page',
        status: 'Published',
        scheduledDate: '2026-10-15',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Thu in New York',
        livePostUrl: 'https://facebook.com/kinetikdynamics/posts/102144'
      }
    },
    status: 'Published',
    scheduledDate: '2026-10-15',
    scheduledDay: 'Thursday, Oct 15',
    scheduledTime: '18:30',
    publishedDate: '2026-10-15',
    impressions: 1890,
    engagements: 98,
    repliesOrDms: 4,
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-14 15:00', action: 'Approved and published', actor: 'human' }
    ]
  },
  {
    id: 'pub-8',
    topic: 'How a logistics broker automated 1,200 customs declarations per month',
    format: 'Case study',
    painAddressed: 'Cross-border customs delays from missing tariff codes and manual manifests',
    targetKeyword: 'customs declaration automation case study',
    pattern: 'Before/After benchmark',
    author: 'Sarah Connor',
    baseText: 'Customs paperwork errors can hold a $250k freight container at port for 7 days, costing $1,200 daily in demurrage penalties.\n\nFor a UK-EU freight forwarder, we deployed an automated tariff code verification agent that parses international invoices against the latest HMRC schema.\n\nZero demurrage fines over the past 6 months.',
    selectedDestinations: ['linkedin_personal', 'website_blog', 'facebook_page'],
    destinationSchedules: {
      linkedin_personal: {
        destinationId: 'linkedin_personal',
        status: 'Published',
        scheduledDate: '2026-10-13',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Tue in New York',
        livePostUrl: 'https://linkedin.com/in/alexmercer/post/7269101'
      },
      website_blog: {
        destinationId: 'website_blog',
        status: 'Published',
        scheduledDate: '2026-10-13',
        scheduledTime: '20:00',
        audienceTimeInfo: '= 10:00 AM Tue in New York',
        livePostUrl: 'https://kinetikdynamics.com/case-studies/customs-declaration-automation'
      },
      facebook_page: {
        destinationId: 'facebook_page',
        status: 'Published',
        scheduledDate: '2026-10-13',
        scheduledTime: '18:30',
        audienceTimeInfo: '= 8:30 AM Tue in New York',
        livePostUrl: 'https://facebook.com/kinetikdynamics/posts/101902'
      }
    },
    status: 'Published',
    scheduledDate: '2026-10-13',
    scheduledDay: 'Tuesday, Oct 13',
    scheduledTime: '18:30',
    publishedDate: '2026-10-13',
    impressions: 3650,
    engagements: 196,
    repliesOrDms: 7,
    draftedByAgent: false,
    auditTrail: [
      { date: '2026-10-12 16:00', action: 'Approved and published', actor: 'human' }
    ]
  }
];
