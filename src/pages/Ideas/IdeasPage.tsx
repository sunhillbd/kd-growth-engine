import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { IdeaItem, ChannelId, Post } from '../../types';
import { PostComposerModal } from '../../components/publish/PostComposerModal';
import { PlanWeeklyPostsModal } from '../../components/publish/PlanWeeklyPostsModal';
import { 
  Plus, Sparkles, MessageSquare, Edit2, Trash2, ArrowRight, 
  Check, Calendar, BookOpen, Layers, ExternalLink, HelpCircle, X
} from 'lucide-react';

interface QuestionAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAnswers: (answers: string[]) => void;
}

const WeeklyQuestionsModal: React.FC<QuestionAnswerModalProps> = ({
  isOpen,
  onClose,
  onSubmitAnswers
}) => {
  const [q1, setQ1] = useState('An unexpected webhook timeout under high shipment load that required a redis lock.');
  const [q2, setQ2] = useState('How we deliver in 6 weeks without technical debt or agency maintenance lag.');
  const [q3, setQ3] = useState('The difference between an automated background worker and a fragile Zapier loop.');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" />
      <div className="relative bg-white rounded-lg p-6 max-w-lg w-full shadow-2xl border border-gray-200 z-10 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Answer This Week's Studio Questions</h3>
            <p className="text-gray-500 text-[11px] mt-0.5">Your answers will be distilled into 2 new content ideas.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-medium text-gray-800 mb-1">
              1. What technical or operational problem did you solve for a client this week?
            </label>
            <textarea
              value={q1}
              onChange={e => setQ1(e.target.value)}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-800 mb-1">
              2. What question or objection did a prospect raise on a sales call?
            </label>
            <textarea
              value={q2}
              onChange={e => setQ2(e.target.value)}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-800 mb-1">
              3. What rule or benchmark did you share with a founder?
            </label>
            <textarea
              value={q3}
              onChange={e => setQ3(e.target.value)}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSubmitAnswers([q1, q2, q3]);
              onClose();
            }}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
          >
            Submit & Generate 2 Ideas
          </button>
        </div>
      </div>
    </div>
  );
};

export const IdeasPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    ideas,
    channels,
    posts,
    offers,
    approvalMode,
    addIdeaItem,
    updateIdeaItem,
    deleteIdeaItem,
    planNextWeekIdeas,
    planWeeklyPosts,
    createDraftsForOpenSlots,
    addPostsBuffer
  } = useStore();

  // Tabs: Ideas | Patterns | Swipe file
  type IdeasTab = 'ideas' | 'patterns' | 'swipe';
  const tabParam = searchParams.get('tab') as IdeasTab;
  const activeTab: IdeasTab = (tabParam && ['ideas', 'patterns', 'swipe'].includes(tabParam)) ? tabParam : 'ideas';

  const handleTabChange = (t: IdeasTab) => {
    setSearchParams(prev => {
      prev.set('tab', t);
      return prev;
    });
  };

  // Quick Add input state
  const [newIdeaText, setNewIdeaText] = useState('');

  // Weekly questions modal
  const [weeklyQuestionsOpen, setWeeklyQuestionsOpen] = useState(false);

  // Plan Next Week modal state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planProgress, setPlanProgress] = useState(false);
  const [channelCounts, setChannelCounts] = useState<Record<ChannelId, number>>({
    linkedin_personal: 3,
    linkedin_company: 0,
    facebook_page: 1,
    x_profile: 5,
    website_blog: 1
  });
  const [focusOffer, setFocusOffer] = useState(offers[0]?.name || 'AI Automation Sprint');

  // Composer Modal state for Write Post
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerInitialDraft, setComposerInitialDraft] = useState<string | undefined>();
  const [composerInitialTopic, setComposerInitialTopic] = useState<string | undefined>();
  const [composerInitialPattern, setComposerInitialPattern] = useState<string | undefined>();
  const [composerTargetChannel, setComposerTargetChannel] = useState<ChannelId | undefined>();

  // Quick save idea
  const handleQuickAddIdea = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newIdeaText.trim()) {
      const idea: IdeaItem = {
        id: `idea-${Date.now()}`,
        title: newIdeaText.trim(),
        source: 'Manual',
        tag: 'Founder Strategy',
        createdAt: 'Today',
        suggestedDraft: `${newIdeaText.trim()}\n\nKey studio insight: Keep systems simple and eliminate manual bottlenecks.`
      };
      addIdeaItem(idea);
      setNewIdeaText('');
    }
  };

  const handleWeeklyQuestionsSubmit = (answers: string[]) => {
    const idea1: IdeaItem = {
      id: `idea-q-${Date.now()}-1`,
      title: `How we eliminated client delivery friction on ${answers[0].substring(0, 40)}`,
      shortNotes: answers[0],
      source: 'Weekly questions',
      tag: 'Engineering',
      pattern: 'Architecture teardown',
      suggestedDraft: `Every tech team hits production bottlenecks.\n\nThis week, our engineering team resolved: ${answers[0]}.\n\nHere is the exact diagnostic framework and fix.`
    };
    const idea2: IdeaItem = {
      id: `idea-q-${Date.now()}-2`,
      title: `What enterprise buyers get wrong about ${answers[1].substring(0, 40)}`,
      shortNotes: answers[1],
      source: 'Weekly questions',
      tag: 'Founder Strategy',
      pattern: 'Contrarian breakdown',
      suggestedDraft: `On a recent client discovery call, the founder asked:\n\n"${answers[1]}"\n\nHere is the 3-step proof framework and zero-retention IP guarantee we share with every enterprise partner.`
    };
    addIdeaItem(idea1);
    addIdeaItem(idea2);
  };

  const handleConfirmPlanNextWeek = async () => {
    setPlanProgress(true);
    await planNextWeekIdeas(channelCounts, focusOffer);
    setPlanProgress(false);
    setPlanModalOpen(false);
  };

  const handleWritePostFromIdea = (idea: IdeaItem) => {
    setComposerInitialTopic(idea.title);
    setComposerInitialDraft(idea.suggestedDraft || `${idea.title}\n\n${idea.shortNotes || ''}`);
    setComposerInitialPattern(idea.pattern);
    setComposerTargetChannel(idea.targetChannelId || 'linkedin_personal');
    setComposerOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Top Page Sub-Header */}
      <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-6">
          <h1 className="text-base font-semibold text-gray-900 tracking-tight">
            Ideas
          </h1>

          {/* Tabs: Ideas | Patterns | Swipe file */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => handleTabChange('ideas')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'ideas'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Ideas ({ideas.length})
            </button>

            <button
              onClick={() => handleTabChange('patterns')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'patterns'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Patterns
            </button>

            <button
              onClick={() => handleTabChange('swipe')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'swipe'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Swipe file
            </button>
          </nav>
        </div>

        {/* Primary New Post Button in Header */}
        <button
          onClick={() => {
            setComposerInitialDraft(undefined);
            setComposerInitialTopic(undefined);
            setComposerInitialPattern(undefined);
            setComposerTargetChannel(undefined);
            setComposerOpen(true);
          }}
          className="text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-[6px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>New post</span>
        </button>
      </div>

      {/* Main Body */}
      <main className="flex-1 overflow-y-auto p-6 bg-white space-y-6 max-w-6xl mx-auto w-full">
        {activeTab === 'ideas' && (
          <>
            {/* Top Bar: Input "Add an idea…" + Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[280px]">
                <input
                  type="text"
                  value={newIdeaText}
                  onChange={e => setNewIdeaText(e.target.value)}
                  onKeyDown={handleQuickAddIdea}
                  placeholder="Add an idea… (Press Enter to save)"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:border-blue-500 focus:ring-0 text-gray-900 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(true)}
                  className="px-3.5 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 rounded-lg text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>Plan next week</span>
                </button>

                <button
                  type="button"
                  onClick={createDraftsForOpenSlots}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <span>Write drafts for open slots</span>
                </button>
              </div>
            </div>

            {/* "This week's questions" card at the top */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4 flex items-center justify-between text-xs text-blue-950">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-gray-900">
                    This week's retrospective questions
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-1.5 py-0.2 rounded">
                    3 questions
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Share weekly client breakthroughs or objections to generate high-performing studio content.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setWeeklyQuestionsOpen(true)}
                className="px-3 py-1.5 bg-white border border-blue-300 hover:bg-blue-50 text-blue-900 rounded text-xs font-semibold shadow-2xs shrink-0"
              >
                Answer
              </button>
            </div>

            {/* Ideas Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {ideas.map(idea => (
                <div
                  key={idea.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    {/* Header tags & source */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400 font-mono text-[10px]">
                        {idea.source}
                      </span>
                      {idea.tag && (
                        <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                          {idea.tag}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xs font-bold text-gray-900 leading-snug">
                      {idea.title}
                    </h3>

                    {/* Short notes */}
                    {idea.shortNotes && (
                      <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                        {idea.shortNotes}
                      </p>
                    )}

                    {/* Metadata: Pain & Pattern */}
                    <div className="pt-2 border-t border-gray-100 space-y-1 text-[10px] text-gray-500">
                      {idea.painAddressed && (
                        <div className="truncate">
                          <span className="font-semibold text-gray-600">Pain:</span> {idea.painAddressed}
                        </div>
                      )}
                      {idea.pattern && (
                        <div>
                          <span className="font-semibold text-gray-600">Pattern:</span> {idea.pattern}
                        </div>
                      )}
                      {idea.targetKeyword && (
                        <div className="truncate font-mono">
                          <span className="font-semibold text-gray-600">Keyword:</span> {idea.targetKeyword}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleWritePostFromIdea(idea)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Write post</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1 text-gray-400">
                      <button
                        type="button"
                        onClick={() => deleteIdeaItem(idea.id)}
                        className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Delete idea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PATTERNS TAB */}
        {activeTab === 'patterns' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Content Writing Patterns</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Proven structures used by Kinetik Dynamics to convert technical insights into client pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Before/After benchmark',
                  desc: 'Quantifies concrete operational delays against post-automation speed and accuracy.',
                  rate: '18.2% reply rate',
                  sample: 'How we cut invoice processing from 36 hours to 4 minutes with a document pipeline.'
                },
                {
                  name: 'Cost dissection',
                  desc: 'Breaks down hidden runway waste, bloated agency quotes, or SaaS tool limits.',
                  rate: '15.4% reply rate',
                  sample: 'The $28k mistake founders make migrating from Zapier to custom background workers.'
                },
                {
                  name: 'Architecture teardown',
                  desc: 'Deep technical explanation of failure modes, database bottlenecks, or resilient pipelines.',
                  rate: '11.5% reply rate',
                  sample: 'PostgreSQL partial indexing: Cutting query latency from 4.2s to 18ms under load.'
                },
                {
                  name: 'Contrarian breakdown',
                  desc: 'Directly reframes common startup or engineering misconceptions using production evidence.',
                  rate: '14.8% reply rate',
                  sample: 'Why early-stage SaaS architecture should avoid microservices before $1M ARR.'
                },
                {
                  name: 'Step-by-step framework',
                  desc: 'Actionable operational rules for building self-healing systems and human-in-the-loop gates.',
                  rate: '13.1% reply rate',
                  sample: 'The 4-layer security checklist for production enterprise AI agents.'
                },
                {
                  name: 'Founder lesson',
                  desc: 'Real engineering trade-offs and studio decisions made while building client MVPs.',
                  rate: '16.0% reply rate',
                  sample: 'Why we killed our custom staging server and switched to ephemeral preview branches.'
                }
              ].map(p => (
                <div key={p.name} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-xs">{p.name}</span>
                    <span className="font-mono text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded font-semibold">
                      {p.rate}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{p.desc}</p>
                  <div className="p-2.5 bg-white border border-gray-200 rounded text-xs text-gray-800 italic">
                    "{p.sample}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SWIPE FILE TAB */}
        {activeTab === 'swipe' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Studio Swipe File</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Verified high-performing posts from engineering founders and top B2B software studios.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Engineering velocity over premature microservices',
                  hook: 'Microservices solve organizational scaling problems, not engineering velocity problems.',
                  author: 'Alex Mercer · LinkedIn',
                  metric: '2,840 impressions · 14 replies'
                },
                {
                  title: 'Document processing benchmark case study',
                  hook: 'Cut invoice processing from 36 hours to 4 minutes flat with zero vendor ID hallucination.',
                  author: 'Alex Mercer · 𝕏',
                  metric: '1,920 impressions · 9 DMs · $28k deal won'
                },
                {
                  title: 'Zapier task cap failure modes',
                  hook: 'When to stick with no-code and when custom background workers save thousands.',
                  author: 'Alex Mercer · LinkedIn',
                  metric: '3,100 impressions · 18 comments'
                }
              ].map((sw, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg bg-white space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900">{sw.title}</span>
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold">
                      {sw.metric}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-sans">
                    "{sw.hook}"
                  </p>
                  <div className="text-[10px] text-gray-400 font-mono">
                    {sw.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PLAN NEXT WEEK'S EDITORIAL POSTS MODAL */}
      <PlanWeeklyPostsModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        channels={channels}
        offers={offers}
        onGeneratePlan={planWeeklyPosts}
        onNavigateToTab={(tab) => {
          setPlanModalOpen(false);
          navigate(`/publish?tab=${tab}`);
        }}
        onOpenComposerForPost={(post) => {
          setPlanModalOpen(false);
          setComposerInitialTopic(post.text.split('\n')[0]);
          setComposerInitialDraft(post.text);
          setComposerInitialPattern(post.pattern);
          setComposerTargetChannel(post.channelId);
          setComposerOpen(true);
        }}
      />

      {/* WEEKLY QUESTIONS MODAL */}
      <WeeklyQuestionsModal
        isOpen={weeklyQuestionsOpen}
        onClose={() => setWeeklyQuestionsOpen(false)}
        onSubmitAnswers={handleWeeklyQuestionsSubmit}
      />

      {/* POST COMPOSER MODAL (Prefilled from Idea) */}
      <PostComposerModal
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        channels={channels}
        allPosts={posts}
        approvalMode={approvalMode}
        initialTargetChannelId={composerTargetChannel}
        initialDraftText={composerInitialDraft}
        initialTopic={composerInitialTopic}
        initialPattern={composerInitialPattern}
        onSubmit={(newPosts) => {
          addPostsBuffer(newPosts);
          setComposerOpen(false);
        }}
        onOpenScheduleModal={() => {}}
      />
    </div>
  );
};
