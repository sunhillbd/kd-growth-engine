import React, { useState } from 'react';
import { Search, Check, Copy, Bookmark, ExternalLink, Filter } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface StudioPattern {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  avgReplyRate: string;
  bestFor: string;
  checklist: string[];
  sampleHook: string;
  fullExample: string;
}

const STUDIO_PATTERNS: StudioPattern[] = [
  {
    id: 'pat-1',
    name: 'Contrarian breakdown',
    description: 'Directly reframes common startup or engineering misconceptions using production evidence.',
    targetAudience: 'Seed SaaS Founders, Early CTOs',
    avgReplyRate: '14.8%',
    bestFor: 'Challenging over-hiring or premature microservice adoption',
    checklist: [
      'States bold counter-intuitive claim in first 10 words',
      'Exposes the hidden operational or monetary cost',
      'Contrasts with standard agency advice',
      'Provides our studio rule as the solution'
    ],
    sampleHook: 'Why seed founders burn $120k recruiting engineers before shipping MVP',
    fullExample: `Most seed founders spend their first 4 months doing the exact same thing:\n\n1. Post a Founding Engineer job on LinkedIn\n2. Sift through 400 resume submissions\n3. Interview 25 candidates\n4. Offer declined due to salary or equity mismatch\n5. Repeat\n\nMeanwhile, 4 months of runway has evaporated, and zero real customers have touched the product.\n\nFor PayLedger ($1.2M seed), we delivered their entire multi-tenant billing engine in 5 weeks. Validate your product with paying customers first.`
  },
  {
    id: 'pat-2',
    name: 'Before/After benchmark',
    description: 'Quantifies concrete operational delays against post-automation speed and accuracy.',
    targetAudience: 'Heads of Operations, Logistics & Agency Founders',
    avgReplyRate: '18.2%',
    bestFor: 'Demonstrating ROI on back-office AI and API automation',
    checklist: [
      'Baseline metric explicitly quantified (hours / error %)',
      'Identifies the exact manual friction point',
      'Explains technical pipeline deployed',
      'Final verified benchmark delivered'
    ],
    sampleHook: 'How we cut invoice processing from 36 hours to 4 minutes with a document pipeline',
    fullExample: `A freight client was spending 18 hours a week manually copy-pasting shipment manifests from email PDFs into an internal inventory sheet.\n\nWe deployed a webhook parser and queued background job in 10 days. The processing time went from 36 hours of human delay to 2.4 seconds per file.`
  },
  {
    id: 'pat-3',
    name: 'Architecture teardown',
    description: 'Deep technical explanation of failure modes, database bottlenecks, or resilient pipelines.',
    targetAudience: 'Technical Co-founders, VP Engineering, CTOs',
    avgReplyRate: '11.5%',
    bestFor: 'Proving studio technical authority and rigor',
    checklist: [
      'Specific failure state described (deadlocks, 429 caps, table locks)',
      'Underlying database or queue reason exposed',
      'Guardrail or idempotency schema provided',
      'Production lesson learned'
    ],
    sampleHook: 'The hidden database deadlocks destroying B2B billing portals on the 1st of the month',
    fullExample: `On the 1st of every month, Stripe fires 5,000 webhook events within 60 seconds. If your database transactions lack row-level locking and idempotent receipt tables, you get race conditions and double invoices.\n\nHere is the PostgreSQL transaction structure we use across our studio clients.`
  },
  {
    id: 'pat-4',
    name: 'Cost dissection',
    description: 'Unflinching financial breakdown of in-house team costs vs dedicated studio sprints.',
    targetAudience: 'Managing Directors, Bootstrapped & Funded Founders',
    avgReplyRate: '16.4%',
    bestFor: 'Overcoming price objections on MVP and sprint packages',
    checklist: [
      'Lists direct hiring costs (salary, taxes, equity)',
      'Reveals hidden delay costs (4 months recruitment time)',
      'Shows fixed-scope studio sprint alternative',
      'Calculates total net runway preserved'
    ],
    sampleHook: 'What an MVP actually costs in 2026: Real studio balance sheet breakdown',
    fullExample: `Early-stage founders get quoted two extremes: $3,000 from a freelancer who will disappear in 3 weeks, or $150,000 from a 40-person agency with 3 account managers.\n\nHere is an honest breakdown of what building a production-ready, security-cleared web and mobile MVP actually costs in 2026.`
  },
  {
    id: 'pat-5',
    name: 'Step-by-step framework',
    description: 'Actionable architectural steps that readers can save and apply immediately.',
    targetAudience: 'Senior Developers, Product Engineers',
    avgReplyRate: '12.0%',
    bestFor: 'Generating high bookmarking and algorithmic distribution',
    checklist: [
      'Clear sequential numbering (Step 1 to 4)',
      'Zero fluff; high technical specificity',
      'Mentions real tools and libraries used in production',
      'Offers code or architectural advice'
    ],
    sampleHook: 'The 4-layer security checklist for production enterprise AI agents',
    fullExample: `Before letting an AI agent trigger production database updates, enforce these 4 security rings: 1) Deterministic JSON schema verification, 2) Read-only execution sandboxes, 3) Human confirmation thresholds on destructive actions, 4) Immutable audit logs.`
  },
  {
    id: 'pat-6',
    name: 'Founder lesson',
    description: 'Transparent lessons learned from delivering 6-week MVPs in high-stakes environments.',
    targetAudience: 'Agency Owners, Startup Founders',
    avgReplyRate: '15.1%',
    bestFor: 'Building founder-to-founder trust and authentic relationship building',
    checklist: [
      'Recounts real client scenario without naming client if confidential',
      'Explains what went wrong or what surprise emerged',
      'The policy or technical change established as a result',
      'Direct recommendation to peers'
    ],
    sampleHook: 'Why we rejected a $60k contract because the client didn’t need custom code',
    fullExample: `Last month a logistics founder came to us with a $60,000 budget to build a custom dispatch portal from scratch.\n\nAfter reviewing their operational requirements, we realized they could achieve 95% of their goals using off-the-shelf SaaS and two custom webhook automations.\n\nWe sent them to an existing provider and charged them zero dollars. A good studio tells you when NOT to write code.`
  }
];

export const PatternsPage: React.FC = () => {
  const { showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<StudioPattern>(STUDIO_PATTERNS[0]);

  const filteredPatterns = STUDIO_PATTERNS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.bestFor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied hook template to clipboard');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-bold text-gray-900 tracking-tight">
            Patterns & Swipe File
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Empirical content structures, tested hook formulas, and studio swipe references.
          </p>
        </div>

        <div className="w-64 relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search patterns..."
            className="w-full text-xs rounded border border-gray-300 pl-8 pr-3 py-1.5 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Pattern Selector List */}
        <div className="w-80 border-r border-gray-200 bg-gray-50/50 overflow-y-auto divide-y divide-gray-100 shrink-0">
          {filteredPatterns.map(p => {
            const isSelected = selectedPattern.id === p.id;

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPattern(p)}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-white border-l-3 border-l-blue-600 shadow-2xs' 
                    : 'hover:bg-gray-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900">
                    {p.name}
                  </h3>
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {p.avgReplyRate} reply
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 line-clamp-2 mt-1 leading-snug">
                  {p.description}
                </p>
                <div className="text-[10px] text-gray-400 font-mono mt-2">
                  Best for: {p.bestFor}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Pattern Breakdown & Swipe View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          <div className="flex items-start justify-between border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">
                  {selectedPattern.name}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  Avg Reply Rate: {selectedPattern.avgReplyRate}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 max-w-xl">
                {selectedPattern.description}
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(selectedPattern.sampleHook)}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5 shadow-xs"
            >
              <Copy className="w-3.5 h-3.5 text-gray-500" />
              <span>Copy hook</span>
            </button>
          </div>

          {/* Structure Checklist */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 font-semibold">
              Pattern Structure Checklist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedPattern.checklist.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded border border-gray-200 bg-gray-50 flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-gray-800 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Hook & Example */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 font-semibold">
              Live Studio Example
            </h3>
            <div className="p-4 rounded-[6px] border border-gray-200 bg-gray-50/70 space-y-3 font-sans">
              <div className="text-xs font-bold text-gray-900 border-b border-gray-200/60 pb-2">
                Hook: "{selectedPattern.sampleHook}"
              </div>
              <pre className="text-xs text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {selectedPattern.fullExample}
              </pre>
            </div>
          </div>

          {/* Target Audience & Strategy */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded border border-gray-200 bg-white">
              <span className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-1">
                Target Audience
              </span>
              <span className="text-xs font-semibold text-gray-900">
                {selectedPattern.targetAudience}
              </span>
            </div>

            <div className="p-3.5 rounded border border-gray-200 bg-white">
              <span className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-1">
                Optimal Usage
              </span>
              <span className="text-xs font-semibold text-gray-900">
                {selectedPattern.bestFor}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
