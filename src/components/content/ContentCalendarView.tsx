import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, Clock, X } from 'lucide-react';
import { ContentItem, DestinationId } from '../../types';
import { PLATFORM_ICONS } from '../../mock/destinations';
import { FIXED_TODAY_DATE } from '../../mock/content';

interface ContentCalendarViewProps {
  items: ContentItem[];
  onOpenDrawer: (item: ContentItem) => void;
  onDropItemOnDay: (itemId: string, dateStr: string) => void;
  onInitiateChipDrag: (item: ContentItem, targetDate: string) => void;
  calendarMode: 'week' | 'month';
  onCalendarModeChange: (mode: 'week' | 'month') => void;
  currentDateOffset: number;
  onPrevDate: () => void;
  onNextDate: () => void;
  onToday: () => void;
}

export const ContentCalendarView: React.FC<ContentCalendarViewProps> = ({
  items,
  onOpenDrawer,
  onDropItemOnDay,
  onInitiateChipDrag,
  calendarMode,
  currentDateOffset,
  onPrevDate,
  onNextDate,
  onToday
}) => {
  // Popover state for "+N more"
  const [popoverDay, setPopoverDay] = useState<{ date: string; items: ContentItem[] } | null>(null);

  // Helper to format dates around Thursday, Oct 29, 2026
  // Base anchor: Thursday, Oct 29, 2026. Week starts on Sunday Oct 25 or Monday Oct 26.
  // Standard business calendar: Monday to Sunday.
  // Monday: Oct 26, Tuesday: Oct 27, Wednesday: Oct 28, Thursday: Oct 29 (TODAY), Friday: Oct 30, Saturday: Oct 31, Sunday: Nov 1
  const baseAnchor = new Date(2026, 9, 26); // Oct 26, 2026 (Monday)
  baseAnchor.setDate(baseAnchor.getDate() + currentDateOffset * (calendarMode === 'week' ? 7 : 28));

  // Generate 7 days for Week view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseAnchor);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = dateStr === FIXED_TODAY_DATE;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });

    return { dateStr, isToday, dayName, dayNumber, monthName, fullDate: d };
  });

  // Generate 28 days for Month view (4 weeks)
  const monthDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(baseAnchor);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = dateStr === FIXED_TODAY_DATE;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });

    return { dateStr, isToday, dayName, dayNumber, monthName, fullDate: d };
  });

  const displayedDays = calendarMode === 'week' ? weekDays : monthDays;

  // Filter items matching date
  const getItemsForDate = (dateStr: string) => {
    return items.filter(item => {
      // Check scheduledDate or scheduledDay or destinationSchedules
      if (item.scheduledDate === dateStr) return true;
      if (item.publishedDate === dateStr) return true;
      const schedules = Object.values(item.destinationSchedules || {});
      return schedules.some(s => s.scheduledDate === dateStr);
    });
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Needs approval': return 'bg-amber-500';
      case 'Scheduled': return 'bg-indigo-500';
      case 'Published': return 'bg-emerald-500';
      case 'Draft': return 'bg-slate-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      {/* Calendar Grid Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/70 text-xs font-mono shrink-0">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
          <div key={day} className="py-2 text-center text-gray-500 font-semibold border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Body */}
      <div className={`flex-1 grid grid-cols-7 divide-x divide-gray-200 overflow-y-auto ${
        calendarMode === 'week' ? 'grid-rows-1' : 'grid-rows-4 divide-y divide-gray-200'
      }`}>
        {displayedDays.map(day => {
          const dayItems = getItemsForDate(day.dateStr);
          const maxVisible = 3;
          const visibleItems = dayItems.slice(0, maxVisible);
          const overflowCount = dayItems.length - maxVisible;

          return (
            <div
              key={day.dateStr}
              onDragOver={e => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={e => {
                e.preventDefault();
                try {
                  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                  if (data?.id) {
                    onDropItemOnDay(data.id, day.dateStr);
                  }
                } catch {}
              }}
              className={`p-1.5 flex flex-col transition-colors border-b border-gray-200 last:border-r-0 min-h-[140px] ${
                day.isToday ? 'bg-blue-50/20' : 'bg-white hover:bg-gray-50/30'
              }`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between px-1 py-1 mb-1">
                <span className={`text-xs font-mono ${
                  day.isToday 
                    ? 'w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center -ml-0.5' 
                    : 'text-gray-700 font-medium'
                }`}>
                  {day.dayNumber}
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  {day.monthName}
                </span>
              </div>

              {/* Chips (Strictly max 3, no internal scrolling) */}
              <div className="flex-1 space-y-1 overflow-hidden">
                {visibleItems.map(item => {
                  const hasFailedDest = Object.values(item.destinationSchedules || {}).some(s => s.status === 'Failed');

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.setData('text/plain', JSON.stringify({ id: item.id }));
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragEnd={() => {}}
                      onClick={() => onOpenDrawer(item)}
                      className={`px-2 py-1.5 rounded-[4px] border text-left text-xs transition-all cursor-pointer shadow-2xs group flex flex-col gap-0.5 ${
                        item.status === 'Needs approval'
                          ? 'border-amber-200 bg-amber-50/80 hover:bg-amber-100 text-amber-950'
                          : item.status === 'Scheduled'
                            ? 'border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950'
                            : item.status === 'Published'
                              ? 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950'
                              : 'border-gray-200 bg-white hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 text-[11px] shrink-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(item.status)}`} />
                          {item.selectedDestinations.slice(0, 2).map(d => (
                            <span key={d} className="text-[10px]">
                              {PLATFORM_ICONS[d.startsWith('linkedin') ? 'LinkedIn' : d === 'facebook_page' ? 'Facebook' : d === 'x_profile' ? 'X' : 'Website']}
                            </span>
                          ))}
                        </div>
                        <span className="font-mono text-[9px] text-gray-400 shrink-0">
                          {item.scheduledTime || '18:30'}
                        </span>
                      </div>

                      <div className="font-medium truncate text-[11px] leading-tight">
                        {item.topic}
                      </div>

                      {hasFailedDest && (
                        <span className="text-[9px] font-bold text-red-600 font-mono">
                          Failed on X
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* +N more chip */}
                {overflowCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setPopoverDay({ date: day.dateStr, items: dayItems })}
                    className="w-full text-center py-0.5 text-[10px] font-mono font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                  >
                    +{overflowCount} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Popover for "+N more" */}
      {popoverDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={() => setPopoverDay(null)}>
          <div 
            className="bg-white rounded-[6px] border border-gray-200 shadow-xl max-w-sm w-full p-3 space-y-2 animate-in fade-in zoom-in-95 duration-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-900 font-mono">
                {popoverDay.date} ({popoverDay.items.length} items)
              </span>
              <button onClick={() => setPopoverDay(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto space-y-1.5 divide-y divide-gray-50">
              {popoverDay.items.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setPopoverDay(null);
                    onOpenDrawer(item);
                  }}
                  className="pt-1.5 first:pt-0 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors text-xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-medium text-gray-900 truncate">
                      {item.topic}
                    </span>
                    <span className="font-mono text-[10px] text-gray-400 shrink-0">
                      {item.scheduledTime || '18:30'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(item.status)}`} />
                    <span>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
