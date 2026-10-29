import React from 'react';
import { Post, Channel, ChannelId } from '../../types';
import { MoreHorizontal, Play, ArrowUp, Edit2, Trash2, Check, AlertCircle, RefreshCw, ExternalLink, Link2, Eye, MessageSquare, ThumbsUp, DollarSign } from 'lucide-react';

interface PostCardProps {
  post: Post;
  channels: Channel[];
  onOpenDrawer: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onShareNow?: (postId: string) => void;
  onMoveToTop?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onApprove?: (postId: string) => void;
  onRequestChanges?: (postId: string) => void;
  onApproveSiblings?: (siblingIds: string[]) => void;
  onAddToQueue?: (post: Post) => void;
  onRetry?: (postId: string) => void;
  onSelectSibling?: (siblingId: string) => void;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  channels,
  onOpenDrawer,
  onEdit,
  onShareNow,
  onMoveToTop,
  onDelete,
  onApprove,
  onRequestChanges,
  onApproveSiblings,
  onAddToQueue,
  onRetry,
  onSelectSibling,
  showCheckbox = false,
  isSelected = false,
  onToggleSelect
}) => {
  const channel = channels.find(c => c.id === post.channelId);

  const getPlatformIcon = (platform?: Channel['platform']) => {
    switch (platform) {
      case 'LinkedIn':
        return (
          <div className="w-4 h-4 rounded bg-[#0A66C2] flex items-center justify-center text-white font-bold text-[9px] shrink-0">
            in
          </div>
        );
      case 'Facebook':
        return (
          <div className="w-4 h-4 rounded bg-[#1877F2] flex items-center justify-center text-white font-bold text-[10px] shrink-0">
            f
          </div>
        );
      case 'X':
        return (
          <div className="w-4 h-4 rounded bg-black flex items-center justify-center text-white font-bold text-[10px] shrink-0">
            𝕏
          </div>
        );
      case 'Website':
        return (
          <div className="w-4 h-4 rounded bg-emerald-700 flex items-center justify-center text-white font-bold text-[8px] shrink-0">
            KD
          </div>
        );
      default:
        return (
          <div className="w-4 h-4 rounded bg-gray-500 flex items-center justify-center text-white text-[9px] shrink-0">
            #
          </div>
        );
    }
  };

  const getStatusBadge = (status: Post['status']) => {
    switch (status) {
      case 'Draft':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
            Draft
          </span>
        );
      case 'Needs approval':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Needs approval
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Scheduled
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Sent
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Failed
          </span>
        );
    }
  };

  const hasSiblings = post.siblingPostIds && post.siblingPostIds.length > 0;

  return (
    <div
      onClick={() => onOpenDrawer(post)}
      className={`group bg-white border rounded-lg p-4 transition-all hover:border-gray-400 hover:shadow-xs cursor-pointer select-none ${
        post.status === 'Failed'
          ? 'border-rose-200 bg-rose-50/20'
          : isSelected
          ? 'border-blue-500 bg-blue-50/20'
          : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Selection Checkbox */}
        {showCheckbox && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect && onToggleSelect(post.id);
            }}
            className="pt-0.5"
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
            />
          </div>
        )}

        {/* Channel Icon & Metadata Column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 truncate">
              {getPlatformIcon(channel?.platform)}
              <span className="text-xs font-semibold text-gray-900 truncate">
                {channel?.name || post.channelId}
              </span>

              {/* Time display */}
              {post.scheduledTime && (
                <span className="text-xs text-gray-500 font-mono">
                  · {post.scheduledTime}
                </span>
              )}
              {post.sentAt && (
                <span className="text-xs text-gray-500 font-mono">
                  · {post.sentAt}
                </span>
              )}

              {/* Sibling Indicator */}
              {hasSiblings && (
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (post.siblingPostIds && onSelectSibling) {
                      onSelectSibling(post.siblingPostIds[0]);
                    } else {
                      onOpenDrawer(post);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  title="Part of a multi-channel batch composition"
                >
                  <Link2 className="w-3 h-3" />
                  <span>Created together ({post.siblingPostIds!.length + 1})</span>
                </span>
              )}
            </div>

            {/* Status Badge */}
            <div className="shrink-0 flex items-center gap-2">
              {getStatusBadge(post.status)}
            </div>
          </div>

          {/* Text Excerpt (2 lines max) */}
          <p className="text-xs text-gray-700 line-clamp-2 font-normal leading-relaxed whitespace-pre-line mb-2">
            {post.text}
          </p>

          {/* Special Agent Draft Info for Approvals */}
          {post.status === 'Needs approval' && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded px-2.5 py-1.5 mb-2 text-[11px] text-amber-900 flex items-start gap-1.5">
              <span className="font-semibold text-amber-800 shrink-0">Drafted by agent · {post.agentTaskId || '#T-4091'}:</span>
              <span className="text-amber-800">{post.whyThisPost || 'Targeting B2B SaaS CTOs.'}</span>
            </div>
          )}

          {/* Error Message for Failed posts */}
          {post.status === 'Failed' && post.errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded px-2.5 py-1 mb-2 text-xs text-rose-800 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span>Failed: {post.errorMessage}</span>
            </div>
          )}

          {/* Sent Metrics Row */}
          {post.status === 'Sent' && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1 border-t border-gray-100 mt-2 font-mono">
              <div className="flex items-center gap-1" title="Impressions">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                <span>{post.impressions?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center gap-1" title="Engagements">
                <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                <span>{post.engagements?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center gap-1" title="Replies or DMs">
                <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                <span>{post.repliesOrDms || 0}</span>
              </div>
              {post.linkedDeals && (
                <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200" title="Linked deal">
                  <DollarSign className="w-3 h-3 text-emerald-600" />
                  <span>${post.linkedDeals.toLocaleString()} deal ({post.linkedDealCompany || 'Client'})</span>
                </div>
              )}
              {post.livePostUrl && (
                <a
                  href={post.livePostUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline ml-auto font-sans"
                >
                  <span>View live post</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Actions Bar */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2"
          >
            <div className="flex items-center gap-1.5">
              {/* Approvals Actions */}
              {post.status === 'Needs approval' && (
                <>
                  <button
                    onClick={() => onApprove && onApprove(post.id)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => onRequestChanges && onRequestChanges(post.id)}
                    className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded text-xs font-medium transition-colors"
                  >
                    <span>Request changes</span>
                  </button>

                  {hasSiblings && onApproveSiblings && (
                    <button
                      onClick={() => onApproveSiblings([post.id, ...(post.siblingPostIds || [])])}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-medium transition-colors"
                      title="Approve all posts created in this batch"
                    >
                      <span>Approve all {post.siblingPostIds!.length + 1}</span>
                    </button>
                  )}
                </>
              )}

              {/* Drafts Actions */}
              {post.status === 'Draft' && (
                <button
                  onClick={() => onAddToQueue && onAddToQueue(post)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <ArrowUp className="w-3 h-3" />
                  <span>Add to queue</span>
                </button>
              )}

              {/* Queue Actions */}
              {post.status === 'Scheduled' && (
                <>
                  <button
                    onClick={() => onShareNow && onShareNow(post.id)}
                    className="px-2 py-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Publish immediately"
                  >
                    <Play className="w-3 h-3 text-emerald-600" />
                    <span>Share now</span>
                  </button>

                  <button
                    onClick={() => onMoveToTop && onMoveToTop(post.id)}
                    className="px-2 py-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Move to top of queue"
                  >
                    <ArrowUp className="w-3 h-3 text-blue-600" />
                    <span>Move to top</span>
                  </button>
                </>
              )}

              {/* Failed Retry Action */}
              {post.status === 'Failed' && (
                <button
                  onClick={() => onRetry && onRetry(post.id)}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              )}
            </div>

            {/* Common Secondary Actions: Edit, Delete */}
            <div className="flex items-center gap-1 text-gray-400">
              {onEdit && (
                <button
                  onClick={() => onEdit(post)}
                  className="p-1 hover:text-gray-700 hover:bg-gray-100 rounded"
                  title="Edit post"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(post.id)}
                  className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded"
                  title="Delete post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Media Thumbnail (if post has media) */}
        {post.mediaUrl && (
          <div className="w-16 h-16 rounded border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
            <img src={post.mediaUrl} alt="Post attachment" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};
