import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, AlertTriangle, CheckSquare, Users, Lightbulb } from 'lucide-react';
import { SetupChecklist } from './SetupChecklist';

export const OverviewPage: React.FC = () => {
  const { leads, posts, proposals, sources, activity } = useStore();

  const leadsToApprove = leads.filter(l => l.stage === 'Qualified').length;
  const postsToApprove = posts.filter(p => p.status === 'Needs approval').length;
  const proposalsToReview = proposals.filter(p => p.status === 'pending').length;
  const sourcesWithErrors = sources.filter(s => s.health === 'Failing').length;

  const funnelStages = [
    { stage: 'Signals collected', count: 600, prevPercent: '100.0%' },
    { stage: 'Qualified by agent', count: 90, prevPercent: '15.0%' },
    { stage: 'Approved by human', count: 55, prevPercent: '61.1%' },
    { stage: 'Contacted via outreach', count: 52, prevPercent: '94.5%' },
    { stage: 'Positive replies received', count: 7, prevPercent: '13.5%' },
    { stage: 'Discovery calls booked', count: 3, prevPercent: '42.9%' },
    { stage: 'Closed deals (Won)', count: 1, prevPercent: '33.3%' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Setup Checklist (Dismissible) */}
      <SetupChecklist />

      {/* 1. "Needs you" list at the top */}
      <section className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
            Needs Your Attention
          </h2>
          <span className="text-[11px] font-mono text-gray-500">
            {leadsToApprove + postsToApprove + proposalsToReview + sourcesWithErrors} items waiting
          </span>
        </div>

        <div className="divide-y divide-gray-100 text-xs sm:text-sm">
          {/* Leads to approve */}
          <Link
            to="/leads/queue"
            className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-blue-600 shrink-0" strokeWidth={1.5} />
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-blue-600">
                  Leads waiting for approval
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  Review buying signals, site audits, and drafted first touchpoints
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono tabular-nums text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                {leadsToApprove} waiting
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </div>
          </Link>

          {/* Posts to approve */}
          <Link
            to="/publish?tab=approvals"
            className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={1.5} />
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-amber-700">
                  Social posts waiting for approval
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  LinkedIn and X drafts scheduled for this week
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono tabular-nums text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                {postsToApprove} waiting
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </div>
          </Link>

          {/* Proposals to review */}
          <Link
            to="/insights"
            className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Lightbulb className="w-4 h-4 text-purple-600 shrink-0" strokeWidth={1.5} />
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-purple-700">
                  Agent strategy proposals to review
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  Data-backed suggestions on source allocations and copy angles
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono tabular-nums text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
                {proposalsToReview} proposals
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </div>
          </Link>

          {/* Sources with errors */}
          <Link
            to="/leads/sources"
            className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-4 h-4 shrink-0 ${sourcesWithErrors > 0 ? 'text-rose-600' : 'text-gray-400'}`} strokeWidth={1.5} />
              <div>
                <span className={`font-semibold ${sourcesWithErrors > 0 ? 'text-gray-900 group-hover:text-rose-600' : 'text-gray-600'}`}>
                  Collector sources with errors
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {sourcesWithErrors > 0 ? 'Funding news stream rate-limited (HTTP 429)' : 'All 7 collectors operational'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-mono tabular-nums text-xs px-2 py-0.5 rounded font-semibold border ${
                sourcesWithErrors > 0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                {sourcesWithErrors} errors
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </div>
          </Link>
        </div>
      </section>

      {/* 2. One row of 4 plain numbers for the last 30 days */}
      <section className="bg-white border border-gray-200 rounded-[6px] p-5">
        <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-gray-500 mb-4">
          Last 30 Days (Rolling Window)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="pt-2 md:pt-0">
            <div className="text-2xl font-bold font-mono tabular-nums text-gray-900">
              55
            </div>
            <div className="text-xs text-gray-500 mt-1">Leads approved</div>
          </div>
          <div className="pt-2 md:pt-0 md:pl-6">
            <div className="text-2xl font-bold font-mono tabular-nums text-gray-900">
              52
            </div>
            <div className="text-xs text-gray-500 mt-1">Messages sent</div>
          </div>
          <div className="pt-2 md:pt-0 md:pl-6">
            <div className="text-2xl font-bold font-mono tabular-nums text-gray-900">
              7
            </div>
            <div className="text-xs text-gray-500 mt-1">Replies received</div>
          </div>
          <div className="pt-2 md:pt-0 md:pl-6">
            <div className="text-2xl font-bold font-mono tabular-nums text-gray-900">
              3
            </div>
            <div className="text-xs text-gray-500 mt-1">Calls booked</div>
          </div>
        </div>
      </section>

      {/* 3. Funnel Table + Recent Activity (2 column grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funnel Table */}
        <section className="lg:col-span-7 bg-white border border-gray-200 rounded-[6px] overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
              Conversion Funnel
            </h2>
            <span className="text-[11px] font-mono text-gray-500">
              N=600 total signals
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-gray-500 font-medium">
                  <th className="py-2.5 px-4 font-normal">Funnel Stage</th>
                  <th className="py-2.5 px-4 font-normal text-right">Count</th>
                  <th className="py-2.5 px-4 font-normal text-right">% of Previous</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {funnelStages.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors h-10">
                    <td className="py-2 px-4 text-gray-900 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span className="font-medium">{row.stage}</span>
                    </td>
                    <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-800">
                      {row.count}
                    </td>
                    <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-600">
                      {row.prevPercent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Recent Activity (Last 10 events) */}
        <section className="lg:col-span-5 bg-white border border-gray-200 rounded-[6px] overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
              Recent Activity
            </h2>
            <span className="text-[11px] font-mono text-gray-500">
              Last 10 events
            </span>
          </div>

          <div className="divide-y divide-gray-100 overflow-y-auto max-h-[340px] text-xs">
            {activity.slice(0, 10).map(evt => (
              <div key={evt.id} className="p-3 hover:bg-gray-50 transition-colors flex items-start gap-3">
                <span className="font-mono tabular-nums text-gray-400 shrink-0 text-[11px] mt-0.5">
                  {evt.timestamp}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 leading-snug">
                    {evt.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] uppercase font-mono px-1 py-0.2 rounded border ${
                      evt.actor === 'agent' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : evt.actor === 'human'
                        ? 'bg-gray-100 text-gray-700 border-gray-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {evt.actor}
                    </span>
                    {evt.link && (
                      <Link to={evt.link} className="text-[11px] text-blue-600 hover:underline">
                        View item →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
