import { DestinationConfig, PostingWindow, DestinationId } from '../types';

export const PLATFORM_ICONS: Record<string, string> = {
  'LinkedIn': 'LI',
  'Facebook': 'FB',
  'X': 'X',
  'Website': 'WEB'
};

export const DESTINATIONS: DestinationConfig[] = [
  {
    id: 'linkedin_personal',
    platform: 'LinkedIn',
    accountName: 'Alex Mercer',
    subName: 'LinkedIn · Personal profile',
    statusDot: 'connected'
  },
  {
    id: 'linkedin_company',
    platform: 'LinkedIn',
    accountName: 'Kinetik Dynamics',
    subName: 'LinkedIn · Company page (Kinetik Dynamics)',
    statusDot: 'pending_review',
    disabled: true,
    disabledReason: 'Pending LinkedIn review (OAuth app under review for MDP v2 access)',
    connectionLink: '/settings'
  },
  {
    id: 'facebook_page',
    platform: 'Facebook',
    accountName: 'Kinetik Dynamics Page',
    subName: 'Facebook · Page (Kinetik Dynamics)',
    statusDot: 'connected'
  },
  {
    id: 'x_profile',
    platform: 'X',
    accountName: '@kinetikdynamics',
    subName: 'X · @kinetikdynamics',
    statusDot: 'connected'
  },
  {
    id: 'website_blog',
    platform: 'Website',
    accountName: 'kinetikdynamics.com',
    subName: 'Website · kinetikdynamics.com',
    statusDot: 'connected'
  }
];

export const POSTING_WINDOWS: PostingWindow[] = [
  {
    destinationId: 'linkedin_personal',
    destinationName: 'LinkedIn · Personal profile',
    audienceTimezone: 'New York (US Eastern)',
    recommendedDays: 'Tue - Thu',
    timeRange: '8:00 AM - 10:00 AM',
    dhakaEquivalent: '6:00 PM - 8:00 PM (Asia/Dhaka)'
  },
  {
    destinationId: 'linkedin_company',
    destinationName: 'LinkedIn · Company page',
    audienceTimezone: 'New York (US Eastern)',
    recommendedDays: 'Tue - Thu',
    timeRange: '8:30 AM - 10:30 AM',
    dhakaEquivalent: '6:30 PM - 8:30 PM (Asia/Dhaka)'
  },
  {
    destinationId: 'facebook_page',
    destinationName: 'Facebook · Page',
    audienceTimezone: 'New York (US Eastern)',
    recommendedDays: 'Wednesday',
    timeRange: '12:00 PM - 1:00 PM',
    dhakaEquivalent: '10:00 PM (Asia/Dhaka)'
  },
  {
    destinationId: 'x_profile',
    destinationName: 'X · @kinetikdynamics',
    audienceTimezone: 'New York (US Eastern)',
    recommendedDays: 'Weekdays (Mon - Fri)',
    timeRange: '9:00 AM - 11:00 AM',
    dhakaEquivalent: '7:00 PM - 9:00 PM (Asia/Dhaka)'
  },
  {
    destinationId: 'website_blog',
    destinationName: 'Website · kinetikdynamics.com',
    audienceTimezone: 'New York (US Eastern)',
    recommendedDays: 'Mon & Thu',
    timeRange: '10:00 AM',
    dhakaEquivalent: '8:00 PM (Asia/Dhaka)'
  }
];

// Helper to calculate audience equivalent time
export const getAudienceEquivalentTime = (timeDhaka: string, day: string = 'Today'): string => {
  // Dhaka is GMT+6, New York is GMT-4 (EDT, 10h behind Dhaka)
  const [hourStr, minStr] = timeDhaka.split(':');
  const h = parseInt(hourStr || '14', 10);
  const m = minStr || '00';
  
  // NY is h - 10 hours
  let nyHour = h - 10;
  let nyDay = day;
  if (nyHour < 0) {
    nyHour += 24;
    nyDay = 'previous day';
  }
  const ampm = nyHour >= 12 ? 'PM' : 'AM';
  const displayHour = nyHour % 12 === 0 ? 12 : nyHour % 12;

  return `= ${displayHour}:${m} ${ampm} ${nyDay} in New York`;
};
