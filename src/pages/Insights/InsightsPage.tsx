import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { proposalDecisionHistory } from '../../mock/proposals';
import { Modal } from '../../components/common/Modal';
import { Check, X, Lightbulb, AlertCircle } from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'proposals' ? 'proposals' : 'performance';
  const [activeTab, setActiveTab] = useState<'performance' | 'proposals'>(initialTab);

  const { proposals, acceptProposal, rejectProposal } = useStore();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Insufficient confidence interval');

  // Performance Table 1: Channel & ICP Performance (with horizontal bars inside cells)
  const channelData = [
    { entity: 'Hacker News (Ask HN)', type: 'Source', sampleSize: 28, replyRate: 25.0, winRate: 7.1 },
    { entity: 'Reddit (r/logistics, r/startups)', type: 'Source', sampleSize: 18, replyRate: 22.2, winRate: 5.5 },
    { entity: 'Agency RFP Feeds (Clutch)', type: 'Source', sampleSize: 14, replyRate: 14.2, winRate: 7.1 },
    { entity: 'Indeed Senior Requisitions', type: 'Source', sampleSize: 32, replyRate: 12.5, winRate: 3.1 },
    { entity: 'SMB AI Automation ICP', type: 'ICP', sampleSize: 32, replyRate: 18.7, winRate: 6.2 },
    { entity: 'Funded SaaS MVP ICP', type: 'ICP', sampleSize: 38, replyRate: 15.8, winRate: 5.2 },
    { entity: 'Agency White-label Dev ICP', type: 'ICP', sampleSize: 14, replyRate: 14.2, winRate: 7.1 },
    { entity: 'Funding News (PitchBook)', type: 'Source', sampleSize: 40, replyRate: 0.0, winRate: 0.0 },
    { entity: 'Non-technical Founder ICP', type: 'ICP', sampleSize: 8, replyRate: 12.5, winRate: 0.0 }, // under 10
    { entity: 'Product Hunt Launch Feed', type: 'Source', sampleSize: 6, replyRate: 16.6, winRate: 0.0 }, // under 10
  ];

  // Performance Table 2: Content Topics & Inbound Conversions
  const topicData = [
    { topic: 'Freight & Customs Automated Extraction', format: 'Case study', sampleSize: 4, impressions: 3420, inbounds: 6, conversion: 0.17 },
    { topic: 'Why Waiting to Hire Engineers Delays Seed Startups', format: 'LinkedIn post', sampleSize: 6, impressions: 4890, inbounds: 8, conversion: 0.16 },
    { topic: 'Agency White-label Scaling Without Bloating Payroll', format: 'LinkedIn post', sampleSize: 3, impressions: 2180, inbounds: 4, conversion: 0.18 },
    { topic: 'LLM Document Parsing Architecture Breakdown', format: 'Carousel', sampleSize: 2, impressions: 1950, inbounds: 3, conversion: 0.15 },
    { topic: 'Generic AI Chat Tools vs Production Automation', format: 'X thread', sampleSize: 5, impressions: 1200, inbounds: 1, conversion: 0.08 },
    { topic: 'Solo Founder Idea Validation Sprints', format: 'X thread', sampleSize: 2, impressions: 840, inbounds: 0, conversion: 0.00 } // under 10
  ];

  const handleOpenRejectModal = (id: string) => {
    setSelectedProposalId(id);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedProposalId) return;
    rejectProposal(selectedProposalId, rejectReason);
    setRejectModalOpen(false);
  };

  const pendingProposals = proposals.filter(p => p.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Insights & Conversion Analytics</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Empirical conversion rates by channel and data-backed strategy proposals.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6">
        <button
          onClick={() => setActiveTab('performance')}
          className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'performance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Channel & Content Performance
        </button>
        <button
          onClick={() => setActiveTab('proposals')}
          className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'proposals'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Agent Proposals ({pendingProposals.length} pending)
        </button>
      </div>

      {activeTab === 'performance' ? (
        <div className="space-y-6">
          {/* Table 1: Source & ICP Conversion Rates */}
          <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
                  Reply and Win Rate by Signal Source and ICP
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Shows conversion from outreach step 1 to positive reply and closed deal. Sample size shown per row.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-gray-500 font-medium">
                    <th className="py-2.5 px-4 font-normal">Segment / Collector</th>
                    <th className="py-2.5 px-4 font-normal">Type</th>
                    <th className="py-2.5 px-4 font-normal text-right">Sample Size</th>
                    <th className="py-2.5 px-4 font-normal w-56">Reply Rate %</th>
                    <th className="py-2.5 px-4 font-normal w-48">Win Rate %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {channelData.map((row, idx) => {
                    const isLowSample = row.sampleSize < 10;
                    return (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors h-11">
                        <td className="py-2 px-4 font-medium text-gray-900 flex items-center gap-2">
                          <span>{row.entity}</span>
                          {isLowSample && (
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              Low sample
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-gray-500 font-mono text-[11px]">
                          {row.type}
                        </td>
                        <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-700">
                          N={row.sampleSize}
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(100, row.replyRate * 3.5)}%` }}
                              ></div>
                            </div>
                            <span className="w-10 text-right font-mono tabular-nums font-semibold text-gray-900 text-xs">
                              {row.replyRate.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{ width: `${Math.min(100, row.winRate * 10)}%` }}
                              ></div>
                            </div>
                            <span className="w-10 text-right font-mono tabular-nums font-semibold text-emerald-700 text-xs">
                              {row.winRate.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Inbound Inquiries by Content Topic */}
          <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
                  Inbound Inquiries Attributed by Content Topic
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Tracks which editorial themes generate direct inbound DMs and booking inquiries.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-gray-500 font-medium">
                    <th className="py-2.5 px-4 font-normal">Content Angle / Theme</th>
                    <th className="py-2.5 px-4 font-normal">Primary Format</th>
                    <th className="py-2.5 px-4 font-normal text-right">Published Posts</th>
                    <th className="py-2.5 px-4 font-normal text-right">Impressions</th>
                    <th className="py-2.5 px-4 font-normal text-right">Inbound Inquiries</th>
                    <th className="py-2.5 px-4 font-normal w-48">Conversion %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topicData.map((row, idx) => {
                    const isLowSample = row.sampleSize < 10;
                    return (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors h-11">
                        <td className="py-2 px-4 font-medium text-gray-900 flex items-center gap-2">
                          <span>{row.topic}</span>
                          {isLowSample && (
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              Low sample
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-gray-500 font-mono text-[11px]">
                          {row.format}
                        </td>
                        <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-700">
                          N={row.sampleSize}
                        </td>
                        <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-700">
                          {row.impressions.toLocaleString()}
                        </td>
                        <td className="py-2 px-4 text-right font-mono tabular-nums font-semibold text-gray-900">
                          {row.inbounds}
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${Math.min(100, row.conversion * 500)}%` }}
                              ></div>
                            </div>
                            <span className="w-10 text-right font-mono tabular-nums font-semibold text-gray-900 text-xs">
                              {(row.conversion * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Agent Proposals & History */
        <div className="space-y-6">
          {/* Active Proposals List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
              Active Strategy Proposals ({pendingProposals.length})
            </h3>

            {pendingProposals.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 bg-white border border-gray-200 rounded-[6px]">
                No pending proposals. The agent evaluates performance weekly.
              </div>
            ) : (
              pendingProposals.map(prop => (
                <div
                  key={prop.id}
                  className="bg-white border border-gray-200 rounded-[6px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-purple-600 shrink-0" strokeWidth={1.5} />
                      <span className="font-semibold text-gray-900 text-sm">
                        {prop.suggestion}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed pl-6">
                      Evidence: {prop.evidence}
                    </p>
                    <div className="pl-6 text-[11px] font-mono text-gray-400">
                      Target: {prop.targetEntity} · Evaluated: {prop.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenRejectModal(prop.id)}
                      className="px-3 py-1.5 border border-gray-300 rounded-[6px] text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Reject...
                    </button>
                    <button
                      onClick={() => acceptProposal(prop.id)}
                      className="px-3.5 py-1.5 bg-blue-600 text-white rounded-[6px] font-medium hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Past Decisions History Table */}
          <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
                Decision History & Outcomes
              </h3>
              <span className="text-[11px] font-mono text-gray-500">
                Audited strategy changes
              </span>
            </div>

            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
                  <th className="py-2.5 px-4 font-normal">Date</th>
                  <th className="py-2.5 px-4 font-normal">Suggestion</th>
                  <th className="py-2.5 px-4 font-normal text-center">Decision</th>
                  <th className="py-2.5 px-4 font-normal">Decided By</th>
                  <th className="py-2.5 px-4 font-normal">Recorded Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {proposalDecisionHistory.map(hist => (
                  <tr key={hist.id} className="hover:bg-gray-50 transition-colors h-11">
                    <td className="py-2 px-4 font-mono text-gray-500 text-xs whitespace-nowrap">
                      {hist.date}
                    </td>
                    <td className="py-2 px-4 font-semibold text-gray-900 max-w-xs truncate" title={hist.suggestion}>
                      {hist.suggestion}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                        hist.decision === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {hist.decision}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-gray-700 whitespace-nowrap">
                      {hist.actor}
                    </td>
                    <td className="py-2 px-4 text-gray-600 text-xs">
                      {hist.outcome}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Proposal Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Agent Proposal"
        description="Select rationale to prevent the agent from proposing this strategy again."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Rejection Rationale
            </label>
            <select
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none bg-white"
            >
              <option value="Sample size too small (<30 contacts)">Sample size too small (&lt;30 contacts)</option>
              <option value="Strategic priority overrides raw conversion rate">Strategic priority overrides raw conversion rate</option>
              <option value="Planned client case study will fix copy conversion">Planned client case study will fix copy conversion</option>
              <option value="Temporary external market anomaly">Temporary external market anomaly</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-[6px] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-rose-600 rounded-[6px] hover:bg-rose-700"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
