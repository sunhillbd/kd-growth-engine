import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ContentItem, DestinationId } from '../../types';
import { DESTINATIONS } from '../../mock/destinations';
import { Modal } from '../../components/common/Modal';
import { Check, X, Edit2, AlertTriangle, Clock } from 'lucide-react';

export const ApprovalsPage: React.FC = () => {
  const { 
    content, 
    approvePost, 
    bulkApprovePosts, 
    approvePostDestination, 
    rejectPostDestination,
    userRole
  } = useStore();
  const navigate = useNavigate();

  // Pending posts are items where either overall status is 'Pending approval' OR any destination schedule is 'Pending approval'
  const pendingPosts = content.filter(c => {
    if (c.status === 'Needs approval') return true;
    if (c.destinationSchedules) {
      return Object.values(c.destinationSchedules).some(s => s.status === 'Pending approval');
    }
    return false;
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Destination reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<{ postId: string; destId: DestinationId } | null>(null);
  const [rejectReason, setRejectReason] = useState('Off-brand phrasing or tone');

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === pendingPosts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingPosts.map(p => p.id));
    }
  };

  const handleBulkApprove = () => {
    bulkApprovePosts(selectedIds);
    setSelectedIds([]);
  };

  const handleOpenRejectModal = (postId: string, destId: DestinationId) => {
    setRejectTarget({ postId, destId });
    setRejectModalOpen(true);
  };

  const handleConfirmDestinationReject = () => {
    if (!rejectTarget) return;
    rejectPostDestination(rejectTarget.postId, rejectTarget.destId, rejectReason);
    setRejectModalOpen(false);
    setRejectTarget(null);
  };

  const getDestinationContent = (post: ContentItem, destId: DestinationId) => {
    switch (destId) {
      case 'linkedin_personal': return post.linkedinPersonalOverride || post.baseText;
      case 'linkedin_company': return post.linkedinCompanyOverride || post.baseText;
      case 'facebook_page': return post.facebookOverride || post.baseText;
      case 'x_profile': return post.xOverride || post.baseText;
      case 'website_blog': return post.baseText;
      default: return post.baseText;
    }
  };

  if (pendingPosts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Check className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">
          No social posts waiting for approval
        </h3>
        <p className="text-xs text-gray-500">
          All destination drafts have been reviewed and scheduled into the calendar.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header and Bulk Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Content Approvals Queue</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Approve all destinations at once or review each destination individually. Usable on mobile (390px).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selectedIds.length === pendingPosts.length && pendingPosts.length > 0}
              onChange={handleSelectAll}
              className="rounded text-blue-600 w-4 h-4"
            />
            <span>Select all ({pendingPosts.length})</span>
          </label>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkApprove}
              disabled={userRole === 'Viewer'}
              title={userRole === 'Viewer' ? "Viewers can't do this" : undefined}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-[6px] transition-colors shadow-sm ${
                userRole === 'Viewer' 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Approve selected ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-6">
        {pendingPosts.map(post => {
          const isSelected = selectedIds.includes(post.id);
          const dests = post.selectedDestinations || ['linkedin_personal'];

          return (
            <div
              key={post.id}
              className={`bg-white border rounded-[6px] p-4 sm:p-5 transition-all space-y-5 ${
                isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(post.id)}
                    className="rounded text-blue-600 w-4 h-4 mt-1"
                  />
                  <div>
                    <span className="font-mono text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                      Multi-Destination Draft · {post.format}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm mt-0.5">
                      {post.topic}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500 mt-1">
                      <span>Drafted by agent · task {post.agentTaskId || '#T-104'}</span>
                      {post.whyThisPost && <span>· {post.whyThisPost}</span>}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => approvePost(post.id)}
                  disabled={userRole === 'Viewer'}
                  title={userRole === 'Viewer' ? "Viewers can't do this" : undefined}
                  className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-[6px] transition-colors shrink-0 shadow-sm ${
                    userRole === 'Viewer'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                      : 'text-white bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Approve All Destinations
                </button>
              </div>

              {/* Per-Destination Sections */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-gray-500 block">
                  Destinations to Dispatch ({dests.length})
                </span>

                <div className="space-y-3">
                  {dests.map(destId => {
                    const cfg = DESTINATIONS.find(d => d.id === destId);
                    const sched = post.destinationSchedules?.[destId] || {
                      scheduledDate: post.scheduledDay || '2026-11-04',
                      scheduledTime: post.scheduledTime || '18:30',
                      audienceTimeInfo: '= 8:30 AM in New York',
                      status: 'Pending approval'
                    };

                    const textCopy = getDestinationContent(post, destId);
                    const isPending = sched.status === 'Pending approval';
                    const hasLinkWarning = destId === 'x_profile' && textCopy.includes('http');

                    return (
                      <div
                        key={destId}
                        className="p-3.5 bg-gray-50 border border-gray-200 rounded-[6px] space-y-2.5 text-xs"
                      >
                        {/* Destination Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{cfg?.subName}</span>
                            <span className="text-[11px] text-gray-500 font-mono">({cfg?.accountName})</span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[11px] text-gray-600">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{sched.scheduledDate} {sched.scheduledTime}</span>
                            <span className="text-gray-400 font-normal">{sched.audienceTimeInfo}</span>
                          </div>
                        </div>

                        {/* Warnings if any */}
                        {hasLinkWarning && (
                          <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" strokeWidth={1.5} />
                            <span>Warning: Link in main tweet costs organic distribution on X.</span>
                          </div>
                        )}

                        {/* Copy snippet */}
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded border border-gray-200 text-xs">
                          {textCopy}
                        </p>

                        {/* Per-Destination Actions (Responsive down to 390px with large buttons) */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                          <div className="text-[11px] font-mono text-gray-500">
                            Status: <span className="font-semibold text-gray-800">{sched.status}</span>
                          </div>

                          {isPending ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenRejectModal(post.id, destId)}
                                className="min-h-[38px] flex-1 sm:flex-initial px-3 py-1.5 border border-gray-300 rounded-[6px] text-gray-700 hover:bg-white text-xs font-medium transition-colors"
                              >
                                Reject this
                              </button>
                              <button
                                type="button"
                                onClick={() => approvePostDestination(post.id, destId)}
                                disabled={userRole === 'Viewer'}
                                title={userRole === 'Viewer' ? "Viewers can't do this" : undefined}
                                className={`min-h-[38px] flex-1 sm:flex-initial px-3.5 py-1.5 rounded-[6px] text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                                  userRole === 'Viewer'
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" /> Approve this
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-emerald-700 font-mono">
                              ✓ Confirmed for schedule
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Edit full post link */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => navigate(`/content/compose?id=${post.id}`)}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-medium"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit in Composer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Destination Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Destination Draft"
        description="Provide a reason for rejection to tune the agent's platform style rules."
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Rejection Reason
            </label>
            <select
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none bg-white font-medium"
            >
              <option value="Off-brand phrasing or tone">Off-brand phrasing or tone</option>
              <option value="Formatting does not suit this platform">Formatting does not suit this platform</option>
              <option value="Timing or date collision">Timing or date collision</option>
              <option value="Contains unverified factual claim">Contains unverified factual claim</option>
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
              onClick={handleConfirmDestinationReject}
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
