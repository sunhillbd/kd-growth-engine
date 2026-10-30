import React, { useState } from 'react';
import { Channel, Post, ChannelId } from '../../types';
import { PostCard } from './PostCard';
import { Check, CheckSquare, X, MessageSquare, AlertCircle } from 'lucide-react';

interface ApprovalsTabProps {
  channels: Channel[];
  posts: Post[];
  selectedChannelId: ChannelId | 'all';
  onOpenDrawer: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onApprove: (postId: string) => void;
  onRequestChanges: (postId: string, reason: string) => void;
  onApproveSelected: (postIds: string[]) => void;
  onApproveSiblings: (siblingIds: string[]) => void;
}

export const ApprovalsTab: React.FC<ApprovalsTabProps> = ({
  channels,
  posts,
  selectedChannelId,
  onOpenDrawer,
  onEditPost,
  onDeletePost,
  onApprove,
  onRequestChanges,
  onApproveSelected,
  onApproveSiblings
}) => {
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [requestChangesModalForId, setRequestChangesModalForId] = useState<string | null>(null);
  const [changesReason, setChangesReason] = useState<string>('Refine tone for Series B technical leadership.');

  const approvals = posts.filter(p => {
    if (p.status !== 'Needs approval') return false;
    if (selectedChannelId !== 'all' && p.channelId !== selectedChannelId) return false;
    return true;
  });

  const toggleSelectPost = (id: string) => {
    if (selectedPostIds.includes(id)) {
      setSelectedPostIds(prev => prev.filter(pId => pId !== id));
    } else {
      setSelectedPostIds(prev => [...prev, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedPostIds.length === approvals.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(approvals.map(p => p.id));
    }
  };

  const handleConfirmRequestChanges = () => {
    if (requestChangesModalForId) {
      onRequestChanges(requestChangesModalForId, changesReason);
      setRequestChangesModalForId(null);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Approvals Header & Bulk Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Waiting for Approval ({approvals.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Posts drafted by agents requiring human sign-off before joining channel queues.
          </p>
        </div>

        {approvals.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5 text-gray-500" />
              <span>
                {selectedPostIds.length === approvals.length ? 'Deselect all' : 'Select all'}
              </span>
            </button>

            {selectedPostIds.length > 0 && (
              <button
                onClick={() => {
                  onApproveSelected(selectedPostIds);
                  setSelectedPostIds([]);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve selected ({selectedPostIds.length})</span>
              </button>
            )}
          </div>
        )}
      </div>

      {approvals.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-10 text-center text-xs text-gray-500 space-y-2">
          <Check className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="font-semibold text-gray-800">All caught up!</p>
          <p className="text-[11px]">No posts currently waiting for human approval.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map(post => (
            <PostCard
              key={post.id}
              post={post}
              channels={channels}
              onOpenDrawer={onOpenDrawer}
              onEdit={onEditPost}
              onDelete={onDeletePost}
              onApprove={onApprove}
              onRequestChanges={(id) => setRequestChangesModalForId(id)}
              onApproveSiblings={onApproveSiblings}
              showCheckbox={true}
              isSelected={selectedPostIds.includes(post.id)}
              onToggleSelect={toggleSelectPost}
            />
          ))}
        </div>
      )}

      {/* REQUEST CHANGES MODAL */}
      {requestChangesModalForId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setRequestChangesModalForId(null)} />
          <div className="relative bg-white rounded-lg p-5 max-w-md w-full shadow-xl border border-gray-200 z-10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-xs">Request changes from agent</h3>
              <button onClick={() => setRequestChangesModalForId(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              This post will be returned to Drafts with your instructions recorded:
            </p>

            <textarea
              value={changesReason}
              onChange={e => setChangesReason(e.target.value)}
              rows={3}
              className="w-full text-xs p-2.5 border border-gray-300 rounded text-gray-900 focus:border-blue-500 focus:ring-0"
              placeholder="What needs to change? (e.g. emphasize latency metrics, shorten hook)"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRequestChangesModalForId(null)}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRequestChanges}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium"
              >
                Send back to Drafts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
