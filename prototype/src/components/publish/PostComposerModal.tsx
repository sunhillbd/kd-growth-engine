import React, { useState, useEffect, useRef } from 'react';
import { Post, Channel, ChannelId, PublishStatus, WebsitePostData } from '../../types';
import { getNextOpenSlot, FIXED_TODAY_DATE } from '../../utils/publishQueue';
import { FormatToolbar } from './FormatToolbar';
import { FormatMode, formatPostPreviewHtml } from '../../utils/textFormatter';
import { 
  X, ChevronDown, Check, AlertCircle, Sparkles, Image, Paperclip, 
  Plus, Trash2, Calendar, Clock, Globe, ArrowRight, ShieldCheck, Eye, RefreshCw
} from 'lucide-react';

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  allPosts: Post[];
  approvalMode: 'manual' | 'auto';
  initialPost?: Post | null;
  initialTargetChannelId?: ChannelId | 'all';
  initialSlotTarget?: { date: string; time: string; slotId: string; channelId?: ChannelId };
  initialDraftText?: string;
  initialTopic?: string;
  initialPattern?: string;
  onSubmit: (posts: Post[]) => void;
  onOpenScheduleModal: (channel: Channel) => void;
}

const PATTERNS = [
  'Before/After benchmark',
  'Cost dissection',
  'Architecture teardown',
  'Contrarian breakdown',
  'Step-by-step framework',
  'Founder lesson'
];

export const PostComposerModal: React.FC<PostComposerModalProps> = ({
  isOpen,
  onClose,
  channels,
  allPosts,
  approvalMode,
  initialPost,
  initialTargetChannelId,
  initialSlotTarget,
  initialDraftText,
  initialTopic,
  initialPattern,
  onSubmit,
  onOpenScheduleModal
}) => {
  if (!isOpen) return null;

  // Selected Channels
  const [selectedChannels, setSelectedChannels] = useState<ChannelId[]>(() => {
    if (initialPost) return [initialPost.channelId];
    if (initialSlotTarget?.channelId) return [initialSlotTarget.channelId];
    if (initialTargetChannelId && initialTargetChannelId !== 'all') return [initialTargetChannelId];
    // Default to connected channels
    const firstConnected = channels.find(c => c.status === 'connected');
    return firstConnected ? [firstConnected.id] : ['linkedin_personal'];
  });

  // Base editor text
  const [baseText, setBaseText] = useState<string>(
    initialPost?.text || initialDraftText || ''
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formatMode, setFormatMode] = useState<FormatMode>('unicode');

  // Per-channel overrides & custom tabs
  const [activeTab, setActiveTab] = useState<'all' | ChannelId>('all');
  const [channelOverrides, setChannelOverrides] = useState<Record<string, string>>({});
  const [customizedTabs, setCustomizedTabs] = useState<Record<string, boolean>>({});

  // Sync formatMode when switching to/from website_blog
  useEffect(() => {
    if (activeTab === 'website_blog') {
      setFormatMode('markdown');
    } else {
      setFormatMode('unicode');
    }
  }, [activeTab]);

  // Pattern & Checklist
  const [pattern, setPattern] = useState<string>(initialPost?.pattern || initialPattern || 'Before/After benchmark');
  const [tag, setTag] = useState<string>(initialPost?.tag || 'Engineering');
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(initialPost?.mediaUrl);

  // Thread posts for X
  const [xThreads, setXThreads] = useState<string[]>(
    initialPost?.channelSpecific?.xThreadPosts || ['1/ First reply expansion: Here are the key technical constraints we hit.', '2/ The final production benchmark metrics.']
  );

  // Website CMS Data
  const [websiteData, setWebsiteData] = useState<WebsitePostData>(
    initialPost?.channelSpecific?.websiteData || {
      title: initialTopic || 'High-Throughput Automation Architecture in 2026',
      slug: 'high-throughput-automation-architecture-2026',
      metaDescription: 'How engineering studios architect event-driven automation pipelines with zero data hallucination.',
      category: 'Engineering',
      targetKeyword: 'event driven automation pipelines',
      publishMode: 'publish_live',
      seoChecklist: {
        keywordInTitle: true,
        oneH1: true,
        faqSection: true,
        schemaType: 'TechArticle'
      }
    }
  );

  // Claims & Originality Check State
  const [claimsChecked, setClaimsChecked] = useState(false);
  const [originalityChecked, setOriginalityChecked] = useState(false);
  const [checksFeedback, setChecksFeedback] = useState<string | null>(null);

  // Create another toggle
  const [createAnother, setCreateAnother] = useState(false);

  // Date & Time Picker Table Expansion
  const [scheduleTableExpanded, setScheduleTableExpanded] = useState(false);
  const [customSchedules, setCustomSchedules] = useState<Record<string, { date: string; time: string }>>({});

  // Submit dropdown menu
  const [submitDropdownOpen, setSubmitDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Confirm Share Now Dialog
  const [confirmShareNowOpen, setConfirmShareNowOpen] = useState(false);

  // Autosave status simulation
  const [autosaveText, setAutosaveText] = useState('Saved just now');

  // Track changes for dirty exit confirmation
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSubmitDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleChannelSelection = (id: ChannelId) => {
    setIsDirty(true);
    const targetChannel = channels.find(c => c.id === id);
    if (targetChannel?.status === 'pending_review' || targetChannel?.status === 'not_connected') {
      return; // Disabled
    }

    if (selectedChannels.includes(id)) {
      if (selectedChannels.length === 1) return; // Must keep at least one
      setSelectedChannels(prev => prev.filter(c => c !== id));
      if (activeTab === id) setActiveTab('all');
    } else {
      setSelectedChannels(prev => [...prev, id]);
    }
  };

  const handleBaseTextChange = (val: string) => {
    setIsDirty(true);
    setBaseText(val);
    setAutosaveText('Saved just now');
  };

  const handleChannelTextChange = (channelId: ChannelId, val: string) => {
    setIsDirty(true);
    setChannelOverrides(prev => ({ ...prev, [channelId]: val }));
    setCustomizedTabs(prev => ({ ...prev, [channelId]: true }));
    setAutosaveText('Saved just now');
  };

  const handleCheckClaims = () => {
    setClaimsChecked(true);
    setChecksFeedback('Claims verified: Benchmark figures and metrics match Portline Logistics client record.');
  };

  const handleCheckOriginality = () => {
    setOriginalityChecked(true);
    setChecksFeedback('Originality 100%: No duplicated phrasing with prior published posts.');
  };

  const handleClose = () => {
    if (isDirty && baseText.trim().length > 10) {
      if (window.confirm('You have unsaved changes. Discard post?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Compute Queue Slots for selected channels
  const queueSummaryList = selectedChannels.map(channelId => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return null;

    if (initialSlotTarget && initialSlotTarget.channelId === channelId) {
      return {
        channel,
        date: initialSlotTarget.date,
        time: initialSlotTarget.time,
        audienceTime: '8:30 AM NY',
        label: `${channel.name.split(' · ')[0]} ${initialSlotTarget.date.split('-').slice(1).join('/')} ${initialSlotTarget.time}`
      };
    }

    if (customSchedules[channelId]) {
      return {
        channel,
        date: customSchedules[channelId].date,
        time: customSchedules[channelId].time,
        audienceTime: 'Custom slot',
        label: `${channel.name.split(' · ')[0]} ${customSchedules[channelId].date} ${customSchedules[channelId].time}`
      };
    }

    const nextSlot = getNextOpenSlot(channel, allPosts);
    if (nextSlot) {
      return {
        channel,
        date: nextSlot.date,
        time: nextSlot.time,
        audienceTime: nextSlot.audienceTime,
        label: `${channel.name.split(' · ')[0]} ${nextSlot.dayOfWeek} ${nextSlot.audienceTime || nextSlot.time}`
      };
    }

    return {
      channel,
      date: '2026-11-03',
      time: '18:30',
      label: `${channel.name.split(' · ')[0]} (No posting schedule set)`
    };
  }).filter(Boolean);

  const channelsWithoutSchedule = selectedChannels
    .map(id => channels.find(c => c.id === id))
    .filter(c => c && (!c.slots || c.slots.length === 0));

  const hasMissingSchedule = channelsWithoutSchedule.length > 0;

  // Primary Submission Logic
  const handleSubmitWithAction = (action: 'add_to_queue' | 'share_next' | 'share_now' | 'schedule_specific' | 'draft') => {
    setSubmitDropdownOpen(false);

    const isManualApproval = approvalMode === 'manual' && action !== 'draft';
    const status: PublishStatus = action === 'draft' 
      ? 'Draft' 
      : isManualApproval 
      ? 'Needs approval' 
      : action === 'share_now' 
      ? 'Sent' 
      : 'Scheduled';

    const groupId = selectedChannels.length > 1 ? `grp-${Date.now()}` : undefined;
    const generatedIds = selectedChannels.map(() => `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);

    const newPosts: Post[] = selectedChannels.map((channelId, index) => {
      const channel = channels.find(c => c.id === channelId);
      const textToUse = channelOverrides[channelId] || baseText;
      const targetSlot = queueSummaryList.find(q => q?.channel.id === channelId);

      let scheduledDate = targetSlot?.date || '2026-10-30';
      let scheduledTime = targetSlot?.time || '18:30';

      if (action === 'share_now') {
        scheduledDate = FIXED_TODAY_DATE;
        scheduledTime = '13:45';
      }

      const siblingIds = generatedIds.filter((_, i) => i !== index);

      return {
        id: generatedIds[index],
        channelId,
        text: textToUse,
        mediaUrl,
        status,
        scheduledDate: action === 'draft' ? undefined : scheduledDate,
        scheduledTime: action === 'draft' ? undefined : scheduledTime,
        sentAt: action === 'share_now' ? 'Today, 1:45 PM' : undefined,
        createdTogetherGroupId: groupId,
        siblingPostIds: siblingIds.length > 0 ? siblingIds : undefined,
        tag,
        draftedByAgent: false,
        author: 'Alex Mercer',
        pattern,
        targetKeyword: websiteData.targetKeyword,
        whyThisPost: isManualApproval ? 'Submitted by team for queue publishing.' : undefined,
        channelSpecific: {
          xThreadPosts: channelId === 'x_profile' ? xThreads : undefined,
          websiteData: channelId === 'website_blog' ? websiteData : undefined
        },
        auditTrail: [
          { date: 'Today (just now)', action: `Created post via Composer (${action})`, actor: 'human' }
        ]
      };
    });

    onSubmit(newPosts);

    if (createAnother) {
      setBaseText('');
      setChannelOverrides({});
      setCustomizedTabs({});
      setIsDirty(false);
    } else {
      onClose();
    }
  };

  const currentTabEffectiveText = activeTab === 'all' 
    ? baseText 
    : (channelOverrides[activeTab] !== undefined ? channelOverrides[activeTab] : baseText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div onClick={handleClose} className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl border border-gray-200 z-10 overflow-hidden flex flex-col h-[92vh]">
        {/* TOP BAR: CHANNEL ROW & TAG SELECT */}
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Publish to:
            </span>

            {/* Channel Avatar Buttons */}
            <div className="flex items-center gap-2">
              {channels.map(channel => {
                const isSelected = selectedChannels.includes(channel.id);
                const isPendingReview = channel.status === 'pending_review';
                const isDisconnected = channel.status === 'not_connected';
                const isDisabled = isPendingReview || isDisconnected;

                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => toggleChannelSelection(channel.id)}
                    disabled={isDisabled}
                    title={
                      isPendingReview ? 'LinkedIn company page is pending review' :
                      isDisconnected ? 'Not connected. Connect in Settings' :
                      `${channel.name} (${isSelected ? 'Selected' : 'Click to select'})`
                    }
                    className={`relative p-1 rounded-full transition-all flex items-center justify-center ${
                      isDisabled ? 'opacity-40 cursor-not-allowed grayscale' :
                      isSelected ? 'ring-2 ring-blue-600 ring-offset-1 bg-white shadow-xs' :
                      'opacity-70 hover:opacity-100 hover:ring-1 hover:ring-gray-300'
                    }`}
                  >
                    {/* Platform icon */}
                    {channel.platform === 'LinkedIn' && (
                      <div className="w-6 h-6 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-[10px]">
                        in
                      </div>
                    )}
                    {channel.platform === 'Facebook' && (
                      <div className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold text-xs">
                        f
                      </div>
                    )}
                    {channel.platform === 'X' && (
                      <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">
                        𝕏
                      </div>
                    )}
                    {channel.platform === 'Website' && (
                      <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-[9px]">
                        KD
                      </div>
                    )}

                    {/* Small badge check if selected */}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 rounded-full text-white flex items-center justify-center text-[8px] font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tag Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500">Tag:</span>
              <select
                value={tag}
                onChange={e => setTag(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs bg-white text-gray-800"
              >
                <option value="Engineering">Engineering</option>
                <option value="Founder Strategy">Founder Strategy</option>
                <option value="AI Automation">AI Automation</option>
                <option value="Case Study">Case Study</option>
              </select>
            </div>

            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: 2 COLUMNS (Left Editor + Right Live Preview) */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT COLUMN: EDITOR */}
          <div className="flex-1 border-r border-gray-200 flex flex-col overflow-y-auto p-5 space-y-4">
            {/* Base Pattern Checklist bar */}
            <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 rounded-md p-2.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Writing Pattern:</span>
                <select
                  value={pattern}
                  onChange={e => setPattern(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-0.5 bg-white font-medium text-gray-800"
                >
                  {PATTERNS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCheckClaims}
                  className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                    claimsChecked ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Check claims
                </button>
                <button
                  type="button"
                  onClick={handleCheckOriginality}
                  className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                    originalityChecked ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Check originality
                </button>
              </div>
            </div>

            {checksFeedback && (
              <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2.5 py-1.5 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{checksFeedback}</span>
              </div>
            )}

            {/* Customize per channel tabs (shown when > 1 channel selected) */}
            {selectedChannels.length > 1 && (
              <div className="border-b border-gray-200 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === 'all'
                      ? 'border-blue-600 text-blue-700 font-semibold'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  All ({selectedChannels.length})
                </button>

                {selectedChannels.map(cid => {
                  const ch = channels.find(c => c.id === cid);
                  const isCustom = customizedTabs[cid];
                  return (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => setActiveTab(cid)}
                      className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1 ${
                        activeTab === cid
                          ? 'border-blue-600 text-blue-700 font-semibold'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <span>{ch?.name.split(' · ')[0]}</span>
                      {isCustom && (
                        <span className="text-[9px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded font-mono font-normal">
                          Customized
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Tab Rules Indicator */}
            {activeTab !== 'all' && (
              <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
                <span>
                  {activeTab === 'linkedin_personal' && 'LinkedIn profile · Limit: 3,000 characters'}
                  {activeTab === 'facebook_page' && 'Facebook Page · Link preview card will generate'}
                  {activeTab === 'x_profile' && 'X account · Limit: 280 characters per tweet'}
                  {activeTab === 'website_blog' && 'Website CMS · Rich article & SEO metadata'}
                </span>
                <span className="font-mono">
                  {currentTabEffectiveText.length} chars
                </span>
              </div>
            )}

            {/* Main Textarea with Format Tools */}
            <div className="flex-1 min-h-[180px] flex flex-col">
              <FormatToolbar
                textareaRef={textareaRef}
                text={currentTabEffectiveText}
                onTextChange={(newText) => {
                  if (activeTab === 'all') {
                    handleBaseTextChange(newText);
                  } else {
                    handleChannelTextChange(activeTab, newText);
                  }
                }}
                formatMode={formatMode}
                onFormatModeChange={setFormatMode}
              />
              <textarea
                ref={textareaRef}
                value={currentTabEffectiveText}
                onChange={e => {
                  if (activeTab === 'all') {
                    handleBaseTextChange(e.target.value);
                  } else {
                    handleChannelTextChange(activeTab, e.target.value);
                  }
                }}
                placeholder={
                  activeTab === 'website_blog'
                    ? 'Write full article body content here...'
                    : 'What do you want to share with your audience?'
                }
                className="w-full flex-1 p-3.5 border border-gray-300 rounded-b-lg border-t-0 text-xs sm:text-sm font-sans leading-relaxed resize-none focus:border-blue-500 focus:ring-0 text-gray-900 shadow-2xs"
              />
            </div>

            {/* X Thread Builder (when X is selected or active) */}
            {selectedChannels.includes('x_profile') && (activeTab === 'all' || activeTab === 'x_profile') && (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-900">
                    𝕏 Thread Continuations ({xThreads.length} replies)
                  </span>
                  <button
                    type="button"
                    onClick={() => setXThreads(prev => [...prev, `${prev.length + 1}/ Key detail: `])}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add to thread</span>
                  </button>
                </div>

                {xThreads.map((reply, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <textarea
                      value={reply}
                      onChange={e => {
                        const next = [...xThreads];
                        next[i] = e.target.value;
                        setXThreads(next);
                      }}
                      className="w-full p-2 border border-gray-300 rounded text-xs bg-white text-gray-800"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => setXThreads(xThreads.filter((_, idx) => idx !== i))}
                      className="p-1 text-gray-400 hover:text-rose-600"
                      title="Remove tweet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Website SEO & CMS Fields (when Website selected) */}
            {selectedChannels.includes('website_blog') && (activeTab === 'all' || activeTab === 'website_blog') && (
              <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50 space-y-3">
                <span className="text-xs font-semibold text-gray-900 block">
                  Website SEO & CMS Settings
                </span>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">Article Title</label>
                    <input
                      type="text"
                      value={websiteData.title}
                      onChange={e => setWebsiteData({ ...websiteData, title: e.target.value })}
                      className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={websiteData.slug}
                      onChange={e => setWebsiteData({ ...websiteData, slug: e.target.value })}
                      className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Meta Description (155 chars)</label>
                  <input
                    type="text"
                    value={websiteData.metaDescription}
                    onChange={e => setWebsiteData({ ...websiteData, metaDescription: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                  />
                </div>

                <div className="flex items-center gap-4 text-xs pt-1">
                  <label className="flex items-center gap-1.5 text-gray-700">
                    <input
                      type="checkbox"
                      checked={websiteData.seoChecklist.oneH1}
                      onChange={e => setWebsiteData({
                        ...websiteData,
                        seoChecklist: { ...websiteData.seoChecklist, oneH1: e.target.checked }
                      })}
                      className="text-blue-600 rounded"
                    />
                    <span>Single H1 Tag</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-gray-700">
                    <input
                      type="checkbox"
                      checked={websiteData.seoChecklist.keywordInTitle}
                      onChange={e => setWebsiteData({
                        ...websiteData,
                        seoChecklist: { ...websiteData.seoChecklist, keywordInTitle: e.target.checked }
                      })}
                      className="text-blue-600 rounded"
                    />
                    <span>Target keyword in title</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: CHANNEL NATIVE LIVE PREVIEW */}
          <div className="w-[380px] bg-gray-50 flex flex-col p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Channel Preview</span>
              </span>

              {/* Selector for which preview to view if multiple */}
              {selectedChannels.length > 1 && (
                <div className="flex items-center gap-1">
                  {selectedChannels.map(cid => (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => setActiveTab(cid)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        activeTab === cid ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {cid.includes('linkedin') ? 'LinkedIn' : cid.includes('fb') ? 'FB' : cid.includes('x') ? 'X' : 'Web'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Native Preview Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs text-xs space-y-3 font-sans">
              {/* Account header */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  AM
                </div>
                <div>
                  <div className="font-bold text-gray-900 leading-tight">Alex Mercer</div>
                  <div className="text-[10px] text-gray-500">
                    {activeTab === 'website_blog' ? 'Published on kinetikdynamics.com' : 'Founder & Technical Director · Kinetik Dynamics'}
                  </div>
                </div>
              </div>

              {/* Text content preview (handles Unicode & Markdown formatting) */}
              {currentTabEffectiveText ? (
                <div 
                  className="text-gray-900 whitespace-pre-line leading-relaxed text-xs break-words"
                  dangerouslySetInnerHTML={{ __html: formatPostPreviewHtml(currentTabEffectiveText) }}
                />
              ) : (
                <div className="text-gray-400 italic text-xs">
                  Preview text will appear here as you type...
                </div>
              )}

              {/* Attached media if any */}
              {mediaUrl && (
                <div className="rounded border border-gray-200 overflow-hidden mt-2">
                  <img src={mediaUrl} alt="Preview" className="w-full h-40 object-cover" />
                </div>
              )}

              {/* Native footer reactions placeholder */}
              <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400 flex items-center justify-between font-mono">
                <span>Like · Comment · Repost</span>
                <span>Just now</span>
              </div>
            </div>

            {/* Autosave status indicator */}
            <div className="text-center text-[10px] text-gray-400 mt-auto pt-4 font-mono">
              Autosave: {autosaveText}
            </div>
          </div>
        </div>

        {/* COMPOSER FOOTER */}
        <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-between shrink-0">
          {/* Left: Create another checkbox */}
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={createAnother}
              onChange={e => setCreateAnother(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Create another</span>
          </label>

          {/* Center: Queue Slot Timing Summary */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            {hasMissingSchedule ? (
              <span className="text-amber-700 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>One channel has no posting schedule.</span>
                <button
                  type="button"
                  onClick={() => onOpenScheduleModal(channelsWithoutSchedule[0]!)}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Set posting times
                </button>
              </span>
            ) : (
              <>
                <span>
                  Goes out next: {queueSummaryList.map(q => q?.label).join(', ')}
                </span>
                <button
                  type="button"
                  onClick={() => setScheduleTableExpanded(!scheduleTableExpanded)}
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs ml-1"
                >
                  {scheduleTableExpanded ? 'Hide schedule' : 'Change'}
                </button>
              </>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmitWithAction('draft')}
              className="px-3.5 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-xs font-medium"
            >
              Save as draft
            </button>

            {/* Primary Action Button with Dropdown Arrow */}
            <div className="relative inline-flex rounded-md shadow-2xs" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => handleSubmitWithAction('add_to_queue')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-l text-xs font-medium transition-colors"
              >
                {approvalMode === 'manual' ? 'Send for approval' : 'Add to queue'}
              </button>

              <button
                type="button"
                onClick={() => setSubmitDropdownOpen(!submitDropdownOpen)}
                className="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-r border-l border-blue-500 text-xs transition-colors"
                title="Scheduling options"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Submit Dropdown Menu */}
              {submitDropdownOpen && (
                <div className="absolute right-0 bottom-full mb-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-30 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSubmitWithAction('add_to_queue')}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-800 font-medium flex items-center justify-between"
                  >
                    <span>Add to queue (default)</span>
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmitWithAction('share_next')}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700"
                  >
                    Share next (top of queue)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitDropdownOpen(false);
                      setConfirmShareNowOpen(true);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700"
                  >
                    Share now
                  </button>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setScheduleTableExpanded(true);
                      setSubmitDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700"
                  >
                    Schedule for date and time…
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* EXPANDABLE DATE & TIME PICKER TABLE PER CHANNEL */}
        {scheduleTableExpanded && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                Custom Schedule Per Channel (Asia/Dhaka & NY time)
              </span>
              <button
                type="button"
                onClick={() => setScheduleTableExpanded(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-[11px] text-gray-500 font-medium">
                  <tr>
                    <th className="p-2.5">Channel</th>
                    <th className="p-2.5">Scheduled Date</th>
                    <th className="p-2.5">Scheduled Time</th>
                    <th className="p-2.5">Audience Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedChannels.map(cid => {
                    const ch = channels.find(c => c.id === cid);
                    const curDate = customSchedules[cid]?.date || '2026-10-30';
                    const curTime = customSchedules[cid]?.time || '18:30';

                    return (
                      <tr key={cid}>
                        <td className="p-2.5 font-medium text-gray-900">{ch?.name}</td>
                        <td className="p-2.5">
                          <input
                            type="date"
                            value={curDate}
                            onChange={e => setCustomSchedules({
                              ...customSchedules,
                              [cid]: { date: e.target.value, time: curTime }
                            })}
                            className="border border-gray-300 rounded px-2 py-1 text-xs font-mono"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="time"
                            value={curTime}
                            onChange={e => setCustomSchedules({
                              ...customSchedules,
                              [cid]: { date: curDate, time: e.target.value }
                            })}
                            className="border border-gray-300 rounded px-2 py-1 text-xs font-mono"
                          />
                        </td>
                        <td className="p-2.5 text-gray-500 font-mono text-[11px]">
                          = 8:30 AM NY
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONFIRM SHARE NOW DIALOG */}
        {confirmShareNowOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setConfirmShareNowOpen(false)} />
            <div className="relative bg-white rounded-lg p-5 max-w-sm w-full shadow-xl border border-gray-200 z-10 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Publish immediately?</h3>
              <p className="text-xs text-gray-600">
                This will send your message directly to {selectedChannels.length} channel(s) right now without queueing.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmShareNowOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmShareNowOpen(false);
                    handleSubmitWithAction('share_now');
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                >
                  Confirm & Share now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
