import { Lead, Signal } from '../types';

export const initialLeads: Lead[] = [
  // 5 Queue Leads (waiting for approval)
  {
    id: 'lead-01',
    company: 'AeroTrans Logistics Ltd',
    website: 'https://aerotrans-logistics.co.uk',
    personName: 'Marcus Vance',
    personRole: 'VP of Global Operations',
    email: 'm.vance@aerotrans-logistics.co.uk',
    emailSource: 'ClearSearch verified from company registry & company website',
    country: 'United Kingdom',
    source: 'Hacker News (Ask HN)',
    sourceUrl: 'https://news.ycombinator.com/item?id=41892011',
    signalType: 'Hiring Post',
    signalText: 'Ask HN: How are mid-size freight brokers handling automated parsing of messy PDF customs documents? Looking for a boutique engineering team or proven tool.',
    signalDate: '2026-10-28 06:14 (Asia/Dhaka)',
    score: 88,
    scoreReasons: [
      { label: 'High buying intent: explicitly asking for boutique engineering team in public forum', weight: 35 },
      { label: 'Exact ICP match: UK logistics operator with 80+ employees', weight: 25 },
      { label: 'Matches proven case study (Portline Freight)', weight: 20 },
      { label: 'Budget indicator: freight volume > 500 shipments/mo', weight: 15 },
      { label: 'Minor: no public GitHub technical team on record', weight: -7 }
    ],
    icpId: 'smb-ai-automation',
    offerId: 'ai-sprint',
    foundAgo: '2h ago',
    foundAt: '2026-10-28 06:14 (Asia/Dhaka)',
    brief: 'AeroTrans is an established UK freight forwarder struggling with customs document processing delays. They process hundreds of messy scanned manifests weekly and are hitting manual turnaround bottlenecks. They need an automated extraction pipeline directly feeding their ERP. Reference our Portline Global Freight case study to validate our domain experience.',
    recommendedProofId: 'proof-1',
    siteAudit: [
      {
        severity: 'High',
        finding: 'Customer portal relies on legacy unencrypted FTP upload script.',
        recommendation: 'Highlight our SOC2-compliant encrypted document ingestion architecture.'
      },
      {
        severity: 'Medium',
        finding: 'Career page lists open role for Junior Customs Clerk open for 72 days.',
        recommendation: 'Position AI sprint as immediate relief while recruitment is stalled.'
      },
      {
        severity: 'Low',
        finding: 'Company recently upgraded to modern TMS (Transport Management System) API.',
        recommendation: 'Confirms technical feasibility for standard JSON webhook sync.'
      }
    ],
    checks: [
      { id: 'c1', label: 'Not already in outreach app', passed: true },
      { id: 'c2', label: 'Not suppressed or opted-out', passed: true },
      { id: 'c3', label: 'Email source recorded and verified', passed: true }
    ],
    emailSubject: 'Automating PDF customs parsing for AeroTrans (like Portline Freight)',
    emailBody: `Hi Marcus,\n\nSaw your Ask HN question regarding automated document parsing for customs manifests at mid-size freight operations.\n\nWe recently completed a 2-week AI automation sprint for Portline Global Freight in Southampton. We cut their document turnaround time from 36 hours down to 4 minutes by combining Claude 3.5 Sonnet extraction with custom validation rules directly into CargoWise—with human review only for items below 95% confidence.\n\nHappy to share a 3-minute video walkthrough of how the pipeline handles scanned and low-resolution international bills of lading without manual re-keying.\n\nWould that be helpful this week?\n\nBest,\nAlex Mercer\nKinetik Dynamics`,
    followUps: [
      {
        step: 1,
        delayDays: 3,
        subject: 'Quick video demo: customs manifest parsing',
        body: 'Hi Marcus, just following up on the freight document parsing video. Did you manage to test an automated pipeline with your TMS, or are you still relying on manual entry?'
      },
      {
        step: 2,
        delayDays: 7,
        subject: 'Portline case study numbers',
        body: 'Hi Marcus, wanted to share the specific accuracy metrics from Portline: 99.2% accuracy across 14 carriers. Let me know if you would like the architecture diagram.'
      },
      {
        step: 3,
        delayDays: 14,
        subject: 'Closing loop on customs automation',
        body: 'Hi Marcus, closing the loop here. If automating customs entry becomes a Q4 priority, let me know. Wishing you and the AeroTrans team great momentum.'
      }
    ],
    stage: 'Qualified',
    valueEst: 8500,
    timeline: [
      { date: '2026-10-28 06:14', event: 'Signal detected on Hacker News', actor: 'agent' },
      { date: '2026-10-28 06:16', event: 'ClearSearch verified contact Marcus Vance', actor: 'agent' },
      { date: '2026-10-28 06:17', event: 'Site audit and email draft compiled (Score: 88)', actor: 'agent' }
    ]
  },
  {
    id: 'lead-02',
    company: 'OrbitFin Tech',
    website: 'https://orbitfin.io',
    personName: 'Elena Rostova',
    personRole: 'Co-Founder & CEO',
    email: 'elena@orbitfin.io',
    emailSource: 'Founding team contact on PitchBook / company website',
    country: 'United States',
    source: 'TechCrunch / PitchBook',
    sourceUrl: 'https://techcrunch.com/2026/10/26/orbitfin-raises-2m-seed-for-credit-automation',
    signalType: 'Funding News',
    signalText: 'OrbitFin announces $2.1M Seed round led by PointNine. Looking to ship MVP of embedded invoice financing engine before January Q1 rollout.',
    signalDate: '2026-10-27 18:40 (Asia/Dhaka)',
    score: 82,
    scoreReasons: [
      { label: 'Fresh funding: $2.1M Seed closed 48h ago', weight: 30 },
      { label: 'Explicit deadline: Must launch before January Q1', weight: 25 },
      { label: 'Matches MVP in 6 Weeks core stack (Next.js + Stripe/Plaid)', weight: 20 },
      { label: 'Prior founder background: 2nd time founder', weight: 15 },
      { label: 'Risk: May be evaluating hiring full-time internal CTO', weight: -8 }
    ],
    icpId: 'funded-saas',
    offerId: 'mvp-6-weeks',
    foundAgo: '5h ago',
    foundAt: '2026-10-27 18:40 (Asia/Dhaka)',
    brief: 'Elena just raised $2.1M for OrbitFin to provide embedded credit lines. They have aggressive launch targets for January but only 2 founders and no in-house frontend/backend squad yet. Our 6-week MVP delivery model fits their timeline perfectly, mirroring what we built for PayLedger ($340k ARR in 90 days).',
    recommendedProofId: 'proof-2',
    siteAudit: [
      {
        severity: 'High',
        finding: 'Landing page is a basic Typeform with no authentication or product scaffolding.',
        recommendation: 'Emphasize complete turn-key delivery including RBAC auth and Plaid integration.'
      },
      {
        severity: 'Medium',
        finding: 'AngelList post for Founding Engineer has zero applications listed.',
        recommendation: 'Highlight that hiring takes 90+ days while we deploy code next Monday.'
      }
    ],
    checks: [
      { id: 'c1', label: 'Not already in outreach app', passed: true },
      { id: 'c2', label: 'Not suppressed or opted-out', passed: true },
      { id: 'c3', label: 'Email source recorded and verified', passed: true }
    ],
    complianceWarning: 'US CAN-SPAM: Must verify physical studio address in footer and instant 1-click opt-out token.',
    emailSubject: 'Shipping OrbitFin’s credit MVP before January (without hiring lag)',
    emailBody: `Hi Elena,\n\nCongrats on the $2.1M Seed round with PointNine.\n\nSaw the announcement noting your target to deploy the embedded financing engine before January. Most early founders lose 3 to 4 months trying to recruit senior engineers in this market before writing a single line of production code.\n\nWe specialize in taking funded fintechs from Figma to revenue-ready web apps in 6 weeks. For PayLedger, we delivered their entire multi-tenant billing and disbursement portal 1 week ahead of schedule, helping them generate $340k ARR within 90 days.\n\nWe provide a full senior engineering pod (Next.js, Supabase, Stripe/Plaid, enterprise audit logs) starting immediately under your full IP ownership.\n\nAre you open to comparing our 6-week sprint plan against your internal roadmap?\n\nBest,\nAlex Mercer\nKinetik Dynamics`,
    followUps: [
      {
        step: 1,
        delayDays: 3,
        subject: 'PayLedger architecture breakdown',
        body: 'Hi Elena, following up with the tech spec we used for PayLedger. It includes the Plaid auth flow and automated ledger balance reconciliation.'
      },
      {
        step: 2,
        delayDays: 7,
        subject: 'January launch timeline math',
        body: 'Hi Elena, if you plan to launch in January, development needs to start by mid-November. Happy to do a quick 15-min scope review this week.'
      },
      {
        step: 3,
        delayDays: 14,
        subject: 'Engineering capacity update',
        body: 'Hi Elena, checking in before we commit our November sprint pod. Let me know if external engineering capacity is still on your radar.'
      }
    ],
    stage: 'Qualified',
    valueEst: 28000,
    timeline: [
      { date: '2026-10-27 18:40', event: 'Funding signal captured via TechCrunch', actor: 'agent' },
      { date: '2026-10-27 18:42', event: 'ClearSearch enriched founder contact', actor: 'agent' },
      { date: '2026-10-27 18:45', event: 'Lead brief compiled (Score: 82)', actor: 'agent' }
    ]
  },
  {
    id: 'lead-03',
    company: 'Meridian Supply Partners',
    website: 'https://meridiansupply.com',
    personName: 'Liam Walker',
    personRole: 'Chief Technology Officer',
    email: 'l.walker@meridiansupply.com',
    emailSource: 'Hunter.io verified from domain',
    country: 'United States',
    source: 'Indeed Hiring Feed',
    sourceUrl: 'https://indeed.com/job/founding-full-stack-engineer-meridian',
    signalType: 'Hiring Post',
    signalText: 'Hiring: Senior Full-Stack Engineer (React/Node). Job open for 64 days. Building custom inventory allocation platform for B2B industrial catalog.',
    signalDate: '2026-10-27 12:15 (Asia/Dhaka)',
    score: 79,
    scoreReasons: [
      { label: 'Job posting stagnant: Open for 64 consecutive days', weight: 25 },
      { label: 'Strong budget: B2B industrial distributor with $12M revenue', weight: 20 },
      { label: 'Technical stack match: React / Node.js inventory system', weight: 15 },
      { label: 'Proven match: Apex Industrial Parts case study', weight: 15 },
      { label: 'Minor: Hiring manager is technical CTO (prefers in-house)', weight: -6 }
    ],
    icpId: 'funded-saas',
    offerId: 'mvp-6-weeks',
    foundAgo: '11h ago',
    foundAt: '2026-10-27 12:15 (Asia/Dhaka)',
    brief: 'Meridian has had an open Senior Full-Stack requisition for over 2 months while their inventory portal project is stalled. Liam is likely feeling pressure from leadership to deliver before year-end. Point him to our Apex Industrial Parts case study where we launched a $2.1M distributor portal in 6 weeks.',
    recommendedProofId: 'proof-6',
    siteAudit: [
      {
        severity: 'Medium',
        finding: 'B2B ordering requires phone or PDF email order submission.',
        recommendation: 'Position self-service portal as primary margin driver.'
      },
      {
        severity: 'Low',
        finding: 'DNS records show enterprise Microsoft 365 and NetSuite infrastructure.',
        recommendation: 'Confirm ease of integrating with existing NetSuite SuiteScript.'
      }
    ],
    checks: [
      { id: 'c1', label: 'Not already in outreach app', passed: true },
      { id: 'c2', label: 'Not suppressed or opted-out', passed: true },
      { id: 'c3', label: 'Email source recorded and verified', passed: true }
    ],
    emailSubject: 'Unblocking Meridian’s inventory platform while engineering role is open',
    emailBody: `Hi Liam,\n\nNoticed Meridian has had the Senior Full-Stack role open for 60+ days for your custom B2B inventory allocation platform.\n\nRecruiting senior engineers in this market often delays launch by 3-4 months. We recently partnered with Apex Industrial Parts to deliver their complete customer ordering portal in 6 weeks, migrating 300 wholesale accounts and processing $2.1M in the first 60 days.\n\nWe can plug in as an autonomous pod to deliver the initial release under your architectural standards, handing off clean code and tests when your permanent hire joins.\n\nWould you be open to seeing the architecture documentation from that build?\n\nBest,\nAlex Mercer\nKinetik Dynamics`,
    followUps: [
      {
        step: 1,
        delayDays: 3,
        subject: 'Apex Industrial Parts technical spec',
        body: 'Hi Liam, sharing the high-level schema we used for ERP synchronization at Apex. Let me know if you would like to review.'
      },
      {
        step: 2,
        delayDays: 7,
        subject: 'Contract-to-hire or pod handover',
        body: 'Hi Liam, we always ensure clean documentation so in-house teams take over with zero friction. Open to a 10-min chat?'
      },
      {
        step: 3,
        delayDays: 14,
        subject: 'Following up on Meridian dev backlog',
        body: 'Hi Liam, touching base one last time in case your team is still looking for engineering bandwidth this quarter.'
      }
    ],
    stage: 'Qualified',
    valueEst: 24000,
    timeline: [
      { date: '2026-10-27 12:15', event: 'Stagnant job post detected on Indeed', actor: 'agent' },
      { date: '2026-10-27 12:18', event: 'ClearSearch enriched contact data', actor: 'agent' },
      { date: '2026-10-27 12:20', event: 'Drafted outreach message (Score: 79)', actor: 'agent' }
    ]
  },
  {
    id: 'lead-04',
    company: 'Canvas Creative Studio',
    website: 'https://canvascreative.agency',
    personName: 'Chloe Laurent',
    personRole: 'Head of Digital & Technical Director',
    email: 'chloe@canvascreative.agency',
    emailSource: 'Clutch agency directory contact listing',
    country: 'United Kingdom',
    source: 'Agency RFP Feed',
    sourceUrl: 'https://clutch.co/rfp/canvas-creative-interactive-portal',
    signalType: 'Agency Referral',
    signalText: 'Looking for vetted white-label engineering partner for a 4-month enterprise client React portal build. Must operate under agency NDA.',
    signalDate: '2026-10-27 09:30 (Asia/Dhaka)',
    score: 85,
    scoreReasons: [
      { label: 'Direct agency demand: explicit RFP for white-label React engineers', weight: 35 },
      { label: 'Long timeline: 4-month enterprise contract ($25k+ potential)', weight: 25 },
      { label: 'Exact ICP match: UK digital agency with 30+ team', weight: 20 },
      { label: 'Strict requirement: agency NDA and white-labeling', weight: 10 },
      { label: 'Minor: RFP has 3 other agency applicants', weight: -5 }
    ],
    icpId: 'agency-whitelabel',
    offerId: 'whitelabel-dev',
    foundAgo: '14h ago',
    foundAt: '2026-10-27 09:30 (Asia/Dhaka)',
    brief: 'Canvas Creative is an esteemed UK creative studio that just closed a major client contract needing advanced React/GraphQL development. Their in-house team is primarily Webflow and Shopify designers. They need an engineering pod that can embed into their Slack under their email domain. Cite our confidential London digital studio retainer proof.',
    recommendedProofId: 'proof-3',
    siteAudit: [
      {
        severity: 'Low',
        finding: 'Agency portfolio highlights design awards but zero complex SaaS case studies.',
        recommendation: 'Position Kinetik as their silent technical engine.'
      },
      {
        severity: 'Low',
        finding: 'Client roster includes luxury European retail brands.',
        recommendation: 'Ensure all comms emphasize pixel-perfect design implementation.'
      }
    ],
    checks: [
      { id: 'c1', label: 'Not already in outreach app', passed: true },
      { id: 'c2', label: 'Not suppressed or opted-out', passed: true },
      { id: 'c3', label: 'Email source recorded and verified', passed: true }
    ],
    emailSubject: 'White-label React engineering pod for Canvas Creative’s enterprise RFP',
    emailBody: `Hi Chloe,\n\nSaw Canvas Creative’s RFP on Clutch for a white-label engineering partner on the upcoming enterprise React portal build.\n\nWe act as the dedicated white-label engineering pod for premier design agencies across London and Amsterdam. In our last agency partnership, our engineers worked under the agency’s domain email and Slack, shipping 18 consecutive bi-weekly sprints for a luxury retail client with zero defects.\n\nWe provide senior full-stack talent (React, TypeScript, GraphQL, Node.js), strict NDA protection, and full developer standby during UK hours.\n\nWould you like to review our agency white-label master agreement and sample rate sheet?\n\nBest,\nAlex Mercer\nKinetik Dynamics`,
    followUps: [
      {
        step: 1,
        delayDays: 3,
        subject: 'Agency partnership deck & MSA sample',
        body: 'Hi Chloe, attaching our standard agency MSA showing our strict non-solicitation covenants and SLA commitments.'
      },
      {
        step: 2,
        delayDays: 7,
        subject: 'Client pitch support for your RFP',
        body: 'Hi Chloe, happy to join your technical architecture review as Canvas’s internal CTO if helpful for the client pitch.'
      },
      {
        step: 3,
        delayDays: 14,
        subject: 'Engineering availability for Q4',
        body: 'Hi Chloe, wanted to check if you finalized your development partner for the 4-month build. Keep us in mind for future overflow!'
      }
    ],
    stage: 'Qualified',
    valueEst: 18000,
    timeline: [
      { date: '2026-10-27 09:30', event: 'RFP published on Clutch directory', actor: 'agent' },
      { date: '2026-10-27 09:32', event: 'Scored 85 for Agency Whitelabel ICP', actor: 'agent' },
      { date: '2026-10-27 09:35', event: 'Drafted tailored white-label pitch', actor: 'agent' }
    ]
  },
  {
    id: 'lead-05',
    company: 'TenancyOps Software',
    website: 'https://tenancyops.io',
    personName: 'Brian Miller',
    personRole: 'Founder & CEO',
    email: 'brian@tenancyops.io',
    emailSource: 'ClearSearch verified from founder profile',
    country: 'United States',
    source: 'Reddit r/startups',
    sourceUrl: 'https://reddit.com/r/startups/comments/192klx/looking_for_dev_shop_to_finish_mvp',
    signalType: 'Reddit Problem',
    signalText: 'Our outsourced dev team vanished with 80% done code. Looking for reliable studio in US/UK/EU time zones to take our property triage app to launch.',
    signalDate: '2026-10-26 21:05 (Asia/Dhaka)',
    score: 72,
    scoreReasons: [
      { label: 'Urgent pain: abandoned by previous contractor with 80% done code', weight: 25 },
      { label: 'Domain match: property triage automation', weight: 20 },
      { label: 'Risk: Legacy codebase may have severe technical debt', weight: -12 },
      { label: 'Duplicate check failure: Contacted 12 days ago in previous campaign', weight: -30 }
    ],
    icpId: 'funded-saas',
    offerId: 'mvp-6-weeks',
    foundAgo: '1d ago',
    foundAt: '2026-10-26 21:05 (Asia/Dhaka)',
    brief: 'Brian is dealing with an abandoned codebase for a property management ticket triage tool. He posted on Reddit looking for a reliable team to take over. However, our outreach system shows he was already contacted 12 days ago by our previous campaign sequence. Approve action must be locked to prevent spam.',
    recommendedProofId: 'proof-4',
    siteAudit: [
      {
        severity: 'High',
        finding: 'Staging server throws 502 Bad Gateway on authentication callback.',
        recommendation: 'Requires code audit before any fixed-price milestone.'
      },
      {
        severity: 'Medium',
        finding: 'Previous dev left uncommitted branches in public GitHub fork.',
        recommendation: 'Immediate security rotation required.'
      }
    ],
    checks: [
      { id: 'c1', label: 'Not already in outreach app', passed: false, note: 'Failed: Contacted 12 days ago in Campaign "Q3 SaaS Founders"' },
      { id: 'c2', label: 'Not suppressed or opted-out', passed: true },
      { id: 'c3', label: 'Email source recorded and verified', passed: true }
    ],
    emailSubject: 'Rescuing the TenancyOps triage MVP and getting to launch',
    emailBody: `Hi Brian,\n\nSaw your note about the dev team disappearing on the property triage app.\n\nInheriting partially built code is something we handle frequently. For UrbanKey Rentals, we took over a fragmented triage tool, resolved the core architectural bottlenecks, and got them live in under a month.\n\nHappy to run an initial 48-hour code audit to tell you honestly whether the existing code can be salvaged or if a clean scaffold is faster.\n\nLet me know if you want our audit checklist.\n\nBest,\nAlex Mercer\nKinetik Dynamics`,
    followUps: [
      {
        step: 1,
        delayDays: 3,
        subject: 'Code audit checklist',
        body: 'Hi Brian, here is the 10-point checklist we run when taking over external codebases.'
      },
      {
        step: 2,
        delayDays: 7,
        subject: 'TenancyOps triage demo',
        body: 'Hi Brian, checking in to see if you resolved the staging deployment issues.'
      },
      {
        step: 3,
        delayDays: 14,
        subject: 'Property triage follow up',
        body: 'Hi Brian, wishing you the best with the TenancyOps launch.'
      }
    ],
    stage: 'Qualified',
    valueEst: 15000,
    timeline: [
      { date: '2026-10-26 21:05', event: 'Reddit post detected by agent', actor: 'agent' },
      { date: '2026-10-26 21:08', event: 'Duplicate detection flagged: Contacted 12 days ago', actor: 'system' }
    ]
  },

  // 30 Additional leads across Pipeline stages
  // Approved Stage (3 leads)
  {
    id: 'lead-06',
    company: 'Portex Customs Brokers',
    website: 'https://portexbrokers.com',
    personName: 'Arthur Davies',
    personRole: 'Managing Director',
    email: 'arthur@portexbrokers.com',
    emailSource: 'ClearSearch verified',
    country: 'United Kingdom',
    source: 'Hacker News (Ask HN)',
    sourceUrl: 'https://news.ycombinator.com/item?id=4180012',
    signalType: 'Hiring Post',
    signalText: 'Need an AI pipeline to classify European transit manifests into CHIEF/CDS.',
    signalDate: '2026-10-25',
    score: 86,
    scoreReasons: [{ label: 'High intent UK logistics', weight: 35 }],
    icpId: 'smb-ai-automation',
    offerId: 'ai-sprint',
    foundAgo: '3d ago',
    foundAt: '2026-10-25 14:00',
    brief: 'High volume broker handling UK customs declaration entries.',
    recommendedProofId: 'proof-1',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'Automating CDS declaration manifests',
    emailBody: 'Hi Arthur...',
    followUps: [],
    stage: 'Approved',
    valueEst: 9500,
    timeline: [{ date: '2026-10-26', event: 'Approved by human operator', actor: 'human' }]
  },
  {
    id: 'lead-07',
    company: 'Nordic Legal AI',
    website: 'https://nordiclegal.ai',
    personName: 'Freja Lindqvist',
    personRole: 'Founder',
    email: 'freja@nordiclegal.ai',
    emailSource: 'Slush 2026 Attendee List',
    country: 'Sweden',
    source: 'TechCrunch / PitchBook',
    sourceUrl: 'https://techcrunch.com/nordiclegal-seed',
    signalType: 'Funding News',
    signalText: 'NordicLegal secures €1.4M pre-seed for contract clause verification.',
    signalDate: '2026-10-25',
    score: 84,
    scoreReasons: [{ label: 'Fresh pre-seed round', weight: 30 }],
    icpId: 'funded-saas',
    offerId: 'mvp-6-weeks',
    foundAgo: '3d ago',
    foundAt: '2026-10-25 11:30',
    brief: 'Stealth legal tech startup needing Next.js MVP built.',
    recommendedProofId: 'proof-5',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'Building NordicLegal MVP in 6 weeks',
    emailBody: 'Hi Freja...',
    followUps: [],
    stage: 'Approved',
    valueEst: 26000,
    timeline: [{ date: '2026-10-26', event: 'Approved by human operator', actor: 'human' }]
  },
  {
    id: 'lead-08',
    company: 'Boutique Studio 44',
    website: 'https://studio44.design',
    personName: 'Matteo Rossi',
    personRole: 'Founder & Design Lead',
    email: 'matteo@studio44.design',
    emailSource: 'Awwwards agency submission',
    country: 'Italy',
    source: 'Agency RFP Feed',
    sourceUrl: 'https://clutch.co/rfp/studio44',
    signalType: 'Agency Referral',
    signalText: 'Seeking ongoing React and WebGL developer partner for client portals.',
    signalDate: '2026-10-24',
    score: 80,
    scoreReasons: [{ label: 'High design aesthetic need', weight: 25 }],
    icpId: 'agency-whitelabel',
    offerId: 'whitelabel-dev',
    foundAgo: '4d ago',
    foundAt: '2026-10-24 16:00',
    brief: 'High-end Milan design studio with technical dev overflow.',
    recommendedProofId: 'proof-8',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'White-label engineering for Studio 44',
    emailBody: 'Hi Matteo...',
    followUps: [],
    stage: 'Approved',
    valueEst: 7500,
    timeline: [{ date: '2026-10-25', event: 'Approved by human operator', actor: 'human' }]
  },

  // Contacted Stage (12 leads)
  ...Array.from({ length: 12 }).map((_, i) => {
    const companies = ['ZetaFlow Analytics', 'CloudCart B2B', 'Peakline Medical', 'Krypton Logistics', 'Veritas Audit', 'OmniShip Europe', 'Stratos Capital App', 'Beacon Healthcare', 'HyperScale Studio', 'BlueAnchor Freight', 'Cortex Ops', 'Apex Ledger'];
    const names = ['Sarah Jenkins', 'Oliver Twist', 'Hannah Abbott', 'Lucas Scott', 'Rachel Green', 'Simon Cowell', 'Emily Watson', 'James Potter', 'Charlotte Bronte', 'William Blake', 'Grace Hopper', 'Thomas Edison'];
    const countries = ['United States', 'United Kingdom', 'Germany', 'Netherlands', 'Canada'];
    return {
      id: `lead-contacted-${i + 1}`,
      company: companies[i % companies.length],
      website: `https://${companies[i % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
      personName: names[i % names.length],
      personRole: i % 2 === 0 ? 'Founder & CEO' : 'Head of Operations',
      email: `${names[i % names.length].toLowerCase().split(' ')[0]}@${companies[i % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
      emailSource: 'ClearSearch verified',
      country: countries[i % countries.length],
      source: 'Indeed Hiring Feed',
      sourceUrl: 'https://example.com/source',
      signalType: 'Hiring Post' as Signal['signalType'],
      signalText: `Hiring senior developers to build automated platform for ${companies[i % companies.length]}.`,
      signalDate: `2026-10-${Math.max(1, 24 - i).toString().padStart(2, '0')}`,
      score: 75 + (i % 15),
      scoreReasons: [{ label: 'Automated outreach active', weight: 20 }],
      icpId: i % 2 === 0 ? 'funded-saas' : 'smb-ai-automation',
      offerId: i % 2 === 0 ? 'mvp-6-weeks' : 'ai-sprint' as Lead['offerId'],
      foundAgo: `${i + 3}d ago`,
      foundAt: `2026-10-${Math.max(1, 24 - i).toString().padStart(2, '0')}`,
      brief: 'Contacted via sequence. Step 1 sent. Waiting for initial reply.',
      recommendedProofId: 'proof-1',
      siteAudit: [],
      checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
      emailSubject: `Engineering capacity for ${companies[i % companies.length]}`,
      emailBody: 'Outreach email in progress...',
      followUps: [],
      stage: 'Contacted' as Lead['stage'],
      valueEst: 12000 + i * 1500,
      timeline: [
        { date: `2026-10-${Math.max(1, 24 - i).toString().padStart(2, '0')}`, event: 'Email step 1 delivered via outreach app', actor: 'system' }
      ]
    };
  }),

  // Replied Stage (4 leads)
  {
    id: 'lead-replied-01',
    company: 'Veloce Freight Forwarding',
    website: 'https://velocefreight.co.uk',
    personName: 'Claire Redfield',
    personRole: 'Director of Operations',
    email: 'claire@velocefreight.co.uk',
    emailSource: 'ClearSearch verified',
    country: 'United Kingdom',
    source: 'Reddit r/logistics',
    sourceUrl: 'https://reddit.com/r/logistics',
    signalType: 'Reddit Problem',
    signalText: 'Looking for solution to parse sea freight manifests.',
    signalDate: '2026-10-21',
    score: 87,
    scoreReasons: [{ label: 'Replied asking for pricing and demo video', weight: 40 }],
    icpId: 'smb-ai-automation',
    offerId: 'ai-sprint',
    foundAgo: '7d ago',
    foundAt: '2026-10-21',
    brief: 'Claire replied: "Thanks Alex. Does your tool integrate with CargoWise One? We have 3,000 monthly sea waybills."',
    recommendedProofId: 'proof-1',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'CargoWise integration demo for Veloce Freight',
    emailBody: 'Hi Claire...',
    followUps: [],
    stage: 'Replied',
    valueEst: 11000,
    timeline: [
      { date: '2026-10-22 14:15', event: 'Replied to Step 1: Interested in CargoWise demo', actor: 'human' }
    ]
  },
  {
    id: 'lead-replied-02',
    company: 'Apex Claim Solutions',
    website: 'https://apexclaims.com',
    personName: 'Gregory House',
    personRole: 'VP Claims Processing',
    email: 'ghouse@apexclaims.com',
    emailSource: 'Hunter.io',
    country: 'United States',
    source: 'Hacker News (Ask HN)',
    sourceUrl: 'https://news.ycombinator.com',
    signalType: 'Hiring Post',
    signalText: 'Need automated insurance document extraction.',
    signalDate: '2026-10-20',
    score: 83,
    scoreReasons: [{ label: 'Replied asking for SOC2 compliance sheet', weight: 35 }],
    icpId: 'smb-ai-automation',
    offerId: 'ai-sprint',
    foundAgo: '8d ago',
    foundAt: '2026-10-20',
    brief: 'Gregory asked for SOC2 compliance details and HIPAA applicability.',
    recommendedProofId: 'proof-4',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'SOC2 & data security documentation',
    emailBody: 'Hi Gregory...',
    followUps: [],
    stage: 'Replied',
    valueEst: 12500,
    timeline: [
      { date: '2026-10-23 18:20', event: 'Replied: requesting security documentation', actor: 'human' }
    ]
  },
  {
    id: 'lead-replied-03',
    company: 'NorthStar Brand Agency',
    website: 'https://northstarbrand.agency',
    personName: 'Fiona Gallagher',
    personRole: 'Partner & Managing Director',
    email: 'fiona@northstarbrand.agency',
    emailSource: 'ClearSearch verified',
    country: 'United Kingdom',
    source: 'Agency RFP Feed',
    sourceUrl: 'https://clutch.co',
    signalType: 'Agency Referral',
    signalText: 'Agency needs 2 dedicated React devs for Q4 push.',
    signalDate: '2026-10-19',
    score: 82,
    scoreReasons: [{ label: 'Replied asking for developer day rates', weight: 30 }],
    icpId: 'agency-whitelabel',
    offerId: 'whitelabel-dev',
    foundAgo: '9d ago',
    foundAt: '2026-10-19',
    brief: 'Fiona replied asking if we have capacity starting mid-November.',
    recommendedProofId: 'proof-3',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'Re: White-label capacity for NorthStar',
    emailBody: 'Hi Fiona...',
    followUps: [],
    stage: 'Replied',
    valueEst: 8500,
    timeline: [
      { date: '2026-10-24 10:10', event: 'Replied: Inquiring about November start date', actor: 'human' }
    ]
  },
  {
    id: 'lead-replied-04',
    company: 'HealthSync Portal',
    website: 'https://healthsync.io',
    personName: 'Daniel Craig',
    personRole: 'Co-Founder',
    email: 'daniel@healthsync.io',
    emailSource: 'PitchBook',
    country: 'United States',
    source: 'TechCrunch / PitchBook',
    sourceUrl: 'https://techcrunch.com',
    signalType: 'Funding News',
    signalText: 'Raised $1.5M for patient coordination MVP.',
    signalDate: '2026-10-18',
    score: 79,
    scoreReasons: [{ label: 'Replied with Figma link for estimation', weight: 35 }],
    icpId: 'funded-saas',
    offerId: 'mvp-6-weeks',
    foundAgo: '10d ago',
    foundAt: '2026-10-18',
    brief: 'Daniel shared their 12-page Figma prototype for a fixed price build quote.',
    recommendedProofId: 'proof-7',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'HealthSync Figma MVP Estimate',
    emailBody: 'Hi Daniel...',
    followUps: [],
    stage: 'Replied',
    valueEst: 29000,
    timeline: [
      { date: '2026-10-24 16:45', event: 'Replied: Sent Figma wireframes for estimate', actor: 'human' }
    ]
  },

  // Call Booked Stage (3 leads)
  {
    id: 'lead-booked-01',
    company: 'Kestrel Cargo Systems',
    website: 'https://kestrelcargo.com',
    personName: 'Tobias Fünke',
    personRole: 'Head of Operations & Logistics',
    email: 'tobias@kestrelcargo.com',
    emailSource: 'ClearSearch verified',
    country: 'United States',
    source: 'Hacker News (Ask HN)',
    sourceUrl: 'https://news.ycombinator.com',
    signalType: 'Hiring Post',
    signalText: 'Automating bill of lading ingestion from overseas carriers.',
    signalDate: '2026-10-15',
    score: 91,
    scoreReasons: [{ label: 'Discovery call confirmed via Cal.com', weight: 45 }],
    icpId: 'smb-ai-automation',
    offerId: 'ai-sprint',
    foundAgo: '13d ago',
    foundAt: '2026-10-15',
    brief: 'Tobias booked a 30-min discovery call for tomorrow at 16:00 (Asia/Dhaka). Reviewing their sample air waybill format.',
    recommendedProofId: 'proof-1',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'Discovery Call: AI Automation for Kestrel Cargo',
    emailBody: 'Confirmed call on calendar.',
    followUps: [],
    stage: 'Call booked',
    valueEst: 10500,
    timeline: [
      { date: '2026-10-26 15:00', event: 'Booked discovery call for Oct 29', actor: 'human' }
    ]
  },
  {
    id: 'lead-booked-02',
    company: 'CivicTech Solutions',
    website: 'https://civictech.co',
    personName: 'Gillian Jacobs',
    personRole: 'Managing Director',
    email: 'gillian@civictech.co',
    emailSource: 'ClearSearch verified',
    country: 'United Kingdom',
    source: 'Product Hunt Launch Comments',
    sourceUrl: 'https://producthunt.com',
    signalType: 'Product Hunt Launch',
    signalText: 'Looking for MVP partner to rewrite grant submission software.',
    signalDate: '2026-10-14',
    score: 86,
    scoreReasons: [{ label: 'Call scheduled with full leadership team', weight: 40 }],
    icpId: 'funded-saas',
    offerId: 'mvp-6-weeks',
    foundAgo: '14d ago',
    foundAt: '2026-10-14',
    brief: 'Call scheduled for Thursday with CEO and Product Lead. Preparing fixed-price 6-week breakdown.',
    recommendedProofId: 'proof-2',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'CivicTech MVP Discovery Call',
    emailBody: 'Confirmed call on calendar.',
    followUps: [],
    stage: 'Call booked',
    valueEst: 22000,
    timeline: [
      { date: '2026-10-25 11:00', event: 'Booked 45m technical scoping call', actor: 'human' }
    ]
  },
  {
    id: 'lead-booked-03',
    company: 'Monolith Creative London',
    website: 'https://monolithcreative.co.uk',
    personName: 'Rowan Atkinson',
    personRole: 'Managing Partner',
    email: 'rowan@monolithcreative.co.uk',
    emailSource: 'Clutch directory',
    country: 'United Kingdom',
    source: 'Agency RFP Feed',
    sourceUrl: 'https://clutch.co',
    signalType: 'Agency Referral',
    signalText: 'RFP for long-term white-label engineering retainer.',
    signalDate: '2026-10-12',
    score: 88,
    scoreReasons: [{ label: 'Discovery call booked with Managing Partner', weight: 40 }],
    icpId: 'agency-whitelabel',
    offerId: 'whitelabel-dev',
    foundAgo: '16d ago',
    foundAt: '2026-10-12',
    brief: 'Call on Friday to review their Q1 client roster and allocate 2 dedicated developers on 6-month retainer.',
    recommendedProofId: 'proof-3',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'White-label Dev Retainer Alignment Call',
    emailBody: 'Confirmed call on calendar.',
    followUps: [],
    stage: 'Call booked',
    valueEst: 16000,
    timeline: [
      { date: '2026-10-24 17:30', event: 'Booked Retainer Scoping Call', actor: 'human' }
    ]
  },

  // Proposal Stage (2 leads)
  {
    id: 'lead-prop-01',
    company: 'Stratum Wealth Portal',
    website: 'https://stratumwealth.com',
    personName: 'Charles Montgomery',
    personRole: 'CEO & Co-Founder',
    email: 'charles@stratumwealth.com',
    emailSource: 'PitchBook',
    country: 'United States',
    source: 'TechCrunch / PitchBook',
    sourceUrl: 'https://techcrunch.com',
    signalType: 'Funding News',
    signalText: 'Stratum raises $1.8M seed round for boutique wealth advisor platform.',
    signalDate: '2026-10-05',
    score: 93,
    scoreReasons: [{ label: 'Proposal sent: $32,000 MVP build in 6 weeks', weight: 50 }],
    icpId: 'funded-saas',
    offerId: 'mvp-6-weeks',
    foundAgo: '23d ago',
    foundAt: '2026-10-05',
    brief: 'Sent detailed 14-page statement of work for $32,000 fixed price. Meeting with board for approval this Wednesday.',
    recommendedProofId: 'proof-2',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'Stratum Wealth MVP Proposal & Architecture',
    emailBody: 'Proposal submitted.',
    followUps: [],
    stage: 'Proposal',
    valueEst: 32000,
    timeline: [
      { date: '2026-10-22 19:00', event: 'Proposal delivered ($32k fixed price)', actor: 'human' }
    ]
  },
  {
    id: 'lead-prop-02',
    company: 'Alpine Logistics AG',
    website: 'https://alpinelogistics.ch',
    personName: 'Beatrix Vogel',
    personRole: 'Head of Supply Chain Technology',
    email: 'beatrix.vogel@alpinelogistics.ch',
    emailSource: 'ClearSearch verified',
    country: 'Switzerland',
    source: 'Hacker News (Ask HN)',
    sourceUrl: 'https://news.ycombinator.com',
    signalType: 'Hiring Post',
    signalText: 'Automating multi-lingual Swiss customs declarations.',
    signalDate: '2026-10-02',
    score: 90,
    scoreReasons: [{ label: 'Proposal sent: €11,500 AI Automation Sprint', weight: 45 }],
    icpId: 'smb-ai-automation',
    offerId: 'ai-sprint',
    foundAgo: '26d ago',
    foundAt: '2026-10-02',
    brief: 'Proposal under final legal review by Swiss operations counsel.',
    recommendedProofId: 'proof-1',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'Alpine Logistics AI Sprint Agreement',
    emailBody: 'Proposal submitted.',
    followUps: [],
    stage: 'Proposal',
    valueEst: 12500,
    timeline: [
      { date: '2026-10-24 11:30', event: 'Sent SOW with European data clause', actor: 'human' }
    ]
  },

  // Won Stage (1 lead)
  {
    id: 'lead-won-01',
    company: 'Portline Global Freight',
    website: 'https://portlineglobal.co.uk',
    personName: 'Julian Sterling',
    personRole: 'Director of Freight Operations',
    email: 'julian@portlineglobal.co.uk',
    emailSource: 'ClearSearch verified',
    country: 'United Kingdom',
    source: 'Hacker News (Ask HN)',
    sourceUrl: 'https://news.ycombinator.com',
    signalType: 'Hiring Post',
    signalText: 'Need automated document processing for Southampton terminal.',
    signalDate: '2026-09-15',
    score: 95,
    scoreReasons: [{ label: 'Deal closed: $11,500 AI Automation Sprint', weight: 50 }],
    icpId: 'smb-ai-automation',
    offerId: 'ai-sprint',
    foundAgo: '43d ago',
    foundAt: '2026-09-15',
    brief: 'Won deal. Completed 2-week sprint and converted into case study (Proof #1).',
    recommendedProofId: 'proof-1',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'Kickoff: Portline Global Freight AI Sprint',
    emailBody: 'Project completed successfully.',
    followUps: [],
    stage: 'Won',
    valueEst: 11500,
    timeline: [
      { date: '2026-09-28', event: 'Contract signed & deposit paid ($11,500)', actor: 'human' },
      { date: '2026-10-12', event: 'Delivered production system to Portline', actor: 'human' }
    ]
  },

  // Lost Stage (2 leads)
  {
    id: 'lead-lost-01',
    company: 'QuickCourier App',
    website: 'https://quickcourier.test',
    personName: 'Samir Patel',
    personRole: 'Solo Founder',
    email: 'samir@quickcourier.test',
    emailSource: 'Reddit DM',
    country: 'United Kingdom',
    source: 'Reddit r/startups',
    sourceUrl: 'https://reddit.com',
    signalType: 'Reddit Problem',
    signalText: 'Need app built for bike messengers.',
    signalDate: '2026-09-20',
    score: 61,
    scoreReasons: [{ label: 'Budget disqualifier', weight: -25 }],
    icpId: 'nontech-founder',
    offerId: 'mvp-6-weeks',
    foundAgo: '38d ago',
    foundAt: '2026-09-20',
    brief: 'Lost due to budget mismatch ($3,000 budget for complex dispatch app).',
    recommendedProofId: 'proof-2',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'Re: QuickCourier scoping',
    emailBody: 'Budget mismatch.',
    followUps: [],
    stage: 'Lost',
    lostReason: 'Budget under minimum threshold ($3k budget vs $18k minimum)',
    valueEst: 3000,
    timeline: [
      { date: '2026-09-25', event: 'Disqualified on budget constraints', actor: 'human' }
    ]
  },
  {
    id: 'lead-lost-02',
    company: 'FinTrack Europe',
    website: 'https://fintrack.de',
    personName: 'Klaus Schmidt',
    personRole: 'Head of Engineering',
    email: 'klaus@fintrack.de',
    emailSource: 'ClearSearch verified',
    country: 'Germany',
    source: 'Indeed Hiring Feed',
    sourceUrl: 'https://indeed.com',
    signalType: 'Hiring Post',
    signalText: 'Hiring internal full-stack team.',
    signalDate: '2026-09-28',
    score: 74,
    scoreReasons: [{ label: 'Decided on internal hire', weight: -20 }],
    icpId: 'funded-saas',
    offerId: 'mvp-6-weeks',
    foundAgo: '30d ago',
    foundAt: '2026-09-28',
    brief: 'Klaus decided to keep development entirely in-house after hiring an internal tech lead.',
    recommendedProofId: 'proof-2',
    siteAudit: [],
    checks: [{ id: 'c1', label: 'All checks passed', passed: true }],
    emailSubject: 'Re: FinTrack engineering sprint',
    emailBody: 'Went with internal hire.',
    followUps: [],
    stage: 'Lost',
    lostReason: 'Hired internal full-time engineering lead',
    valueEst: 20000,
    timeline: [
      { date: '2026-10-10', event: 'Lead notified they filled the position internally', actor: 'human' }
    ]
  }
];
