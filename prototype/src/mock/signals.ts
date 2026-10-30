import { Signal } from '../types';

export const initialSignals: Signal[] = [
  {
    id: 'sig-01',
    source: 'Hacker News (Ask HN)',
    sourceUrl: 'https://news.ycombinator.com/item?id=41892011',
    companyName: 'AeroTrans Logistics',
    textSnippet: 'Ask HN: How are mid-size freight brokers handling automated parsing of messy PDF customs documents? Looking for a boutique engineering team or proven tool.',
    signalType: 'Hiring Post',
    relevanceScore: 92,
    status: 'lead',
    foundAt: '2026-10-28 06:14 (Asia/Dhaka)',
    authorOrContact: 'Marcus Vance (VP Ops)'
  },
  {
    id: 'sig-02',
    source: 'TechCrunch / PitchBook',
    sourceUrl: 'https://techcrunch.com/2026/10/26/orbitfin-raises-2m-seed-for-credit-automation',
    companyName: 'OrbitFin Tech',
    textSnippet: 'OrbitFin announces $2.1M Seed round led by PointNine. Looking to ship MVP of embedded invoice financing engine before January Q1 rollout.',
    signalType: 'Funding News',
    relevanceScore: 89,
    status: 'lead',
    foundAt: '2026-10-27 18:40 (Asia/Dhaka)',
    authorOrContact: 'Elena Rostova (Co-Founder)'
  },
  {
    id: 'sig-03',
    source: 'Indeed Hiring Feed',
    sourceUrl: 'https://indeed.com/job/founding-full-stack-engineer-meridian',
    companyName: 'Meridian Supply',
    textSnippet: 'Hiring: Senior Full-Stack Engineer (React/Node). Job open for 64 days. Building custom inventory allocation platform for B2B industrial catalog.',
    signalType: 'Hiring Post',
    relevanceScore: 84,
    status: 'lead',
    foundAt: '2026-10-27 12:15 (Asia/Dhaka)',
    authorOrContact: 'Liam Walker (CTO)'
  },
  {
    id: 'sig-04',
    source: 'Agency RFP Feed',
    sourceUrl: 'https://clutch.co/rfp/canvas-creative-interactive-portal',
    companyName: 'Canvas Creative Studio',
    textSnippet: 'Looking for vetted white-label engineering partner for a 4-month enterprise client React portal build. Must operate under agency NDA.',
    signalType: 'Agency Referral',
    relevanceScore: 81,
    status: 'lead',
    foundAt: '2026-10-27 09:30 (Asia/Dhaka)',
    authorOrContact: 'Chloe Laurent (Head of Digital)'
  },
  {
    id: 'sig-05',
    source: 'Reddit r/startups',
    sourceUrl: 'https://reddit.com/r/startups/comments/192klx/looking_for_dev_shop_to_finish_mvp',
    companyName: 'TenancyOps Software',
    textSnippet: 'Our outsourced dev team vanished with 80% done code. Looking for reliable studio in US/UK/EU time zones to take our property triage app to launch.',
    signalType: 'Reddit Problem',
    relevanceScore: 78,
    status: 'lead',
    foundAt: '2026-10-26 21:05 (Asia/Dhaka)',
    authorOrContact: 'Brian Miller (Founder)'
  },
  {
    id: 'sig-06',
    source: 'Product Hunt Launch Comments',
    sourceUrl: 'https://producthunt.com/posts/docflow-v1',
    companyName: 'DocFlow Technologies',
    textSnippet: 'We shipped v1 today but the backend OCR extraction is too slow for commercial contracts. Evaluating external engineering partners for an overhaul.',
    signalType: 'Product Hunt Launch',
    relevanceScore: 75,
    status: 'unprocessed',
    foundAt: '2026-10-26 15:40 (Asia/Dhaka)',
    authorOrContact: 'Sophia Zhang'
  },
  {
    id: 'sig-07',
    source: 'Hacker News (Who is Hiring)',
    sourceUrl: 'https://news.ycombinator.com/item?id=41850020',
    companyName: 'Quantix Analytics',
    textSnippet: 'Quantix is hiring contract Python / React developers for 3 months to build customer portal. Remote friendly.',
    signalType: 'Hiring Post',
    relevanceScore: 74,
    status: 'unprocessed',
    foundAt: '2026-10-26 11:20 (Asia/Dhaka)',
    authorOrContact: 'Julian Meyer'
  },
  {
    id: 'sig-08',
    source: 'Reddit r/SaaS',
    sourceUrl: 'https://reddit.com/r/SaaS/comments/191abc/need_advice_on_document_parsing_llm',
    companyName: 'ClaimRight Adjusting',
    textSnippet: 'Spent 2 weeks trying to get LangChain to reliably extract insurance line items from scanned tables. It hallucinates row totals. Has anyone hired a studio for this?',
    signalType: 'Reddit Problem',
    relevanceScore: 86,
    status: 'unprocessed',
    foundAt: '2026-10-25 19:10 (Asia/Dhaka)',
    authorOrContact: 'Danielle Brooks'
  },
  {
    id: 'sig-09',
    source: 'Agency RFP Feed',
    sourceUrl: 'https://agencydirectories.com/opp/39812',
    companyName: 'Vanguard Brand Co',
    textSnippet: 'Seeking white-label tech partner to support our luxury hospitality clients. Need headless Shopify + custom Next.js loyalty portals.',
    signalType: 'Agency Referral',
    relevanceScore: 82,
    status: 'unprocessed',
    foundAt: '2026-10-25 14:00 (Asia/Dhaka)',
    authorOrContact: 'Tom Sterling'
  },
  {
    id: 'sig-10',
    source: 'TechCrunch / PitchBook',
    sourceUrl: 'https://techcrunch.com/2026/10/24/omnilog-seed',
    companyName: 'OmniLog Freight',
    textSnippet: 'OmniLog secures $1.8M seed round from London seed syndicate. Focus will be on automating carrier dispatches and driver bill reconciliation.',
    signalType: 'Funding News',
    relevanceScore: 83,
    status: 'unprocessed',
    foundAt: '2026-10-25 08:30 (Asia/Dhaka)',
    authorOrContact: 'Arthur Pendelton'
  },
  {
    id: 'sig-11',
    source: 'Reddit r/webdev',
    sourceUrl: 'https://reddit.com/r/webdev/comments/190xyz/can_anyone_recommend_good_agency',
    companyName: 'Local Gym Chain',
    textSnippet: 'Need a simple brochure website with hours and pricing. Budget is $400.',
    signalType: 'Reddit Problem',
    relevanceScore: 24,
    status: 'dropped',
    foundAt: '2026-10-24 18:00 (Asia/Dhaka)',
    authorOrContact: 'GymOwner99'
  },
  {
    id: 'sig-12',
    source: 'Indeed Hiring Feed',
    sourceUrl: 'https://indeed.com/job/senior-wordpress-developer-apex',
    companyName: 'Apex Media Group',
    textSnippet: 'Looking for part time developer to update WordPress plugins and PHP 7 to PHP 8.',
    signalType: 'Hiring Post',
    relevanceScore: 32,
    status: 'dropped',
    foundAt: '2026-10-24 16:15 (Asia/Dhaka)',
    authorOrContact: 'HR Apex'
  },
  // Additional signals to simulate 60 realistic signals
  ...Array.from({ length: 48 }).map((_, i) => {
    const num = i + 13;
    const sources = ['Reddit r/logistics', 'Hacker News (Ask HN)', 'Indeed Hiring Feed', 'Product Hunt Launch Comments', 'TechCrunch / PitchBook', 'Agency RFP Feed'];
    const types: Signal['signalType'][] = ['Hiring Post', 'Funding News', 'Reddit Problem', 'Product Hunt Launch', 'Agency Referral', 'Tech Stack Change'];
    const companies = ['Zephyr Freight', 'NordicPay', 'Kite Health', 'BluePeak Capital', 'Solas Legal', 'Forma Studio', 'Elevate AI', 'CivicMesh', 'Beacon Warehousing', 'TraceLogix'];
    const src = sources[i % sources.length];
    const comp = companies[i % companies.length] + ' ' + (num > 30 ? 'Inc.' : 'LLC');
    const score = 45 + ((i * 7) % 48);
    const status: Signal['status'] = score > 80 && i % 3 === 0 ? 'lead' : (score < 50 ? 'dropped' : 'unprocessed');

    return {
      id: `sig-${num}`,
      source: src,
      sourceUrl: `https://example.com/signals/${num}`,
      companyName: comp,
      textSnippet: `Signal report #${num}: Evaluating automated workflows and engineering partners to scale operations for ${comp}. Seeking US/UK time zone support.`,
      signalType: types[i % types.length],
      relevanceScore: score,
      status: status,
      foundAt: `2026-10-${Math.max(1, 28 - Math.floor(i / 2)).toString().padStart(2, '0')} 10:${(i * 3) % 60} (Asia/Dhaka)`,
      authorOrContact: `Contact Lead #${num}`
    };
  })
];
