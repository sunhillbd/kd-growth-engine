import { SourceCollector, SearchPlan } from '../types';

export const initialSources: SourceCollector[] = [
  {
    id: 'src-1',
    name: 'Hacker News (Ask HN & Who is Hiring)',
    type: 'Community Forum Scanner',
    enabled: true,
    lastRun: '18 mins ago',
    items7d: 142,
    leads7d: 18,
    health: 'Healthy',
    schedule: 'Every 30 minutes'
  },
  {
    id: 'src-2',
    name: 'Indeed & ATS Hiring Feeds',
    type: 'Job Board Scraping',
    enabled: true,
    lastRun: '24 mins ago',
    items7d: 186,
    leads7d: 14,
    health: 'Healthy',
    schedule: 'Every 1 hour'
  },
  {
    id: 'src-3',
    name: 'Reddit Scanner (r/startups, r/SaaS, r/logistics)',
    type: 'Subreddit Keyword Stream',
    enabled: true,
    lastRun: '12 mins ago',
    items7d: 94,
    leads7d: 9,
    health: 'Healthy',
    schedule: 'Every 15 minutes'
  },
  {
    id: 'src-4',
    name: 'Agency RFP Boards (Clutch & Directory RFPs)',
    type: 'B2B Directory Feed',
    enabled: true,
    lastRun: '45 mins ago',
    items7d: 48,
    leads7d: 8,
    health: 'Healthy',
    schedule: 'Every 2 hours'
  },
  {
    id: 'src-5',
    name: 'Funding News (TechCrunch & PitchBook)',
    type: 'Venture Capital RSS & API',
    enabled: false,
    lastRun: '2 hours ago',
    items7d: 64,
    leads7d: 6,
    health: 'Failing',
    errorMessage: 'HTTP 429 Too Many Requests: Rate limit quota exceeded on PitchBook syndication feed. Exponential backoff retry scheduled in 38 minutes.',
    schedule: 'Every 1 hour'
  },
  {
    id: 'src-6',
    name: 'Product Hunt Launch & Comments',
    type: 'Product Launch Webhook',
    enabled: true,
    lastRun: '32 mins ago',
    items7d: 58,
    leads7d: 5,
    health: 'Healthy',
    schedule: 'Every 1 hour'
  },
  {
    id: 'src-7',
    name: 'Contract & Tech Stack Change Feeds',
    type: 'Public Repository & DNS Monitor',
    enabled: true,
    lastRun: '50 mins ago',
    items7d: 38,
    leads7d: 3,
    health: 'Healthy',
    schedule: 'Every 4 hours'
  }
];

export const initialSearchPlans: SearchPlan[] = [
  {
    id: 'plan-1',
    icpId: 'smb-ai-automation',
    sourceId: 'src-1',
    sourceName: 'Hacker News',
    query: '"parse PDF" OR "customs manifest" OR "OCR extraction" OR "automate invoices"',
    signalsFound: 68,
    leadsProduced: 12,
    replyRate: 22.4
  },
  {
    id: 'plan-2',
    icpId: 'funded-saas',
    sourceId: 'src-2',
    sourceName: 'Indeed & ATS Feeds',
    query: '"Founding Engineer" AND ("Next.js" OR "React") AND "open for >30 days"',
    signalsFound: 92,
    leadsProduced: 16,
    replyRate: 14.8
  },
  {
    id: 'plan-3',
    icpId: 'agency-whitelabel',
    sourceId: 'src-4',
    sourceName: 'Agency RFP Boards',
    query: '"white-label" OR "white label dev" OR "external engineering partner" OR "React partner"',
    signalsFound: 34,
    leadsProduced: 8,
    replyRate: 17.5
  },
  {
    id: 'plan-4',
    icpId: 'funded-saas',
    sourceId: 'src-5',
    sourceName: 'Funding News',
    query: '"Seed round" AND ("$1M" OR "$2M" OR "$3M") AND ("B2B" OR "fintech" OR "logistics")',
    signalsFound: 52,
    leadsProduced: 7,
    replyRate: 0.0
  },
  {
    id: 'plan-5',
    icpId: 'smb-ai-automation',
    sourceId: 'src-3',
    sourceName: 'Reddit Scanner',
    query: 'subreddit:logistics "manual entry" OR "automation" OR "CargoWise" OR "spreadsheet bottleneck"',
    signalsFound: 41,
    leadsProduced: 9,
    replyRate: 25.0
  }
];

export const suggestedKeywordsFromClearSearch = [
  { id: 'k1', keyword: 'EDI 214 freight parsing', monthlyVolume: '320 searches', competition: 'Low', intent: 'High Commercial' },
  { id: 'k2', keyword: 'outsource MVP development fixed price', monthlyVolume: '890 searches', competition: 'Medium', intent: 'High Commercial' },
  { id: 'k3', keyword: 'white label React developers for agencies', monthlyVolume: '450 searches', competition: 'Low', intent: 'High Commercial' },
  { id: 'k4', keyword: 'automate PDF invoice entry into NetSuite', monthlyVolume: '610 searches', competition: 'Low', intent: 'High Commercial' },
  { id: 'k5', keyword: 'emergency dev team to finish SaaS MVP', monthlyVolume: '280 searches', competition: 'Low', intent: 'Urgent Pain' },
  { id: 'k6', keyword: 'hire founding engineer contractor remote', monthlyVolume: '1,200 searches', competition: 'High', intent: 'Commercial' }
];
