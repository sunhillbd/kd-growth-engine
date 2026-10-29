import { ConnectionStatus } from '../types';

export const initialConnections: ConnectionStatus[] = [
  {
    id: 'conn-1',
    name: 'Outreach App (Instantly / Smartlead API)',
    type: 'Email Dispatch & Inbox Sync',
    status: 'Connected',
    lastSync: '4 mins ago',
    details: 'Connected to workspace "Kinetik Cold Outreach" (3 dedicated sending domains)',
    eventLogs: [
      { timestamp: '08:12 (Asia/Dhaka)', event: 'Email Sent', recipient: 'lucas.scott@peakline.com', details: 'Step 1 sequence dispatched via domain node-3' },
      { timestamp: '07:45 (Asia/Dhaka)', event: 'Email Replied', recipient: 'claire@velocefreight.co.uk', details: 'Positive intent detected (CargoWise inquiry)' },
      { timestamp: '06:30 (Asia/Dhaka)', event: 'Email Bounced', recipient: 'd.ross@defunctlogistics.com', details: '550 5.1.1 User unknown (soft bounce handled)' },
      { timestamp: 'Yesterday 17:05', event: 'Meeting Booked', recipient: 'tobias@kestrelcargo.com', details: 'Cal.com webhook received: 30m discovery call' },
      { timestamp: 'Yesterday 14:20', event: 'Unsubscribed', recipient: 'info@unsubscribeme.co.uk', details: 'Header unsubscribe clicked: domain suppressed' }
    ]
  },
  {
    id: 'conn-2',
    name: 'ClearSearch Data Enrichment',
    type: 'Lead & Contact Discovery API',
    status: 'Connected',
    lastSync: '18 mins ago',
    details: 'API Tier: Growth (1,840 / 5,000 monthly credits remaining)'
  },
  {
    id: 'conn-3',
    name: 'LinkedIn Company Page',
    type: 'Social Distribution & Community',
    status: 'Pending review',
    lastSync: 'Pending approval',
    details: 'OAuth app submitted to LinkedIn Developer Portal for Marketing Developer Platform v2 access.'
  },
  {
    id: 'conn-4',
    name: 'X (Twitter API v2)',
    type: 'Social Distribution & Listening',
    status: 'Connected',
    lastSync: '32 mins ago',
    details: 'Connected as @KinetikDynamics (Read/Write Basic Tier)'
  },
  {
    id: 'conn-5',
    name: 'Contact Verification Provider (Hunter & ZeroBounce)',
    type: 'SMTP & MX Record Verification',
    status: 'Connected',
    lastSync: '1 hour ago',
    details: 'Deliverability confidence threshold enforced at 92%'
  }
];

export const complianceRulesByRegion = [
  {
    region: 'United States',
    framework: 'CAN-SPAM Act',
    requirements: [
      'Accurate header and from-line identifying sender company',
      'Non-deceptive subject lines directly relating to body copy',
      'Valid physical postal address of Kinetik Dynamics in footer',
      'Clear and conspicuous mechanism to opt out / unsubscribe',
      'Honor opt-out requests within 10 business days (instant via webhook)'
    ]
  },
  {
    region: 'United Kingdom',
    framework: 'PECR & UK GDPR',
    requirements: [
      'B2B soft opt-in applies to corporate subscribers (Ltd / LLP / PLC)',
      'Legitimate Interest Assessment (LIA) logged for every recipient role',
      'Immediate unsubscribe link in every communication',
      'Do not contact sole traders or partnerships without prior consent',
      'Record source of public business email address in CRM records'
    ]
  },
  {
    region: 'European Union',
    framework: 'EU GDPR & National Transpositions',
    requirements: [
      'Strict B2B country-specific rules (Germany requires strict double opt-in; Netherlands allows corporate outreach with tight B2B relevance)',
      'Right to erasure (Article 17) automated upon single unsubscribe request',
      'Data minimization: store only necessary professional contact details',
      'Zero sensitive personal data or consumer profiling'
    ]
  }
];
