import React, { useState } from 'react';
import { Channel, ChannelId, Post, Offer } from '../../types';
import { X, Check, Calendar, ArrowRight, Eye, RefreshCw, PenTool, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

interface PlanWeeklyPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  offers: Offer[];
  onGeneratePlan: (params: {
    channelCounts: Record<ChannelId, number>;
    focusOffer: string;
    useClearSearch?: boolean;
    targetStatus?: 'Needs approval' | 'Draft';
  }) => Promise<Post[]>;
  onNavigateToTab?: (tab: 'queue' | 'calendar' | 'drafts' | 'approvals' | 'sent') => void;
  onOpenComposerForPost?: (post: Post) => void;
}

export const PlanWeeklyPostsModal: React.FC<PlanWeeklyPostsModalProps> = ({
  isOpen,
  onClose,
  channels,
  offers,
  onGeneratePlan,
  onNavigateToTab,
  onOpenComposerForPost
}) => {
  if (!isOpen) return null;

  const [channelCounts, setChannelCounts] = useState<Record<ChannelId, number>>({
    linkedin_personal: 3,
    linkedin_company: 0,
    facebook_page: 1,
    x_profile: 5,
    website_blog: 1
  });

  const [focusOffer, setFocusOffer] = useState<string>(
    offers[0]?.name || 'MVP in 6 Weeks'
  );

  const [useClearSearch, setUseClearSearch] = useState<boolean>(true);
  const [targetStatus, setTargetStatus] = useState<'Needs approval' | 'Draft'>('Needs approval');

  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisStep, setSynthesisStep] = useState<number>(0);
  const [generatedPlan, setGeneratedPlan] = useState<Post[] | null>(null);

  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSynthesizing(true);
    setSynthesisStep(1);

    const t1 = setTimeout(() => setSynthesisStep(2), 800);
    const t2 = setTimeout(() => setSynthesisStep(3), 1600);

    try {
      const posts = await onGeneratePlan({
        channelCounts,
        focusOffer,
        useClearSearch,
        targetStatus
      });

      clearTimeout(t1);
      clearTimeout(t2);
      setIsSynthesizing(false);
      setGeneratedPlan(posts);
    } catch {
      setIsSynthesizing(false);
    }
  };

  const getPlatformIcon = (platform?: Channel['platform']) => {
    switch (platform) {
      case 'LinkedIn':
        return <span className="w-2.5 h-2.5 rounded-full bg-[#0A66C2] inline-block shrink-0" />;
      case 'Facebook':
        return <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2] inline-block shrink-0" />;
      case 'X':
        return <span className="w-2.5 h-2.5 rounded-full bg-black inline-block shrink-0" />;
      case 'Website':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block shrink-0" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl border border-gray-200 z-10 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                Editorial Agent
              </span>
              <h2 className="text-sm font-bold text-gray-900">
                Plan Next Week's Editorial Posts
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Automatically draft and schedule high-intent posts into next week's queue slots based on studio offers.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-gray-700 space-y-6">
          {/* STATE 1: SYNTHESIS PROGRESS ANIMATION */}
          {isSynthesizing && (
            <div className="py-8 px-4 space-y-5">
              <div className="space-y-4 max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    synthesisStep > 1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-blue-600 text-white animate-pulse'
                  }`}>
                    {synthesisStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                  </div>
                  <span className={`text-xs ${synthesisStep >= 1 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                    Analyzing client conversion signals and ICP objections...
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    synthesisStep > 2 ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : synthesisStep === 2 ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {synthesisStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                  </div>
                  <span className={`text-xs ${synthesisStep >= 2 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                    Harvesting intent keywords from ClearSearch ({focusOffer})...
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    synthesisStep === 3 ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-100 text-gray-400'
                  }`}>
                    3
                  </div>
                  <span className={`text-xs ${synthesisStep === 3 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                    Synthesizing 7 tailored posts and assigning to next week's queue slots...
                  </span>
                </div>
              </div>

              <div className="max-w-md mx-auto w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-6">
                <div
                  className="bg-blue-600 h-full transition-all duration-700 ease-out"
                  style={{ width: `${(synthesisStep / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* STATE 2: GENERATED PLAN REVIEW TABLE */}
          {!isSynthesizing && generatedPlan && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">
                    7 posts planned and assigned to next week's open slots!
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Status: {targetStatus}
                </span>
              </div>

              {/* Weekly Editorial Plan Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                    <tr>
                      <th className="py-2.5 px-3">Slot / Day</th>
                      <th className="py-2.5 px-3">Channel</th>
                      <th className="py-2.5 px-3">Topic & Hook Angle</th>
                      <th className="py-2.5 px-3">Pattern</th>
                      <th className="py-2.5 px-3">Target Keyword</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {generatedPlan.map(post => {
                      const ch = channels.find(c => c.id === post.channelId);
                      return (
                        <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-gray-900 whitespace-nowrap">
                            <div className="font-semibold">{post.scheduledDate}</div>
                            <div className="text-[10px] text-gray-500">{post.scheduledTime} (8:30 AM NY)</div>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-medium text-gray-800">
                              {getPlatformIcon(ch?.platform)}
                              <span>{ch?.name.split(' · ')[0]}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 max-w-xs">
                            <div className="font-semibold text-gray-900 truncate" title={post.text.split('\n')[0]}>
                              {post.text.split('\n')[0]}
                            </div>
                            <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                              {post.whyThisPost}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
                              {post.pattern}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[10px] text-gray-600 whitespace-nowrap">
                            {post.targetKeyword}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            {onOpenComposerForPost && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenComposerForPost(post);
                                }}
                                className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded font-medium"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STATE 3: CONFIGURATION FORM */}
          {!isSynthesizing && !generatedPlan && (
            <form onSubmit={handleStartGeneration} className="space-y-5">
              {/* Target Posts per Channel */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-2">
                  Target Posts per Channel for Next Week (Nov 2 – Nov 8, 2026)
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {channels.filter(c => c.status === 'connected').map(ch => (
                    <div key={ch.id} className="flex items-center justify-between p-2.5 rounded border border-gray-200 bg-gray-50/70">
                      <div className="flex items-center gap-2 truncate">
                        {getPlatformIcon(ch.platform)}
                        <span className="font-medium text-gray-900 truncate text-xs">
                          {ch.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => setChannelCounts({
                            ...channelCounts,
                            [ch.id]: Math.max(0, (channelCounts[ch.id] || 0) - 1)
                          })}
                          className="w-5 h-5 rounded border border-gray-300 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 font-bold"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-mono font-bold text-xs">
                          {channelCounts[ch.id] || 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => setChannelCounts({
                            ...channelCounts,
                            [ch.id]: (channelCounts[ch.id] || 0) + 1
                          })}
                          className="w-5 h-5 rounded border border-gray-300 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Studio Offer */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Focus Studio Offer (Primary CTA & Case Angle)
                </label>
                <select
                  value={focusOffer}
                  onChange={e => setFocusOffer(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded bg-white text-gray-900 font-medium"
                >
                  {offers.map(o => (
                    <option key={o.id} value={o.name}>
                      {o.name} — {o.promise.substring(0, 70)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* ClearSearch & Status Settings */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useClearSearch}
                    onChange={e => setUseClearSearch(e.target.checked)}
                    className="mt-0.5 text-blue-600 rounded"
                  />
                  <div>
                    <span className="font-semibold text-gray-900 block">
                      Harvest search intent keywords from ClearSearch
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Integrates 14 trending technical keywords (e.g. "Next.js modular monolith", "invoice automation OCR worker").
                    </span>
                  </div>
                </label>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Schedule directly into queue as:</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="plan_status"
                        checked={targetStatus === 'Needs approval'}
                        onChange={() => setTargetStatus('Needs approval')}
                        className="text-blue-600"
                      />
                      <span>Needs approval (Human sign-off)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="plan_status"
                        checked={targetStatus === 'Draft'}
                        onChange={() => setTargetStatus('Draft')}
                        className="text-blue-600"
                      />
                      <span>Drafts</span>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
          {!generatedPlan ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSynthesizing}
                onClick={handleStartGeneration}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1.5 disabled:opacity-50"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Generate Weekly Plan (7 posts)</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setGeneratedPlan(null)}
                className="text-xs text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Plan again
              </button>
              <div className="flex items-center gap-2">
                {onNavigateToTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToTab('approvals');
                    }}
                    className="px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 rounded text-xs font-medium text-gray-800"
                  >
                    Review in Approvals
                  </button>
                )}
                {onNavigateToTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToTab('queue');
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                  >
                    View in Queue
                  </button>
                )}
                {!onNavigateToTab && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                  >
                    Done
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
