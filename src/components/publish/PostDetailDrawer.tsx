import React from 'react';
import { Post, Channel, ChannelId } from '../../types';
import { X, Play, Clock, ArrowUp, Edit2, Trash2, Check, RefreshCw, ExternalLink, Link2, Eye, ThumbsUp, MessageSquare, DollarSign, Calendar, Globe } from 'lucide-react';

interface PostDetailDrawerProps {
  post: Post | null;
  channels: Channel[];
  allPosts: Post[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (post: Post) => void;
  onShareNow: (postId: string) => void;
  onApprove: (postId: string) => void;
  onRequestChanges: (postId: string) => void;
  onDelete: (postId: string) => void;
  onRetry: (postId: string) => void;
  onSelectSibling: (siblingPost: Post) => void;
}

export const PostDetailDrawer: React.FC<PostDetailDrawerProps> = ({
  post,
  channels,
  allPosts,
  isOpen,
  onClose,
  onEdit,
  onShareNow,
  onApprove,
  onRequestChanges,
  onDelete,
  onRetry,
  onSelectSibling
}) => {
  if (!isOpen || !post) return null;

  const channel = channels.find(c => c.id === post.channelId);

  const getPlatformBadge = (platform?: Channel['platform']) => {
    switch (platform) {
      case 'LinkedIn':
        return <span className="bg-[#0A66C2] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">LinkedIn</span>;
      case 'Facebook':
        return <span className="bg-[#1877F2] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">Facebook</span>;
      case 'X':
        return <span className="bg-black text-white px-1.5 py-0.5 rounded text-[10px] font-bold">𝕏</span>;
      case 'Website':
        return <span className="bg-emerald-700 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">Website</span>;
      default:
        return <span className="bg-gray-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">Channel</span>;
    }
  };

  const siblingPosts = (post.siblingPostIds || [])
    .map(id => allPosts.find(p => p.id === id))
    .filter(Boolean) as Post[];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col h-full z-10 border-l border-gray-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            {getPlatformBadge(channel?.platform)}
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {channel?.name || post.channelId}
            </h2>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
              post.status === 'Sent' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              post.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              post.status === 'Needs approval' ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold' :
              post.status === 'Failed' ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold' :
              'bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              {post.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(post);
              }}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded text-xs flex items-center gap-1 font-medium"
              title="Edit in composer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-gray-700">
          {/* Sibling posts notification if created together */}
          {siblingPosts.length > 0 && (
            <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3.5">
              <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs mb-1.5">
                <Link2 className="w-3.5 h-3.5" />
                <span>Created together in one composition ({siblingPosts.length + 1} channels)</span>
              </div>
              <p className="text-[11px] text-blue-800 mb-2">
                This post has sibling versions tailored for other channels:
              </p>
              <div className="flex flex-wrap gap-2">
                {siblingPosts.map(sib => {
                  const sibChannel = channels.find(c => c.id === sib.channelId);
                  return (
                    <button
                      key={sib.id}
                      onClick={() => onSelectSibling(sib)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-blue-200 hover:border-blue-400 text-xs font-medium text-blue-900 shadow-2xs transition-colors"
                    >
                      <span>{sibChannel?.name || sib.channelId}</span>
                      <span className="text-[10px] text-gray-500 font-mono">({sib.status})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Schedule or Sent Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Posting Time:</span>
              <span className="font-semibold text-gray-900 font-mono">
                {post.scheduledDate ? `${post.scheduledDate} at ${post.scheduledTime}` : post.sentAt || 'Unscheduled'}
              </span>
            </div>
            {channel?.slots && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500">Audience time conversion:</span>
                <span className="text-gray-600 font-mono">
                  Asia/Dhaka · {channel.slots.find(s => s.id === post.slotId)?.audienceTime || '8:30 AM NY'}
                </span>
              </div>
            )}
            {post.pattern && (
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-200">
                <span className="text-gray-500">Writing Pattern:</span>
                <span className="font-medium text-gray-800">{post.pattern}</span>
              </div>
            )}
            {post.targetKeyword && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500">Target Keyword:</span>
                <span className="font-mono text-gray-800">{post.targetKeyword}</span>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Message Content
            </h3>
            <div className="p-4 bg-white border border-gray-200 rounded-lg whitespace-pre-line leading-relaxed text-gray-900 font-sans text-xs sm:text-sm select-text">
              {post.text}
            </div>
          </div>

          {/* X Thread posts if applicable */}
          {post.channelSpecific?.xThreadPosts && post.channelSpecific.xThreadPosts.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Thread Replies ({post.channelSpecific.xThreadPosts.length})
              </h3>
              <div className="space-y-2">
                {post.channelSpecific.xThreadPosts.map((reply, i) => (
                  <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs leading-relaxed">
                    {reply}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Website SEO details if applicable */}
          {post.channelSpecific?.websiteData && (
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3.5 space-y-2 text-xs">
              <h3 className="font-semibold text-emerald-950 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Website Article Metadata</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="text-gray-500">Slug:</span> <span className="font-mono">{post.channelSpecific.websiteData.slug}</span></div>
                <div><span className="text-gray-500">Category:</span> <span>{post.channelSpecific.websiteData.category}</span></div>
              </div>
              <p className="text-[11px] text-gray-600 italic">
                {post.channelSpecific.websiteData.metaDescription}
              </p>
            </div>
          )}

          {/* Performance Metrics if Sent */}
          {post.status === 'Sent' && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Published Results & Performance
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <div className="text-lg font-bold font-mono text-gray-900">
                    {post.impressions?.toLocaleString() || 0}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase mt-0.5">Impressions</div>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <div className="text-lg font-bold font-mono text-gray-900">
                    {post.engagements?.toLocaleString() || 0}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase mt-0.5">Engagements</div>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <div className="text-lg font-bold font-mono text-gray-900">
                    {post.repliesOrDms || 0}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase mt-0.5">Replies / DMs</div>
                </div>
              </div>

              {post.linkedDeals && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold text-emerald-950 text-xs">
                        Attributed Deal: ${post.linkedDeals.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        Client: {post.linkedDealCompany}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                    Won
                  </span>
                </div>
              )}

              {post.livePostUrl && (
                <div className="mt-3">
                  <a
                    href={post.livePostUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <span>Open published post on live channel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Audit Trail */}
          {post.auditTrail && post.auditTrail.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                History & Activity
              </h3>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-gray-50/50">
                {post.auditTrail.map((ev, i) => (
                  <div key={i} className="p-2.5 text-[11px] flex items-center justify-between">
                    <span className="text-gray-800">{ev.action}</span>
                    <span className="text-gray-400 font-mono text-[10px]">
                      {ev.actor} · {ev.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onDelete(post.id);
            }}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            {post.status === 'Needs approval' && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onRequestChanges(post.id);
                  }}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded text-xs font-medium"
                >
                  Request changes
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onApprove(post.id);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve & Schedule</span>
                </button>
              </>
            )}

            {post.status === 'Scheduled' && (
              <button
                onClick={() => {
                  onClose();
                  onShareNow(post.id);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Share now</span>
              </button>
            )}

            {post.status === 'Failed' && (
              <button
                onClick={() => {
                  onClose();
                  onRetry(post.id);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
