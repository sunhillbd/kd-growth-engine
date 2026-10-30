import React, { useState } from 'react';
import { Channel, WeeklySlot, ChannelId } from '../../types';
import { X, Plus, Clock, Copy, PauseCircle, PlayCircle, Check, AlertCircle } from 'lucide-react';

interface PostingScheduleModalProps {
  channel: Channel | null;
  channels: Channel[];
  isOpen: boolean;
  onClose: () => void;
  onSaveSchedule: (channelId: ChannelId, slots: WeeklySlot[], timezone: string, postingGoal: '1x' | '3x' | '5x') => void;
  onTogglePauseQueue: (channelId: ChannelId) => void;
}

const DAYS_OF_WEEK: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[] = [
  'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
];

export const PostingScheduleModal: React.FC<PostingScheduleModalProps> = ({
  channel,
  channels,
  isOpen,
  onClose,
  onSaveSchedule,
  onTogglePauseQueue
}) => {
  if (!isOpen || !channel) return null;

  const [timezone, setTimezone] = useState(channel.timezone || 'Asia/Dhaka');
  const [slots, setSlots] = useState<WeeklySlot[]>(channel.slots || []);
  const [postingGoal, setPostingGoal] = useState<'1x' | '3x' | '5x'>(channel.postingGoal || '3x');
  const [selectedDayOption, setSelectedDayOption] = useState<'everyday' | 'weekdays' | 'weekends' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('weekdays');
  const [newTime, setNewTime] = useState('18:30');
  const [copyFromChannelId, setCopyFromChannelId] = useState<string>('');

  const removeSlot = (slotId: string) => {
    setSlots(prev => prev.filter(s => s.id !== slotId));
  };

  const handleAddSlot = () => {
    let daysToAdd: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[] = [];
    if (selectedDayOption === 'everyday') {
      daysToAdd = [...DAYS_OF_WEEK];
    } else if (selectedDayOption === 'weekdays') {
      daysToAdd = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    } else if (selectedDayOption === 'weekends') {
      daysToAdd = ['Sat', 'Sun'];
    } else {
      daysToAdd = [selectedDayOption];
    }

    const newSlots: WeeklySlot[] = daysToAdd.map((day, idx) => ({
      id: `slot-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
      dayOfWeek: day,
      time: newTime,
      audienceTime: '8:30 AM NY'
    }));

    setSlots(prev => [...prev, ...newSlots]);
  };

  const handleApplyGoal = (goal: '1x' | '3x' | '5x') => {
    setPostingGoal(goal);
    // Fill suggested slots from best industry times
    if (goal === '1x') {
      setSlots([
        { id: `slot-goal-1`, dayOfWeek: 'Wed', time: '18:30', audienceTime: '8:30 AM NY' }
      ]);
    } else if (goal === '3x') {
      setSlots([
        { id: `slot-goal-1`, dayOfWeek: 'Tue', time: '18:30', audienceTime: '8:30 AM NY' },
        { id: `slot-goal-2`, dayOfWeek: 'Wed', time: '18:30', audienceTime: '8:30 AM NY' },
        { id: `slot-goal-3`, dayOfWeek: 'Thu', time: '18:30', audienceTime: '8:30 AM NY' },
      ]);
    } else if (goal === '5x') {
      setSlots([
        { id: `slot-goal-1`, dayOfWeek: 'Mon', time: '19:00', audienceTime: '9:00 AM NY' },
        { id: `slot-goal-2`, dayOfWeek: 'Tue', time: '19:00', audienceTime: '9:00 AM NY' },
        { id: `slot-goal-3`, dayOfWeek: 'Wed', time: '19:00', audienceTime: '9:00 AM NY' },
        { id: `slot-goal-4`, dayOfWeek: 'Thu', time: '19:00', audienceTime: '9:00 AM NY' },
        { id: `slot-goal-5`, dayOfWeek: 'Fri', time: '19:00', audienceTime: '9:00 AM NY' },
      ]);
    }
  };

  const handleCopySchedule = () => {
    const sourceChannel = channels.find(c => c.id === copyFromChannelId);
    if (sourceChannel && sourceChannel.slots) {
      setSlots([...sourceChannel.slots]);
      setTimezone(sourceChannel.timezone);
      setPostingGoal(sourceChannel.postingGoal);
    }
  };

  const handleSave = () => {
    onSaveSchedule(channel.id, slots, timezone, postingGoal);
    onClose();
  };

  // Group slots by day
  const slotsByDay: Record<string, WeeklySlot[]> = {};
  DAYS_OF_WEEK.forEach(day => {
    slotsByDay[day] = slots.filter(s => s.dayOfWeek === day);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Posting Schedule: {channel.name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Posts go into this channel's queue and fill the next open slot automatically.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-gray-700">
          {/* Pause Banner if queue is paused */}
          {channel.isPaused && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center justify-between text-amber-900">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="font-medium">This channel's queue is paused. Scheduled posts will not go live.</span>
              </div>
              <button
                onClick={() => onTogglePauseQueue(channel.id)}
                className="px-2.5 py-1 bg-amber-600 text-white rounded text-xs font-medium hover:bg-amber-700"
              >
                Resume queue
              </button>
            </div>
          )}

          {/* Timezone & Posting Goal Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">
                Schedule Timezone
              </label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-900 focus:border-blue-500 focus:ring-0"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">
                Posting Goal
              </label>
              <div className="flex items-center gap-2">
                {(['1x', '3x', '5x'] as const).map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleApplyGoal(goal)}
                    className={`flex-1 py-1.5 px-2 rounded border text-xs font-medium transition-colors ${
                      postingGoal === goal
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {goal} / week
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Copy Schedule from another channel */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <span className="text-xs font-medium text-gray-700 shrink-0">
              Copy from channel:
            </span>
            <select
              value={copyFromChannelId}
              onChange={e => setCopyFromChannelId(e.target.value)}
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option value="">Select connected channel...</option>
              {channels.filter(c => c.id !== channel.id && c.slots && c.slots.length > 0).map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.slots.length} slots)
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!copyFromChannelId}
              onClick={handleCopySchedule}
              className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Copy
            </button>
          </div>

          {/* Weekly Slots List grouped by Day */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Weekly Posting Times ({slots.length} active slots)
              </span>
            </div>

            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white">
              {DAYS_OF_WEEK.map(day => {
                const daySlots = slotsByDay[day] || [];
                return (
                  <div key={day} className="p-3 flex items-start gap-4">
                    <span className="w-12 text-xs font-bold text-gray-900 shrink-0 pt-0.5">
                      {day}
                    </span>

                    <div className="flex-1 flex flex-wrap gap-2">
                      {daySlots.length === 0 ? (
                        <span className="text-xs text-gray-400 italic">No slots scheduled</span>
                      ) : (
                        daySlots.map(slot => (
                          <span
                            key={slot.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200 text-xs font-mono font-medium group"
                          >
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span>{slot.time}</span>
                            {slot.audienceTime && (
                              <span className="text-[10px] text-gray-500 font-sans">
                                ({slot.audienceTime})
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeSlot(slot.id)}
                              className="text-gray-400 hover:text-rose-600 ml-0.5"
                              title="Remove slot"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Posting Time Form */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/70 space-y-3">
            <span className="text-xs font-semibold text-gray-900 block">
              + Add Posting Time
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-[11px] text-gray-500 mb-1">Frequency / Day</label>
                <select
                  value={selectedDayOption}
                  onChange={e => setSelectedDayOption(e.target.value as any)}
                  className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-900"
                >
                  <option value="everyday">Every day</option>
                  <option value="weekdays">Weekdays (Mon-Fri)</option>
                  <option value="weekends">Weekends (Sat-Sun)</option>
                  <option value="Mon">Mondays only</option>
                  <option value="Tue">Tuesdays only</option>
                  <option value="Wed">Wednesdays only</option>
                  <option value="Thu">Thursdays only</option>
                  <option value="Fri">Fridays only</option>
                  <option value="Sat">Saturdays only</option>
                  <option value="Sun">Sundays only</option>
                </select>
              </div>

              <div className="w-36">
                <label className="block text-[11px] text-gray-500 mb-1">Time ({timezone})</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-2.5 py-1 bg-white font-mono"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add slot</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onTogglePauseQueue(channel.id)}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
          >
            {channel.isPaused ? (
              <>
                <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resume channel queue</span>
              </>
            ) : (
              <>
                <PauseCircle className="w-3.5 h-3.5 text-gray-500" />
                <span>Pause queue</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
