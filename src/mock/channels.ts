import { Channel, ChannelId } from '../types';

export const CHANNELS_INITIAL: Channel[] = [
  {
    id: 'linkedin_personal',
    platform: 'LinkedIn',
    name: 'LinkedIn · Personal profile',
    handleOrSub: 'Alex Mercer',
    status: 'connected',
    isPaused: false,
    timezone: 'Asia/Dhaka',
    postingGoal: '3x',
    slots: [
      { id: 'lip-1', dayOfWeek: 'Tue', time: '18:30', audienceTime: '8:30 AM NY' },
      { id: 'lip-2', dayOfWeek: 'Wed', time: '18:30', audienceTime: '8:30 AM NY' },
      { id: 'lip-3', dayOfWeek: 'Thu', time: '18:30', audienceTime: '8:30 AM NY' },
    ]
  },
  {
    id: 'linkedin_company',
    platform: 'LinkedIn',
    name: 'LinkedIn · Company page',
    handleOrSub: 'Kinetik Dynamics',
    status: 'pending_review',
    disabledReason: 'Needs LinkedIn review. You can connect once approved.',
    isPaused: false,
    timezone: 'Asia/Dhaka',
    postingGoal: '1x',
    slots: []
  },
  {
    id: 'facebook_page',
    platform: 'Facebook',
    name: 'Facebook · Page',
    handleOrSub: 'Kinetik Dynamics',
    status: 'connected',
    isPaused: false,
    timezone: 'Asia/Dhaka',
    postingGoal: '1x',
    slots: [
      { id: 'fb-1', dayOfWeek: 'Wed', time: '22:00', audienceTime: '12:00 PM NY' },
    ]
  },
  {
    id: 'x_profile',
    platform: 'X',
    name: 'X · account',
    handleOrSub: '@kinetikdynamics',
    status: 'connected',
    isPaused: false,
    timezone: 'Asia/Dhaka',
    postingGoal: '5x',
    spendCapMonthly: 150,
    slots: [
      { id: 'x-1', dayOfWeek: 'Mon', time: '19:00', audienceTime: '9:00 AM NY' },
      { id: 'x-2', dayOfWeek: 'Tue', time: '19:00', audienceTime: '9:00 AM NY' },
      { id: 'x-3', dayOfWeek: 'Wed', time: '19:00', audienceTime: '9:00 AM NY' },
      { id: 'x-4', dayOfWeek: 'Thu', time: '19:00', audienceTime: '9:00 AM NY' },
      { id: 'x-5', dayOfWeek: 'Fri', time: '19:00', audienceTime: '9:00 AM NY' },
    ]
  },
  {
    id: 'website_blog',
    platform: 'Website',
    name: 'Website · kinetikdynamics.com',
    handleOrSub: 'kinetikdynamics.com/blog',
    status: 'connected',
    isPaused: false,
    timezone: 'Asia/Dhaka',
    postingGoal: '3x',
    connectionType: 'Laravel route',
    slots: [
      { id: 'web-1', dayOfWeek: 'Mon', time: '20:00', audienceTime: '10:00 AM NY' },
      { id: 'web-2', dayOfWeek: 'Thu', time: '20:00', audienceTime: '10:00 AM NY' },
    ]
  }
];

export const CHANNEL_PLATFORM_ICONS: Record<string, string> = {
  'LinkedIn': 'LI',
  'Facebook': 'FB',
  'X': 'X',
  'Website': 'WEB'
};

export const FIXED_TODAY_DATE = '2026-10-29'; // Thursday, 29 October 2026

export const DAY_OF_WEEK_MAP: Record<number, 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat'
};
