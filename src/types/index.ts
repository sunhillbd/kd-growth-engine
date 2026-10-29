export type OfferId = 'ai-sprint' | 'mvp-6-weeks' | 'whitelabel-dev';

export interface Offer {
  id: OfferId;
  name: string;
  targetIcps: string[];
  priceRange: string;
  timeline: string;
  proofCount: number;
  promise: string;
  deliverables: string[];
  history: { date: string; who: string; what: string }[];
}

export interface Icp {
  id: string;
  name: string;
  offerId: OfferId;
  countries: string[];
  roles: string[];
  leadsCount: number;
  replyRate: number; // percentage
  callsCount: number;
  winsCount: number;
  // Definition
  companyType: string;
  companySize: string;
  industries: string[];
  buyingTriggers: string[];
  pains: string[];
  objections: { objection: string; answer: string }[];
  disqualifiers: string[];
  monthlyPerformance: { month: string; leads: number; replies: number; calls: number; wins: number }[];
  history: { date: string; who: string; what: string }[];
}

export interface ProofItem {
  id: string;
  title: string;
  clientType: string;
  offerId: OfferId;
  industry: string;
  result: string;
  canNameClient: boolean;
  clientName?: string;
  timesUsed: number;
  writeUp: string;
  usedIn: { type: 'lead' | 'post'; id: string; title: string; date: string }[];
}

export type SignalType = 'Hiring Post' | 'Funding News' | 'Reddit Problem' | 'Product Hunt Launch' | 'Agency Referral' | 'Tech Stack Change';

export interface Signal {
  id: string;
  source: string;
  sourceUrl: string;
  textSnippet: string;
  signalType: SignalType;
  relevanceScore: number;
  status: 'lead' | 'dropped' | 'unprocessed';
  foundAt: string;
  companyName: string;
  authorOrContact?: string;
}

export type PipelineStage = 
  | 'Qualified' 
  | 'Approved' 
  | 'Contacted' 
  | 'Replied' 
  | 'Call booked' 
  | 'Proposal' 
  | 'Won' 
  | 'Lost';

export interface LeadCheck {
  id: string;
  label: string;
  passed: boolean;
  note?: string;
}

export interface ScoreReason {
  label: string;
  weight: number; // e.g. +30 or -8
}

export interface SiteAuditFinding {
  severity: 'High' | 'Medium' | 'Low';
  finding: string;
  recommendation: string;
}

export interface FollowUpStep {
  step: number;
  delayDays: number;
  subject: string;
  body: string;
}

export interface Lead {
  id: string;
  company: string;
  website: string;
  personName: string;
  personRole: string;
  email: string;
  emailSource: string;
  country: string;
  source: string;
  sourceUrl: string;
  signalType: SignalType;
  signalText: string;
  signalDate: string;
  score: number;
  scoreReasons: ScoreReason[];
  icpId: string;
  offerId: OfferId;
  foundAgo: string;
  foundAt: string;
  brief: string;
  recommendedProofId: string;
  siteAudit: SiteAuditFinding[];
  checks: LeadCheck[];
  emailSubject: string;
  emailBody: string;
  followUps: FollowUpStep[];
  stage: PipelineStage;
  valueEst: number; // e.g. 15000
  notes?: string;
  lostReason?: string;
  timeline: { date: string; event: string; actor: string }[];
  complianceWarning?: string;
}

export interface SourceCollector {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  lastRun: string;
  items7d: number;
  leads7d: number;
  health: 'Healthy' | 'Failing';
  errorMessage?: string;
  schedule: string;
}

export interface SearchPlan {
  id: string;
  icpId: string;
  sourceId: string;
  sourceName: string;
  query: string;
  signalsFound: number;
  leadsProduced: number;
  replyRate: number;
}

export type ContentFormat = 'LinkedIn post' | 'Carousel' | 'X thread' | 'Case study' | 'Website article';

export type ChannelId = 
  | 'linkedin_personal' 
  | 'linkedin_company' 
  | 'facebook_page' 
  | 'x_profile' 
  | 'website_blog';

export type DestinationId = ChannelId;

export type PublishStatus = 
  | 'Draft' 
  | 'Needs approval' 
  | 'Scheduled' 
  | 'Sent' 
  | 'Failed';

export type DestinationStatus = PublishStatus | 'Publishing' | 'Published' | 'Pending approval';
export type ContentStatus = 'Idea' | 'Draft' | 'Needs approval' | 'Scheduled' | 'Published';

export interface WeeklySlot {
  id: string;
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  time: string; // e.g. "18:30"
  audienceTime: string; // e.g. "8:30 AM NY"
}

export interface Channel {
  id: ChannelId;
  platform: 'LinkedIn' | 'Facebook' | 'X' | 'Website';
  name: string;
  handleOrSub: string;
  avatarUrl?: string;
  status: 'connected' | 'needs_attention' | 'pending_review' | 'not_connected';
  disabledReason?: string;
  isPaused: boolean;
  timezone: string; // "Asia/Dhaka"
  slots: WeeklySlot[];
  postingGoal: '1x' | '3x' | '5x';
  connectionType?: 'WordPress' | 'Laravel route' | 'Webhook' | 'Other';
  spendCapMonthly?: number;
}

export interface Post {
  id: string;
  channelId: ChannelId;
  text: string;
  mediaUrl?: string;
  status: PublishStatus;
  scheduledDate?: string; // "2026-10-30"
  scheduledTime?: string; // "18:30"
  slotId?: string;
  sentAt?: string;
  createdTogetherGroupId?: string;
  siblingPostIds?: string[];
  tag?: string;
  draftedByAgent: boolean;
  agentTaskId?: string;
  whyThisPost?: string; // one-line reason for approval
  errorMessage?: string; // for Failed posts
  impressions?: number;
  engagements?: number;
  repliesOrDms?: number;
  linkedDeals?: number;
  linkedDealCompany?: string;
  livePostUrl?: string;
  author?: string;
  pattern?: string;
  targetKeyword?: string;
  channelSpecific?: {
    xThreadPosts?: string[];
    websiteData?: WebsitePostData;
    linkedinPdfCarousel?: string;
    facebookLinkPreview?: { title: string; url: string; description: string };
  };
  comments?: { id: string; author: string; text: string; date: string }[];
  auditTrail?: { date: string; action: string; actor: string }[];
}

export interface IdeaItem {
  id: string;
  title: string;
  shortNotes?: string;
  tag?: string;
  painAddressed?: string;
  targetKeyword?: string;
  pattern?: string;
  source: 'Weekly questions' | 'Lead signals' | 'Agent plan' | 'Manual';
  suggestedDraft?: string;
  targetChannelId?: ChannelId;
  createdAt?: string;
}

export interface DestinationConfig {
  id: DestinationId;
  platform: 'LinkedIn' | 'Facebook' | 'X' | 'Website';
  accountName: string;
  subName: string;
  statusDot: 'connected' | 'needs_attention' | 'not_connected' | 'pending_review';
  disabled?: boolean;
  disabledReason?: string;
  connectionLink?: string;
}

export interface WebsitePostData {
  title: string;
  slug: string;
  metaDescription: string;
  category: string;
  featuredImage?: string;
  targetKeyword: string;
  publishMode: 'publish_live' | 'cms_draft';
  seoChecklist: {
    keywordInTitle: boolean;
    oneH1: boolean;
    faqSection: boolean;
    schemaType: string;
  };
}

export interface PostDestinationSchedule {
  destinationId: DestinationId;
  status: DestinationStatus;
  scheduledDate: string; // "2026-11-03"
  scheduledTime: string; // "14:00"
  audienceTimeInfo: string; // "= 10:30 PM Mon in New York"
  livePostUrl?: string;
  errorMessage?: string;
  isPastTime?: boolean;
  exceedsCap?: boolean;
}

export interface ContentItem {
  id: string;
  topic: string;
  format: ContentFormat;
  painAddressed: string;
  targetKeyword: string;
  baseText: string;
  attachedMedia?: string;
  draftedByAgent: boolean;
  agentTaskId?: string;
  author?: string; // 'Agent', 'Alex Mercer', 'Sarah Connor'
  pattern?: string; // 'Contrarian breakdown' | 'Before/After benchmark' | 'Architecture teardown' | 'Cost dissection' | 'Step-by-step framework' | 'Founder lesson'
  source?: string; // 'From weekly questions' | 'Client discovery call' | 'ClearSearch keyword trend' | 'Client delivery outcome'
  whyThisIdea?: string;
  whyThisPost?: string; // reason for approval card
  
  // Selected destinations & schedules
  selectedDestinations: DestinationId[];
  destinationSchedules: Record<string, PostDestinationSchedule>;
  
  // Per-destination overrides & settings
  linkedinPersonalOverride?: string;
  linkedinPersonalCarousel?: string;
  
  linkedinCompanyOverride?: string;
  
  facebookOverride?: string;
  facebookPageName?: string;
  facebookLinkPreview?: { title: string; url: string; description: string };
  
  xOverride?: string;
  xThreadPosts?: string[]; // array of follow-up tweets in thread
  
  websiteData?: WebsitePostData;
  
  // Overall / primary status
  status: ContentStatus;
  scheduledDate?: string;
  scheduledDay?: string;
  scheduledTime?: string;
  publishedDate?: string;
  
  // Metrics once published
  impressions?: number;
  engagements?: number;
  repliesOrDms?: number;
  linkedDeals?: number;
  linkedDealCompany?: string;
  metricsHistory?: { date: string; impressions: number; replies: number }[];
  auditTrail?: { date: string; action: string; actor: string }[];
  comments?: { id: string; author: string; text: string; date: string }[];
}

export interface PostingWindow {
  destinationId: DestinationId;
  destinationName: string;
  audienceTimezone: string;
  recommendedDays: string;
  timeRange: string;
  dhakaEquivalent: string;
}

export interface Proposal {
  id: string;
  suggestion: string;
  evidence: string;
  sampleSize: number;
  status: 'pending' | 'accepted' | 'rejected';
  actionType: 'pause_source' | 'increase_budget' | 'adjust_copy' | 'create_proof' | 'refine_icp';
  targetEntity: string;
  rejectionReason?: string;
  date: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string; // e.g. "14:22"
  date: string;
  description: string;
  actor: 'agent' | 'human' | 'system';
  link?: string;
}

export interface ConnectionStatus {
  id: string;
  name: string;
  type: string;
  status: 'Connected' | 'Pending review' | 'Error' | 'Disconnected';
  lastSync: string;
  accountUsed?: string;
  details?: string;
  note?: string;
  eventLogs?: { timestamp: string; event: string; recipient: string; details: string }[];
}

export interface ToastMessage {
  id: string;
  message: string;
  undoAction?: () => void;
  duration?: number;
}

export type UserRole = 'Owner' | 'Editor' | 'Approver' | 'Viewer';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  twoFactorEnabled: boolean;
  timezone: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Invited';
  lastActive: string;
}

export interface UserSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent?: boolean;
}

export interface OnboardingData {
  business: {
    companyName: string;
    websiteUrl: string;
    description: string;
    primaryMarkets: string[];
  };
  offers: {
    name: string;
    promise: string;
    priceRange: string;
  }[];
  icps: {
    name: string;
    whoTheyAre: string;
    rolesToContact: string;
    buyingTriggers: string;
  }[];
  caseStudies: {
    title: string;
    clientType: string;
    result: string;
    canNameClient: boolean;
  }[];
  voice: {
    sampleText: string;
    toneRules: string[];
  };
  connectedTools: Record<string, boolean>;
  rules: {
    approvalMode: 'manual' | 'auto';
    dailyLeadLimit: number;
    dailyPostLimit: number;
    monthlySpendCap: number;
    aiProvider: string;
    aiModel: string;
    aiApiKey: string;
  };
}

