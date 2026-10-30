import { Channel, Post, WeeklySlot, ChannelId } from '../types';

export const FIXED_TODAY_DATE = '2026-10-29'; // Thursday

export const DAY_NAMES: ('Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[] = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

export const FULL_DAY_NAMES: Record<string, string> = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday'
};

// Helper: parse "YYYY-MM-DD" into Date object at midnight UTC
export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

// Helper: format Date object to "YYYY-MM-DD"
export function formatDateStr(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper: add days to "YYYY-MM-DD"
export function addDays(dateStr: string, days: number): string {
  const d = parseDateStr(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return formatDateStr(d);
}

// Helper: get day of week abbreviation from "YYYY-MM-DD"
export function getDayOfWeek(dateStr: string): 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' {
  const d = parseDateStr(dateStr);
  return DAY_NAMES[d.getUTCDay()];
}

// Format date into human-friendly format: "Thursday, Oct 29" or "Tomorrow, Oct 30"
export function formatFriendlyDate(dateStr: string, todayStr = FIXED_TODAY_DATE): string {
  if (dateStr === todayStr) return 'Today';
  if (dateStr === addDays(todayStr, 1)) return 'Tomorrow';
  const d = parseDateStr(dateStr);
  const dayName = FULL_DAY_NAMES[DAY_NAMES[d.getUTCDay()]];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[d.getUTCMonth()];
  const dayNum = d.getUTCDate();
  return `${dayName}, ${monthName} ${dayNum}`;
}

export function formatShortDate(dateStr: string): string {
  const d = parseDateStr(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export interface SlotOccurrence {
  date: string; // "2026-10-30"
  time: string; // "18:30"
  dayOfWeek: string;
  audienceTime?: string;
  slotId: string;
}

export type QueueItem = 
  | { type: 'post'; post: Post; date: string; time: string; audienceTime?: string }
  | { type: 'open_slot'; date: string; time: string; dayOfWeek: string; audienceTime?: string; slotId: string; channelId: ChannelId };

export interface DayQueueGroup {
  date: string;
  friendlyDate: string;
  items: QueueItem[];
}

/**
 * Find the next open slot for a channel starting from `fromDate`.
 * Scans up to 60 days in the future.
 */
export function getNextOpenSlot(
  channel: Channel,
  allPosts: Post[],
  fromDate = FIXED_TODAY_DATE
): SlotOccurrence | null {
  if (!channel.slots || channel.slots.length === 0) return null;

  const scheduledForChannel = allPosts.filter(
    p => p.channelId === channel.id && p.status === 'Scheduled' && p.scheduledDate
  );

  // Check each day starting today
  for (let offset = 0; offset <= 60; offset++) {
    const curDate = addDays(fromDate, offset);
    const dayName = getDayOfWeek(curDate);

    // Find slots matching this day
    const matchingSlots = channel.slots.filter(s => s.dayOfWeek === dayName);

    for (const slot of matchingSlots) {
      // If it's today, check if time hasn't passed (we can assume today slots at 18:30+ are valid or skip if already past)
      // Check if slot on this date is already occupied
      const isOccupied = scheduledForChannel.some(p => {
        return p.scheduledDate === curDate && (p.scheduledTime === slot.time || p.slotId === slot.id);
      });

      if (!isOccupied) {
        return {
          date: curDate,
          time: slot.time,
          dayOfWeek: slot.dayOfWeek,
          audienceTime: slot.audienceTime,
          slotId: slot.id
        };
      }
    }
  }

  return null;
}

/**
 * Return queue list grouped by day for a channel (or all channels).
 * Includes both scheduled posts and dashed open slots for the next `daysCount` days.
 */
export function getChannelQueueGroups(
  channels: Channel[],
  posts: Post[],
  selectedChannelId: ChannelId | 'all',
  daysCount = 14,
  fromDate = FIXED_TODAY_DATE
): DayQueueGroup[] {
  const groups: DayQueueGroup[] = [];

  const targetChannels = selectedChannelId === 'all' 
    ? channels.filter(c => c.status === 'connected')
    : channels.filter(c => c.id === selectedChannelId);

  for (let offset = 0; offset < daysCount; offset++) {
    const curDate = addDays(fromDate, offset);
    const dayOfWeek = getDayOfWeek(curDate);
    const dayItems: QueueItem[] = [];

    // 1. Scheduled posts on this date
    const postsOnDay = posts.filter(p => {
      if (p.status !== 'Scheduled') return false;
      if (p.scheduledDate !== curDate) return false;
      if (selectedChannelId !== 'all' && p.channelId !== selectedChannelId) return false;
      return true;
    }).sort((a, b) => (a.scheduledTime || '00:00').localeCompare(b.scheduledTime || '00:00'));

    postsOnDay.forEach(post => {
      const channel = channels.find(c => c.id === post.channelId);
      const slot = channel?.slots?.find(s => s.id === post.slotId || s.time === post.scheduledTime);
      dayItems.push({
        type: 'post',
        post,
        date: curDate,
        time: post.scheduledTime || '12:00',
        audienceTime: slot?.audienceTime
      });
    });

    // 2. Open slots on this date for targeted channels
    targetChannels.forEach(channel => {
      if (channel.isPaused) return;
      const matchingSlots = (channel.slots || []).filter(s => s.dayOfWeek === dayOfWeek);

      matchingSlots.forEach(slot => {
        // Is this slot already occupied by a post?
        const occupied = postsOnDay.some(
          p => p.channelId === channel.id && (p.scheduledTime === slot.time || p.slotId === slot.id)
        );

        if (!occupied) {
          dayItems.push({
            type: 'open_slot',
            date: curDate,
            time: slot.time,
            dayOfWeek: slot.dayOfWeek,
            audienceTime: slot.audienceTime,
            slotId: slot.id,
            channelId: channel.id
          });
        }
      });
    });

    // Sort day items chronologically
    dayItems.sort((a, b) => a.time.localeCompare(b.time));

    if (dayItems.length > 0) {
      groups.push({
        date: curDate,
        friendlyDate: formatFriendlyDate(curDate, fromDate),
        items: dayItems
      });
    }
  }

  return groups;
}

/**
 * Check if a channel's queue is empty or runs out within 3 days.
 * "A banner appears if a channel's queue is empty or runs out within 3 days:
 * 'LinkedIn · Personal has no posts after Nov 4. Fill it' with a Fill with drafts button."
 */
export function checkQueueRunningOut(
  channel: Channel,
  allPosts: Post[],
  fromDate = FIXED_TODAY_DATE
): { runningOut: boolean; lastPostDate?: string; lastPostDateFormatted?: string } {
  if (channel.status !== 'connected' || channel.isPaused || !channel.slots || channel.slots.length === 0) {
    return { runningOut: false };
  }

  const scheduled = allPosts
    .filter(p => p.channelId === channel.id && p.status === 'Scheduled' && p.scheduledDate && p.scheduledDate >= fromDate)
    .sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''));

  if (scheduled.length === 0) {
    return {
      runningOut: true,
      lastPostDate: fromDate,
      lastPostDateFormatted: formatShortDate(fromDate)
    };
  }

  const lastPost = scheduled[scheduled.length - 1];
  const lastPostDate = lastPost.scheduledDate!;

  // If last post is within 3 days of today
  const threeDaysOut = addDays(fromDate, 3);
  if (lastPostDate <= threeDaysOut) {
    return {
      runningOut: true,
      lastPostDate,
      lastPostDateFormatted: formatShortDate(lastPostDate)
    };
  }

  return { runningOut: false, lastPostDate, lastPostDateFormatted: formatShortDate(lastPostDate) };
}
