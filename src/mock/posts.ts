import { Post } from '../types';

export const POSTS_INITIAL: Post[] = [
  // ==========================================
  // 1. NEEDS APPROVAL (3 posts)
  // ==========================================
  {
    id: 'post-appr-1',
    channelId: 'linkedin_personal',
    text: 'Most B2B SaaS teams spend 36 hours manually reviewing and routing invoices each week.\n\nWe engineered an event-driven worker for a logistics scale-up that runs document OCR and validation in 4 minutes flat. Zero hallucinated vendor IDs, full audit trace in Postgres.\n\nHere is the exact architecture breakdown.',
    status: 'Needs approval',
    scheduledDate: '2026-10-30',
    scheduledTime: '18:30',
    slotId: 'lip-1',
    draftedByAgent: true,
    agentTaskId: '#T-4091',
    whyThisPost: 'Targeting Series B CTOs experiencing manual operations lag. Uses verified logistics benchmark.',
    author: 'Agent',
    pattern: 'Before/After benchmark',
    targetKeyword: 'invoice automation architecture',
    createdTogetherGroupId: 'grp-invoice-case',
    siblingPostIds: ['post-appr-2']
  },
  {
    id: 'post-appr-2',
    channelId: 'x_profile',
    text: 'Cut invoice processing from 36 hours to 4 minutes.\n\nHow we built an event-driven validation worker for a Series B logistics firm with zero vendor hallucination.\n\nArchitecture breakdown below 👇',
    status: 'Needs approval',
    scheduledDate: '2026-10-30',
    scheduledTime: '19:00',
    slotId: 'x-5',
    draftedByAgent: true,
    agentTaskId: '#T-4091',
    whyThisPost: 'Accompanying X thread for the invoice automation benchmark case study.',
    author: 'Agent',
    pattern: 'Architecture teardown',
    targetKeyword: 'OCR worker pipeline',
    createdTogetherGroupId: 'grp-invoice-case',
    siblingPostIds: ['post-appr-1'],
    channelSpecific: {
      xThreadPosts: [
        '1/ Ingestion: Invoices arrive via webhooks from billing partners directly into an encrypted S3 bucket.',
        '2/ Worker: AWS Lambda parses PDF OCR into structured JSON with pydantic schemas. 99.4% schema accuracy.',
        '3/ Human Gate: Any confidence score < 95% routes into a 1-click Slack approval modal.'
      ]
    }
  },
  {
    id: 'post-appr-3',
    channelId: 'website_blog',
    text: 'Building a High-Throughput Document Validation Pipeline in 2026',
    status: 'Needs approval',
    scheduledDate: '2026-11-02',
    scheduledTime: '20:00',
    slotId: 'web-1',
    draftedByAgent: true,
    agentTaskId: '#T-4102',
    whyThisPost: 'Long-form studio technical guide targeting engineering managers searching for document OCR architecture.',
    author: 'Agent',
    pattern: 'Step-by-step framework',
    targetKeyword: 'document validation pipeline',
    channelSpecific: {
      websiteData: {
        title: 'Building a High-Throughput Document Validation Pipeline in 2026',
        slug: 'document-validation-pipeline-guide',
        metaDescription: 'A production blueprint for engineering teams replacing manual invoice routing with validated worker queues.',
        category: 'Engineering & Automation',
        targetKeyword: 'document validation pipeline',
        publishMode: 'cms_draft',
        seoChecklist: {
          keywordInTitle: true,
          oneH1: true,
          faqSection: true,
          schemaType: 'TechArticle'
        }
      }
    }
  },

  // ==========================================
  // 2. DRAFTS (6 posts)
  // ==========================================
  {
    id: 'post-draft-1',
    channelId: 'linkedin_personal',
    text: 'Why 80% of AI wrappers churn within 90 days of launch:\n\nThey solve a generic interface problem instead of integrating into an existing high-frequency back-office bottleneck.\n\nIf you are building an AI product in Q4, anchor on database-level automation, not another chat window.',
    status: 'Draft',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Contrarian breakdown',
    targetKeyword: 'AI wrapper retention'
  },
  {
    id: 'post-draft-2',
    channelId: 'facebook_page',
    text: 'We just open-sourced our internal 6-week MVP scoping template.\n\nIt covers fixed-scope sprints, guardrails against feature bloat, and the weekly delivery cadence we use for European founders.',
    status: 'Draft',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Step-by-step framework',
    targetKeyword: 'MVP scoping template',
    channelSpecific: {
      facebookLinkPreview: {
        title: 'Kinetik Dynamics MVP Scoping Framework',
        url: 'https://kinetikdynamics.com/frameworks/mvp-scope',
        description: 'The exact fixed-scope roadmap template used for 6-week studio builds.'
      }
    }
  },
  {
    id: 'post-draft-3',
    channelId: 'x_profile',
    text: 'Hot take: If your MVP takes longer than 6 weeks to ship, you are not testing hypotheses, you are hiding behind code.',
    status: 'Draft',
    draftedByAgent: true,
    agentTaskId: '#T-3990',
    author: 'Agent',
    pattern: 'Contrarian breakdown',
    targetKeyword: 'startup velocity'
  },
  {
    id: 'post-draft-4',
    channelId: 'website_blog',
    text: 'What an MVP Actually Costs in 2026: An Agency vs Studio Breakdown',
    status: 'Draft',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Cost dissection',
    targetKeyword: 'MVP build cost 2026',
    channelSpecific: {
      websiteData: {
        title: 'What an MVP Actually Costs in 2026: Agency vs Studio Breakdown',
        slug: 'mvp-build-cost-2026',
        metaDescription: 'A transparent breakdown of MVP development costs across US, UK, and EU studios.',
        category: 'Founder Strategy',
        targetKeyword: 'MVP build cost 2026',
        publishMode: 'cms_draft',
        seoChecklist: {
          keywordInTitle: true,
          oneH1: true,
          faqSection: true,
          schemaType: 'Article'
        }
      }
    }
  },
  {
    id: 'post-draft-5',
    channelId: 'linkedin_personal',
    text: 'The $28k mistake founders make when migrating from Zapier to custom background jobs.\n\nThey rebuild 100% of their ad-hoc zaps instead of mapping the 3 high-volume workflows that actually hit rate limits.',
    status: 'Draft',
    draftedByAgent: true,
    agentTaskId: '#T-4011',
    author: 'Agent',
    pattern: 'Founder lesson',
    targetKeyword: 'Zapier migration custom code'
  },
  {
    id: 'post-draft-6',
    channelId: 'x_profile',
    text: 'Clean code that never ships solves zero customer problems. Ship the smallest working slice on Friday, measure Monday.',
    status: 'Draft',
    draftedByAgent: false,
    author: 'Sarah Connor',
    pattern: 'Contrarian breakdown',
    targetKeyword: 'software release cycle'
  },

  // ==========================================
  // 3. SCHEDULED (10 posts across next 14 days)
  // Includes 3 posts created together (createdTogetherGroupId: 'grp-mvp-launch')
  // ==========================================
  {
    id: 'post-sched-1',
    channelId: 'linkedin_personal',
    text: 'Six weeks ago, a fintech founder came to us with an unvalidated idea on a napkin.\n\nToday, they onboarded their first 25 paying pilot accounts.\n\nHere is how we scoped the core database, bypassed unnecessary auth complexity, and shipped ahead of schedule.',
    status: 'Scheduled',
    scheduledDate: '2026-11-03', // Tuesday next week
    scheduledTime: '18:30',
    slotId: 'lip-1',
    draftedByAgent: true,
    agentTaskId: '#T-3902',
    author: 'Agent',
    pattern: 'Founder lesson',
    targetKeyword: 'fintech MVP launch',
    createdTogetherGroupId: 'grp-mvp-launch',
    siblingPostIds: ['post-sched-2', 'post-sched-3']
  },
  {
    id: 'post-sched-2',
    channelId: 'facebook_page',
    text: 'Case Study: From concept to 25 paying pilot accounts in 6 weeks.\n\nHow Kinetik Dynamics built and deployed a production fintech MVP for early traction.',
    status: 'Scheduled',
    scheduledDate: '2026-11-04', // Wednesday next week
    scheduledTime: '22:00',
    slotId: 'fb-1',
    draftedByAgent: true,
    agentTaskId: '#T-3902',
    author: 'Agent',
    pattern: 'Founder lesson',
    targetKeyword: 'fintech MVP build',
    createdTogetherGroupId: 'grp-mvp-launch',
    siblingPostIds: ['post-sched-1', 'post-sched-3']
  },
  {
    id: 'post-sched-3',
    channelId: 'x_profile',
    text: 'From napkin wireframe to 25 paying pilot users in 6 weeks.\n\nFintech MVP launch thread and tech stack breakdown 👇',
    status: 'Scheduled',
    scheduledDate: '2026-11-03', // Tuesday next week
    scheduledTime: '19:00',
    slotId: 'x-2',
    draftedByAgent: true,
    agentTaskId: '#T-3902',
    author: 'Agent',
    pattern: 'Before/After benchmark',
    targetKeyword: 'fintech MVP',
    createdTogetherGroupId: 'grp-mvp-launch',
    siblingPostIds: ['post-sched-1', 'post-sched-2']
  },
  {
    id: 'post-sched-4',
    channelId: 'linkedin_personal',
    text: 'Technical debt is not bad code—it is code you wrote before you knew your customers actually wanted the feature.\n\nStop optimizing for 100k users when you are hunting for your first 10.',
    status: 'Scheduled',
    scheduledDate: '2026-11-04', // Wednesday
    scheduledTime: '18:30',
    slotId: 'lip-2',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Contrarian breakdown',
    targetKeyword: 'startup tech debt'
  },
  {
    id: 'post-sched-5',
    channelId: 'website_blog',
    text: 'Deploying Self-Healing AI Workers: When to Automate and When to Gate',
    status: 'Scheduled',
    scheduledDate: '2026-11-05', // Thursday
    scheduledTime: '20:00',
    slotId: 'web-2',
    draftedByAgent: true,
    agentTaskId: '#T-3955',
    author: 'Agent',
    pattern: 'Step-by-step framework',
    targetKeyword: 'self-healing AI workers',
    channelSpecific: {
      websiteData: {
        title: 'Deploying Self-Healing AI Workers: When to Automate and When to Gate',
        slug: 'deploying-self-healing-ai-workers',
        metaDescription: 'A pragmatic framework for AI engineering teams deciding between automated background agents and human gates.',
        category: 'AI Automation',
        targetKeyword: 'self-healing AI workers',
        publishMode: 'publish_live',
        seoChecklist: {
          keywordInTitle: true,
          oneH1: true,
          faqSection: true,
          schemaType: 'TechArticle'
        }
      }
    }
  },
  {
    id: 'post-sched-6',
    channelId: 'x_profile',
    text: 'Building background workers? Stop polling relational databases every 5 seconds. Use event bridges and webhook queues.',
    status: 'Scheduled',
    scheduledDate: '2026-11-02', // Monday
    scheduledTime: '19:00',
    slotId: 'x-1',
    draftedByAgent: false,
    author: 'Sarah Connor',
    pattern: 'Architecture teardown',
    targetKeyword: 'event driven architecture'
  },
  {
    id: 'post-sched-7',
    channelId: 'x_profile',
    text: 'Your daily reminder: Most internal studio tools do not need AI. They need reliable SQL schemas, fast endpoints, and clean UX.',
    status: 'Scheduled',
    scheduledDate: '2026-11-04', // Wednesday
    scheduledTime: '19:00',
    slotId: 'x-3',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Contrarian breakdown',
    targetKeyword: 'boring technology'
  },
  {
    id: 'post-sched-8',
    channelId: 'x_profile',
    text: 'The best engineering sprint is the one where you delete 2,000 lines of brittle code and replace it with 1 robust webhook handler.',
    status: 'Scheduled',
    scheduledDate: '2026-11-05', // Thursday
    scheduledTime: '19:00',
    slotId: 'x-4',
    draftedByAgent: true,
    agentTaskId: '#T-4022',
    author: 'Agent',
    pattern: 'Founder lesson',
    targetKeyword: 'code refactoring'
  },
  {
    id: 'post-sched-9',
    channelId: 'website_blog',
    text: 'The 6-Week Software Studio Delivery Playbook: Architecture & QA Cadence',
    status: 'Scheduled',
    scheduledDate: '2026-11-09', // Monday next week
    scheduledTime: '20:00',
    slotId: 'web-1',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Step-by-step framework',
    targetKeyword: 'software studio playbook',
    channelSpecific: {
      websiteData: {
        title: 'The 6-Week Software Studio Delivery Playbook: Architecture & QA Cadence',
        slug: 'software-studio-delivery-playbook',
        metaDescription: 'Our standard playbook for running 6-week MVP builds with predictable quality and zero scope creep.',
        category: 'Studio Strategy',
        targetKeyword: 'software studio playbook',
        publishMode: 'publish_live',
        seoChecklist: {
          keywordInTitle: true,
          oneH1: true,
          faqSection: true,
          schemaType: 'Article'
        }
      }
    }
  },
  {
    id: 'post-sched-10',
    channelId: 'x_profile',
    text: 'Why we mandate 1-click approvals for all agent-generated outreach: algorithms find signals, but humans protect reputation.',
    status: 'Scheduled',
    scheduledDate: '2026-11-06', // Friday
    scheduledTime: '19:00',
    slotId: 'x-5',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Contrarian breakdown',
    targetKeyword: 'human in the loop'
  },

  // ==========================================
  // 4. SENT (9 posts in past with believable results & linked deals)
  // ==========================================
  {
    id: 'post-sent-1',
    channelId: 'linkedin_personal',
    text: 'How we helped an EU legaltech client cut contract classification time from 4 hours to 12 seconds with structured LLM workers.\n\nNo brittle scrapers, no endless prompt chaining. Just clean JSON schemas and a strict human verification gate.',
    status: 'Sent',
    sentAt: '2026-10-22 18:30',
    scheduledDate: '2026-10-22',
    scheduledTime: '18:30',
    impressions: 4890,
    engagements: 142,
    repliesOrDms: 12,
    linkedDeals: 28000,
    linkedDealCompany: 'Vanguard Claims Logistics',
    livePostUrl: 'https://linkedin.com/feed/update/urn:li:activity:7251029384910293',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Before/After benchmark'
  },
  {
    id: 'post-sent-2',
    channelId: 'x_profile',
    text: 'We audited 40 SaaS lead pipelines this month.\n\n78% of them had broken webhook retries and silent data drops between their marketing forms and CRM.\n\nFix your pipes before you buy more ads.',
    status: 'Sent',
    sentAt: '2026-10-23 19:00',
    scheduledDate: '2026-10-23',
    scheduledTime: '19:00',
    impressions: 3120,
    engagements: 98,
    repliesOrDms: 9,
    livePostUrl: 'https://x.com/kinetikdynamics/status/1848920192830192',
    draftedByAgent: true,
    agentTaskId: '#T-3801',
    author: 'Agent',
    pattern: 'Contrarian breakdown'
  },
  {
    id: 'post-sent-3',
    channelId: 'facebook_page',
    text: 'New studio case study: Building an automated compliance checker for financial data exports.\n\nRead the full technical breakdown on our blog.',
    status: 'Sent',
    sentAt: '2026-10-21 22:00',
    scheduledDate: '2026-10-21',
    scheduledTime: '22:00',
    impressions: 1140,
    engagements: 36,
    repliesOrDms: 3,
    livePostUrl: 'https://facebook.com/kinetikdynamics/posts/102938491029',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Case study'
  },
  {
    id: 'post-sent-4',
    channelId: 'website_blog',
    text: 'Why We Build Studio Prototypes With Tailwind and Fast Static Stores',
    status: 'Sent',
    sentAt: '2026-10-19 20:00',
    scheduledDate: '2026-10-19',
    scheduledTime: '20:00',
    impressions: 2450,
    engagements: 88,
    repliesOrDms: 7,
    linkedDeals: 45000,
    linkedDealCompany: 'Apex Legal Intelligence',
    livePostUrl: 'https://kinetikdynamics.com/blog/prototypes-tailwind-static-stores',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Architecture teardown'
  },
  {
    id: 'post-sent-5',
    channelId: 'linkedin_personal',
    text: 'Hiring a 5-person engineering team for an unvalidated MVP is the fastest way to burn your seed round.\n\nA boutique studio can ship the production version in 6 weeks for a third of the burn.',
    status: 'Sent',
    sentAt: '2026-10-15 18:30',
    scheduledDate: '2026-10-15',
    scheduledTime: '18:30',
    impressions: 6240,
    engagements: 210,
    repliesOrDms: 18,
    livePostUrl: 'https://linkedin.com/feed/update/urn:li:activity:724892019283019',
    draftedByAgent: true,
    agentTaskId: '#T-3740',
    author: 'Agent',
    pattern: 'Cost dissection'
  },
  {
    id: 'post-sent-6',
    channelId: 'x_profile',
    text: 'A clean relational schema > 10 microservices for an early-stage startup. Do not let resume-driven development kill your company.',
    status: 'Sent',
    sentAt: '2026-10-16 19:00',
    scheduledDate: '2026-10-16',
    scheduledTime: '19:00',
    impressions: 4890,
    engagements: 165,
    repliesOrDms: 14,
    livePostUrl: 'https://x.com/kinetikdynamics/status/18460192830192',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Contrarian breakdown'
  },
  {
    id: 'post-sent-7',
    channelId: 'linkedin_personal',
    text: 'The best agencies in 2026 do not sell hours. They sell guaranteed production outcomes in fixed sprint cycles.',
    status: 'Sent',
    sentAt: '2026-10-08 18:30',
    scheduledDate: '2026-10-08',
    scheduledTime: '18:30',
    impressions: 3870,
    engagements: 115,
    repliesOrDms: 8,
    livePostUrl: 'https://linkedin.com/feed/update/urn:li:activity:72410293849102',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Founder lesson'
  },
  {
    id: 'post-sent-8',
    channelId: 'website_blog',
    text: 'The Micro-SaaS Tech Stack: Postgres, React, and Fast Node Background Queues',
    status: 'Sent',
    sentAt: '2026-10-12 20:00',
    scheduledDate: '2026-10-12',
    scheduledTime: '20:00',
    impressions: 1980,
    engagements: 64,
    repliesOrDms: 5,
    livePostUrl: 'https://kinetikdynamics.com/blog/micro-saas-tech-stack-2026',
    draftedByAgent: true,
    agentTaskId: '#T-3690',
    author: 'Agent',
    pattern: 'Architecture teardown'
  },
  {
    id: 'post-sent-9',
    channelId: 'x_profile',
    text: 'Our automation bot found 60 high-intent buyer signals across Reddit and HN this week. 12 qualified into pipeline calls.',
    status: 'Sent',
    sentAt: '2026-10-20 19:00',
    scheduledDate: '2026-10-20',
    scheduledTime: '19:00',
    impressions: 2790,
    engagements: 76,
    repliesOrDms: 6,
    livePostUrl: 'https://x.com/kinetikdynamics/status/18479201928301',
    draftedByAgent: true,
    agentTaskId: '#T-3770',
    author: 'Agent',
    pattern: 'Before/After benchmark'
  },

  // ==========================================
  // 5. FAILED (2 posts)
  // ==========================================
  {
    id: 'post-fail-1',
    channelId: 'x_profile',
    text: 'Automating customer onboarding with custom LLM agents: 3 failure points you need to catch before deploying.',
    status: 'Failed',
    sentAt: '2026-10-28 19:00',
    scheduledDate: '2026-10-28',
    scheduledTime: '19:00',
    errorMessage: 'Daily limit reached. X API returned HTTP 429: User tier cap exceeded.',
    draftedByAgent: true,
    agentTaskId: '#T-4080',
    author: 'Agent',
    pattern: 'Architecture teardown'
  },
  {
    id: 'post-fail-2',
    channelId: 'website_blog',
    text: 'Zero-Downtime Database Migrations with Laravel and Postgres',
    status: 'Failed',
    sentAt: '2026-10-26 20:00',
    scheduledDate: '2026-10-26',
    scheduledTime: '20:00',
    errorMessage: 'CMS webhook timeout: kinetikdynamics.com returned 504 Gateway Timeout.',
    draftedByAgent: false,
    author: 'Alex Mercer',
    pattern: 'Step-by-step framework',
    channelSpecific: {
      websiteData: {
        title: 'Zero-Downtime Database Migrations with Laravel and Postgres',
        slug: 'zero-downtime-migrations-laravel-postgres',
        metaDescription: 'Step-by-step guide to running schema migrations with zero lock contention.',
        category: 'Engineering',
        targetKeyword: 'zero downtime migrations',
        publishMode: 'publish_live',
        seoChecklist: {
          keywordInTitle: true,
          oneH1: true,
          faqSection: false,
          schemaType: 'TechArticle'
        }
      }
    }
  }
];
