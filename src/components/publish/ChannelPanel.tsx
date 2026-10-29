import React, { useState, useRef, useEffect } from 'react';
import { Channel, ChannelId } from '../../types';
import { MoreHorizontal, Plus, AlertCircle, CheckCircle2, PauseCircle, Clock, ExternalLink } from 'lucide-react';

interface ChannelPanelProps {
  channels: Channel[];
  selectedChannelId: ChannelId | 'all';
  onSelectChannel: (id: ChannelId | 'all') => void;
  onOpenConnectModal: () => void;
  onOpenScheduleModal: (channel: Channel) => void;
  onTogglePauseChannel: (channelId: ChannelId) => void;
  onOpenDisconnectModal: (channel: Channel) => void;
  queuedCountByChannel: Record<string, number>;
}

export const ChannelPanel: React.FC<ChannelPanelProps> = ({
  channels,
  selectedChannelId,
  onSelectChannel,
  onOpenConnectModal,
  onOpenScheduleModal,
  onTogglePauseChannel,
  onOpenDisconnectModal,
  queuedCountByChannel
}) => {
  const [menuOpenForId, setMenuOpenForId] = useState<ChannelId | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenForId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const totalQueued = Object.values(queuedCountByChannel).reduce((acc, curr) => acc + curr, 0);

  const getPlatformIcon = (platform: Channel['platform']) => {
    switch (platform) {
      case 'LinkedIn':
        return (
          <div className="w-5 h-5 rounded bg-[#0A66C2] flex items-center justify-center text-white font-bold text-[10px] shrink-0">
            in
          </div>
        );
      case 'Facebook':
        return (
          <div className="w-5 h-5 rounded bg-[#1877F2] flex items-center justify-center text-white font-bold text-xs shrink-0">
            f
          </div>
        );
      case 'X':
        return (
          <div className="w-5 h-5 rounded bg-black flex items-center justify-center text-white font-bold text-xs shrink-0">
            𝕏
          </div>
        );
      case 'Website':
        return (
          <div className="w-5 h-5 rounded bg-emerald-700 flex items-center justify-center text-white font-bold text-[9px] shrink-0">
            KD
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded bg-gray-600 flex items-center justify-center text-white text-xs shrink-0">
            #
          </div>
        );
    }
  };

  return (
    <div className="w-60 border-r border-gray-200 bg-white flex flex-col shrink-0 h-full select-none">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Channels
        </span>
        <button
          onClick={onOpenConnectModal}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
          title="Connect a new channel"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Connect</span>
        </button>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* All Channels Option */}
        <button
          onClick={() => onSelectChannel('all')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
            selectedChannelId === 'all'
              ? 'bg-gray-100 text-gray-900 font-semibold'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center text-gray-700 text-[10px] font-semibold">
              All
            </div>
            <span className="truncate">All channels</span>
          </div>
          <span className="font-mono text-[11px] text-gray-500 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
            {totalQueued}
          </span>
        </button>

        <div className="pt-2 pb-1 px-3">
          <div className="border-t border-gray-100" />
        </div>

        {/* Individual Channels */}
        {channels.map(channel => {
          const isSelected = selectedChannelId === channel.id;
          const queuedCount = queuedCountByChannel[channel.id] || 0;
          const isPendingReview = channel.status === 'pending_review';
          const isDisconnected = channel.status === 'not_connected';
          const isPaused = channel.isPaused;

          return (
            <div
              key={channel.id}
              className={`group relative flex items-center justify-between px-2.5 py-2 rounded-md text-xs transition-colors ${
                isSelected
                  ? 'bg-blue-50/70 text-blue-950 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${isDisconnected ? 'opacity-50' : ''}`}
            >
              {/* Click target for selecting channel */}
              <button
                onClick={() => onSelectChannel(channel.id)}
                className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                title={`${channel.name} (${channel.handleOrSub})`}
              >
                {getPlatformIcon(channel.platform)}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-medium text-gray-900 leading-tight">
                      {channel.platform === 'LinkedIn' 
                        ? (channel.id === 'linkedin_personal' ? 'LinkedIn · Personal' : 'LinkedIn · Company')
                        : channel.platform === 'Facebook'
                        ? 'Facebook · Page'
                        : channel.platform === 'X'
                        ? 'X · Account'
                        : 'Website'}
                    </span>
                    {/* Health dot */}
                    {channel.status === 'connected' && !isPaused && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Connected & healthy" />
                    )}
                    {channel.status === 'connected' && isPaused && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Queue paused" />
                    )}
                    {isPendingReview && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Pending LinkedIn review" />
                    )}
                    {channel.status === 'needs_attention' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" title="Needs attention" />
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate mt-0.5">
                    {isPendingReview ? 'Review pending' : isPaused ? 'Queue paused' : channel.handleOrSub}
                  </div>
                </div>
              </button>

              {/* Queued count & Context Menu */}
              <div className="flex items-center gap-1 ml-1.5 shrink-0">
                {!isPendingReview && !isDisconnected && (
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {queuedCount}
                  </span>
                )}

                {/* "…" menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenForId(menuOpenForId === channel.id ? null : channel.id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded"
                    title="Channel actions"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {menuOpenForId === channel.id && (
                    <div
                      ref={menuRef}
                      className="absolute left-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-30 text-xs"
                    >
                      <button
                        onClick={() => {
                          setMenuOpenForId(null);
                          onOpenScheduleModal(channel);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>Posting schedule</span>
                      </button>

                      <button
                        onClick={() => {
                          setMenuOpenForId(null);
                          onTogglePauseChannel(channel.id);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <PauseCircle className="w-3.5 h-3.5 text-gray-400" />
                        <span>{isPaused ? 'Resume queue' : 'Pause queue'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setMenuOpenForId(null);
                          onOpenConnectModal();
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                        <span>Reconnect</span>
                      </button>

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={() => {
                          setMenuOpenForId(null);
                          onOpenDisconnectModal(channel);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                      >
                        <span>Disconnect</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Panel Bottom: + Connect channel */}
      <div className="p-3 border-t border-gray-200 bg-gray-50/50">
        <button
          onClick={onOpenConnectModal}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-gray-500" />
          <span>+ Connect channel</span>
        </button>
      </div>
    </div>
  );
};
