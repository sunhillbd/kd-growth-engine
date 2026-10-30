import { ActivityEvent } from '../types';

export const initialActivity: ActivityEvent[] = [
  {
    id: 'act-01',
    timestamp: '08:14',
    date: 'Today',
    description: 'Agent identified high-intent signal for AeroTrans Logistics (Score: 88)',
    actor: 'agent',
    link: '/leads/queue'
  },
  {
    id: 'act-02',
    timestamp: '07:45',
    date: 'Today',
    description: 'Outreach app delivered Step 2 follow-up to Veloce Freight Forwarding',
    actor: 'system'
  },
  {
    id: 'act-03',
    timestamp: '06:30',
    date: 'Today',
    description: 'Rate limit error flagged on Funding News collector (HTTP 429)',
    actor: 'system',
    link: '/leads/sources'
  },
  {
    id: 'act-04',
    timestamp: '22:15',
    date: 'Yesterday',
    description: 'Alex Mercer approved lead for OrbitFin Tech and queued for dispatch',
    actor: 'human',
    link: '/leads/pipeline'
  },
  {
    id: 'act-05',
    timestamp: '19:40',
    date: 'Yesterday',
    description: 'Drafted 3 new LinkedIn posts for next week’s content plan',
    actor: 'agent',
    link: '/content/approvals'
  },
  {
    id: 'act-06',
    timestamp: '17:05',
    date: 'Yesterday',
    description: 'Discovery call booked with Tobias Fünke (Kestrel Cargo Systems)',
    actor: 'human',
    link: '/leads/pipeline'
  },
  {
    id: 'act-07',
    timestamp: '15:20',
    date: 'Yesterday',
    description: 'Proposal v2 delivered to Charles Montgomery (Stratum Wealth Portal)',
    actor: 'human',
    link: '/leads/pipeline'
  },
  {
    id: 'act-08',
    timestamp: '12:10',
    date: '26 Oct',
    description: 'Signal from Reddit r/startups filtered: duplicate contacted 12d ago',
    actor: 'system',
    link: '/leads/signals'
  },
  {
    id: 'act-09',
    timestamp: '10:00',
    date: '26 Oct',
    description: 'LinkedIn case study published: 99.2% OCR accuracy on logistics manifests',
    actor: 'system',
    link: '/content/posts'
  },
  {
    id: 'act-10',
    timestamp: '09:15',
    date: '25 Oct',
    description: 'Samira Khan approved weekly search plan changes for Indeed ATS feed',
    actor: 'human',
    link: '/leads/sources'
  }
];
