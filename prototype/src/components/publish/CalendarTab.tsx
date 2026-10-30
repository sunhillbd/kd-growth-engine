import React, { useState } from 'react';
import { Channel, Post, ChannelId } from '../../types';
import { FIXED_TODAY_DATE, addDays, getDayOfWeek, parseDateStr } from '../../utils/publishQueue';
import { ChevronLeft, ChevronRight, Plus, Clock, FileText, ArrowRight, X, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarTabProps {
  channels: Channel[];
  posts: Post[];
  selectedChannelId: ChannelId | 'all';
  onOpenDrawer: (post: Post) => void;
  onOpenComposerForSlot: (date: string, time: string, slotId: string, channelId: ChannelId) => void;
  onOpenComposerForDay: (date: string, channelId?: ChannelId) => void;
  onReschedulePost: (postId: string, date: string, time: string) => void;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  channels,
  posts,
  selectedChannelId,
  onOpenDrawer,
  onOpenComposerForSlot,
  onOpenComposerForDay,
  onReschedulePost
}) => {
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');
  const [weekOffset, setWeekOffset] = useState<number>(0); // 0 = current week starting around FIXED_TODAY_DATE (2026-10-29)
  const [draftsTrayOpen, setDraftsTrayOpen] = useState<boolean>(false);
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
  const [moreChipsPopover, setMoreChipsPopover] = useState<{ dayDate: string; posts: Post[] } | null>(null);

  // Compute week start date (Sunday or Monday of current week for 2026-10-29)
  // 2026-10-29 is Thursday. Sunday was 2026-10-25.
  const baseSunday = '2026-10-25';
  const startDay = addDays(baseSunday, weekOffset * 7);

  // 7 days for week view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const curDate = addDays(startDay, i);
    return {
      date: curDate,
      dayOfWeek: getDayOfWeek(curDate),
      dayNum: parseDateStr(curDate).getUTCDate(),
      isToday: curDate === FIXED_TODAY_DATE
    };
  });

  // Filter posts
  const filteredPosts = posts.filter(p => {
    if (selectedChannelId !== 'all' && p.channelId !== selectedChannelId) return false;
    return true;
  });

  // Drafts for the right tray
  const availableDrafts = posts.filter(p => {
    if (p.status !== 'Draft') return false;
    if (selectedChannelId !== 'all' && p.channelId !== selectedChannelId) return false;
    return true;
  });

  const getPlatformIcon = (platform?: Channel['platform']) => {
    switch (platform) {
      case 'LinkedIn':
        return <span className="w-2.5 h-2.5 rounded-full bg-[#0A66C2] inline-block shrink-0" />;
      case 'Facebook':
        return <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2] inline-block shrink-0" />;
      case 'X':
        return <span className="w-2.5 h-2.5 rounded-full bg-black inline-block shrink-0" />;
      case 'Website':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block shrink-0" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block shrink-0" />;
    }
  };

  const getStatusDot = (status: Post['status']) => {
    switch (status) {
      case 'Sent':
        return <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Sent" />;
      case 'Needs approval':
        return <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Needs approval" />;
      case 'Scheduled':
        return <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="Scheduled" />;
      case 'Failed':
        return <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" title="Failed" />;
      default:
        return <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" title="Draft" />;
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, postId: string) => {
    setDraggedPostId(postId);
    e.dataTransfer.setData('text/plain', postId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnDay = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    const postId = draggedPostId || e.dataTransfer.getData('text/plain');
    if (postId) {
      const p = posts.find(item => item.id === postId);
      if (p) {
        onReschedulePost(postId, targetDate, p.scheduledTime || '18:30');
      }
    }
    setDraggedPostId(null);
  };

  return (
    <div className="flex h-full gap-4 relative">
      {/* Main Calendar View Area */}
      <div className="flex-1 flex flex-col min-w-0 space-y-3">
        {/* Toolbar */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {/* View segmented control */}
            <div className="inline-flex rounded-md border border-gray-300 p-0.5 bg-gray-100 text-xs font-medium">
              <button
                type="button"
                onClick={() => setCalendarView('week')}
                className={`px-3 py-1 rounded transition-colors ${
                  calendarView === 'week' ? 'bg-white text-gray-900 shadow-2xs font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setCalendarView('month')}
                className={`px-3 py-1 rounded transition-colors ${
                  calendarView === 'month' ? 'bg-white text-gray-900 shadow-2xs font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month
              </button>
            </div>

            {/* Nav Arrows */}
            <div className="flex items-center gap-1 ml-2">
              <button
                type="button"
                onClick={() => setWeekOffset(prev => prev - 1)}
                className="p-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-600"
                title="Previous week"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-xs font-medium text-gray-700"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset(prev => prev + 1)}
                className="p-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-600"
                title="Next week"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-xs font-semibold text-gray-800 ml-2 font-mono">
              {weekDays[0].date} — {weekDays[6].date}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Drafts Tray Toggle Button */}
            <button
              type="button"
              onClick={() => setDraftsTrayOpen(!draftsTrayOpen)}
              className={`px-3 py-1.5 rounded border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                draftsTrayOpen
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-gray-500" />
              <span>Drafts ({availableDrafts.length})</span>
            </button>
          </div>
        </div>

        {/* WEEK VIEW GRID */}
        {calendarView === 'week' ? (
          <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden bg-gray-200 gap-[1px] min-h-[520px]">
            {weekDays.map(day => {
              const postsOnDay = filteredPosts.filter(p => p.scheduledDate === day.date || (p.sentAt && day.isToday));
              const visibleChips = postsOnDay.slice(0, 3);
              const remainingCount = postsOnDay.length - 3;

              // Find target channels for dashed slot placeholders
              const targetChannels = selectedChannelId === 'all'
                ? channels.filter(c => c.status === 'connected')
                : channels.filter(c => c.id === selectedChannelId);

              const daySlots = targetChannels.flatMap(ch => 
                (ch.slots || []).filter(s => s.dayOfWeek === day.dayOfWeek).map(s => ({ ...s, channelId: ch.id }))
              );

              // Empty slots not occupied
              const openSlotsOnDay = daySlots.filter(
                s => !postsOnDay.some(p => p.channelId === s.channelId && p.scheduledTime === s.time)
              );

              return (
                <div
                  key={day.date}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnDay(e, day.date)}
                  className={`bg-white p-2 flex flex-col justify-between select-none min-h-[160px] ${
                    day.isToday ? 'bg-blue-50/20' : ''
                  }`}
                >
                  {/* Day header */}
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                        {day.dayOfWeek}
                      </span>
                      <span className={`text-xs font-semibold px-1.5 py-0.2 rounded font-mono ${
                        day.isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
                      }`}>
                        {day.dayNum}
                      </span>
                    </div>

                    {/* Chips Container - strictly max 3, NO internal scrollbars */}
                    <div className="space-y-1.5 mt-2">
                      {visibleChips.map(post => {
                        const channel = channels.find(c => c.id === post.channelId);
                        return (
                          <div
                            key={post.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, post.id)}
                            onClick={() => onOpenDrawer(post)}
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-[11px] cursor-grab active:cursor-grabbing hover:border-gray-400 transition-all flex items-center gap-1.5"
                            title={`${post.text} (Click to open, drag to reschedule)`}
                          >
                            {getPlatformIcon(channel?.platform)}
                            <span className="font-mono text-[10px] text-gray-500 shrink-0">
                              {post.scheduledTime || '18:30'}
                            </span>
                            <span className="truncate flex-1 text-gray-800 font-normal">
                              {post.text.substring(0, 28)}
                            </span>
                            {getStatusDot(post.status)}
                          </div>
                        );
                      })}

                      {/* "+N more" popover trigger */}
                      {remainingCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setMoreChipsPopover({ dayDate: day.date, posts: postsOnDay })}
                          className="w-full text-center py-0.5 text-[10px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50/60 rounded"
                        >
                          +{remainingCount} more
                        </button>
                      )}

                      {/* Open slots as faint dashed placeholders */}
                      {openSlotsOnDay.slice(0, 2).map((slot, sIdx) => (
                        <button
                          key={`open-${day.date}-${slot.id}-${sIdx}`}
                          type="button"
                          onClick={() => onOpenComposerForSlot(day.date, slot.time, slot.id, slot.channelId)}
                          className="w-full p-1 rounded border border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 text-[10px] text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-between font-mono"
                          title="Open slot · Click to create post"
                        >
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{slot.audienceTime || slot.time}</span>
                          </span>
                          <span className="font-sans font-medium text-[9px]">+ Add</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Empty cell click trigger */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenComposerForDay(day.date, selectedChannelId !== 'all' ? selectedChannelId : undefined)}
                      className="w-full text-center text-[10px] text-gray-300 hover:text-gray-600 hover:bg-gray-50 py-0.5 rounded transition-colors"
                      title="Add post to this day"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* MONTH VIEW GRID (simulated 4 weeks) */
          <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden bg-gray-200 gap-[1px] min-h-[500px]">
            {Array.from({ length: 28 }, (_, i) => {
              const curDate = addDays(baseSunday, i);
              const dayNum = parseDateStr(curDate).getUTCDate();
              const isToday = curDate === FIXED_TODAY_DATE;
              const postsOnDay = filteredPosts.filter(p => p.scheduledDate === curDate);
              const visible = postsOnDay.slice(0, 2);
              const remaining = postsOnDay.length - 2;

              return (
                <div
                  key={curDate}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnDay(e, curDate)}
                  className={`bg-white p-1.5 flex flex-col justify-between min-h-[90px] select-none ${
                    isToday ? 'bg-blue-50/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-1 rounded font-mono ${
                      isToday ? 'bg-blue-600 text-white' : 'text-gray-600'
                    }`}>
                      {dayNum}
                    </span>
                  </div>

                  <div className="space-y-1 mt-1">
                    {visible.map(post => {
                      const ch = channels.find(c => c.id === post.channelId);
                      return (
                        <div
                          key={post.id}
                          onClick={() => onOpenDrawer(post)}
                          className="px-1 py-0.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-[9px] truncate cursor-pointer flex items-center gap-1"
                        >
                          {getPlatformIcon(ch?.platform)}
                          <span className="truncate">{post.text}</span>
                        </div>
                      );
                    })}
                    {remaining > 0 && (
                      <span className="text-[9px] text-blue-600 font-semibold block">
                        +{remaining} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenComposerForDay(curDate)}
                    className="text-right text-[10px] text-gray-300 hover:text-gray-600"
                  >
                    +
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DRAFTS TRAY (Right Drawer Tray) */}
      {draftsTrayOpen && (
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg z-20">
          <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-900">
                Drafts Tray ({availableDrafts.length})
              </span>
            </div>
            <button
              onClick={() => setDraftsTrayOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2 bg-blue-50 text-[11px] text-blue-800 border-b border-blue-100">
            Drag any draft onto a calendar day or slot to schedule it.
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {availableDrafts.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">
                No drafts available.
              </div>
            ) : (
              availableDrafts.map(draft => {
                const ch = channels.find(c => c.id === draft.channelId);
                return (
                  <div
                    key={draft.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, draft.id)}
                    onClick={() => onOpenDrawer(draft)}
                    className="p-3 bg-white border border-gray-200 rounded-lg shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all cursor-grab active:cursor-grabbing space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        {getPlatformIcon(ch?.platform)}
                        <span className="font-semibold text-gray-900 text-[11px]">
                          {ch?.name.split(' · ')[0]}
                        </span>
                      </div>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-mono">
                        Draft
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
                      {draft.text}
                    </p>

                    <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1 border-t border-gray-100">
                      <span>{draft.pattern || 'General'}</span>
                      <span className="text-blue-600 font-medium">Drag to schedule →</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* POPOVER FOR "+N MORE" POSTS ON A DAY */}
      {moreChipsPopover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => setMoreChipsPopover(null)} />
          <div className="relative bg-white rounded-lg p-5 max-w-md w-full shadow-xl border border-gray-200 z-10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-900 font-mono">
                Posts on {moreChipsPopover.dayDate} ({moreChipsPopover.posts.length})
              </span>
              <button
                onClick={() => setMoreChipsPopover(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {moreChipsPopover.posts.map(post => {
                const ch = channels.find(c => c.id === post.channelId);
                return (
                  <div
                    key={post.id}
                    onClick={() => {
                      setMoreChipsPopover(null);
                      onOpenDrawer(post);
                    }}
                    className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-xs cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{ch?.name}</span>
                      <span className="font-mono text-gray-500 text-[11px]">{post.scheduledTime}</span>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{post.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
