import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lead } from '../../types';
import { 
  CheckCircle2, XCircle, Clock, ExternalLink, RefreshCw, 
  ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, 
  HelpCircle, Sparkles, Filter 
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const QueuePage: React.FC = () => {
  const { leads, approveLead, rejectLead, snoozeLead, updateLeadMessage, resetDemoData, offers, proof, icps, userRole } = useStore();

  // If Brain has no ICPs, show plain empty state
  if (icps.length === 0) {
    return (
      <div className="h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center p-8 text-center space-y-3 font-sans">
        <h3 className="text-sm font-semibold text-gray-900">
          No ICPs configured in Brain
        </h3>
        <p className="text-xs text-gray-500 max-w-sm">
          Until the Brain has data, the lead queue cannot score buying signals. Finish your ICPs to start finding leads.
        </p>
        <a
          href="/brain/icps"
          className="text-xs font-medium py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] transition-colors"
        >
          Finish your ICPs to start finding leads
        </a>
      </div>
    );
  }

  // Waiting leads in queue are stage === 'Qualified'
  const waitingLeads = leads.filter(l => l.stage === 'Qualified');

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(waitingLeads[0]?.id || null);

  // Filters
  const [filterIcp, setFilterIcp] = useState<string>('all');
  const [filterOffer, setFilterOffer] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);

  // Re-run audit fake state
  const [isAuditing, setIsAuditing] = useState(false);

  // Reject modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Bad ICP fit');

  // Follow-ups expanded state
  const [followUpsOpen, setFollowUpsOpen] = useState(false);

  // Filtered list
  const filteredLeads = waitingLeads.filter(l => {
    if (filterIcp !== 'all' && l.icpId !== filterIcp) return false;
    if (filterOffer !== 'all' && l.offerId !== filterOffer) return false;
    if (filterSource !== 'all' && !l.source.toLowerCase().includes(filterSource.toLowerCase())) return false;
    if (l.score < minScore) return false;
    return true;
  });

  // Current selected lead
  const currentLead = filteredLeads.find(l => l.id === selectedLeadId) || filteredLeads[0] || null;

  // Sync selectedLeadId if current was removed or empty
  useEffect(() => {
    if ((!selectedLeadId || !filteredLeads.some(l => l.id === selectedLeadId)) && filteredLeads.length > 0) {
      setSelectedLeadId(filteredLeads[0].id);
    }
  }, [filteredLeads, selectedLeadId]);

  // Keyboard navigation: ArrowUp, ArrowDown, A (approve), R (reject)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') return;

      if (!currentLead) return;

      const currentIndex = filteredLeads.findIndex(l => l.id === currentLead.id);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = Math.min(currentIndex + 1, filteredLeads.length - 1);
        setSelectedLeadId(filteredLeads[nextIdx].id);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = Math.max(currentIndex - 1, 0);
        setSelectedLeadId(filteredLeads[prevIdx].id);
      } else if (e.key === 'a' || e.key === 'A') {
        const canApprove = currentLead.checks.every(c => c.passed);
        if (canApprove && userRole !== 'Viewer') {
          e.preventDefault();
          approveLead(currentLead.id);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setRejectModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLead, filteredLeads, approveLead]);

  const handleReRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
    }, 2000);
  };

  const handleApproveCurrent = () => {
    if (!currentLead) return;
    const allPassed = currentLead.checks.every(c => c.passed);
    if (!allPassed) return;
    approveLead(currentLead.id);
  };

  const handleConfirmReject = () => {
    if (!currentLead) return;
    rejectLead(currentLead.id, rejectReason);
    setRejectModalOpen(false);
  };

  const getRecommendedProofTitle = (proofId: string) => {
    return proof.find(p => p.id === proofId)?.title || 'Portline Global Freight Case Study';
  };

  // If no leads waiting in queue, show empty state
  if (waitingLeads.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
          <Clock className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            No leads waiting
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            The agent checks sources every 30 minutes. All approved leads have been sent to outreach.
          </p>
        </div>
        <button
          onClick={resetDemoData}
          className="text-xs font-medium px-3.5 py-2 rounded-[6px] border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.5} />
          <span>Reset Demo Queue (Restore 5 Leads)</span>
        </button>
      </div>
    );
  }

  const allPassed = currentLead?.checks.every(c => c.passed) ?? false;
  const failingCheck = currentLead?.checks.find(c => !c.passed);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left Column: Filterable List */}
      <div className="w-80 sm:w-96 border-r border-gray-200 bg-white flex flex-col shrink-0 h-full">
        {/* Filters bar */}
        <div className="p-3 border-b border-gray-200 bg-gray-50 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-700 font-medium">
            <span className="font-mono text-[11px] uppercase tracking-wider text-gray-500">
              Queue ({filteredLeads.length} of {waitingLeads.length})
            </span>
            <span className="text-[11px] font-mono text-gray-400">
              Keys: ↑ ↓ A R
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <select
              value={filterSource}
              onChange={e => setFilterSource(e.target.value)}
              className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 text-[11px] outline-none"
            >
              <option value="all">All Sources</option>
              <option value="hacker news">Hacker News</option>
              <option value="indeed">Indeed</option>
              <option value="techcrunch">TechCrunch</option>
              <option value="reddit">Reddit</option>
              <option value="clutch">Agency RFP</option>
            </select>

            <select
              value={filterOffer}
              onChange={e => setFilterOffer(e.target.value)}
              className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 text-[11px] outline-none"
            >
              <option value="all">All Offers</option>
              <option value="ai-sprint">AI Automation</option>
              <option value="mvp-6-weeks">MVP 6 Weeks</option>
              <option value="whitelabel-dev">White-label</option>
            </select>
          </div>
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredLeads.map(lead => {
            const isSelected = lead.id === currentLead?.id;
            const hasCheckFailure = lead.checks.some(c => !c.passed);

            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className={`p-3.5 cursor-pointer transition-colors text-xs ${
                  isSelected 
                    ? 'bg-blue-50/70 border-l-2 border-l-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-gray-900 truncate">
                    {lead.company}
                  </div>
                  <span className={`font-mono tabular-nums px-1.5 py-0.2 rounded text-[11px] font-bold shrink-0 ${
                    lead.score >= 85 
                      ? 'bg-blue-100 text-blue-800' 
                      : lead.score >= 75
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {lead.score}
                  </span>
                </div>

                <div className="text-gray-700 font-medium truncate mt-0.5">
                  {lead.personName} · <span className="text-gray-500 font-normal">{lead.personRole}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 font-mono">
                  <span className="truncate max-w-[170px]">
                    {lead.source}
                  </span>
                  <span className="text-gray-400">
                    {lead.foundAgo}
                  </span>
                </div>

                {hasCheckFailure && (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-rose-700 font-mono bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                    <AlertTriangle className="w-3 h-3" /> Check failed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Lead Detail (Exact Order Requested) */}
      {currentLead ? (
        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
          {/* Scrollable details */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header info */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">{currentLead.company}</h2>
                  <a
                    href={currentLead.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-blue-600 inline-flex items-center"
                    title="Open website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">
                  Target Offer: {offers.find(o => o.id === currentLead.offerId)?.name} · Est. Value: ${currentLead.valueEst.toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 font-mono block">Relevance Score</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-blue-600">
                  {currentLead.score}
                </span>
              </div>
            </div>

            {/* Compliance Alert if present */}
            {currentLead.complianceWarning && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-[6px] flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="font-semibold block">Compliance Check Requirement</span>
                  <span>{currentLead.complianceWarning}</span>
                </div>
              </div>
            )}

            {/* 1. SIGNAL */}
            <section className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
                1. Buying Intent Signal
              </h3>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-[6px] space-y-2 text-xs">
                <p className="text-gray-900 font-medium leading-relaxed italic">
                  "{currentLead.signalText}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono pt-1 border-t border-gray-200">
                  <span>Source: {currentLead.source}</span>
                  <div className="flex items-center gap-3">
                    <span>{currentLead.signalDate}</span>
                    <a
                      href={currentLead.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      View Original <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. WHY IT SCORED (Score Breakdown) */}
            <section className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
                2. Why it scored {currentLead.score}
              </h3>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-[6px] text-xs overflow-hidden">
                {currentLead.scoreReasons.map((reason, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between bg-white hover:bg-gray-50">
                    <span className="text-gray-800">{reason.label}</span>
                    <span className={`font-mono tabular-nums font-semibold text-xs ${
                      reason.weight > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {reason.weight > 0 ? `+${reason.weight}` : reason.weight}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. BRIEF */}
            <section className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
                3. Lead Brief & Recommended Proof
              </h3>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-[6px] space-y-3 text-xs">
                <p className="text-gray-800 leading-relaxed">
                  {currentLead.brief}
                </p>
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-gray-500 font-mono text-[11px]">Recommended Proof Item:</span>
                  <span className="text-blue-700 bg-blue-50 font-medium px-2 py-0.5 rounded text-[11px] border border-blue-100">
                    {getRecommendedProofTitle(currentLead.recommendedProofId)}
                  </span>
                </div>
              </div>
            </section>

            {/* 4. SITE AUDIT (ClearSearch) */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
                  4. Site Audit (ClearSearch)
                </h3>
                <button
                  onClick={handleReRunAudit}
                  disabled={isAuditing}
                  className="text-[11px] text-gray-600 hover:text-gray-900 border border-gray-200 px-2 py-0.5 rounded bg-white hover:bg-gray-50 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isAuditing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                  <span>{isAuditing ? 'Auditing...' : 'Re-run audit'}</span>
                </button>
              </div>

              {isAuditing ? (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-[6px] text-xs text-gray-600 font-mono animate-pulse">
                  Scanning DNS records, career postings, and tech stack fingerprints for {currentLead.company}...
                </div>
              ) : (
                <div className="space-y-2">
                  {currentLead.siteAudit.map((item, idx) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-[6px] bg-white text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{item.finding}</span>
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                          item.severity === 'High' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : item.severity === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-gray-600 text-[11px]">
                        Angle: {item.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 5. CONTACT */}
            <section className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
                5. Contact Details
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-[6px] p-4 text-xs grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-400 block text-[11px]">Person</span>
                  <span className="font-semibold text-gray-900">{currentLead.personName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Role</span>
                  <span className="text-gray-800">{currentLead.personRole}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Email</span>
                  <span className="font-mono text-gray-900">{currentLead.email}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Country</span>
                  <span className="text-gray-800">{currentLead.country}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-400 block text-[11px]">Email Source & Verification</span>
                  <span className="font-mono text-gray-600 text-[11px]">{currentLead.emailSource}</span>
                </div>
              </div>
            </section>

            {/* 6. CHECKS */}
            <section className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
                6. Automated Validation Checks
              </h3>
              <div className="space-y-1.5 border border-gray-200 rounded-[6px] p-3 text-xs bg-white">
                {currentLead.checks.map(check => (
                  <div key={check.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.5} />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" strokeWidth={1.5} />
                      )}
                      <span className={check.passed ? 'text-gray-800' : 'text-rose-900 font-semibold'}>
                        {check.label}
                      </span>
                    </div>
                    {check.note && (
                      <span className="font-mono text-[11px] text-rose-600 font-medium">
                        {check.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 7. MESSAGE (Subject, Body & Follow-up Sequence) */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
                  7. Drafted Touchpoint (Editable)
                </h3>
                <span className="text-[11px] text-gray-500 font-mono">
                  Drafted by agent · task #T-098
                </span>
              </div>

              <div className="space-y-3 bg-white border border-gray-200 rounded-[6px] p-4 text-xs">
                <div>
                  <label className="block text-[11px] font-mono text-gray-500 mb-1">Subject</label>
                  <input
                    type="text"
                    value={currentLead.emailSubject}
                    onChange={e => updateLeadMessage(currentLead.id, e.target.value, currentLead.emailBody)}
                    className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-500 mb-1">Email Body</label>
                  <textarea
                    rows={8}
                    value={currentLead.emailBody}
                    onChange={e => updateLeadMessage(currentLead.id, currentLead.emailSubject, e.target.value)}
                    className="w-full text-xs font-sans leading-relaxed px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
                  />
                </div>

                {/* Collapsible Follow-up sequence (3 steps) */}
                <div className="pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setFollowUpsOpen(!followUpsOpen)}
                    className="w-full flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 py-1"
                  >
                    <span className="font-semibold font-mono text-[11px] uppercase tracking-wider">
                      Follow-up Sequence ({currentLead.followUps.length} automated steps)
                    </span>
                    {followUpsOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {followUpsOpen && (
                    <div className="space-y-3 mt-3 pt-2 border-t border-gray-100">
                      {currentLead.followUps.map(step => (
                        <div key={step.step} className="p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-xs space-y-1">
                          <div className="flex items-center justify-between font-mono text-[11px] text-gray-500">
                            <span className="font-semibold text-gray-700">Step {step.step}</span>
                            <span>Sends after +{step.delayDays} days without reply</span>
                          </div>
                          <div className="font-semibold text-gray-900">{step.subject}</div>
                          <p className="text-gray-600 leading-snug">{step.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Action Bar */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(true)}
                className="px-3 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-[6px] hover:bg-gray-100 transition-colors"
              >
                Reject (R)
              </button>
              <button
                type="button"
                onClick={() => snoozeLead(currentLead.id, 3)}
                className="px-3 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-[6px] hover:bg-gray-100 transition-colors"
              >
                Snooze 3d
              </button>
            </div>

            <div className="flex items-center gap-3">
              {!allPassed && failingCheck && (
                <span className="text-xs text-rose-600 font-mono">
                  {failingCheck.note || 'Validation check failed'}
                </span>
              )}
              <button
                type="button"
                onClick={handleApproveCurrent}
                disabled={!allPassed || userRole === 'Viewer'}
                title={userRole === 'Viewer' ? "Viewers can't do this" : undefined}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-[6px] transition-colors flex items-center gap-1.5 ${
                  allPassed && userRole !== 'Viewer'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                <span>Approve and send to outreach (A)</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Lead"
        description="Select reason for disqualification to train agent filters."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Disqualification Reason
            </label>
            <select
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none bg-white"
            >
              <option value="Bad ICP fit">Bad ICP fit (outside target vertical/role)</option>
              <option value="Poor timing">Poor timing (project already finished or stalled)</option>
              <option value="Low budget">Low budget (below studio minimums)</option>
              <option value="Competitor / Agency">Direct competitor or sub-contract agency</option>
              <option value="Duplicate company">Duplicate company already in active outreach</option>
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
              Confirm Disqualification
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
