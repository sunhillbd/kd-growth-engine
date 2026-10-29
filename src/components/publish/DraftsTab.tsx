import React from 'react';
import { Channel, Post, ChannelId } from '../../types';
import { PostCard } from './PostCard';
import { FileText, Plus } from 'lucide-react';

interface DraftsTabProps {
  channels: Channel[];
  posts: Post[];
  selectedChannelId: ChannelId | 'all';
  onOpenDrawer: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onAddToQueue: (post: Post) => void;
  onOpenComposer: () => void;
}

export const DraftsTab: React.FC<DraftsTabProps> = ({
  channels,
  posts,
  selectedChannelId,
  onOpenDrawer,
  onEditPost,
  onDeletePost,
  onAddToQueue,
  onOpenComposer
}) => {
  const drafts = posts.filter(p => {
    if (p.status !== 'Draft') return false;
    if (selectedChannelId !== 'all' && p.channelId !== selectedChannelId) return false;
    return true;
  });

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Drafts ({drafts.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Unscheduled posts saved by the team or converted from ideas.
          </p>
        </div>

        <button
          onClick={onOpenComposer}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New draft</span>
        </button>
      </div>

      {drafts.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-10 text-center text-xs text-gray-500 space-y-2">
          <FileText className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="font-medium text-gray-700">No drafts currently saved</p>
          <p className="text-[11px]">Save compositions as drafts or generate drafts from Ideas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map(draft => (
            <PostCard
              key={draft.id}
              post={draft}
              channels={channels}
              onOpenDrawer={onOpenDrawer}
              onEdit={onEditPost}
              onDelete={onDeletePost}
              onAddToQueue={onAddToQueue}
            />
          ))}
        </div>
      )}
    </div>
  );
};
