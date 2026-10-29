import { TeamMember, UserSession, CurrentUser } from '../types';

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Alex Mercer',
    email: 'alex@kinetikdynamics.com',
    role: 'Owner',
    status: 'Active',
    lastActive: 'Just now'
  },
  {
    id: 'user-2',
    name: 'Sarah Connor',
    email: 'sarah@kinetikdynamics.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '2 hours ago'
  },
  {
    id: 'user-3',
    name: 'David Chen',
    email: 'david@kinetikdynamics.com',
    role: 'Approver',
    status: 'Active',
    lastActive: 'Yesterday'
  },
  {
    id: 'user-4',
    name: 'Elena Rostova',
    email: 'elena@investorcapital.com',
    role: 'Viewer',
    status: 'Active',
    lastActive: '3 days ago'
  },
  {
    id: 'user-5',
    name: 'Marcus Vance',
    email: 'marcus@kinetikdynamics.com',
    role: 'Editor',
    status: 'Invited',
    lastActive: 'Invited 2 days ago'
  }
];

export const initialSessions: UserSession[] = [
  {
    id: 'sess-1',
    device: 'Desktop (Windows 11)',
    browser: 'Chrome 129.0',
    ip: '103.205.71.18',
    location: 'Dhaka, Bangladesh',
    lastActive: 'Active now (current session)',
    isCurrent: true
  },
  {
    id: 'sess-2',
    device: 'MacBook Pro 16"',
    browser: 'Safari 18.0',
    ip: '198.51.100.42',
    location: 'New York, United States',
    lastActive: 'Yesterday at 18:40',
    isCurrent: false
  },
  {
    id: 'sess-3',
    device: 'iPhone 15 Pro',
    browser: 'Mobile Safari',
    ip: '103.205.71.22',
    location: 'Dhaka, Bangladesh',
    lastActive: '3 days ago',
    isCurrent: false
  }
];

export const defaultUser: CurrentUser = {
  id: 'user-1',
  name: 'Alex Mercer',
  email: 'alex@kinetikdynamics.com',
  role: 'Owner',
  twoFactorEnabled: false,
  timezone: 'Asia/Dhaka'
};
