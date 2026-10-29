import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Maximize2, Minimize2, Check, AlertCircle, AlertTriangle, 
  ExternalLink, Clock, MessageSquare, ShieldCheck, FileCheck,
  ChevronRight, Calendar, Sparkles, Send, RotateCcw, Ban
} from 'lucide-react';
import { ContentItem, ContentStatus, DestinationId } from '../../types';
import { useStore } from '../../context/StoreContext';
import { DESTINATIONS, PLATFORM_ICONS } from '../../mock/destinations';

interface ContentDrawerProps {
  isOpen: boolean;
  item: ContentItem | null;
  onClose: () => void;
  initialSection?: 'content' | 'destinations' | 'results' | 'activity';
  focusEditorOnOpen?: boolean;
}

const STATUS_SEQUENCE: ContentStatus[] = ['Idea', 'Draft', 'Needs approval', 'Scheduled', 'Published'];

const PATTERNS_LIST = [
  {
    name: 'Contrarian breakdown',
    description: 'Challenges conventional wisdom with real production data',
    checklist: ['States contrarian claim upfront', 'Gives 2 quantitative reasons', 'Contrasts with standard agency advice', 'Ends with actionable takeaway']
  },
  {
    name: 'Before/After benchmark',
    description: 'Quantifies operational lag vs automated throughput',
    checklist: ['Baseline problem quantified', 'Bottleneck identified', 'Engineered solution summary', 'Post-launch metric comparison']
  },
  {
    name: 'Architecture teardown',
    description: 'Deconstructs real production system design and trade-offs',
    checklist: ['Concrete tech stack specified', 'Database or queue trade-off', 'Failure state guardrail', 'Architecture diagram or code structure']
  },
  {
    name: 'Cost dissection',
    description: 'Real breakdown of recruiting/tooling costs vs studio delivery',
    checklist: ['Direct financial comparison', 'Hidden operational costs highlighted', 'Runway and velocity calculation', 'Clear studio alternative']
  },
  {
    name: 'Step-by-step framework',
    description: 'Actionable blueprint for CTOs and automation leads',
    checklist: ['Step 1: Ingestion / Auth', 'Step 2: Core processing / LLM', 'Step 3: Verification / Human gate', 'Step 4: Dispatch / Audit']
  },
  {
    name: 'Founder lesson',
    description: 'Hard-won lessons from 6-week MVP builds',
    checklist: ['Specific context & mistake', 'Near-term consequence', 'Framework developed', 'Rule for future builds']
  }
];

export const ContentDrawer: React.FC<ContentDrawerProps> = ({
  isOpen,
  item,
  onClose,
  initialSection = 'content',
  focusEditorOnOpen = false
}) => {
  const { 
    updatePost, 
    changePostStatus, 
    approvePost, 
    rejectPost, 
    approvePostDestination, 
    rejectPostDestination,
    reschedulePostDestination,
    cancelPostDestination,
    publishNowPostDestination,
    retryPostDestination,
    userRole,
    approvalMode,
    showToast
  } = useStore();

  const isViewer = userRole === 'Viewer';

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<'content' | 'destinations' | 'results' | 'activity'>(initialSection);
  const [activeDestTab, setActiveDestTab] = useState<DestinationId>('linkedin_personal');

  // Form local state
  const [title, setTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [baseText, setBaseText] = useState('');
  const [pattern, setPattern] = useState('Contrarian breakdown');
  const [selectedDestinations, setSelectedDestinations] = useState<DestinationId[]>([]);
  const [sameTimeForAll, setSameTimeForAll] = useState(true);
  const [scheduledDate, setScheduledDate] = useState('2026-11-04');
  const [scheduledTime, setScheduledTime] = useState('18:30');

  // Overrides
  const [linkedinPersonalOverride, setLinkedinPersonalOverride] = useState('');
  const [facebookOverride, setFacebookOverride] = useState('');
  const [xOverride, setXOverride] = useState('');
  const [xThreadPosts, setXThreadPosts] = useState<string[]>([]);
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [websiteSlug, setWebsiteSlug] = useState('');
  const [websiteMeta, setWebsiteMeta] = useState('');
  const [websitePublishMode, setWebsitePublishMode] = useState<'publish_live' | 'cms_draft'>('cms_draft');

  // Claim & Originality check states
  const [claimsVerified, setClaimsVerified] = useState(false);
  const [originalityVerified, setOriginalityVerified] = useState(false);
  const [checkLoading, setCheckLoading] = useState<'claims' | 'originality' | null>(null);

  // Rejection modal
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Tone is too informal for enterprise CTOs');
  const [rejectingDestId, setRejectingDestId] = useState<DestinationId | null>(null);

  // Unsaved changes prompt
  const [isDirty, setIsDirty] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);

  // Comment box
  const [newComment, setNewComment] = useState('');

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Sync state from item
  useEffect(() => {
    if (item) {
      setTitle(item.topic || '');
      setBaseText(item.baseText || '');
      setPattern(item.pattern || 'Contrarian breakdown');
      setSelectedDestinations(item.selectedDestinations || ['linkedin_personal']);
      setScheduledDate(item.scheduledDate || item.scheduledDay || '2026-11-04');
      setScheduledTime(item.scheduledTime || '18:30');
      setLinkedinPersonalOverride(item.linkedinPersonalOverride || '');
      setFacebookOverride(item.facebookOverride || '');
      setXOverride(item.xOverride || '');
      setXThreadPosts(item.xThreadPosts || []);
      setWebsiteTitle(item.websiteData?.title || item.topic || '');
      setWebsiteSlug(item.websiteData?.slug || '');
      setWebsiteMeta(item.websiteData?.metaDescription || '');
      setWebsitePublishMode(item.websiteData?.publishMode || 'cms_draft');
      setClaimsVerified(false);
      setOriginalityVerified(false);
      setIsDirty(false);

      if (item.selectedDestinations && item.selectedDestinations.length > 0) {
        setActiveDestTab(item.selectedDestinations[0]);
      }
    }
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      setActiveSection(initialSection);
      if (focusEditorOnOpen) {
        setTimeout(() => editorRef.current?.focus(), 150);
      }
    }
  }, [isOpen, initialSection, focusEditorOnOpen]);

  // Keyboard navigation: A = approve, R = reject, Esc = close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.key === 'Escape') {
        e.preventDefault();
        handleAttemptClose();
        return;
      }

      if (!isInput && item?.status === 'Needs approval' && !isViewer) {
        if (e.key.toLowerCase() === 'a') {
          e.preventDefault();
          handleApprove();
        } else if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          setRejectingDestId(null);
          setRejectionModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, item, isDirty, isViewer]);

  if (!isOpen || !item) return null;

  const handleAttemptClose = () => {
    if (isDirty && item.status !== 'Draft') {
      setDiscardConfirmOpen(true);
    } else {
      onClose();
    }
  };

  const saveDraftAuto = () => {
    if (!item) return;
    updatePost({
      ...item,
      topic: title,
      baseText,
      pattern,
      selectedDestinations,
      linkedinPersonalOverride,
      facebookOverride,
      xOverride,
      xThreadPosts,
      websiteData: item.websiteData ? {
        ...item.websiteData,
        title: websiteTitle,
        slug: websiteSlug,
        metaDescription: websiteMeta,
        publishMode: websitePublishMode
      } : undefined
    });
    setIsDirty(false);
  };

  const handleApprove = () => {
    if (isViewer) return;
    approvePost(item.id);
    onClose();
  };

  const handleRequestChanges = () => {
    if (isViewer) return;
    if (rejectingDestId) {
      rejectPostDestination(item.id, rejectingDestId, rejectionReason);
    } else {
      rejectPost(item.id, rejectionReason);
    }
    setRejectionModalOpen(false);
    onClose();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const updatedComments = [
      ...(item.comments || []),
      {
        id: `c-${Date.now()}`,
        author: 'Alex Mercer',
        text: newComment.trim(),
        date: 'Today (just now)'
      }
    ];

    updatePost({
      ...item,
      comments: updatedComments
    });
    setNewComment('');
    showToast('Comment added');
  };

  const runClaimCheck = () => {
    setCheckLoading('claims');
    setTimeout(() => {
      setCheckLoading(null);
      setClaimsVerified(true);
      showToast('Claims check: All 3 facts verified against studio case studies');
    }, 700);
  };

  const runOriginalityCheck = () => {
    setCheckLoading('originality');
    setTimeout(() => {
      setCheckLoading(null);
      setOriginalityVerified(true);
      showToast('Originality score 98% · Zero overlap with existing library');
    }, 700);
  };

  // Stepper status badge colors
  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case 'Idea': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Draft': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Needs approval': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Scheduled': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Published': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const currentPatternConfig = PATTERNS_LIST.find(p => p.name === pattern) || PATTERNS_LIST[0];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-2xs transition-opacity"
        onClick={handleAttemptClose}
      />

      {/* Drawer Container */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 bg-white border-l border-gray-200 shadow-2xl flex flex-col transition-all duration-200 ease-in-out ${
          isExpanded ? 'w-full max-w-5xl' : 'w-full sm:w-[560px]'
        }`}
      >
        {/* HEADER */}
        <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0 gap-3">
          <div className="flex-1 min-w-0 flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={e => { setTitle(e.target.value); setIsDirty(true); }}
                onBlur={() => { setIsEditingTitle(false); saveDraftAuto(); }}
                onKeyDown={e => { if (e.key === 'Enter') { setIsEditingTitle(false); saveDraftAuto(); } }}
                autoFocus
                className="text-sm font-bold text-gray-900 border border-blue-500 rounded px-2 py-0.5 w-full bg-white"
              />
            ) : (
              <h2 
                onClick={() => setIsEditingTitle(true)}
                title="Click to edit title"
                className="text-sm font-bold text-gray-900 truncate hover:text-blue-600 cursor-pointer"
              >
                {title || 'Untitled post'}
              </h2>
            )}
            <span className="text-[11px] text-gray-400 font-mono shrink-0">
              {item.id}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {item.status === 'Draft' && (
              <span className="text-[11px] text-gray-400 font-mono mr-1">
                Saved just now
              </span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-200/50 transition-colors"
              title={isExpanded ? "Collapse to standard drawer" : "Expand to full view"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleAttemptClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-200/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* STATUS STEPPER & PRIMARY ACTION BAR */}
        <div className="px-5 py-2.5 border-b border-gray-200 bg-white flex items-center justify-between shrink-0 gap-4">
          {/* Status Stepper */}
          <div className="flex items-center gap-1 text-[11px] font-mono overflow-x-auto">
            {STATUS_SEQUENCE.map((s, idx) => {
              const isActive = item.status === s;
              const isPast = STATUS_SEQUENCE.indexOf(item.status) > idx;

              return (
                <React.Fragment key={s}>
                  <button
                    onClick={() => {
                      if (!isViewer) changePostStatus(item.id, s);
                    }}
                    disabled={isViewer}
                    className={`px-2 py-0.5 rounded border transition-colors ${
                      isActive 
                        ? getStatusColor(s) + ' font-bold ring-1 ring-black/5' 
                        : isPast 
                          ? 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100' 
                          : 'bg-white text-gray-300 border-transparent hover:text-gray-500'
                    }`}
                  >
                    {s}
                  </button>
                  {idx < STATUS_SEQUENCE.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Dynamic Primary / Secondary Button */}
          <div className="flex items-center gap-2 shrink-0">
            {item.status === 'Idea' && (
              <button
                onClick={() => {
                  changePostStatus(item.id, 'Draft');
                  setActiveSection('content');
                  setTimeout(() => editorRef.current?.focus(), 100);
                }}
                disabled={isViewer}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-xs"
              >
                Write draft
              </button>
            )}

            {item.status === 'Draft' && (
              <button
                onClick={() => {
                  if (approvalMode === 'auto') {
                    changePostStatus(item.id, 'Scheduled');
                  } else {
                    changePostStatus(item.id, 'Needs approval');
                  }
                  saveDraftAuto();
                }}
                disabled={isViewer}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-xs"
              >
                {approvalMode === 'auto' ? 'Schedule' : 'Send for approval'}
              </button>
            )}

            {item.status === 'Needs approval' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setRejectingDestId(null);
                    setRejectionModalOpen(true);
                  }}
                  disabled={isViewer}
                  className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Request changes
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isViewer}
                  title={isViewer ? "Viewers can't do this" : "Shortcut: A"}
                  className={`px-3.5 py-1.5 text-xs font-semibold text-white rounded transition-colors shadow-xs ${
                    isViewer ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  Approve
                </button>
              </div>
            )}

            {item.status === 'Scheduled' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    publishNowPostDestination(item.id, activeDestTab);
                  }}
                  disabled={isViewer}
                  className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Publish now
                </button>
                <button
                  onClick={() => setActiveSection('destinations')}
                  disabled={isViewer}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Reschedule
                </button>
              </div>
            )}

            {item.status === 'Published' && (
              <button
                onClick={() => setActiveSection('results')}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                View results
              </button>
            )}
          </div>
        </div>

        {/* STICKY SECTION NAVIGATION */}
        <div className="px-5 border-b border-gray-200 bg-white flex items-center gap-4 text-xs font-medium text-gray-500 shrink-0 select-none">
          <button
            onClick={() => setActiveSection('content')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeSection === 'content'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveSection('destinations')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeSection === 'destinations'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            Destinations and schedule
          </button>
          {item.status === 'Published' && (
            <button
              onClick={() => setActiveSection('results')}
              className={`py-2.5 border-b-2 transition-colors ${
                activeSection === 'results'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent hover:text-gray-900'
              }`}
            >
              Results
            </button>
          )}
          <button
            onClick={() => setActiveSection('activity')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeSection === 'activity'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            Activity
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* ======================================================== */}
          {/* SECTION 1: CONTENT */}
          {/* ======================================================== */}
          {activeSection === 'content' && (
            <div className="space-y-5">
              {/* If Idea status: "Why this idea" block first */}
              {item.status === 'Idea' && (
                <div className="p-3.5 rounded-[6px] border border-blue-200 bg-blue-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-900 uppercase font-mono tracking-wider">
                      Why this idea
                    </span>
                    {item.source && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-800">
                        {item.source}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-blue-950 space-y-1">
                    <div>
                      <span className="font-semibold text-blue-900">Pain addressed:</span>{' '}
                      {item.painAddressed}
                    </div>
                    <div>
                      <span className="font-semibold text-blue-900">Target keyword:</span>{' '}
                      <span className="font-mono">{item.targetKeyword}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-900">Hook pattern:</span>{' '}
                      {pattern}
                    </div>
                    {item.whyThisIdea && (
                      <div className="text-gray-600 pt-1 text-[11px]">
                        {item.whyThisIdea}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pattern Selector with Structure Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">
                    Content pattern & structure
                  </label>
                  <span className="text-[11px] text-gray-500">
                    {currentPatternConfig.description}
                  </span>
                </div>
                <select
                  value={pattern}
                  onChange={e => {
                    setPattern(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full text-xs rounded border border-gray-300 p-2 bg-white focus:border-blue-600 focus:outline-none"
                >
                  {PATTERNS_LIST.map(p => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {/* Structure checklist */}
                <div className="p-3 rounded border border-gray-200 bg-gray-50 space-y-1.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500 font-semibold mb-1">
                    Pattern structure checklist
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {currentPatternConfig.checklist.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-gray-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[11px] leading-tight">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Base text editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">
                    Base text editor
                  </label>
                  <span className="text-[11px] font-mono text-gray-400">
                    {baseText.length} characters
                  </span>
                </div>
                <textarea
                  ref={editorRef}
                  value={baseText}
                  onChange={e => {
                    setBaseText(e.target.value);
                    setIsDirty(true);
                  }}
                  onBlur={saveDraftAuto}
                  rows={8}
                  className="w-full text-xs sm:text-sm rounded border border-gray-300 p-3 leading-relaxed focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
                  placeholder="Draft your core insight or announcement here..."
                />
              </div>

              {/* Claim & Originality Verification Actions (Plain text, NO AI sparkles) */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={runClaimCheck}
                    disabled={checkLoading !== null}
                    className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                      claimsVerified 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {checkLoading === 'claims' ? 'Checking studio records...' : claimsVerified ? '✓ Claims verified' : 'Check claims'}
                  </button>

                  <button
                    type="button"
                    onClick={runOriginalityCheck}
                    disabled={checkLoading !== null}
                    className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                      originalityVerified 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {checkLoading === 'originality' ? 'Checking library...' : originalityVerified ? '✓ Originality 98%' : 'Check originality'}
                  </button>
                </div>

                <div className="text-[11px] text-gray-400 font-mono">
                  {item.draftedByAgent ? `Drafted by agent ${item.agentTaskId || ''}` : `Written by ${item.author || 'Human'}`}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 2: DESTINATIONS AND SCHEDULE */}
          {/* ======================================================== */}
          {activeSection === 'destinations' && (
            <div className="space-y-6">
              {/* Destination Checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">
                  Publish to destinations
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DESTINATIONS.map(d => {
                    const isSelected = selectedDestinations.includes(d.id);

                    if (d.disabled) {
                      return (
                        <div 
                          key={d.id}
                          className="flex items-center justify-between p-2 rounded border border-gray-200 bg-gray-50 opacity-60 text-xs"
                          title={d.disabledReason}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{PLATFORM_ICONS[d.platform]}</span>
                            <span className="text-gray-600">{d.accountName}</span>
                          </div>
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Needs review
                          </span>
                        </div>
                      );
                    }

                    return (
                      <label 
                        key={d.id}
                        className={`flex items-center justify-between p-2 rounded border text-xs cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50/40 text-blue-900 font-medium' 
                            : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                if (selectedDestinations.length > 1) {
                                  setSelectedDestinations(selectedDestinations.filter(id => id !== d.id));
                                  setIsDirty(true);
                                } else {
                                  showToast('At least one destination must remain selected');
                                }
                              } else {
                                setSelectedDestinations([...selectedDestinations, d.id]);
                                setIsDirty(true);
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{PLATFORM_ICONS[d.platform]}</span>
                          <span>{d.accountName}</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Per-Destination Override Tabs */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">
                    Platform formatting & overrides
                  </label>
                  <span className="text-[11px] text-gray-500">
                    Customize per channel
                  </span>
                </div>

                <div className="flex border-b border-gray-200 gap-2 overflow-x-auto text-xs">
                  {selectedDestinations.map(destId => {
                    const dest = DESTINATIONS.find(d => d.id === destId);
                    if (!dest) return null;
                    const isActive = activeDestTab === destId;

                    return (
                      <button
                        key={destId}
                        onClick={() => setActiveDestTab(destId)}
                        className={`pb-1.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                          isActive
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <span>{PLATFORM_ICONS[dest.platform]}</span>
                        <span>{dest.accountName}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Tab Panel */}
                <div className="p-3 rounded border border-gray-200 bg-gray-50 space-y-3">
                  {/* LinkedIn Override */}
                  {activeDestTab.startsWith('linkedin') && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-700 font-medium">LinkedIn formatting (3,000 char max)</span>
                        <span className="font-mono text-gray-400">
                          {(linkedinPersonalOverride || baseText).length} / 3000
                        </span>
                      </div>
                      <textarea
                        value={linkedinPersonalOverride || baseText}
                        onChange={e => {
                          setLinkedinPersonalOverride(e.target.value);
                          setIsDirty(true);
                        }}
                        rows={5}
                        className="w-full text-xs rounded border border-gray-300 p-2 bg-white focus:outline-none focus:border-blue-600"
                        placeholder="LinkedIn specific override..."
                      />
                    </div>
                  )}

                  {/* Facebook Override */}
                  {activeDestTab === 'facebook_page' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-700 font-medium">Facebook Page copy</span>
                        <span className="font-mono text-gray-400">
                          {(facebookOverride || baseText).length} chars
                        </span>
                      </div>
                      <textarea
                        value={facebookOverride || baseText}
                        onChange={e => {
                          setFacebookOverride(e.target.value);
                          setIsDirty(true);
                        }}
                        rows={4}
                        className="w-full text-xs rounded border border-gray-300 p-2 bg-white focus:outline-none focus:border-blue-600"
                        placeholder="Facebook page copy..."
                      />
                    </div>
                  )}

                  {/* X Override + Warning */}
                  {activeDestTab === 'x_profile' && (
                    <div className="space-y-2.5">
                      {/* Link warning banner */}
                      <div className="p-2.5 rounded border border-amber-200 bg-amber-50/70 text-xs text-amber-900 flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="font-semibold block">Links cost more on X</span>
                          <span className="text-[11px] text-amber-800">
                            External URLs heavily decrease algorithmic reach. Put the link in a reply instead.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setXThreadPosts([...xThreadPosts, 'Link to full breakdown: https://kinetikdynamics.com/blog/teardown']);
                            showToast('Added link to thread reply');
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-amber-900 bg-white border border-amber-300 rounded hover:bg-amber-100/50 shrink-0"
                        >
                          Move link to first reply
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-700 font-medium">Main tweet (280 char limit)</span>
                        <span className="font-mono text-gray-400">
                          {(xOverride || baseText.substring(0, 275)).length} / 280
                        </span>
                      </div>
                      <textarea
                        value={xOverride || baseText.substring(0, 275)}
                        onChange={e => {
                          setXOverride(e.target.value);
                          setIsDirty(true);
                        }}
                        rows={3}
                        maxLength={280}
                        className="w-full text-xs rounded border border-gray-300 p-2 bg-white focus:outline-none focus:border-blue-600"
                      />

                      {/* Thread builder */}
                      {xThreadPosts.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-mono text-gray-500 uppercase font-semibold">
                            Thread replies ({xThreadPosts.length})
                          </span>
                          {xThreadPosts.map((post, idx) => (
                            <div key={idx} className="p-2 bg-white rounded border border-gray-200 text-xs">
                              <span className="text-gray-400 font-mono mr-1.5">{idx + 2}/</span>
                              {post}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Website Override + SEO Checklist */}
                  {activeDestTab === 'website_blog' && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">Article title</label>
                          <input
                            type="text"
                            value={websiteTitle}
                            onChange={e => { setWebsiteTitle(e.target.value); setIsDirty(true); }}
                            className="w-full text-xs rounded border border-gray-300 p-1.5 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">URL slug</label>
                          <input
                            type="text"
                            value={websiteSlug || websiteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                            onChange={e => { setWebsiteSlug(e.target.value); setIsDirty(true); }}
                            className="w-full text-xs rounded border border-gray-300 p-1.5 bg-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-gray-700 font-medium">CMS publishing mode</span>
                        <div className="flex items-center gap-2 text-xs">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="cms_mode"
                              checked={websitePublishMode === 'cms_draft'}
                              onChange={() => setWebsitePublishMode('cms_draft')}
                            />
                            <span>Draft in CMS</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="cms_mode"
                              checked={websitePublishMode === 'publish_live'}
                              onChange={() => setWebsitePublishMode('publish_live')}
                            />
                            <span>Publish Live</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule Table (Per Destination with suggested times and Dhaka/NY time) */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">
                    Schedule table
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameTimeForAll}
                      onChange={e => setSameTimeForAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Same time for all destinations</span>
                  </label>
                </div>

                <div className="text-[11px] font-mono text-gray-500 bg-gray-50 p-2 rounded border border-gray-200 flex items-center justify-between">
                  <span>Times shown in Asia/Dhaka</span>
                  <span className="text-gray-700 font-semibold">= 8:30 AM New York (Audience peak)</span>
                </div>

                <div className="border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 font-mono uppercase text-[10px] text-gray-500">
                      <tr>
                        <th className="p-2.5">Destination</th>
                        <th className="p-2.5">Date & Time</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedDestinations.map(destId => {
                        const dest = DESTINATIONS.find(d => d.id === destId);
                        const sched = item.destinationSchedules[destId] || {
                          destinationId: destId,
                          status: item.status === 'Needs approval' ? 'Pending approval' : item.status === 'Published' ? 'Published' : 'Scheduled',
                          scheduledDate,
                          scheduledTime,
                          audienceTimeInfo: '= 8:30 AM NY'
                        };

                        const isFailed = sched.status === 'Failed';

                        return (
                          <tr key={destId} className="hover:bg-gray-50/50">
                            <td className="p-2.5">
                              <div className="flex items-center gap-1.5">
                                <span>{PLATFORM_ICONS[dest?.platform || 'LinkedIn']}</span>
                                <span className="font-medium text-gray-900">{dest?.accountName}</span>
                              </div>
                            </td>
                            <td className="p-2.5 font-mono text-gray-600">
                              {sched.scheduledDate || scheduledDate} at {sched.scheduledTime || scheduledTime}
                            </td>
                            <td className="p-2.5">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                                isFailed 
                                  ? 'bg-red-50 text-red-700 border-red-200 font-bold' 
                                  : sched.status === 'Published' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : sched.status === 'Pending approval' 
                                      ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              }`}>
                                {sched.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-right space-x-1.5">
                              {isFailed ? (
                                <button
                                  type="button"
                                  onClick={() => retryPostDestination(item.id, destId)}
                                  disabled={isViewer}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                  Retry
                                </button>
                              ) : sched.status === 'Scheduled' ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => publishNowPostDestination(item.id, destId)}
                                    disabled={isViewer}
                                    className="text-[11px] text-gray-600 hover:text-gray-900"
                                  >
                                    Publish now
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => cancelPostDestination(item.id, destId)}
                                    disabled={isViewer}
                                    className="text-[11px] text-gray-500 hover:text-red-600"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : sched.status === 'Pending approval' && !isViewer ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => approvePostDestination(item.id, destId)}
                                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRejectingDestId(destId);
                                      setRejectionModalOpen(true);
                                    }}
                                    className="text-xs text-gray-500 hover:text-red-700"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 3: RESULTS (For Published Items) */}
          {/* ======================================================== */}
          {activeSection === 'results' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded border border-gray-200 bg-gray-50">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500 font-semibold">
                    Impressions
                  </div>
                  <div className="text-xl font-bold font-mono text-gray-900 mt-1">
                    {(item.impressions || 4890).toLocaleString()}
                  </div>
                </div>

                <div className="p-3.5 rounded border border-gray-200 bg-gray-50">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500 font-semibold">
                    Engagements
                  </div>
                  <div className="text-xl font-bold font-mono text-gray-900 mt-1">
                    {(item.engagements || 230).toLocaleString()}
                  </div>
                </div>

                <div className="p-3.5 rounded border border-gray-200 bg-gray-50">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500 font-semibold">
                    Replies / DMs
                  </div>
                  <div className="text-xl font-bold font-mono text-gray-900 mt-1">
                    {item.repliesOrDms || 8}
                  </div>
                </div>
              </div>

              {/* Linked Deal */}
              {item.linkedDeals ? (
                <div className="p-3.5 rounded border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-900 block">
                      Linked Pipeline Revenue Attributed
                    </span>
                    <span className="text-xs text-emerald-800">
                      {item.linkedDealCompany || 'Inbound client deal initiated from direct post engagement'}
                    </span>
                  </div>
                  <span className="text-sm font-bold font-mono text-emerald-700 bg-white px-2.5 py-1 rounded border border-emerald-300">
                    +${item.linkedDeals.toLocaleString()}
                  </span>
                </div>
              ) : null}

              {/* External Post Links */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-700 block">
                  Live Post Links
                </span>
                <div className="space-y-1.5 text-xs">
                  {selectedDestinations.map(dId => {
                    const sched = item.destinationSchedules[dId];
                    const liveUrl = sched?.livePostUrl || `https://example.com/${dId}/post/${item.id}`;

                    return (
                      <a
                        key={dId}
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded border border-gray-200 bg-white hover:bg-gray-50 text-blue-600 transition-colors"
                      >
                        <span className="font-medium text-gray-800 capitalize">
                          {dId.replace('_', ' · ')}
                        </span>
                        <div className="flex items-center gap-1 text-xs">
                          <span>Open external post</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 4: ACTIVITY */}
          {/* ======================================================== */}
          {activeSection === 'activity' && (
            <div className="space-y-5">
              {/* Timeline */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-700 block">
                  Event history
                </span>
                <div className="border border-gray-200 rounded divide-y divide-gray-100 text-xs">
                  {(item.auditTrail || [
                    { date: 'Today (just now)', action: 'Created content item', actor: 'human' }
                  ]).map((event, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${
                          event.actor === 'agent' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {event.actor}
                        </span>
                        <span className="text-gray-800">{event.action}</span>
                      </div>
                      <span className="font-mono text-gray-400 text-[11px]">
                        {event.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment box */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-700 block">
                  Internal notes & comments
                </span>
                
                {item.comments && item.comments.length > 0 && (
                  <div className="space-y-1.5 mb-2">
                    {item.comments.map(c => (
                      <div key={c.id} className="p-2.5 rounded bg-gray-50 border border-gray-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                          <span className="font-semibold text-gray-700">{c.author}</span>
                          <span>{c.date}</span>
                        </div>
                        <p className="text-gray-800">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleAddComment} className="space-y-2">
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    rows={2}
                    className="w-full text-xs rounded border border-gray-300 p-2 focus:border-blue-600 focus:outline-none"
                    placeholder="Add an internal note or revision feedback..."
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-3 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      Post comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* REJECTION REASON MODAL */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[6px] border border-gray-200 shadow-xl max-w-sm w-full p-4 space-y-3">
            <h4 className="text-xs font-bold text-gray-900">
              {rejectingDestId ? `Reject Destination: ${rejectingDestId}` : 'Request Changes & Return to Draft'}
            </h4>
            <p className="text-xs text-gray-600">
              Provide specific feedback so the drafting agent or editor can revise the copy:
            </p>
            <textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={3}
              className="w-full text-xs rounded border border-gray-300 p-2 focus:border-red-600 focus:outline-none"
              placeholder="e.g. Tone too informal; need harder statistics on the first paragraph..."
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRejectionModalOpen(false)}
                className="px-2.5 py-1 text-xs text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestChanges}
                className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700"
              >
                Confirm request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISCARD CHANGES CONFIRM MODAL */}
      {discardConfirmOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[6px] border border-gray-200 shadow-xl max-w-sm w-full p-4 space-y-3">
            <h4 className="text-xs font-bold text-gray-900">
              Discard unsaved edits?
            </h4>
            <p className="text-xs text-gray-600">
              You have unsaved changes in this post. Do you want to discard them and close the drawer?
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDiscardConfirmOpen(false)}
                className="px-2.5 py-1 text-xs text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Keep editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setDiscardConfirmOpen(false);
                  setIsDirty(false);
                  onClose();
                }}
                className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700"
              >
                Discard & close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
