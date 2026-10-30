import React from 'react';
import { Channel, Post } from '../../types';
import { AlertTriangle, X } from 'lucide-react';

interface DisconnectChannelModalProps {
  channel: Channel | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDisconnect: (channelId: Channel['id']) => void;
  scheduledPosts: Post[];
}

export const DisconnectChannelModal: React.FC<DisconnectChannelModalProps> = ({
  channel,
  isOpen,
  onClose,
  onConfirmDisconnect,
  scheduledPosts
}) => {
  if (!isOpen || !channel) return null;

  const affectedPosts = scheduledPosts.filter(
    p => p.channelId === channel.id && p.status === 'Scheduled'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" />

      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 z-10 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Disconnect {channel.name}?
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Are you sure you want to disconnect this channel? This will pause all publishing and remove scheduled posts in its queue.
            </p>
          </div>
        </div>

        {affectedPosts.length > 0 && (
          <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3 text-xs space-y-2">
            <span className="font-semibold text-rose-900 block">
              The following {affectedPosts.length} scheduled posts will be removed from queue:
            </span>
            <ul className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {affectedPosts.map(post => (
                <li key={post.id} className="text-rose-800 flex items-start gap-1.5 text-[11px]">
                  <span className="font-mono text-rose-600 shrink-0">[{post.scheduledDate} {post.scheduledTime}]:</span>
                  <span className="truncate">{post.text.substring(0, 45)}...</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmDisconnect(channel.id);
              onClose();
            }}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium"
          >
            Disconnect and remove posts
          </button>
        </div>
      </div>
    </div>
  );
};
