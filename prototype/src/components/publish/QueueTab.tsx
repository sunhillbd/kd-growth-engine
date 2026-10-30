import React from 'react';
import { Channel, Post, ChannelId } from '../../types';
import { PostCard } from './PostCard';
import { getChannelQueueGroups, checkQueueRunningOut, FIXED_TODAY_DATE } from '../../utils/publishQueue';
import { Plus, AlertCircle, Clock, PauseCircle, Sparkles } from 'lucide-react';

interface QueueTabProps {
  channels: Channel[];
  posts: Post[];
  selectedChannelId: ChannelId | 'all';
  onOpenDrawer: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onShareNow: (postId: string) => void;
  onMoveToTop: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onOpenComposerForSlot: (date: string, time: string, slotId: string, channelId: ChannelId) => void;
  onFillWithDrafts: (channelId: ChannelId) => void;
  onOpenScheduleModal: (channel: Channel) => void;
}

export const QueueTab: React.FC<QueueTabProps> = ({
  channels,
  posts,
  selectedChannelId,
  onOpenDrawer,
  onEditPost,
  onShareNow,
  onMoveToTop,
  onDeletePost,
  onOpenComposerForSlot,
  onFillWithDrafts,
  onOpenScheduleModal
}) => {
  const selectedChannel = channels.find(c => c.id === selectedChannelId);
  const queueGroups = getChannelQueueGroups(channels, posts, selectedChannelId, 14, FIXED_TODAY_DATE);

  // Check if queue running out banner should show
  // If specific channel selected, check that channel.
  // If 'all' selected, find any connected channel whose queue is running out.
  let runningOutInfo: { runningOut: boolean; channel?: Channel; lastPostDateFormatted?: string } = { runningOut: false };

  if (selectedChannel && selectedChannel.status === 'connected') {
    const res = checkQueueRunningOut(selectedChannel, posts, FIXED_TODAY_DATE);
    if (res.runningOut) {
      runningOutInfo = {
        runningOut: true,
        channel: selectedChannel,
        lastPostDateFormatted: res.lastPostDateFormatted
      };
    }
  } else if (selectedChannelId === 'all') {
    for (const ch of channels) {
      if (ch.status === 'connected' && ch.slots && ch.slots.length > 0) {
        const res = checkQueueRunningOut(ch, posts, FIXED_TODAY_DATE);
        if (res.runningOut) {
          runningOutInfo = {
            runningOut: true,
            channel: ch,
            lastPostDateFormatted: res.lastPostDateFormatted
          };
          break;
        }
      }
    }
  }

  const isPaused = selectedChannel?.isPaused;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Paused Queue Banner */}
      {isPaused && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-center justify-between text-amber-900 text-xs">
          <div className="flex items-center gap-2">
            <PauseCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">
              Queue is paused for {selectedChannel?.name}.
            </span>
            <span className="text-amber-800">
              Posts will stay queued and will not publish until resumed.
            </span>
          </div>
        </div>
      )}

      {/* Queue Running Out Banner */}
      {runningOutInfo.runningOut && runningOutInfo.channel && (
        <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4 flex items-center justify-between text-xs text-blue-950">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="font-semibold">
                {runningOutInfo.channel.name} has no posts after {runningOutInfo.lastPostDateFormatted || 'Nov 4'}.
              </span>
              <span className="text-blue-800 ml-1">
                Fill it to keep your posting schedule consistent.
              </span>
            </div>
          </div>

          <button
            onClick={() => onFillWithDrafts(runningOutInfo.channel!.id)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
          >
            <span>Fill with drafts</span>
          </button>
        </div>
      )}

      {/* No Slots Configured Warning */}
      {selectedChannel && (!selectedChannel.slots || selectedChannel.slots.length === 0) && selectedChannel.status === 'connected' && (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center text-xs text-gray-500 space-y-2">
          <p className="font-medium text-gray-700">No posting schedule configured for this channel.</p>
          <p className="text-[11px]">Set up weekly time slots so posts can fill the queue automatically.</p>
          <button
            onClick={() => onOpenScheduleModal(selectedChannel)}
            className="px-3 py-1.5 bg-white border border-gray-300 text-gray-800 rounded font-medium hover:bg-gray-100"
          >
            Configure posting schedule
          </button>
        </div>
      )}

      {/* Day Groups List */}
      <div className="space-y-8">
        {queueGroups.map(group => (
          <div key={group.date} className="space-y-3">
            {/* Day Header */}
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">
                {group.friendlyDate}
              </h3>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Day Items (Posts + Dashed Open Slots) */}
            <div className="space-y-2.5 pl-2">
              {group.items.map((item, idx) => {
                if (item.type === 'post') {
                  return (
                    <PostCard
                      key={item.post.id}
                      post={item.post}
                      channels={channels}
                      onOpenDrawer={onOpenDrawer}
                      onEdit={onEditPost}
                      onShareNow={onShareNow}
                      onMoveToTop={onMoveToTop}
                      onDelete={onDeletePost}
                    />
                  );
                }

                // DASHED OPEN SLOT ROW
                return (
                  <button
                    key={`slot-${item.date}-${item.slotId}-${item.channelId}-${idx}`}
                    onClick={() => onOpenComposerForSlot(item.date, item.time, item.slotId, item.channelId)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 text-gray-500 hover:text-blue-700 transition-all text-xs group text-left"
                  >
                    <div className="flex items-center gap-2.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600" />
                      <span className="font-medium text-gray-700 group-hover:text-blue-800">
                        Open slot, {item.dayOfWeek} {item.audienceTime || item.time}
                      </span>
                      {selectedChannelId === 'all' && (
                        <span className="text-[11px] text-gray-400 font-sans">
                          ({channels.find(c => c.id === item.channelId)?.name.split(' · ')[0]})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 font-sans text-xs font-medium text-gray-500 group-hover:text-blue-600">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add post</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
