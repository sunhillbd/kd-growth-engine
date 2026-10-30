import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ContentItem, DestinationId, WebsitePostData } from '../../types';
import { DESTINATIONS, getAudienceEquivalentTime } from '../../mock/destinations';
import { Modal } from '../../components/common/Modal';
import { 
  ArrowLeft, Upload, Link2, ShieldCheck, FileText, 
  AlertTriangle, CheckCircle2, Clock, Plus, Trash2, HelpCircle 
} from 'lucide-react';

export const ComposePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { content, addPost, updatePost, proof, approvalMode, showToast, userRole } = useStore();

  const postId = searchParams.get('id');
  const existingPost = content.find(c => c.id === postId);

  // 1. Content: Base text & Media
  const [topic, setTopic] = useState(existingPost?.topic || 'Lessons from building 10+ AI automated workflows');
  const [baseText, setBaseText] = useState(
    existingPost?.baseText || 
    'Most operations teams spend 20+ hours weekly re-keying invoice data into their ERP. Here is how we deploy human-in-the-loop LLM pipelines with 99% accuracy in 2 weeks:\n\n1. Structured schema validation\n2. Exception queues for items under 95% confidence\n3. Real-time webhooks directly into CargoWise or NetSuite.\n\nRead our full breakdown on kinetikdynamics.com/case-studies.'
  );
  const [attachedMedia, setAttachedMedia] = useState<string | null>(existingPost?.attachedMedia || null);

  // 2. Publish to: Destination checkboxes (at least one selected)
  const [selectedDestinations, setSelectedDestinations] = useState<DestinationId[]>(
    existingPost?.selectedDestinations || ['linkedin_personal', 'x_profile']
  );

  // Active Tab for destination overrides (must be one of selected)
  const [activeTab, setActiveTab] = useState<DestinationId>('linkedin_personal');

  // Per-destination override states
  const [linkedinPersonalOverride, setLinkedinPersonalOverride] = useState(existingPost?.linkedinPersonalOverride || '');
  const [linkedinPersonalCarousel, setLinkedinPersonalCarousel] = useState(existingPost?.linkedinPersonalCarousel || '');

  const [linkedinCompanyOverride, setLinkedinCompanyOverride] = useState(existingPost?.linkedinCompanyOverride || '');

  const [facebookOverride, setFacebookOverride] = useState(existingPost?.facebookOverride || '');
  const [facebookPage, setFacebookPage] = useState('Kinetik Dynamics Studio');

  const [xOverride, setXOverride] = useState(existingPost?.xOverride || '');
  const [xThreadPosts, setXThreadPosts] = useState<string[]>(existingPost?.xThreadPosts || [
    '2/ Always use Pydantic or Zod schemas to enforce structured output types before database writes.',
    '3/ Human-in-the-loop review should take under 10 seconds per flagged document.'
  ]);

  const [websiteData, setWebsiteData] = useState<WebsitePostData>(existingPost?.websiteData || {
    title: 'Deploying Production AI Workflows with 99% Accuracy',
    slug: 'deploying-production-ai-workflows',
    metaDescription: 'How Kinetik Dynamics engineers reliable, schema-validated document pipelines for freight and finance operations.',
    category: 'Engineering Architecture',
    featuredImage: 'workflow_pipeline_diagram.png',
    targetKeyword: 'AI automated workflow pipeline',
    publishMode: 'cms_draft',
    seoChecklist: {
      keywordInTitle: true,
      oneH1: true,
      faqSection: true,
      schemaType: 'TechArticle'
    }
  });

  // 4. Schedule panel state
  const [scheduleMode, setScheduleMode] = useState<'publish_now' | 'schedule' | 'draft'>('schedule');
  const [sameTimeForAll, setSameTimeForAll] = useState(true);
  const [globalDate, setGlobalDate] = useState('2026-11-04');
  const [globalTime, setGlobalTime] = useState('18:30');

  // Per-destination specific times when sameTimeForAll is false
  const [destinationDates, setDestinationDates] = useState<Record<string, { date: string; time: string }>>({
    linkedin_personal: { date: '2026-11-04', time: '18:30' },
    linkedin_company: { date: '2026-11-04', time: '18:30' },
    facebook_page: { date: '2026-11-04', time: '22:00' },
    x_profile: { date: '2026-11-04', time: '19:00' },
    website_blog: { date: '2026-11-04', time: '20:00' }
  });

  // Fact check claims modal state
  const [claimsChecked, setClaimsChecked] = useState(false);
  const [claimFlag, setClaimFlag] = useState<string | null>(null);

  // Proof insertion modal
  const [proofModalOpen, setProofModalOpen] = useState(false);

  // Review & Confirm dialog before primary action
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Fallback active tab if current tab is deselected
  const effectiveActiveTab = selectedDestinations.includes(activeTab) 
    ? activeTab 
    : selectedDestinations[0] || 'linkedin_personal';

  // Toggle destination selection
  const handleToggleDestination = (destId: DestinationId) => {
    const config = DESTINATIONS.find(d => d.id === destId);
    if (config?.disabled) return;

    if (selectedDestinations.includes(destId)) {
      if (selectedDestinations.length === 1) {
        showToast('At least one destination must be selected');
        return;
      }
      setSelectedDestinations(selectedDestinations.filter(d => d !== destId));
    } else {
      setSelectedDestinations([...selectedDestinations, destId]);
    }
  };

  // Helper for Suggested Times per destination
  const handleApplySuggestedTime = (destId: DestinationId) => {
    let suggestedDate = '2026-11-04';
    let suggestedTime = '18:30';

    if (destId === 'facebook_page') suggestedTime = '22:00'; // 12 PM NY
    if (destId === 'x_profile') suggestedTime = '19:00'; // 9 AM NY
    if (destId === 'website_blog') suggestedTime = '20:00'; // 10 AM NY

    if (sameTimeForAll) {
      setGlobalDate(suggestedDate);
      setGlobalTime(suggestedTime);
    } else {
      setDestinationDates(prev => ({
        ...prev,
        [destId]: { date: suggestedDate, time: suggestedTime }
      }));
    }
    showToast(`Applied optimal time for ${destId}`);
  };

  // One-click Move link to first reply for X
  const handleMoveLinkToReply = () => {
    const activeXText = xOverride || baseText;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = activeXText.match(urlRegex);

    if (matches && matches.length > 0) {
      const link = matches[0];
      const cleanedText = activeXText.replace(link, '').trim();
      setXOverride(cleanedText);
      setXThreadPosts(prev => [`Read the full case study here: ${link}`, ...prev]);
      showToast('Moved link to first reply in X thread');
    }
  };

  // Check claims against Brain
  const handleCheckClaims = () => {
    setClaimsChecked(true);
    if (baseText.includes('50+ clients') || baseText.includes('10+ AI automated')) {
      setClaimFlag('Claim unverified: "10+ AI automated workflows" is higher than the 8 verified case studies on record in your Brain proof library.');
    } else {
      setClaimFlag(null);
      showToast('All factual claims match verified Brain proof items');
    }
  };

  // Insert proof citation into base text
  const handleInsertProof = (proofItem: typeof proof[0]) => {
    const citation = `\n\nReference: ${proofItem.title} (${proofItem.result})`;
    setBaseText(prev => prev + citation);
    setProofModalOpen(false);
    showToast(`Inserted proof for ${proofItem.clientType}`);
  };

  // Primary action button calculation
  const getPrimaryButtonLabel = () => {
    if (approvalMode === 'manual') {
      return 'Send for approval';
    }
    if (scheduleMode === 'publish_now') {
      return 'Publish now';
    }
    return `Schedule ${selectedDestinations.length} post${selectedDestinations.length > 1 ? 's' : ''}`;
  };

  // Confirm scheduling after review modal
  const handleConfirmAction = () => {
    const schedules: Record<string, any> = {};

    selectedDestinations.forEach(destId => {
      const dDate = sameTimeForAll ? globalDate : (destinationDates[destId]?.date || globalDate);
      const dTime = sameTimeForAll ? globalTime : (destinationDates[destId]?.time || globalTime);
      const audienceInfo = getAudienceEquivalentTime(dTime);

      schedules[destId] = {
        destinationId: destId,
        status: scheduleMode === 'draft' ? 'Draft' : approvalMode === 'manual' ? 'Pending approval' : scheduleMode === 'publish_now' ? 'Published' : 'Scheduled',
        scheduledDate: dDate,
        scheduledTime: dTime,
        audienceTimeInfo: audienceInfo,
        livePostUrl: scheduleMode === 'publish_now' ? `https://example.com/published/${destId}` : undefined
      };
    });

    const newItem: ContentItem = {
      id: existingPost?.id || `post-${Date.now()}`,
      topic,
      format: selectedDestinations.includes('website_blog') ? 'Website article' : 'LinkedIn post',
      painAddressed: 'Operational engineering bottlenecks',
      targetKeyword: websiteData.targetKeyword,
      baseText,
      attachedMedia: attachedMedia || undefined,
      draftedByAgent: false,
      selectedDestinations,
      destinationSchedules: schedules,
      linkedinPersonalOverride: linkedinPersonalOverride || undefined,
      linkedinPersonalCarousel: linkedinPersonalCarousel || undefined,
      linkedinCompanyOverride: linkedinCompanyOverride || undefined,
      facebookOverride: facebookOverride || undefined,
      xOverride: xOverride || undefined,
      xThreadPosts: xThreadPosts.length > 0 ? xThreadPosts : undefined,
      websiteData: selectedDestinations.includes('website_blog') ? websiteData : undefined,
      status: scheduleMode === 'draft' ? 'Draft' : approvalMode === 'manual' ? 'Needs approval' : scheduleMode === 'publish_now' ? 'Published' : 'Scheduled',
      scheduledDay: globalDate,
      scheduledTime: `${globalTime} (Asia/Dhaka)`
    };

    if (existingPost) {
      updatePost(newItem);
    } else {
      addPost(newItem);
    }

    setReviewModalOpen(false);

    if (approvalMode === 'manual' && scheduleMode !== 'draft') {
      navigate('/content/approvals');
    } else if (scheduleMode === 'schedule') {
      navigate('/content/calendar');
    } else {
      navigate('/content/posts');
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50 overflow-hidden">
      {/* Top Header */}
      <div className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/content/plan')}
            className="p-1 text-gray-500 hover:text-gray-900 rounded"
            title="Back to plan"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <span className="text-xs font-semibold text-gray-900">
            {existingPost ? 'Edit Post & Schedules' : 'Compose Multi-Destination Post'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCheckClaims}
            className="text-xs px-2.5 py-1 border border-gray-300 rounded-[6px] hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" strokeWidth={1.5} />
            <span>Check claims against Brain</span>
          </button>

          <button
            type="button"
            onClick={() => setProofModalOpen(true)}
            className="text-xs px-2.5 py-1 border border-gray-300 rounded-[6px] hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.5} />
            <span>Insert proof</span>
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-6xl w-full mx-auto">
        {/* Working Topic */}
        <div className="bg-white border border-gray-200 rounded-[6px] p-4">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
            Internal Working Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
          />
        </div>

        {/* Fact-check Warning Banner */}
        {claimsChecked && claimFlag && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-[6px] text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <span className="font-semibold block">Fact-check Warning</span>
              <span>{claimFlag}</span>
            </div>
          </div>
        )}

        {/* 1. Base Text & Media Editor */}
        <div className="bg-white border border-gray-200 rounded-[6px] p-4 space-y-3">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-700 font-semibold">
            1. Base Content Text & Media
          </label>
          <textarea
            rows={7}
            value={baseText}
            onChange={e => setBaseText(e.target.value)}
            placeholder="Write core post copy that will be shared across all selected destinations..."
            className="w-full p-3 border border-gray-300 rounded-[6px] text-xs leading-relaxed outline-none focus:border-blue-600 font-sans"
          />

          <div className="p-3 border border-gray-200 rounded-[6px] bg-gray-50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <Upload className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
              <span>{attachedMedia ? `Attached media: ${attachedMedia}` : 'No image or PDF carousel attached'}</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachedMedia(attachedMedia ? null : 'workflow_architecture_diagram.png')}
              className="text-[11px] font-medium text-blue-600 hover:underline"
            >
              {attachedMedia ? 'Remove file' : 'Choose media file'}
            </button>
          </div>
        </div>

        {/* 2. Publish to: Destination Checkboxes */}
        <div className="bg-white border border-gray-200 rounded-[6px] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-700 font-semibold">
              2. Publish to (Destinations)
            </label>
            <span className="text-[11px] font-mono text-gray-400">
              {selectedDestinations.length} destination{selectedDestinations.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {DESTINATIONS.map(dest => {
              const isSelected = selectedDestinations.includes(dest.id);
              const isDisabled = Boolean(dest.disabled);

              return (
                <div
                  key={dest.id}
                  onClick={() => !isDisabled && handleToggleDestination(dest.id)}
                  className={`p-3 border rounded-[6px] flex items-start gap-3 transition-colors ${
                    isDisabled 
                      ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-75' 
                      : isSelected 
                      ? 'bg-blue-50/50 border-blue-400 cursor-pointer' 
                      : 'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => {}} // handled by div click
                    className="mt-0.5 rounded text-blue-600 w-4 h-4 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-900 text-xs truncate">
                        {dest.subName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        dest.statusDot === 'connected' ? 'bg-emerald-500' :
                        dest.statusDot === 'pending_review' ? 'bg-amber-500' : 'bg-gray-400'
                      }`}></span>
                      <span className="truncate">{dest.accountName}</span>
                    </div>

                    {isDisabled && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                        <span>{dest.disabledReason}</span>
                        <Link to="/settings" className="text-blue-600 hover:underline shrink-0 ml-1">
                          Connections &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Per-Destination Tabs under Editor */}
        <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-700 font-semibold">
              3. Per-Destination Overrides & Platform Rules
            </span>
            <span className="text-[11px] font-mono text-gray-400">
              Active tab: {DESTINATIONS.find(d => d.id === effectiveActiveTab)?.platform}
            </span>
          </div>

          {/* Sub-tabs for each selected destination */}
          <div className="border-b border-gray-200 flex gap-4 px-5 pt-2">
            {selectedDestinations.map(destId => {
              const config = DESTINATIONS.find(d => d.id === destId);
              const isActive = effectiveActiveTab === destId;

              return (
                <button
                  key={destId}
                  onClick={() => setActiveTab(destId)}
                  className={`pb-2.5 text-xs font-medium border-b-2 transition-colors ${
                    isActive 
                      ? 'border-blue-600 text-blue-600 font-semibold' 
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {config?.subName}
                </button>
              );
            })}
          </div>

          <div className="p-5">
            {/* Tab: LinkedIn (Personal) */}
            {effectiveActiveTab === 'linkedin_personal' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">
                    LinkedIn Override (Alex Mercer Profile)
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">
                    {(linkedinPersonalOverride || baseText).length} / 3,000 characters
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={linkedinPersonalOverride}
                  onChange={e => setLinkedinPersonalOverride(e.target.value)}
                  placeholder="Leave empty to use base text, or enter specific text for LinkedIn..."
                  className="w-full p-3 border border-gray-300 rounded-[6px] text-xs leading-relaxed outline-none focus:border-blue-600"
                />

                <div className="p-3 border border-gray-200 rounded-[6px] bg-gray-50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-gray-800 block">Optional PDF Carousel Document</span>
                    <span className="text-gray-500 text-[11px]">
                      {linkedinPersonalCarousel ? `Loaded: ${linkedinPersonalCarousel}` : 'Upload PDF slides for native LinkedIn swipeable carousel'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLinkedinPersonalCarousel(linkedinPersonalCarousel ? '' : 'freight_carousel_deck.pdf')}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    {linkedinPersonalCarousel ? 'Remove PDF' : 'Upload PDF'}
                  </button>
                </div>
              </div>
            )}

            {/* Tab: LinkedIn (Company Page) */}
            {effectiveActiveTab === 'linkedin_company' && (
              <div className="space-y-3">
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-[6px] text-xs text-blue-900">
                  <span className="font-semibold">Posting as Kinetik Dynamics</span> (Company Page)
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Company Page Override</span>
                  <span className="text-[11px] font-mono text-gray-400">
                    {(linkedinCompanyOverride || baseText).length} / 3,000 characters
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={linkedinCompanyOverride}
                  onChange={e => setLinkedinCompanyOverride(e.target.value)}
                  placeholder="Enter specific copy for company followers..."
                  className="w-full p-3 border border-gray-300 rounded-[6px] text-xs leading-relaxed outline-none focus:border-blue-600"
                />
              </div>
            )}

            {/* Tab: Facebook */}
            {effectiveActiveTab === 'facebook_page' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Target Facebook Page</label>
                    <select
                      value={facebookPage}
                      onChange={e => setFacebookPage(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-[6px] bg-white outline-none text-xs"
                    >
                      <option>Kinetik Dynamics Studio</option>
                      <option>Kinetik Lab Announcements</option>
                    </select>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-700 mb-1">Attached Link Preview</span>
                    <span className="text-xs text-gray-500 font-mono">kinetikdynamics.com/case-studies</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Facebook Post Text</label>
                  <textarea
                    rows={6}
                    value={facebookOverride}
                    onChange={e => setFacebookOverride(e.target.value)}
                    placeholder="Enter copy optimized for Facebook Page audience..."
                    className="w-full p-3 border border-gray-300 rounded-[6px] text-xs leading-relaxed outline-none focus:border-blue-600"
                  />
                </div>

                {/* Facebook Link Preview Card */}
                <div className="p-3 border border-gray-200 rounded-[6px] bg-gray-50 text-xs space-y-1">
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wide block">Facebook Link Preview</span>
                  <div className="font-semibold text-gray-900">Custom Automation Workflows in 2 Weeks | Kinetik Dynamics</div>
                  <p className="text-gray-500 text-[11px]">How boutique software engineering solves document bottlenecks.</p>
                </div>
              </div>
            )}

            {/* Tab: X (@kinetikdynamics) */}
            {effectiveActiveTab === 'x_profile' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">
                    Main Tweet Copy (@kinetikdynamics)
                  </span>
                  <span className={`text-[11px] font-mono tabular-nums ${
                    (xOverride || baseText).length > 280 ? 'text-rose-600 font-bold' : 'text-gray-400'
                  }`}>
                    {(xOverride || baseText).length} / 280 characters
                  </span>
                </div>

                {/* X Link Warning & One-Click Fix */}
                {(xOverride || baseText).includes('http') || (xOverride || baseText).includes('.com') ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-[6px] text-xs text-amber-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-amber-700 shrink-0" strokeWidth={1.5} />
                      <span>Links cost more on X; put the link in a reply to maximize reach.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleMoveLinkToReply}
                      className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-medium rounded text-xs transition-colors shrink-0 ml-2"
                    >
                      Move link to first reply
                    </button>
                  </div>
                ) : null}

                <textarea
                  rows={4}
                  value={xOverride}
                  onChange={e => setXOverride(e.target.value)}
                  placeholder="Enter tweet copy within 280 characters..."
                  className="w-full p-3 border border-gray-300 rounded-[6px] text-xs leading-relaxed outline-none focus:border-blue-600"
                />

                {/* Thread Builder */}
                <div className="pt-2 border-t border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
                      Thread Builder ({xThreadPosts.length} follow-up tweets)
                    </span>
                    <button
                      type="button"
                      onClick={() => setXThreadPosts([...xThreadPosts, ''])}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add post to thread</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {xThreadPosts.map((tweet, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="font-mono text-xs text-gray-400 mt-2 shrink-0">
                          {idx + 2}/
                        </span>
                        <input
                          type="text"
                          value={tweet}
                          onChange={e => {
                            const updated = [...xThreadPosts];
                            updated[idx] = e.target.value;
                            setXThreadPosts(updated);
                          }}
                          placeholder={`Thread tweet #${idx + 2}...`}
                          className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setXThreadPosts(xThreadPosts.filter((_, i) => i !== idx))}
                          className="p-2 text-gray-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Website */}
            {effectiveActiveTab === 'website_blog' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Article Title</label>
                    <input
                      type="text"
                      value={websiteData.title}
                      onChange={e => setWebsiteData({ ...websiteData, title: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-[6px] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">URL Slug</label>
                    <div className="flex items-center">
                      <span className="text-gray-400 font-mono text-[11px] mr-1">/case-studies/</span>
                      <input
                        type="text"
                        value={websiteData.slug}
                        onChange={e => setWebsiteData({ ...websiteData, slug: e.target.value })}
                        className="flex-1 text-xs px-3 py-1.5 border border-gray-300 rounded-[6px] outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Target Keyword</label>
                    <input
                      type="text"
                      value={websiteData.targetKeyword}
                      onChange={e => setWebsiteData({ ...websiteData, targetKeyword: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-[6px] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">CMS Publish Mode</label>
                    <select
                      value={websiteData.publishMode}
                      onChange={e => setWebsiteData({ ...websiteData, publishMode: e.target.value as any })}
                      className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-[6px] bg-white outline-none font-medium"
                    >
                      <option value="cms_draft">Create as draft in the CMS</option>
                      <option value="publish_live">Publish live</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Excerpt / Meta Description</label>
                  <textarea
                    rows={2}
                    value={websiteData.metaDescription}
                    onChange={e => setWebsiteData({ ...websiteData, metaDescription: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-[6px] outline-none"
                  />
                </div>

                {/* Simple SEO Checklist */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-[6px] space-y-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-gray-700 block">
                    SEO Pre-Publish Checklist
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Target keyword in H1 & title</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Exactly one H1 tag present</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>FAQ section schema markup</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-600">
                      <span>Schema: {websiteData.seoChecklist.schemaType}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Schedule Panel (Table with one row per selected destination) */}
        <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-700 font-semibold block">
                4. Multi-Destination Schedule Panel
              </span>
              <p className="text-xs text-gray-500 mt-0.5">
                Times shown in Asia/Dhaka with audience time calculated per row.
              </p>
            </div>

            {/* Controls: Radio Mode & Same Time Toggle */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleMode"
                    checked={scheduleMode === 'publish_now'}
                    onChange={() => setScheduleMode('publish_now')}
                  />
                  <span>Publish now</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleMode"
                    checked={scheduleMode === 'schedule'}
                    onChange={() => setScheduleMode('schedule')}
                  />
                  <span>Schedule</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleMode"
                    checked={scheduleMode === 'draft'}
                    onChange={() => setScheduleMode('draft')}
                  />
                  <span>Save as draft</span>
                </label>
              </div>

              {scheduleMode === 'schedule' && (
                <label className="flex items-center gap-1.5 font-medium text-gray-700 border-l border-gray-200 pl-4 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameTimeForAll}
                    onChange={e => setSameTimeForAll(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Same time for all</span>
                </label>
              )}
            </div>
          </div>

          {/* Master Date/Time row if Same Time for All is ON */}
          {scheduleMode === 'schedule' && sameTimeForAll && (
            <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-[6px] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-mono">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-gray-900">Universal Dispatch Time:</span>
                <input
                  type="date"
                  value={globalDate}
                  onChange={e => setGlobalDate(e.target.value)}
                  className="px-2 py-1 bg-white border border-gray-300 rounded font-mono text-xs"
                />
                <input
                  type="time"
                  value={globalTime}
                  onChange={e => setGlobalTime(e.target.value)}
                  className="px-2 py-1 bg-white border border-gray-300 rounded font-mono text-xs"
                />
                <span className="text-gray-500">{getAudienceEquivalentTime(globalTime)}</span>
              </div>
            </div>
          )}

          {/* Schedule Table */}
          <div className="border border-gray-200 rounded-[6px] overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
                  <th className="py-2.5 px-3 font-normal">Destination</th>
                  <th className="py-2.5 px-3 font-normal">Scheduled Date</th>
                  <th className="py-2.5 px-3 font-normal">Scheduled Time (Dhaka)</th>
                  <th className="py-2.5 px-3 font-normal">Audience Equivalent</th>
                  <th className="py-2.5 px-3 font-normal">Suggested Time</th>
                  <th className="py-2.5 px-3 font-normal text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedDestinations.map(destId => {
                  const cfg = DESTINATIONS.find(d => d.id === destId);
                  const dDate = sameTimeForAll ? globalDate : (destinationDates[destId]?.date || globalDate);
                  const dTime = sameTimeForAll ? globalTime : (destinationDates[destId]?.time || globalTime);
                  const isPast = scheduleMode === 'schedule' && dDate < '2026-10-28';
                  const isXCapWarning = destId === 'x_profile' && scheduleMode === 'schedule' && dTime === '12:00';

                  return (
                    <tr 
                      key={destId} 
                      className={`h-11 transition-colors ${
                        isPast || isXCapWarning ? 'bg-amber-50/70' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-2 px-3 font-semibold text-gray-900">
                        {cfg?.subName}
                      </td>

                      <td className="py-2 px-3 font-mono">
                        {sameTimeForAll || scheduleMode !== 'schedule' ? (
                          <span className="text-gray-700">{scheduleMode === 'publish_now' ? 'Immediate' : dDate}</span>
                        ) : (
                          <input
                            type="date"
                            value={destinationDates[destId]?.date || globalDate}
                            onChange={e => {
                              const val = e.target.value;
                              setDestinationDates(prev => ({
                                ...prev,
                                [destId]: { date: val, time: prev[destId]?.time || globalTime }
                              }));
                            }}
                            className="px-2 py-0.5 border border-gray-300 rounded font-mono text-xs"
                          />
                        )}
                      </td>

                      <td className="py-2 px-3 font-mono">
                        {sameTimeForAll || scheduleMode !== 'schedule' ? (
                          <span className="text-gray-700">{scheduleMode === 'publish_now' ? 'Now' : dTime}</span>
                        ) : (
                          <input
                            type="time"
                            value={destinationDates[destId]?.time || globalTime}
                            onChange={e => {
                              const val = e.target.value;
                              setDestinationDates(prev => ({
                                ...prev,
                                [destId]: { date: prev[destId]?.date || globalDate, time: val }
                              }));
                            }}
                            className="px-2 py-0.5 border border-gray-300 rounded font-mono text-xs"
                          />
                        )}
                      </td>

                      <td className="py-2 px-3 font-mono text-gray-500 text-[11px]">
                        {scheduleMode === 'publish_now' ? '= Now in New York' : getAudienceEquivalentTime(dTime)}
                      </td>

                      <td className="py-2 px-3">
                        <button
                          type="button"
                          onClick={() => handleApplySuggestedTime(destId)}
                          className="text-[11px] text-blue-600 hover:underline font-mono"
                        >
                          Fill optimal window
                        </button>
                      </td>

                      <td className="py-2 px-3 text-center">
                        {isPast ? (
                          <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-semibold">
                            Time in past
                          </span>
                        ) : isXCapWarning ? (
                          <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-semibold">
                            Daily cap warning
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-gray-600">
                            {scheduleMode === 'draft' ? 'Draft' : scheduleMode === 'publish_now' ? 'Ready' : 'Scheduled'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Footer with Save Draft & Dynamic Primary Action */}
      <div className="h-14 border-t border-gray-200 bg-white px-6 flex items-center justify-between shrink-0">
        <div className="text-xs text-gray-500 font-mono">
          Approval mode: <span className="font-semibold text-gray-800">{approvalMode === 'manual' ? 'Manual review' : 'Auto-schedule'}</span> (configurable in Settings)
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setScheduleMode('draft');
              setReviewModalOpen(true);
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-[6px] hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => setReviewModalOpen(true)}
            disabled={userRole === 'Viewer'}
            title={userRole === 'Viewer' ? "Viewers can't do this" : undefined}
            className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-[6px] flex items-center gap-1.5 transition-colors shadow-sm ${
              userRole === 'Viewer'
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                : 'text-white bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <span>{getPrimaryButtonLabel()}</span>
          </button>
        </div>
      </div>

      {/* 6. Review Dialog before Primary Action */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Review & Confirm Scheduling"
        description="Verify target destinations, dispatch times, and content overrides before dispatch."
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="border border-gray-200 rounded-[6px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
                  <th className="py-2 px-3">Destination</th>
                  <th className="py-2 px-3">Text Excerpt</th>
                  <th className="py-2 px-3">Scheduled Date & Time</th>
                  <th className="py-2 px-3 text-right">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedDestinations.map(destId => {
                  const cfg = DESTINATIONS.find(d => d.id === destId);
                  const dDate = sameTimeForAll ? globalDate : (destinationDates[destId]?.date || globalDate);
                  const dTime = sameTimeForAll ? globalTime : (destinationDates[destId]?.time || globalTime);

                  return (
                    <tr key={destId} className="h-10 hover:bg-gray-50">
                      <td className="py-1 px-3 font-semibold text-gray-900">
                        {cfg?.subName}
                      </td>
                      <td className="py-1 px-3 text-gray-600 max-w-xs truncate">
                        {baseText.substring(0, 45)}...
                      </td>
                      <td className="py-1 px-3 font-mono text-gray-800">
                        {scheduleMode === 'publish_now' ? 'Now' : `${dDate} ${dTime}`}
                      </td>
                      <td className="py-1 px-3 text-right font-mono text-gray-400">
                        {destId === 'website_blog' && websiteData.publishMode === 'cms_draft' ? 'CMS Draft' : 'Standard'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-[6px] hover:bg-gray-50"
            >
              Back to Editor
            </button>
            <button
              onClick={handleConfirmAction}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-[6px] hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {/* Insert Proof Modal */}
      <Modal
        isOpen={proofModalOpen}
        onClose={() => setProofModalOpen(false)}
        title="Insert Case Study from Brain"
        description="Select a verified client case study to reference in your post copy."
        maxWidth="lg"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {proof.map(p => (
            <div
              key={p.id}
              onClick={() => handleInsertProof(p)}
              className="p-3 border border-gray-200 rounded-[6px] hover:bg-gray-50 cursor-pointer text-xs space-y-1 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{p.title}</span>
                <span className="font-mono text-gray-400 text-[11px]">{p.industry}</span>
              </div>
              <p className="text-gray-600">{p.result}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
