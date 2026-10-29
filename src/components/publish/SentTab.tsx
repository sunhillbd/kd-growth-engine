import React from 'react';
import { Channel, Post, ChannelId } from '../../types';
import { PostCard } from './PostCard';
import { RefreshCw, ExternalLink, AlertCircle, CheckCircle2, Eye, ThumbsUp, MessageSquare, DollarSign } from 'lucide-react';

interface SentTabProps {
  channels: Channel[];
  posts: Post[];
  selectedChannelId: ChannelId | 'all';
  onOpenDrawer: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onRetry: (postId: string) => void;
}

export const SentTab: React.FC<SentTabProps> = ({
  channels,
  posts,
  selectedChannelId,
  onOpenDrawer,
  onEditPost,
  onDeletePost,
  onRetry
}) => {
  // Published and Failed posts appear here
  const sentAndFailed = posts.filter(p => {
    if (p.status !== 'Sent' && p.status !== 'Failed') return false;
    if (selectedChannelId !== 'all' && p.channelId !== selectedChannelId) return false;
    return true;
  });

  const totalImpressions = sentAndFailed
    .filter(p => p.status === 'Sent')
    .reduce((acc, curr) => acc + (curr.impressions || 0), 0);

  const totalEngagements = sentAndFailed
    .filter(p => p.status === 'Sent')
    .reduce((acc, curr) => acc + (curr.engagements || 0), 0);

  const totalReplies = sentAndFailed
    .filter(p => p.status === 'Sent')
    .reduce((acc, curr) => acc + (curr.repliesOrDms || 0), 0);

  const totalDeals = sentAndFailed
    .filter(p => p.status === 'Sent')
    .reduce((acc, curr) => acc + (curr.linkedDeals || 0), 0);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Metrics Banner */}
      <div className="grid grid-cols-4 gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-center">
        <div>
          <div className="text-base font-bold font-mono text-gray-900">
            {totalImpressions.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 uppercase font-medium mt-0.5">Total Impressions</div>
        </div>
        <div>
          <div className="text-base font-bold font-mono text-gray-900">
            {totalEngagements.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 uppercase font-medium mt-0.5">Engagements</div>
        </div>
        <div>
          <div className="text-base font-bold font-mono text-gray-900">
            {totalReplies.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 uppercase font-medium mt-0.5">Replies & DMs</div>
        </div>
        <div>
          <div className="text-base font-bold font-mono text-emerald-700">
            ${totalDeals.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 uppercase font-medium mt-0.5">Attributed Deals</div>
        </div>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Sent Posts & Delivery Results ({sentAndFailed.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Click any row to open post details and complete engagement metrics.
          </p>
        </div>
      </div>

      {sentAndFailed.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-10 text-center text-xs text-gray-500 space-y-2">
          <p className="font-semibold text-gray-700">No sent posts found</p>
          <p className="text-[11px]">When posts in the queue reach their scheduled slot, they appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sentAndFailed.map(post => (
            <PostCard
              key={post.id}
              post={post}
              channels={channels}
              onOpenDrawer={onOpenDrawer}
              onEdit={onEditPost}
              onDelete={onDeletePost}
              onRetry={onRetry}
            />
          ))}
        </div>
      )}
    </div>
  );
};
