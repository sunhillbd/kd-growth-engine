import React, { useState } from 'react';
import { ContentItem, DestinationId, PostDestinationSchedule } from '../../types';
import { DESTINATIONS } from '../../mock/destinations';
import { useStore } from '../../context/StoreContext';
import { Drawer } from '../common/Drawer';
import { 
  ExternalLink, RotateCw, XCircle, Clock, Play, 
  ChevronDown, ChevronUp, AlertTriangle, FileText, CheckCircle2 
} from 'lucide-react';

interface PostDetailDrawerProps {
  post: ContentItem | null;
  onClose: () => void;
}

export const PostDetailDrawer: React.FC<PostDetailDrawerProps> = ({ post, onClose }) => {
  const { 
    reschedulePostDestination, 
    cancelPostDestination, 
    publishNowPostDestination, 
    retryPostDestination 
  } = useStore();

  const [activeTab, setActiveTab] = useState<DestinationId>('linkedin_personal');
  const [editingDestinationId, setEditingDestinationId] = useState<DestinationId | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('2026-11-10');
  const [rescheduleTime, setRescheduleTime] = useState('18:30');
  const [expandedErrorDestinationId, setExpandedErrorDestinationId] = useState<DestinationId | null>(null);

  if (!post) return null;

  const selectedDests = post.selectedDestinations || ['linkedin_personal'];

  // Current active tab fallback
  const currentTab = selectedDests.includes(activeTab) ? activeTab : selectedDests[0];

  const getDestinationConfig = (id: DestinationId) => {
    return DESTINATIONS.find(d => d.id === id) || DESTINATIONS[0];
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-500';
      case 'Scheduled': return 'bg-blue-600';
      case 'Pending approval': return 'bg-amber-500';
      case 'Failed': return 'bg-rose-500';
      case 'Publishing': return 'bg-purple-500 animate-pulse';
      default: return 'bg-gray-400';
    }
  };

  const getDestinationContent = (destId: DestinationId) => {
    switch (destId) {
      case 'linkedin_personal':
        return post.linkedinPersonalOverride || post.baseText;
      case 'linkedin_company':
        return post.linkedinCompanyOverride || post.baseText;
      case 'facebook_page':
        return post.facebookOverride || post.baseText;
      case 'x_profile':
        return post.xOverride || post.baseText;
      case 'website_blog':
        return post.baseText;
      default:
        return post.baseText;
    }
  };

  const handleSaveReschedule = (destId: DestinationId) => {
    reschedulePostDestination(post.id, destId, rescheduleDate, rescheduleTime);
    setEditingDestinationId(null);
  };

  return (
    <Drawer
      isOpen={Boolean(post)}
      onClose={onClose}
      title={post.topic}
      subtitle={`Multi-destination distribution · ${selectedDests.length} destination${selectedDests.length > 1 ? 's' : ''}`}
      width="xl"
    >
      <div className="space-y-6 text-xs sm:text-sm">
        {/* Destination Statuses Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
            Publishing Destinations & Scheduling States
          </h4>

          <div className="border border-gray-200 rounded-[6px] overflow-hidden bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
                  <th className="py-2.5 px-3 font-normal">Destination</th>
                  <th className="py-2.5 px-3 font-normal">Scheduled (Dhaka & Audience)</th>
                  <th className="py-2.5 px-3 font-normal text-center">Status</th>
                  <th className="py-2.5 px-3 font-normal text-right">Row Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedDests.map(destId => {
                  const cfg = getDestinationConfig(destId);
                  const sched: PostDestinationSchedule = post.destinationSchedules?.[destId] || {
                    destinationId: destId,
                    status: (post.status as any) || 'Draft',
                    scheduledDate: post.scheduledDay || '2026-11-05',
                    scheduledTime: post.scheduledTime?.split(' ')[0] || '18:30',
                    audienceTimeInfo: '= 8:30 AM in New York'
                  };

                  const isEditing = editingDestinationId === destId;
                  const hasError = sched.status === 'Failed' && sched.errorMessage;
                  const isErrorExpanded = expandedErrorDestinationId === destId;

                  return (
                    <React.Fragment key={destId}>
                      <tr className="hover:bg-gray-50/50 transition-colors h-12">
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{cfg.subName}</span>
                          </div>
                          <span className="text-[11px] text-gray-400 font-mono block">
                            Account: {cfg.accountName}
                          </span>
                        </td>

                        <td className="py-2 px-3 font-mono text-[11px]">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="date"
                                value={rescheduleDate}
                                onChange={e => setRescheduleDate(e.target.value)}
                                className="px-2 py-0.5 border border-gray-300 rounded text-xs"
                              />
                              <input
                                type="time"
                                value={rescheduleTime}
                                onChange={e => setRescheduleTime(e.target.value)}
                                className="px-2 py-0.5 border border-gray-300 rounded text-xs"
                              />
                              <button
                                onClick={() => handleSaveReschedule(destId)}
                                className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingDestinationId(null)}
                                className="px-1.5 py-0.5 text-gray-500 hover:text-gray-700 text-[11px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div>
                              <span className="text-gray-900 font-medium">
                                {sched.scheduledDate} {sched.scheduledTime}
                              </span>
                              <span className="text-gray-400 block text-[10px]">
                                {sched.audienceTimeInfo}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 text-[11px]">
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(sched.status)}`}></span>
                            <span className="font-medium text-gray-800">{sched.status}</span>
                          </div>
                          {sched.livePostUrl && (
                            <a
                              href={sched.livePostUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-blue-600 hover:underline block mt-0.5 flex items-center justify-center gap-0.5"
                            >
                              Live Post <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </td>

                        <td className="py-2 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Reschedule */}
                            {!isEditing && (
                              <button
                                onClick={() => {
                                  setEditingDestinationId(destId);
                                  setRescheduleDate(sched.scheduledDate || '2026-11-10');
                                  setRescheduleTime(sched.scheduledTime || '18:30');
                                }}
                                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                              >
                                Reschedule
                              </button>
                            )}

                            {/* Cancel (only while Scheduled) */}
                            {sched.status === 'Scheduled' && (
                              <button
                                onClick={() => cancelPostDestination(post.id, destId)}
                                className="px-2 py-1 text-xs text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                              >
                                Cancel
                              </button>
                            )}

                            {/* Publish Now (if not already Published) */}
                            {sched.status !== 'Published' && sched.status !== 'Publishing' && (
                              <button
                                onClick={() => publishNowPostDestination(post.id, destId)}
                                className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded font-medium"
                              >
                                Publish now
                              </button>
                            )}

                            {/* Retry (only when Failed) */}
                            {sched.status === 'Failed' && (
                              <button
                                onClick={() => retryPostDestination(post.id, destId)}
                                className="px-2.5 py-1 text-xs bg-rose-600 text-white hover:bg-rose-700 rounded font-medium flex items-center gap-1"
                              >
                                <RotateCw className="w-3 h-3" /> Retry
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Error Row if Failed */}
                      {hasError && (
                        <tr className="bg-rose-50/60 border-b border-rose-100">
                          <td colSpan={4} className="py-2.5 px-4 text-xs">
                            <div className="flex items-start gap-2 text-rose-900">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" strokeWidth={1.5} />
                              <div>
                                <span className="font-semibold block font-mono text-[11px] uppercase tracking-wide text-rose-800">
                                  Delivery Failure: {cfg.subName}
                                </span>
                                <p className="font-mono text-xs mt-0.5 leading-relaxed text-rose-900">
                                  {sched.errorMessage}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Text for each destination (tabs) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-200">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700 pb-2">
              Content Copy per Destination
            </h4>
            <div className="flex gap-2">
              {selectedDests.map(destId => {
                const cfg = getDestinationConfig(destId);
                const isActive = currentTab === destId;
                return (
                  <button
                    key={destId}
                    onClick={() => setActiveTab(destId)}
                    className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
                      isActive 
                        ? 'border-blue-600 text-blue-600 font-semibold' 
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {cfg.platform}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-[6px] text-xs space-y-3">
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span>Previewing: {getDestinationConfig(currentTab).subName}</span>
              <span>Account: {getDestinationConfig(currentTab).accountName}</span>
            </div>

            <p className="whitespace-pre-wrap leading-relaxed text-gray-900 text-xs">
              {getDestinationContent(currentTab)}
            </p>

            {/* X Thread preview if on X tab */}
            {currentTab === 'x_profile' && post.xThreadPosts && post.xThreadPosts.length > 0 && (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <span className="font-mono text-[11px] uppercase font-semibold text-gray-600 block">
                  Thread Follow-ups ({post.xThreadPosts.length} tweets)
                </span>
                {post.xThreadPosts.map((t, i) => (
                  <div key={i} className="p-2.5 bg-white border border-gray-200 rounded text-xs text-gray-800">
                    {t}
                  </div>
                ))}
              </div>
            )}

            {/* Website SEO details if on Website tab */}
            {currentTab === 'website_blog' && post.websiteData && (
              <div className="pt-3 border-t border-gray-200 space-y-2 font-mono text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                  <div>Slug: /{post.websiteData.slug}</div>
                  <div>Mode: {post.websiteData.publishMode === 'cms_draft' ? 'Draft in CMS' : 'Live'}</div>
                  <div>Target Keyword: {post.websiteData.targetKeyword}</div>
                  <div>Schema Type: {post.websiteData.seoChecklist.schemaType}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metrics once published */}
        {post.impressions !== undefined && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
              Aggregated Publishing Metrics
            </h4>
            <div className="p-4 bg-white border border-gray-200 rounded-[6px] grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-[11px] font-mono text-gray-500 uppercase block">Total Impressions</span>
                <span className="text-xl font-bold font-mono tabular-nums text-gray-900">
                  {post.impressions.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-gray-500 uppercase block">Engagements</span>
                <span className="text-xl font-bold font-mono tabular-nums text-gray-900">
                  {post.engagements?.toLocaleString() || 0}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-gray-500 uppercase block">Attributed Deals</span>
                <span className="text-xl font-bold font-mono tabular-nums text-emerald-600">
                  ${(post.linkedDeals || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Audit Trail */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
            Publishing Audit Trail
          </h4>
          <div className="border border-gray-200 rounded-[6px] divide-y divide-gray-100 bg-white">
            {post.auditTrail && post.auditTrail.length > 0 ? (
              post.auditTrail.map((evt, idx) => (
                <div key={idx} className="p-2.5 text-xs flex items-center justify-between">
                  <span className="text-gray-800">{evt.action}</span>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                    <span>by {evt.actor}</span>
                    <span>·</span>
                    <span>{evt.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-xs text-gray-500 font-mono">
                Scheduled by agent {post.agentTaskId || '#T-100'} · Auto-sync active
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
