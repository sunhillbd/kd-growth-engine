import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Offer, Icp, ProofItem, Signal, Lead, SourceCollector, SearchPlan, 
  ContentItem, ContentStatus, Proposal, ActivityEvent, PipelineStage, ToastMessage, DestinationId,
  CurrentUser, UserRole, TeamMember, UserSession, OnboardingData,
  Channel, ChannelId, Post, PublishStatus, WeeklySlot, IdeaItem
} from '../types';
import { initialOffers } from '../mock/offers';
import { initialIcps } from '../mock/icps';
import { initialProof } from '../mock/proof';
import { initialSignals } from '../mock/signals';
import { initialLeads } from '../mock/leads';
import { initialSources, initialSearchPlans } from '../mock/sources';
import { initialContent } from '../mock/content';
import { initialProposals } from '../mock/proposals';
import { initialActivity } from '../mock/activity';
import { initialTeamMembers, initialSessions, defaultUser } from '../mock/team';
import { CHANNELS_INITIAL } from '../mock/channels';
import { POSTS_INITIAL } from '../mock/posts';
import { IDEAS_INITIAL } from '../mock/ideas';
import { getNextOpenSlot, addDays, getDayOfWeek, FIXED_TODAY_DATE } from '../utils/publishQueue';

interface StoreContextType {
  offers: Offer[];
  updateOffer: (updated: Offer) => void;
  
  icps: Icp[];
  updateIcp: (updated: Icp) => void;
  
  proof: ProofItem[];
  addProof: (item: ProofItem) => void;
  
  signals: Signal[];
  makeLeadFromSignal: (signalId: string) => void;
  markSignalAsNoise: (signalId: string) => void;
  
  leads: Lead[];
  approveLead: (leadId: string) => void;
  undoApproveLead: (leadId: string) => void;
  rejectLead: (leadId: string, reason: string) => void;
  snoozeLead: (leadId: string, days: number) => void;
  updateLeadMessage: (leadId: string, subject: string, body: string) => void;
  movePipelineStage: (leadId: string, newStage: PipelineStage, reason?: string) => void;
  updateLeadNotes: (leadId: string, notes: string) => void;
  
  sources: SourceCollector[];
  toggleSource: (sourceId: string) => void;
  searchPlans: SearchPlan[];
  updateSearchPlan: (planId: string, query: string) => void;
  addKeywordsToSearchPlans: (keywords: string[]) => void;
  
  content: ContentItem[];
  approvalMode: 'manual' | 'auto';
  setApprovalMode: (mode: 'manual' | 'auto') => void;
  approvePost: (postId: string) => void;
  rejectPost: (postId: string, reason?: string) => void;
  bulkApprovePosts: (postIds: string[]) => void;
  approvePostDestination: (postId: string, destinationId: DestinationId) => void;
  rejectPostDestination: (postId: string, destinationId: DestinationId, reason: string) => void;
  reschedulePostDestination: (postId: string, destinationId: DestinationId, date: string, time: string) => void;
  cancelPostDestination: (postId: string, destinationId: DestinationId) => void;
  publishNowPostDestination: (postId: string, destinationId: DestinationId) => void;
  retryPostDestination: (postId: string, destinationId: DestinationId) => void;
  movePostDate: (postId: string, newDate: string, destinationId?: DestinationId) => void;
  changePostStatus: (postId: string, newStatus: ContentStatus, reason?: string) => void;
  addPost: (item: ContentItem) => void;
  updatePost: (item: ContentItem) => void;
  addIdeasFromWeeklyQuestions: (answers: string[]) => void;
  planNextWeekContent: (params?: { linkedinCount?: number; websiteCount?: number; facebookCount?: number; xCount?: number; focusOffer?: string; useClearSearch?: boolean }) => Promise<void>;
  writeAllDraftsFromIdeas: () => void;
  generateNextWeekContent: () => Promise<void>;
  isGeneratingContent: boolean;
  
  // Buffer Publishing (Channels, Posts, Queue, Ideas)
  channels: Channel[];
  posts: Post[];
  ideas: IdeaItem[];
  addPostsBuffer: (newPosts: Post | Post[]) => void;
  updatePostItem: (post: Post) => void;
  deletePostItem: (postId: string) => void;
  changePostStatusItem: (postId: string, status: PublishStatus, reason?: string) => void;
  approvePostItem: (postId: string) => void;
  approveMultiplePostsItem: (postIds: string[]) => void;
  rejectPostItem: (postId: string, reason: string) => void;
  shareNowPostItem: (postId: string) => void;
  shareNextPostItem: (postId: string) => void;
  reschedulePostItem: (postId: string, date: string, time: string, slotId?: string) => void;
  retryPostItem: (postId: string) => void;
  fillQueueWithDrafts: (channelId: ChannelId) => void;
  createDraftsForOpenSlots: () => void;
  updateChannelSchedule: (channelId: ChannelId, slots: WeeklySlot[], timezone: string, postingGoal: '1x' | '3x' | '5x') => void;
  togglePauseChannel: (channelId: ChannelId) => void;
  connectChannel: (channel: Channel) => void;
  disconnectChannel: (channelId: ChannelId) => void;
  addIdeaItem: (idea: IdeaItem) => void;
  updateIdeaItem: (idea: IdeaItem) => void;
  deleteIdeaItem: (ideaId: string) => void;
  planNextWeekIdeas: (channelCounts: Record<ChannelId, number>, focusOffer: string) => Promise<void>;
  planWeeklyPosts: (params: {
    channelCounts: Record<ChannelId, number>;
    focusOffer: string;
    useClearSearch?: boolean;
    targetStatus?: 'Needs approval' | 'Draft';
  }) => Promise<Post[]>;
  
  proposals: Proposal[];
  acceptProposal: (proposalId: string) => void;
  rejectProposal: (proposalId: string, reason: string) => void;
  
  activity: ActivityEvent[];
  logActivity: (desc: string, actor?: 'agent' | 'human' | 'system', link?: string) => void;
  
  toasts: ToastMessage[];
  showToast: (message: string, undoAction?: () => void, duration?: number) => void;
  removeToast: (id: string) => void;
  
  // Auth & Team
  isAuthenticated: boolean;
  currentUser: CurrentUser;
  userRole: UserRole;
  login: (email: string, password?: string) => { success: boolean; requires2fa?: boolean; error?: string; locked?: boolean };
  logout: () => void;
  completeTwoFactor: (code: string) => boolean;
  switchUserRole: (role: UserRole) => void;
  updateUserProfile: (data: Partial<CurrentUser>) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
  sessions: UserSession[];
  signOutSession: (id: string) => void;
  signOutAllOtherSessions: () => void;
  teamMembers: TeamMember[];
  inviteTeamMember: (email: string, role: UserRole) => void;
  resendInvite: (id: string) => void;
  revokeInvite: (id: string) => void;
  removeTeamMember: (id: string) => void;
  sessionExpiredModalOpen: boolean;
  setSessionExpiredModalOpen: (open: boolean) => void;
  restoreSession: (password: string) => boolean;
  failedLoginAttempts: number;
  isLoginLocked: boolean;

  // Onboarding
  onboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  finishOnboarding: (data: OnboardingData) => void;
  resetOnboarding: () => void;
  setupChecklistDismissed: boolean;
  dismissSetupChecklist: () => void;

  resetDemoData: () => void;
}

export const defaultOnboardingData: OnboardingData = {
  business: {
    companyName: 'Kinetik Dynamics',
    websiteUrl: 'https://kinetikdynamics.com',
    description: 'Boutique software engineering studio building web/app MVPs and AI automation sprints.',
    primaryMarkets: ['US', 'UK', 'EU']
  },
  offers: [
    {
      name: 'AI Automation Sprint',
      promise: 'Automate high-friction back-office operations in 2 weeks with production AI pipelines',
      priceRange: '$12,000 - $18,000'
    },
    {
      name: 'MVP in 6 Weeks',
      promise: 'Deliver market-ready web and mobile products for funded startups in 6 weeks',
      priceRange: '$35,000 - $55,000'
    },
    {
      name: 'White-label Development',
      promise: 'Dedicated senior engineering capacity for fast-scaling growth agencies',
      priceRange: '$8,000 - $15,000/mo'
    }
  ],
  icps: [
    {
      name: 'Seed-Stage B2B SaaS Founders',
      whoTheyAre: 'Funded SaaS startups ($500k-$2M seed) without in-house CTO or senior backend lead',
      rolesToContact: 'Founder, Co-Founder, CEO, Head of Product',
      buyingTriggers: 'Announced funding on TechCrunch, hiring first engineer on LinkedIn, product launch on Product Hunt'
    },
    {
      name: 'Post-Series A Scale-ups',
      whoTheyAre: 'B2B tech companies ($10M-$50M ARR) bottlenecked by customer onboarding or technical debt',
      rolesToContact: 'VP Engineering, Head of Operations, COO',
      buyingTriggers: 'Hiring 5+ engineers, Reddit/HN complaints about slow features, expanding to enterprise tier'
    },
    {
      name: 'Growth & Performance Agencies',
      whoTheyAre: 'Digital and advertising agencies with clients requesting custom apps and dashboards',
      rolesToContact: 'Managing Director, Agency Owner, Technical Director',
      buyingTriggers: 'Posting job openings for contract developers, agency award wins, new client roster growth'
    },
    {
      name: 'Traditional SME Operations Leaders',
      whoTheyAre: 'Logistics, healthcare, and finance companies with heavy manual paperwork',
      rolesToContact: 'COO, Director of Operations, Head of Transformation',
      buyingTriggers: 'Compliance mandate deadlines, expanding team without increasing headcount, legacy ERP migration'
    }
  ],
  caseStudies: [
    {
      title: 'PayLedger Multi-Tenant Billing Portal',
      clientType: 'Seed Fintech ($1.2M seed)',
      result: 'Shipped complete billing portal in 5 weeks; onboarded first 40 paying tenants',
      canNameClient: true
    },
    {
      title: 'HealthTrack HIPAA Document Extraction',
      clientType: 'Telehealth Scale-up',
      result: 'Cut manual intake review time by 82% using automated LLM validation pipeline',
      canNameClient: false
    }
  ],
  voice: {
    sampleText: 'Most seed founders spend 4 months recruiting before shipping anything. Build in 6 weeks with a studio, validate with paying customers, then hire to scale.',
    toneRules: ['direct', 'technical', 'concise']
  },
  connectedTools: {
    outreach: true,
    clearsearch: true,
    linkedin_personal: true,
    linkedin_company: false,
    facebook: true,
    x: true,
    website: true,
    contact_data: true,
    apify: false
  },
  rules: {
    approvalMode: 'manual',
    dailyLeadLimit: 25,
    dailyPostLimit: 3,
    monthlySpendCap: 300,
    aiProvider: 'Anthropic (Claude 3.5 Sonnet)',
    aiModel: 'claude-3-5-sonnet-20241022',
    aiApiKey: 'sk-ant-api03-live-49102830198'
  }
};

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('kge_offers');
    return saved ? JSON.parse(saved) : initialOffers;
  });

  const [icps, setIcps] = useState<Icp[]>(() => {
    const saved = localStorage.getItem('kge_icps');
    return saved ? JSON.parse(saved) : initialIcps;
  });

  const [proof, setProof] = useState<ProofItem[]>(() => {
    const saved = localStorage.getItem('kge_proof');
    return saved ? JSON.parse(saved) : initialProof;
  });

  const [signals, setSignals] = useState<Signal[]>(() => {
    const saved = localStorage.getItem('kge_signals');
    return saved ? JSON.parse(saved) : initialSignals;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('kge_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [sources, setSources] = useState<SourceCollector[]>(() => {
    const saved = localStorage.getItem('kge_sources');
    return saved ? JSON.parse(saved) : initialSources;
  });

  const [searchPlans, setSearchPlans] = useState<SearchPlan[]>(() => {
    const saved = localStorage.getItem('kge_search_plans');
    return saved ? JSON.parse(saved) : initialSearchPlans;
  });

  const [content, setContent] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('kge_content_workspace');
    return saved ? JSON.parse(saved) : initialContent;
  });

  const [approvalMode, setApprovalMode] = useState<'manual' | 'auto'>('manual');

  // Buffer Publishing state
  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem('kge_buffer_channels');
    return saved ? JSON.parse(saved) : CHANNELS_INITIAL;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('kge_buffer_posts');
    return saved ? JSON.parse(saved) : POSTS_INITIAL;
  });

  const [ideas, setIdeas] = useState<IdeaItem[]>(() => {
    const saved = localStorage.getItem('kge_buffer_ideas');
    return saved ? JSON.parse(saved) : IDEAS_INITIAL;
  });

  useEffect(() => {
    localStorage.setItem('kge_buffer_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('kge_buffer_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('kge_buffer_ideas', JSON.stringify(ideas));
  }, [ideas]);

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem('kge_proposals');
    return saved ? JSON.parse(saved) : initialProposals;
  });

  const [activity, setActivity] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem('kge_activity');
    return saved ? JSON.parse(saved) : initialActivity;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('kge_auth');
    return saved !== null ? saved === 'true' : true;
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem('kge_current_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('kge_team_members');
    return saved ? JSON.parse(saved) : initialTeamMembers;
  });

  const [sessions, setSessions] = useState<UserSession[]>(() => {
    const saved = localStorage.getItem('kge_sessions');
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [sessionExpiredModalOpen, setSessionExpiredModalOpen] = useState(false);
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(0);
  const [isLoginLocked, setIsLoginLocked] = useState(false);

  // Onboarding state
  const [onboardingCompleted, setOnboardingCompletedState] = useState<boolean>(() => {
    const saved = localStorage.getItem('kge_onboarding_completed');
    return saved === 'true';
  });

  const [onboardingStep, setOnboardingStepState] = useState<number>(() => {
    const saved = localStorage.getItem('kge_onboarding_step');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem('kge_onboarding_data');
    return saved ? JSON.parse(saved) : defaultOnboardingData;
  });

  const [setupChecklistDismissed, setSetupChecklistDismissed] = useState<boolean>(() => {
    const saved = localStorage.getItem('kge_setup_dismissed');
    return saved === 'true';
  });

  // Sync auth & onboarding to localStorage
  useEffect(() => {
    localStorage.setItem('kge_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kge_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('kge_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('kge_onboarding_data', JSON.stringify(onboardingData));
  }, [onboardingData]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('kge_offers', JSON.stringify(offers));
  }, [offers]);
  useEffect(() => {
    localStorage.setItem('kge_icps', JSON.stringify(icps));
  }, [icps]);
  useEffect(() => {
    localStorage.setItem('kge_proof', JSON.stringify(proof));
  }, [proof]);
  useEffect(() => {
    localStorage.setItem('kge_signals', JSON.stringify(signals));
  }, [signals]);
  useEffect(() => {
    localStorage.setItem('kge_leads', JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem('kge_sources', JSON.stringify(sources));
  }, [sources]);
  useEffect(() => {
    localStorage.setItem('kge_search_plans', JSON.stringify(searchPlans));
  }, [searchPlans]);
  useEffect(() => {
    localStorage.setItem('kge_content_workspace', JSON.stringify(content));
  }, [content]);
  useEffect(() => {
    localStorage.setItem('kge_proposals', JSON.stringify(proposals));
  }, [proposals]);
  useEffect(() => {
    localStorage.setItem('kge_activity', JSON.stringify(activity));
  }, [activity]);

  const showToast = (message: string, undoAction?: () => void, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, undoAction, duration }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logActivity = (desc: string, actor: 'agent' | 'human' | 'system' = 'human', link?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const newEvent: ActivityEvent = {
      id: 'act-' + Date.now(),
      timestamp: timeStr,
      date: 'Today',
      description: desc,
      actor,
      link
    };
    setActivity(prev => [newEvent, ...prev.slice(0, 19)]);
  };

  // Brain actions
  const updateOffer = (updated: Offer) => {
    setOffers(prev => prev.map(o => o.id === updated.id ? updated : o));
    logActivity(`Updated offer "${updated.name}" specifications`, 'human', `/brain/offers/${updated.id}`);
    showToast(`Saved changes to offer: ${updated.name}`);
  };

  const updateIcp = (updated: Icp) => {
    setIcps(prev => prev.map(i => i.id === updated.id ? updated : i));
    logActivity(`Updated ICP definition for "${updated.name}"`, 'human', `/brain/icps/${updated.id}`);
    showToast(`Saved changes to ICP: ${updated.name}`);
  };

  const addProof = (item: ProofItem) => {
    setProof(prev => [item, ...prev]);
    logActivity(`Added new case study "${item.title}"`, 'human', '/brain/proof');
    showToast(`Case study added to Brain`);
  };

  // Signal actions
  const makeLeadFromSignal = (signalId: string) => {
    const sig = signals.find(s => s.id === signalId);
    if (!sig) return;

    setSignals(prev => prev.map(s => s.id === signalId ? { ...s, status: 'lead' } : s));

    const newLead: Lead = {
      id: `lead-sig-${Date.now()}`,
      company: sig.companyName,
      website: `https://${sig.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      personName: sig.authorOrContact || 'Founding Lead',
      personRole: 'Head of Operations / Tech Lead',
      email: `contact@${sig.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      emailSource: 'Manual signal promotion via ClearSearch queue',
      country: 'United States',
      source: sig.source,
      sourceUrl: sig.sourceUrl,
      signalType: sig.signalType,
      signalText: sig.textSnippet,
      signalDate: sig.foundAt,
      score: sig.relevanceScore,
      scoreReasons: [
        { label: 'Promoted manually from signals collector', weight: 30 },
        { label: 'Matches target studio services', weight: 20 }
      ],
      icpId: 'funded-saas',
      offerId: 'mvp-6-weeks',
      foundAgo: 'Just now',
      foundAt: sig.foundAt,
      brief: `Promoted lead from ${sig.source}: ${sig.textSnippet}`,
      recommendedProofId: 'proof-2',
      siteAudit: [
        { severity: 'Medium', finding: 'Company active on social feeds with fresh inquiries.', recommendation: 'Reference rapid sprint timeline.' }
      ],
      checks: [
        { id: 'c1', label: 'Not already in outreach app', passed: true },
        { id: 'c2', label: 'Not suppressed', passed: true },
        { id: 'c3', label: 'Email source recorded', passed: true }
      ],
      emailSubject: `Engineering capacity for ${sig.companyName}`,
      emailBody: `Hi,\n\nSaw your signal regarding ${sig.companyName}.\n\nWe build custom MVPs and automated workflows in 2-6 weeks.\n\nOpen to a brief chat?\n\nBest,\nAlex Mercer\nKinetik Dynamics`,
      followUps: [],
      stage: 'Qualified',
      valueEst: 18000,
      timeline: [
        { date: 'Today', event: `Promoted from signal ${sig.id}`, actor: 'human' }
      ]
    };

    setLeads(prev => [newLead, ...prev]);
    logActivity(`Promoted signal ${sig.id} to Lead Queue for ${sig.companyName}`, 'human', '/leads/queue');
    showToast(`Signal promoted to Lead Queue`);
  };

  const markSignalAsNoise = (signalId: string) => {
    setSignals(prev => prev.map(s => s.id === signalId ? { ...s, status: 'dropped' } : s));
    showToast(`Signal marked as noise`);
  };

  // Lead actions
  const approveLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          stage: 'Approved',
          timeline: [
            ...l.timeline,
            { date: 'Today (just now)', event: 'Approved by human and sent to outreach app', actor: 'human' }
          ]
        };
      }
      return l;
    }));

    logActivity(`Approved lead ${lead.company} and sent to outreach app`, 'human', '/leads/pipeline');

    showToast(
      `Lead ${lead.company} approved and sent to outreach app`,
      () => undoApproveLead(leadId),
      5000
    );
  };

  const undoApproveLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          stage: 'Qualified',
          timeline: l.timeline.filter(t => !t.event.includes('Approved by human'))
        };
      }
      return l;
    }));

    logActivity(`Undid approval for lead ${lead.company}; returned to queue`, 'human', '/leads/queue');
    showToast(`Lead ${lead.company} returned to queue`);
  };

  const rejectLead = (leadId: string, reason: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          stage: 'Lost',
          lostReason: reason,
          timeline: [
            ...l.timeline,
            { date: 'Today', event: `Rejected: ${reason}`, actor: 'human' }
          ]
        };
      }
      return l;
    }));

    logActivity(`Rejected lead ${lead.company}: ${reason}`, 'human');
    showToast(`Lead rejected (${reason})`);
  };

  const snoozeLead = (leadId: string, days: number) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    showToast(`Lead ${lead.company} snoozed for ${days} days`);
  };

  const updateLeadMessage = (leadId: string, subject: string, body: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, emailSubject: subject, emailBody: body } : l));
    showToast(`Email draft saved`);
  };

  const movePipelineStage = (leadId: string, newStage: PipelineStage, reason?: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          stage: newStage,
          lostReason: newStage === 'Lost' ? reason : l.lostReason,
          timeline: [
            ...l.timeline,
            { date: 'Today', event: `Moved to ${newStage}${reason ? ` (${reason})` : ''}`, actor: 'human' }
          ]
        };
      }
      return l;
    }));

    logActivity(`Moved ${lead.company} to ${newStage}`, 'human', '/leads/pipeline');
    showToast(`Moved ${lead.company} to ${newStage}`);
  };

  const updateLeadNotes = (leadId: string, notes: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes } : l));
    showToast(`Notes saved for lead`);
  };

  // Sources actions
  const toggleSource = (sourceId: string) => {
    setSources(prev => prev.map(s => {
      if (s.id === sourceId) {
        const nextState = !s.enabled;
        logActivity(`Turned collector "${s.name}" ${nextState ? 'ON' : 'OFF'}`, 'human', '/leads/sources');
        return { ...s, enabled: nextState, health: nextState ? (s.health === 'Failing' ? 'Healthy' : s.health) : 'Healthy' };
      }
      return s;
    }));
  };

  const updateSearchPlan = (planId: string, query: string) => {
    setSearchPlans(prev => prev.map(p => p.id === planId ? { ...p, query } : p));
    showToast(`Search query updated`);
  };

  const addKeywordsToSearchPlans = (keywords: string[]) => {
    if (keywords.length === 0) return;
    setSearchPlans(prev => [
      ...prev,
      {
        id: `plan-kw-${Date.now()}`,
        icpId: 'smb-ai-automation',
        sourceId: 'src-1',
        sourceName: 'ClearSearch Keywords',
        query: keywords.join(' OR '),
        signalsFound: 14,
        leadsProduced: 3,
        replyRate: 18.0
      }
    ]);
    showToast(`Added ${keywords.length} keywords from ClearSearch`);
  };

  // Content actions - One status line with 5s Undo
  const approvePost = (postId: string) => {
    const post = content.find(p => p.id === postId);
    if (!post) return;
    const prevPost = { ...post, destinationSchedules: { ...post.destinationSchedules } };

    setContent(prev => prev.map(p => {
      if (p.id === postId) {
        const nextSchedules = { ...p.destinationSchedules };
        Object.keys(nextSchedules).forEach(dest => {
          if (nextSchedules[dest].status === 'Pending approval' || nextSchedules[dest].status === 'Draft') {
            nextSchedules[dest] = { ...nextSchedules[dest], status: 'Scheduled' };
          }
        });
        return {
          ...p,
          status: 'Scheduled',
          destinationSchedules: nextSchedules,
          auditTrail: [
            ...(p.auditTrail || []),
            { date: 'Today (just now)', action: 'Approved and scheduled', actor: 'human' }
          ]
        };
      }
      return p;
    }));

    logActivity(`Approved post: "${post.topic.substring(0, 40)}..."`, 'human', '/content');
    showToast(`Approved "${post.topic.substring(0, 32)}..."`, () => {
      setContent(prev => prev.map(p => p.id === postId ? prevPost : p));
      showToast('Approval undone');
    }, 5000);
  };

  const rejectPost = (postId: string, reason?: string) => {
    const post = content.find(p => p.id === postId);
    if (!post) return;
    const prevPost = { ...post, destinationSchedules: { ...post.destinationSchedules } };

    setContent(prev => prev.map(p => {
      if (p.id === postId) {
        const nextSchedules = { ...p.destinationSchedules };
        Object.keys(nextSchedules).forEach(dest => {
          if (nextSchedules[dest].status === 'Pending approval') {
            nextSchedules[dest] = { ...nextSchedules[dest], status: 'Draft' };
          }
        });
        return {
          ...p,
          status: 'Draft',
          destinationSchedules: nextSchedules,
          auditTrail: [
            ...(p.auditTrail || []),
            { date: 'Today (just now)', action: `Returned to Draft${reason ? `: ${reason}` : ''}`, actor: 'human' }
          ]
        };
      }
      return p;
    }));

    showToast(`Returned to Drafts${reason ? ` (${reason})` : ''}`, () => {
      setContent(prev => prev.map(p => p.id === postId ? prevPost : p));
      showToast('Action undone');
    }, 5000);
  };

  const changePostStatus = (postId: string, newStatus: ContentStatus, reason?: string) => {
    const post = content.find(p => p.id === postId);
    if (!post) return;
    const prevPost = { ...post, destinationSchedules: { ...post.destinationSchedules } };

    setContent(prev => prev.map(p => {
      if (p.id === postId) {
        const nextSchedules = { ...p.destinationSchedules };
        if (newStatus === 'Needs approval') {
          Object.keys(nextSchedules).forEach(d => {
            if (nextSchedules[d].status === 'Draft') {
              nextSchedules[d] = { ...nextSchedules[d], status: 'Pending approval' };
            }
          });
        } else if (newStatus === 'Scheduled') {
          Object.keys(nextSchedules).forEach(d => {
            if (nextSchedules[d].status === 'Pending approval' || nextSchedules[d].status === 'Draft') {
              nextSchedules[d] = { ...nextSchedules[d], status: 'Scheduled' };
            }
          });
        } else if (newStatus === 'Draft') {
          Object.keys(nextSchedules).forEach(d => {
            if (nextSchedules[d].status === 'Pending approval') {
              nextSchedules[d] = { ...nextSchedules[d], status: 'Draft' };
            }
          });
        } else if (newStatus === 'Published') {
          Object.keys(nextSchedules).forEach(d => {
            if (nextSchedules[d].status !== 'Failed') {
              nextSchedules[d] = { ...nextSchedules[d], status: 'Published' };
            }
          });
        }

        return {
          ...p,
          status: newStatus,
          destinationSchedules: nextSchedules,
          auditTrail: [
            ...(p.auditTrail || []),
            {
              date: 'Today (just now)',
              action: `Status changed to ${newStatus}${reason ? `: ${reason}` : ''}`,
              actor: 'human'
            }
          ]
        };
      }
      return p;
    }));

    showToast(`Moved to "${newStatus}"`, () => {
      setContent(prev => prev.map(p => p.id === postId ? prevPost : p));
      showToast('Status change undone');
    }, 5000);
  };

  const bulkApprovePosts = (postIds: string[]) => {
    setContent(prev => prev.map(p => {
      if (postIds.includes(p.id)) {
        const nextSchedules = { ...p.destinationSchedules };
        Object.keys(nextSchedules).forEach(dest => {
          if (nextSchedules[dest].status === 'Pending approval') {
            nextSchedules[dest] = { ...nextSchedules[dest], status: 'Scheduled' };
          }
        });
        return { ...p, status: 'Scheduled', destinationSchedules: nextSchedules };
      }
      return p;
    }));
    logActivity(`Bulk approved ${postIds.length} posts for publishing`, 'human', '/content/calendar');
    showToast(`Approved ${postIds.length} posts`);
  };

  const approvePostDestination = (postId: string, destinationId: DestinationId) => {
    setContent(prev => prev.map(p => {
      if (p.id === postId) {
        const destSched = p.destinationSchedules[destinationId];
        if (!destSched) return p;

        const nextSchedules = {
          ...p.destinationSchedules,
          [destinationId]: { ...destSched, status: 'Scheduled' as const }
        };

        const allApproved = Object.values(nextSchedules).every(s => s.status === 'Scheduled' || s.status === 'Published');

        return {
          ...p,
          status: allApproved ? 'Scheduled' : p.status,
          destinationSchedules: nextSchedules,
          auditTrail: [
            ...(p.auditTrail || []),
            { date: 'Today (just now)', action: `Approved destination: ${destinationId}`, actor: 'human' }
          ]
        };
      }
      return p;
    }));
    showToast(`Approved destination for scheduling`);
  };

  const rejectPostDestination = (postId: string, destinationId: DestinationId, reason: string) => {
    setContent(prev => prev.map(p => {
      if (p.id === postId) {
        const destSched = p.destinationSchedules[destinationId];
        if (!destSched) return p;

        const nextSchedules = {
          ...p.destinationSchedules,
          [destinationId]: { ...destSched, status: 'Draft' as const, errorMessage: `Rejected: ${reason}` }
        };

        return {
          ...p,
          destinationSchedules: nextSchedules,
          auditTrail: [
            ...(p.auditTrail || []),
            { date: 'Today (just now)', action: `Rejected destination ${destinationId}: ${reason}`, actor: 'human' }
          ]
        };
      }
      return p;
    }));
    showToast(`Rejected destination (${reason})`);
  };

  const reschedulePostDestination = (postId: string, destinationId: DestinationId, date: string, time: string) => {
    setContent(prev => prev.map(p => {
      if (p.id === postId) {
        const destSched = p.destinationSchedules[destinationId];
        if (!destSched) return p;

        const nextSchedules = {
          ...p.destinationSchedules,
          [destinationId]: {
            ...destSched,
            scheduledDate: date,
            scheduledTime: time,
            status: 'Scheduled' as const,
            isPastTime: false
          }
        };

        return {
          ...p,
          scheduledDay: date,
          scheduledTime: time,
          destinationSchedules: nextSchedules,
          auditTrail: [
            ...(p.auditTrail || []),
            { date: 'Today (just now)', action: `Rescheduled ${destinationId} to ${date} ${time}`, actor: 'human' }
          ]
        };
      }
      return p;
    }));
    showToast(`Destination rescheduled to ${date} ${time}`);
  };

  const cancelPostDestination = (postId: string, destinationId: DestinationId) => {
    setContent(prev => prev.map(p => {
      if (p.id === postId) {
        const destSched = p.destinationSchedules[destinationId];
        if (!destSched) return p;

        const nextSchedules = {
          ...p.destinationSchedules,
          [destinationId]: { ...destSched, status: 'Draft' as const }
        };

        return {
          ...p,
          destinationSchedules: nextSchedules,
          auditTrail: [
            ...(p.auditTrail || []),
            { date: 'Today (just now)', action: `Cancelled schedule for ${destinationId}`, actor: 'human' }
          ]
        };
      }
      return p;
    }));
    showToast(`Cancelled schedule for destination`);
  };

  const publishNowPostDestination = (postId: string, destinationId: DestinationId) => {
    setContent(prev => prev.map(p => {
      if (p.id === postId) {
        const destSched = p.destinationSchedules[destinationId];
        if (!destSched) return p;

        const nextSchedules = {
          ...p.destinationSchedules,
          [destinationId]: {
            ...destSched,
            status: 'Published' as const,
            livePostUrl: `https://example.com/published/${destinationId}/${Date.now()}`
          }
        };

        return {
          ...p,
          status: 'Published',
          publishedDate: 'Today',
          destinationSchedules: nextSchedules,
          auditTrail: [
            ...(p.auditTrail || []),
            { date: 'Today (just now)', action: `Manually published to ${destinationId}`, actor: 'human' }
          ]
        };
      }
      return p;
    }));
    logActivity(`Published post to ${destinationId}`, 'human', '/content/posts');
    showToast(`Published successfully to ${destinationId}`);
  };

  const retryPostDestination = (postId: string, destinationId: DestinationId) => {
    setContent(prev => prev.map(p => {
      if (p.id === postId) {
        const destSched = p.destinationSchedules[destinationId];
        if (!destSched) return p;

        // Reset error message and trigger publish
        const nextSchedules = {
          ...p.destinationSchedules,
          [destinationId]: {
            ...destSched,
            status: 'Published' as const,
            errorMessage: undefined,
            livePostUrl: `https://example.com/published/${destinationId}/${Date.now()}`
          }
        };

        return {
          ...p,
          destinationSchedules: nextSchedules,
          auditTrail: [
            ...(p.auditTrail || []),
            { date: 'Today (just now)', action: `Retried failed publish for ${destinationId} - Success`, actor: 'human' }
          ]
        };
      }
      return p;
    }));
    logActivity(`Retried publish on ${destinationId} - Success`, 'human', '/content/posts');
    showToast(`Retry successful: Published to ${destinationId}`);
  };

  const movePostDate = (postId: string, newDate: string, destinationId?: DestinationId) => {
    setContent(prev => prev.map(p => {
      if (p.id === postId) {
        const nextSchedules = { ...p.destinationSchedules };
        if (destinationId && nextSchedules[destinationId]) {
          nextSchedules[destinationId] = {
            ...nextSchedules[destinationId],
            scheduledDate: newDate
          };
        } else {
          Object.keys(nextSchedules).forEach(d => {
            nextSchedules[d] = {
              ...nextSchedules[d],
              scheduledDate: newDate
            };
          });
        }
        return {
          ...p,
          scheduledDay: newDate,
          destinationSchedules: nextSchedules
        };
      }
      return p;
    }));
    showToast(`Updated calendar schedule`);
  };

  const addPost = (item: ContentItem) => {
    setContent(prev => [item, ...prev]);
    logActivity(`Created post: "${item.topic.substring(0, 40)}..."`, 'human', '/content/posts');
    showToast(`Post saved successfully`);
  };

  const updatePost = (item: ContentItem) => {
    setContent(prev => prev.map(p => p.id === item.id ? item : p));
    showToast(`Post updated`);
  };

  const generateNextWeekContent = async () => {
    setIsGeneratingContent(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    const generated: ContentItem[] = [
      {
        id: `post-gen-${Date.now()}-1`,
        topic: 'Why early-stage SaaS architectures should avoid microservices before $1M ARR',
        format: 'LinkedIn post',
        painAddressed: 'Over-engineering and distributed systems fatigue in seed startups',
        targetKeyword: 'Next.js modular monolith architecture',
        selectedDestinations: ['linkedin_personal', 'x_profile'],
        destinationSchedules: {
          linkedin_personal: {
            destinationId: 'linkedin_personal',
            status: 'Draft',
            scheduledDate: '2026-11-16',
            scheduledTime: '18:30',
            audienceTimeInfo: '= 8:30 AM Mon in New York'
          },
          x_profile: {
            destinationId: 'x_profile',
            status: 'Draft',
            scheduledDate: '2026-11-16',
            scheduledTime: '19:00',
            audienceTimeInfo: '= 9:00 AM Mon in New York'
          }
        },
        status: 'Draft',
        scheduledDay: 'Monday, Nov 16',
        scheduledTime: '18:30 (Asia/Dhaka)',
        draftedByAgent: true,
        agentTaskId: '#T-142',
        baseText: `Microservices solve organization scaling problems, not engineering velocity problems. At seed stage, a well-structured Next.js modular monolith ships 5x faster.`
      },
      {
        id: `post-gen-${Date.now()}-2`,
        topic: 'How we built an automated PDF invoice extractor with 99% accuracy in 2 weeks',
        format: 'Website article',
        painAddressed: 'Manual document entry bottlenecks in mid-market logistics',
        targetKeyword: 'automate PDF invoice entry into NetSuite',
        selectedDestinations: ['website_blog', 'linkedin_personal'],
        destinationSchedules: {
          website_blog: {
            destinationId: 'website_blog',
            status: 'Draft',
            scheduledDate: '2026-11-18',
            scheduledTime: '20:00',
            audienceTimeInfo: '= 10:00 AM Wed in New York'
          },
          linkedin_personal: {
            destinationId: 'linkedin_personal',
            status: 'Draft',
            scheduledDate: '2026-11-18',
            scheduledTime: '18:30',
            audienceTimeInfo: '= 8:30 AM Wed in New York'
          }
        },
        status: 'Draft',
        scheduledDay: 'Wednesday, Nov 18',
        scheduledTime: '20:00 (Asia/Dhaka)',
        draftedByAgent: true,
        agentTaskId: '#T-143',
        baseText: `A walk-through of the confidence scoring queue and schema validation rules we deployed for Portline Global Freight.`
      }
    ];

    setContent(prev => [...generated, ...prev]);
    setIsGeneratingContent(false);
    logActivity('Agent drafted 2 new posts for next week’s plan', 'agent', '/content');
    showToast('Generated 2 new planned posts for next week');
  };

  const addIdeasFromWeeklyQuestions = (answers: string[]) => {
    const now = Date.now();
    const ideaA: ContentItem = {
      id: `idea-q-${now}-1`,
      topic: `How we resolved the ${answers[0] ? `"${answers[0].substring(0, 35)}"` : 'client delivery'} bottleneck`,
      format: 'LinkedIn post',
      painAddressed: 'Uncaught engineering delays in high-throughput automation pipelines',
      targetKeyword: 'production pipeline architecture bottleneck',
      pattern: 'Architecture teardown',
      source: 'From weekly questions',
      author: 'Alex Mercer',
      whyThisIdea: answers[0] ? `Answer to question 1: ${answers[0]}` : 'From weekly team retrospective',
      baseText: `Every tech team hits unforeseen bottlenecks in production.\n\nThis week, we faced: ${answers[0] || 'an unexpected latency spike in webhook ingestion'}.\n\nHere is the exact diagnostic framework and PostgreSQL lock analysis we used to resolve it within 4 hours.`,
      selectedDestinations: ['linkedin_personal', 'x_profile'],
      destinationSchedules: {},
      status: 'Idea',
      draftedByAgent: false,
      auditTrail: [
        { date: 'Today (just now)', action: 'Created from weekly answers', actor: 'human' }
      ]
    };

    const ideaB: ContentItem = {
      id: `idea-q-${now}-2`,
      topic: `Overcoming prospect skepticism on ${answers[1] ? `"${answers[1].substring(0, 35)}"` : 'custom studio delivery'}`,
      format: 'LinkedIn post',
      painAddressed: 'Enterprise buyers skeptical of external agency security and SLA compliance',
      targetKeyword: 'software studio enterprise trust verification',
      pattern: 'Founder lesson',
      source: 'From weekly questions',
      author: 'Sarah Connor',
      whyThisIdea: answers[1] ? `Answer to question 2: ${answers[1]}` : 'From weekly client discovery insights',
      baseText: `On a recent client discovery call, the prospect asked a fair question:\n\n"${answers[1] || 'How do we know your studio will deliver in 6 weeks without ongoing maintenance headaches?'}"\n\nHere is the 3-step proof framework and zero-retention IP guarantee we share with every enterprise partner.`,
      selectedDestinations: ['linkedin_personal', 'website_blog'],
      destinationSchedules: {},
      status: 'Idea',
      draftedByAgent: false,
      auditTrail: [
        { date: 'Today (just now)', action: 'Created from weekly answers', actor: 'human' }
      ]
    };

    setContent(prev => [ideaA, ideaB, ...prev]);
    showToast('2 ideas added from weekly answers');
  };

  const planNextWeekContent = async (params?: {
    linkedinCount?: number;
    websiteCount?: number;
    facebookCount?: number;
    xCount?: number;
    focusOffer?: string;
    useClearSearch?: boolean;
  }) => {
    setIsGeneratingContent(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    const now = Date.now();
    const newIdeas: ContentItem[] = [
      {
        id: `idea-plan-${now}-1`,
        topic: 'Why high-velocity startups choose monolithic backends over microservices',
        format: 'LinkedIn post',
        painAddressed: 'Early architectural fragmentation slowing down customer iteration',
        targetKeyword: 'modular monolith architecture',
        pattern: 'Contrarian breakdown',
        source: 'ClearSearch keyword trend',
        author: 'Agent',
        whyThisIdea: 'Trending search demand among Series A CTOs on monolith vs microservices trade-offs.',
        baseText: 'Splitting your codebase into 8 microservices before product-market fit introduces network latency, distributed logging headaches, and 3x infrastructure costs.\n\nA modular monolith scales past 100k requests/min on a single instance. Keep it simple until traffic forces you to decouple.',
        selectedDestinations: ['linkedin_personal', 'x_profile'],
        destinationSchedules: {},
        status: 'Idea',
        draftedByAgent: true,
        agentTaskId: '#T-201',
        auditTrail: [{ date: 'Today (just now)', action: 'Generated by Plan Next Week agent', actor: 'agent' }]
      },
      {
        id: `idea-plan-${now}-2`,
        topic: 'The $18,000 mistake: What happens when internal ops scripts lack retry queues',
        format: 'LinkedIn post',
        painAddressed: 'Silent failure in back-office data sync causing missing customer orders',
        targetKeyword: 'idempotent background worker automation',
        pattern: 'Cost dissection',
        source: 'Client delivery outcome',
        author: 'Agent',
        whyThisIdea: 'Case study evidence from our ERP automation client.',
        baseText: 'An agency client ran a daily billing script without exponential backoff or dead-letter queues. When the Stripe API experienced a 4-minute hiccup, 140 invoices silently skipped.\n\nHere is how we architect fail-safe webhook pipelines with BullMQ and automated alerting.',
        selectedDestinations: ['linkedin_personal', 'facebook_page'],
        destinationSchedules: {},
        status: 'Idea',
        draftedByAgent: true,
        agentTaskId: '#T-202',
        auditTrail: [{ date: 'Today (just now)', action: 'Generated by Plan Next Week agent', actor: 'agent' }]
      },
      {
        id: `idea-plan-${now}-3`,
        topic: 'How we automated multi-channel client onboarding in 12 business days',
        format: 'Case study',
        painAddressed: 'Client onboarding lag stretching across 3 weeks of manual setup',
        targetKeyword: 'automated client onboarding workflow',
        pattern: 'Before/After benchmark',
        source: 'ClearSearch keyword trend',
        author: 'Agent',
        whyThisIdea: 'Focus on high-ticket service operations efficiency.',
        baseText: 'When a new agency client signs, setup usually requires 12 manual invitations, workspace provisioning, and repository access grants.\n\nWe deployed an automated provisioning bot that executes the entire 22-step checklist in 90 seconds. Onboarding satisfaction jumped 40%.',
        selectedDestinations: ['linkedin_personal', 'website_blog'],
        destinationSchedules: {},
        status: 'Idea',
        draftedByAgent: true,
        agentTaskId: '#T-203',
        auditTrail: [{ date: 'Today (just now)', action: 'Generated by Plan Next Week agent', actor: 'agent' }]
      },
      {
        id: `idea-plan-${now}-4`,
        topic: 'The 4-layer security checklist for production enterprise AI agents',
        format: 'LinkedIn post',
        painAddressed: 'Prompt injection and unauthenticated API calls in custom LLM tools',
        targetKeyword: 'enterprise AI agent security framework',
        pattern: 'Step-by-step framework',
        source: 'Client delivery outcome',
        author: 'Agent',
        whyThisIdea: 'Addresses enterprise security review barriers.',
        baseText: 'Before letting an AI agent trigger production database updates, enforce these 4 security rings: 1) Deterministic JSON schema verification, 2) Read-only execution sandboxes, 3) Human confirmation thresholds on destructive actions, 4) Immutable audit logs.',
        selectedDestinations: ['linkedin_personal', 'x_profile'],
        destinationSchedules: {},
        status: 'Idea',
        draftedByAgent: true,
        agentTaskId: '#T-204',
        auditTrail: [{ date: 'Today (just now)', action: 'Generated by Plan Next Week agent', actor: 'agent' }]
      },
      {
        id: `idea-plan-${now}-5`,
        topic: 'Why we killed our custom staging server and switched to preview deployments',
        format: 'LinkedIn post',
        painAddressed: 'Developers waiting on shared staging environments that stay broken',
        targetKeyword: 'ephemeral PR preview environments',
        pattern: 'Founder lesson',
        source: 'ClearSearch keyword trend',
        author: 'Agent',
        whyThisIdea: 'Studio velocity insight.',
        baseText: 'Shared staging servers are where velocity goes to die. Developer A pushes broken migrations, blocking Developer B, C, and D for two days.\n\nSwitching to ephemeral branch preview URLs cut our PR review cycles from 3 days to 45 minutes.',
        selectedDestinations: ['linkedin_personal', 'facebook_page'],
        destinationSchedules: {},
        status: 'Idea',
        draftedByAgent: true,
        agentTaskId: '#T-205',
        auditTrail: [{ date: 'Today (just now)', action: 'Generated by Plan Next Week agent', actor: 'agent' }]
      },
      {
        id: `idea-plan-${now}-6`,
        topic: 'Database index tuning: Cutting query time from 4.2s to 18ms under load',
        format: 'Website article',
        painAddressed: 'Slow database analytics queries freezing user interfaces',
        targetKeyword: 'PostgreSQL partial index optimization',
        pattern: 'Architecture teardown',
        source: 'ClearSearch keyword trend',
        author: 'Agent',
        whyThisIdea: 'High authority technical case study.',
        baseText: 'When a client table grew past 2 million records, filtering unread notifications caused severe disk I/O bottlenecks.\n\nA single partial B-tree index on WHERE read_at IS NULL reduced query latency by 99.5% with zero memory penalty.',
        selectedDestinations: ['linkedin_personal', 'website_blog'],
        destinationSchedules: {},
        status: 'Idea',
        draftedByAgent: true,
        agentTaskId: '#T-206',
        auditTrail: [{ date: 'Today (just now)', action: 'Generated by Plan Next Week agent', actor: 'agent' }]
      },
      {
        id: `idea-plan-${now}-7`,
        topic: 'The single metric that predicts whether a software MVP will reach $100k ARR',
        format: 'LinkedIn post',
        painAddressed: 'Founders tracking vanity signup metrics instead of paid retention',
        targetKeyword: 'B2B SaaS MVP product market fit metric',
        pattern: 'Contrarian breakdown',
        source: 'ClearSearch keyword trend',
        author: 'Agent',
        whyThisIdea: 'High engagement executive level insight.',
        baseText: 'Website visits, waitlist registrations, and free trial signups do not validate your product.\n\nThe only metric that matters at Day 45: does a user return to use the core utility at least 3 times in their first 14 days without an automated reminder? That is product-market fit.',
        selectedDestinations: ['linkedin_personal', 'x_profile'],
        destinationSchedules: {},
        status: 'Idea',
        draftedByAgent: true,
        agentTaskId: '#T-207',
        auditTrail: [{ date: 'Today (just now)', action: 'Generated by Plan Next Week agent', actor: 'agent' }]
      }
    ];

    setContent(prev => [...newIdeas, ...prev]);
    setIsGeneratingContent(false);
    logActivity('Agent drafted 7 new content ideas for next week', 'agent', '/content');
  };

  const writeAllDraftsFromIdeas = () => {
    setContent(prev => prev.map(p => {
      if (p.status === 'Idea') {
        return {
          ...p,
          status: 'Draft',
          auditTrail: [
            ...(p.auditTrail || []),
            { date: 'Today (just now)', action: 'Converted to Draft via bulk action', actor: 'human' }
          ]
        };
      }
      return p;
    }));
    showToast('All ideas converted to Drafts');
  };

  // Buffer Publishing actions
  const addPostsBuffer = (newPosts: Post | Post[]) => {
    const postArray = Array.isArray(newPosts) ? newPosts : [newPosts];
    setPosts(prev => [...postArray, ...prev]);
    const channelNames = postArray.map(p => {
      const ch = channels.find(c => c.id === p.channelId);
      return ch?.name || p.channelId;
    });
    const channelsDesc = channelNames.length === 1 ? channelNames[0] : `${channelNames.length} channels`;
    const toastMsg = postArray[0]?.status === 'Needs approval'
      ? `Sent for approval (${channelsDesc})`
      : postArray[0]?.status === 'Draft'
      ? `Saved as draft`
      : `Added to queue in ${channelsDesc}`;

    logActivity(`Added post to ${channelsDesc}`, 'human', '/publish');
    showToast(toastMsg, () => {
      const addedIds = postArray.map(p => p.id);
      setPosts(prev => prev.filter(p => !addedIds.includes(p.id)));
      showToast('Action undone');
    }, 5000);
  };

  const updatePostItem = (post: Post) => {
    const prevPost = posts.find(p => p.id === post.id);
    setPosts(prev => prev.map(p => p.id === post.id ? post : p));
    showToast('Post updated', () => {
      if (prevPost) {
        setPosts(prev => prev.map(p => p.id === post.id ? prevPost : p));
        showToast('Changes undone');
      }
    }, 5000);
  };

  const deletePostItem = (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    setPosts(prev => prev.filter(p => p.id !== postId));
    showToast('Post deleted', () => {
      setPosts(prev => [target, ...prev]);
      showToast('Post restored');
    }, 5000);
  };

  const changePostStatusItem = (postId: string, status: PublishStatus, reason?: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    const prevPost = { ...target };

    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      status,
      whyThisPost: reason || p.whyThisPost,
      auditTrail: [
        ...(p.auditTrail || []),
        { date: 'Today (just now)', action: `Status changed to ${status}${reason ? `: ${reason}` : ''}`, actor: 'human' }
      ]
    } : p));

    showToast(`Status changed to "${status}"`, () => {
      setPosts(prev => prev.map(p => p.id === postId ? prevPost : p));
      showToast('Status change undone');
    }, 5000);
  };

  const approvePostItem = (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    const prevPost = { ...target };
    const channel = channels.find(c => c.id === target.channelId);

    let date = target.scheduledDate;
    let time = target.scheduledTime;
    let slotId = target.slotId;
    if (!date && channel) {
      const nextSlot = getNextOpenSlot(channel, posts);
      if (nextSlot) {
        date = nextSlot.date;
        time = nextSlot.time;
        slotId = nextSlot.slotId;
      }
    }

    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      status: 'Scheduled',
      scheduledDate: date || '2026-10-30',
      scheduledTime: time || '18:30',
      slotId,
      auditTrail: [
        ...(p.auditTrail || []),
        { date: 'Today (just now)', action: 'Approved and scheduled into queue', actor: 'human' }
      ]
    } : p));

    logActivity(`Approved post: "${target.text.substring(0, 40)}..."`, 'human', '/publish?tab=approvals');
    showToast(`Approved post for ${channel?.name || 'channel'}`, () => {
      setPosts(prev => prev.map(p => p.id === postId ? prevPost : p));
      showToast('Approval undone');
    }, 5000);
  };

  const approveMultiplePostsItem = (postIds: string[]) => {
    const targets = posts.filter(p => postIds.includes(p.id));
    if (targets.length === 0) return;
    const prevPosts = [...posts];

    setPosts(prev => prev.map(p => {
      if (postIds.includes(p.id)) {
        const channel = channels.find(c => c.id === p.channelId);
        let date = p.scheduledDate;
        let time = p.scheduledTime;
        let slotId = p.slotId;
        if (!date && channel) {
          const nextSlot = getNextOpenSlot(channel, prev);
          if (nextSlot) {
            date = nextSlot.date;
            time = nextSlot.time;
            slotId = nextSlot.slotId;
          }
        }
        return {
          ...p,
          status: 'Scheduled' as PublishStatus,
          scheduledDate: date || '2026-10-30',
          scheduledTime: time || '18:30',
          slotId,
          auditTrail: [
            ...(p.auditTrail || []),
            { date: 'Today (just now)', action: 'Approved via bulk action', actor: 'human' }
          ]
        };
      }
      return p;
    }));

    logActivity(`Approved ${targets.length} posts for publishing`, 'human', '/publish?tab=approvals');
    showToast(`Approved ${targets.length} posts`, () => {
      setPosts(prevPosts);
      showToast('Bulk approval undone');
    }, 5000);
  };

  const rejectPostItem = (postId: string, reason: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    const prevPost = { ...target };

    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      status: 'Draft',
      whyThisPost: reason ? `Changes requested: ${reason}` : p.whyThisPost,
      auditTrail: [
        ...(p.auditTrail || []),
        { date: 'Today (just now)', action: `Requested changes: ${reason}`, actor: 'human' }
      ]
    } : p));

    showToast(`Returned to Drafts (${reason})`, () => {
      setPosts(prev => prev.map(p => p.id === postId ? prevPost : p));
      showToast('Action undone');
    }, 5000);
  };

  const shareNowPostItem = (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    const prevPost = { ...target };
    const channel = channels.find(c => c.id === target.channelId);

    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      status: 'Sent',
      sentAt: 'Today, 1:42 PM',
      livePostUrl: target.livePostUrl || `https://${target.channelId.includes('x') ? 'x.com' : target.channelId.includes('linkedin') ? 'linkedin.com' : 'facebook.com'}/kinetik/post/${Date.now()}`,
      impressions: p.impressions || Math.floor(Math.random() * 200) + 120,
      engagements: p.engagements || Math.floor(Math.random() * 15) + 5,
      auditTrail: [
        ...(p.auditTrail || []),
        { date: 'Today (just now)', action: 'Shared now immediately', actor: 'human' }
      ]
    } : p));

    logActivity(`Shared post now to ${channel?.name || 'channel'}`, 'human', '/publish?tab=sent');
    showToast(`Shared now to ${channel?.name || 'channel'}`, () => {
      setPosts(prev => prev.map(p => p.id === postId ? prevPost : p));
      showToast('Share now undone');
    }, 5000);
  };

  const shareNextPostItem = (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    const channel = channels.find(c => c.id === target.channelId);
    if (!channel) return;
    const prevPosts = [...posts];

    const scheduled = posts
      .filter(p => p.channelId === target.channelId && p.status === 'Scheduled' && p.id !== postId)
      .sort((a, b) => `${a.scheduledDate} ${a.scheduledTime}`.localeCompare(`${b.scheduledDate} ${b.scheduledTime}`));

    let newDate = '2026-10-30';
    let newTime = '18:30';
    let newSlotId: string | undefined;

    if (scheduled.length > 0) {
      newDate = scheduled[0].scheduledDate || newDate;
      newTime = scheduled[0].scheduledTime || newTime;
      newSlotId = scheduled[0].slotId;
    }

    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      status: 'Scheduled',
      scheduledDate: newDate,
      scheduledTime: newTime,
      slotId: newSlotId,
      auditTrail: [
        ...(p.auditTrail || []),
        { date: 'Today (just now)', action: 'Moved to top of queue (Share next)', actor: 'human' }
      ]
    } : p));

    showToast(`Moved to top of queue (Share next)`, () => {
      setPosts(prevPosts);
      showToast('Action undone');
    }, 5000);
  };

  const reschedulePostItem = (postId: string, date: string, time: string, slotId?: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    const prevPost = { ...target };

    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      scheduledDate: date,
      scheduledTime: time,
      slotId: slotId || p.slotId,
      status: 'Scheduled',
      auditTrail: [
        ...(p.auditTrail || []),
        { date: 'Today (just now)', action: `Rescheduled to ${date} ${time}`, actor: 'human' }
      ]
    } : p));

    showToast(`Rescheduled to ${date} ${time}`, () => {
      setPosts(prev => prev.map(p => p.id === postId ? prevPost : p));
      showToast('Reschedule undone');
    }, 5000);
  };

  const retryPostItem = (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    const prevPost = { ...target };
    const channel = channels.find(c => c.id === target.channelId);

    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      status: 'Sent',
      sentAt: 'Today, 1:45 PM',
      errorMessage: undefined,
      impressions: 48,
      engagements: 3,
      livePostUrl: `https://${target.channelId.includes('x') ? 'x.com' : 'kinetikdynamics.com'}/post/${Date.now()}`,
      auditTrail: [
        ...(p.auditTrail || []),
        { date: 'Today (just now)', action: 'Retried failed post - Published successfully', actor: 'human' }
      ]
    } : p));

    logActivity(`Retried failed post on ${channel?.name || 'channel'} - Published`, 'human', '/publish?tab=sent');
    showToast(`Retried and published to ${channel?.name || 'channel'}`, () => {
      setPosts(prev => prev.map(p => p.id === postId ? prevPost : p));
      showToast('Retry undone');
    }, 5000);
  };

  const fillQueueWithDrafts = (channelId: ChannelId) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return;
    const drafts = posts.filter(p => p.channelId === channelId && p.status === 'Draft');
    if (drafts.length === 0) {
      showToast('No drafts found for this channel. Write a draft or plan ideas first.');
      return;
    }

    const prevPosts = [...posts];
    let count = 0;

    setPosts(prev => {
      let currentPool = [...prev];
      drafts.forEach(draft => {
        const nextSlot = getNextOpenSlot(channel, currentPool);
        if (nextSlot) {
          count++;
          currentPool = currentPool.map(p => p.id === draft.id ? {
            ...p,
            status: 'Scheduled' as PublishStatus,
            scheduledDate: nextSlot.date,
            scheduledTime: nextSlot.time,
            slotId: nextSlot.slotId,
            auditTrail: [
              ...(p.auditTrail || []),
              { date: 'Today (just now)', action: `Filled into queue slot ${nextSlot.date} ${nextSlot.time}`, actor: 'human' }
            ]
          } : p);
        }
      });
      return currentPool;
    });

    showToast(`Filled ${count} open slots with drafts for ${channel.name}`, () => {
      setPosts(prevPosts);
      showToast('Action undone');
    }, 5000);
  };

  const createDraftsForOpenSlots = () => {
    const targetChannels = channels.filter(c => c.status === 'connected' && !c.isPaused && c.slots && c.slots.length > 0);
    const newCreatedPosts: Post[] = [];

    targetChannels.forEach(channel => {
      for (let offset = 1; offset <= 7; offset++) {
        const dateStr = addDays(FIXED_TODAY_DATE, offset);
        const dayOfWeek = getDayOfWeek(dateStr);
        const matchingSlots = channel.slots.filter(s => s.dayOfWeek === dayOfWeek);

        matchingSlots.forEach(slot => {
          const occupied = [...posts, ...newCreatedPosts].some(
            p => p.channelId === channel.id && (p.scheduledDate === dateStr && (p.scheduledTime === slot.time || p.slotId === slot.id))
          );

          if (!occupied) {
            const id = `post-slot-fill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
            const topicIdea = IDEAS_INITIAL[newCreatedPosts.length % IDEAS_INITIAL.length];
            newCreatedPosts.push({
              id,
              channelId: channel.id,
              text: topicIdea ? `${topicIdea.title}\n\n${topicIdea.shortNotes || ''}\n\nKey studio benchmark: Automated workers cut manual lag by 90%.` : 'Automating engineering pipelines for scale.',
              status: 'Needs approval',
              scheduledDate: dateStr,
              scheduledTime: slot.time,
              slotId: slot.id,
              draftedByAgent: true,
              agentTaskId: `#T-${Math.floor(Math.random() * 800) + 4100}`,
              whyThisPost: `Generated by agent for open slot on ${dateStr} (${slot.dayOfWeek} ${slot.time}).`,
              author: 'Agent',
              pattern: topicIdea?.pattern || 'Step-by-step framework',
              targetKeyword: topicIdea?.targetKeyword || 'engineering velocity'
            });
          }
        });
      }
    });

    if (newCreatedPosts.length === 0) {
      showToast('All slots in the next 7 days are already filled!');
      return;
    }

    setPosts(prev => [...newCreatedPosts, ...prev]);
    showToast(`${newCreatedPosts.length} drafts created`, undefined, 5000);
  };

  const updateChannelSchedule = (channelId: ChannelId, slots: WeeklySlot[], timezone: string, postingGoal: '1x' | '3x' | '5x') => {
    setChannels(prev => prev.map(c => c.id === channelId ? {
      ...c,
      slots,
      timezone,
      postingGoal
    } : c));
    showToast(`Posting schedule saved for ${channels.find(c => c.id === channelId)?.name || 'channel'}`);
  };

  const togglePauseChannel = (channelId: ChannelId) => {
    const target = channels.find(c => c.id === channelId);
    if (!target) return;
    const nextPaused = !target.isPaused;
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, isPaused: nextPaused } : c));
    showToast(`${target.name} queue ${nextPaused ? 'paused' : 'resumed'}`);
  };

  const connectChannel = (newChannel: Channel) => {
    setChannels(prev => {
      const exists = prev.some(c => c.id === newChannel.id);
      if (exists) {
        return prev.map(c => c.id === newChannel.id ? newChannel : c);
      }
      return [...prev, newChannel];
    });
    showToast(`Connected ${newChannel.name}`);
  };

  const disconnectChannel = (channelId: ChannelId) => {
    const target = channels.find(c => c.id === channelId);
    if (!target) return;
    setPosts(prev => prev.filter(p => !(p.channelId === channelId && p.status === 'Scheduled')));
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, status: 'not_connected', slots: [] } : c));
    showToast(`Disconnected ${target.name} and removed scheduled posts`);
  };

  const addIdeaItem = (idea: IdeaItem) => {
    setIdeas(prev => [idea, ...prev]);
    showToast(`Idea added: "${idea.title.substring(0, 32)}..."`);
  };

  const updateIdeaItem = (idea: IdeaItem) => {
    setIdeas(prev => prev.map(i => i.id === idea.id ? idea : i));
    showToast('Idea updated');
  };

  const deleteIdeaItem = (ideaId: string) => {
    const target = ideas.find(i => i.id === ideaId);
    if (!target) return;
    setIdeas(prev => prev.filter(i => i.id !== ideaId));
    showToast('Idea deleted', () => {
      setIdeas(prev => [target, ...prev]);
      showToast('Idea restored');
    }, 5000);
  };

  const planNextWeekIdeas = async (channelCounts: Record<ChannelId, number>, focusOffer: string) => {
    setIsGeneratingContent(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    const generatedIdeas: IdeaItem[] = [
      {
        id: `idea-plan-${Date.now()}-1`,
        title: 'Why early-stage SaaS architecture should avoid microservices before $1M ARR',
        shortNotes: 'Contrast bloated distributed architectures with high-velocity modular monoliths for Series A founders.',
        painAddressed: 'Over-engineering and distributed systems fatigue slowing down customer feature velocity.',
        targetKeyword: 'Next.js modular monolith architecture',
        pattern: 'Contrarian breakdown',
        source: 'Agent plan',
        tag: 'Architecture',
        targetChannelId: 'linkedin_personal',
        suggestedDraft: 'Microservices solve organizational scaling problems, not engineering velocity problems. At seed stage, a well-structured modular monolith ships 5x faster.'
      },
      {
        id: `idea-plan-${Date.now()}-2`,
        title: 'The $18,000 mistake: What happens when internal ops scripts lack retry queues',
        shortNotes: 'Case study of a Stripe webhook latency spike causing 140 invoices to skip silently.',
        painAddressed: 'Silent failure states in back-office data sync causing lost customer transactions.',
        targetKeyword: 'idempotent background worker automation',
        pattern: 'Cost dissection',
        source: 'Agent plan',
        tag: 'Engineering',
        targetChannelId: 'linkedin_personal',
        suggestedDraft: 'An agency client ran a daily billing script without exponential backoff. When Stripe had a 4-minute hiccup, 140 invoices silently skipped. Here is how we build fail-safe pipelines.'
      },
      {
        id: `idea-plan-${Date.now()}-3`,
        title: 'How we automated multi-channel client onboarding in 12 business days',
        shortNotes: 'Zero-touch repository, Slack, and cloud resource provisioning for enterprise agency partners.',
        painAddressed: 'Client onboarding stretching across 3 weeks of manual setup tickets.',
        targetKeyword: 'automated client onboarding workflow',
        pattern: 'Before/After benchmark',
        source: 'Agent plan',
        tag: 'AI Automation',
        targetChannelId: 'website_blog',
        suggestedDraft: 'When an agency client signs, setup usually requires 12 manual invitations and workspace grants. Our automated provisioning bot completes all 22 steps in 90 seconds.'
      },
      {
        id: `idea-plan-${Date.now()}-4`,
        title: 'The 4-layer security checklist for production enterprise AI agents',
        shortNotes: 'Deterministic schema validation, read-only sandboxes, human confirmation gates, and immutable audit logs.',
        painAddressed: 'Enterprise security reviews blocking autonomous internal agent deployments.',
        targetKeyword: 'enterprise AI agent security framework',
        pattern: 'Step-by-step framework',
        source: 'Agent plan',
        tag: 'AI Automation',
        targetChannelId: 'x_profile',
        suggestedDraft: 'Before letting an AI agent trigger production database updates, enforce these 4 security rings: schema validation, read sandboxes, human gates, and immutable logs.'
      },
      {
        id: `idea-plan-${Date.now()}-5`,
        title: 'Why we killed our custom staging server and switched to ephemeral preview deployments',
        shortNotes: 'How shared staging servers stall team PR review cycles and how preview branches fix it.',
        painAddressed: 'Broken staging environments blocking 4 engineers simultaneously.',
        targetKeyword: 'ephemeral PR preview environments',
        pattern: 'Founder lesson',
        source: 'Agent plan',
        tag: 'Engineering',
        targetChannelId: 'linkedin_personal',
        suggestedDraft: 'Shared staging servers are where velocity dies. Developer A pushes broken migrations, blocking everyone else for two days. Ephemeral branch previews cut review cycles to 45 minutes.'
      },
      {
        id: `idea-plan-${Date.now()}-6`,
        title: 'Database index tuning: Cutting query time from 4.2s to 18ms under 50k RPS',
        shortNotes: 'PostgreSQL partial indexing on null notification timestamps for high-volume SaaS apps.',
        painAddressed: 'Slow database analytics queries freezing user interfaces during peak hours.',
        targetKeyword: 'PostgreSQL partial index optimization',
        pattern: 'Architecture teardown',
        source: 'Agent plan',
        tag: 'Engineering',
        targetChannelId: 'website_blog',
        suggestedDraft: 'When a client table grew past 2 million records, filtering unread notifications caused severe I/O bottlenecks. A single partial B-tree index reduced query latency by 99.5%.'
      },
      {
        id: `idea-plan-${Date.now()}-7`,
        title: 'The single metric that predicts whether a software MVP will reach $100k ARR',
        shortNotes: 'Why free trials and waitlists lie, and why Day-45 core retention is the only predictor that matters.',
        painAddressed: 'Founders tracking vanity signup metrics instead of paid retention.',
        targetKeyword: 'B2B SaaS MVP product market fit metric',
        pattern: 'Contrarian breakdown',
        source: 'Agent plan',
        tag: 'Founder Strategy',
        targetChannelId: 'x_profile',
        suggestedDraft: 'Website visits and free signups do not validate your product. The only metric that matters at Day 45: does a user return to use the core utility at least 3 times in their first 14 days?'
      }
    ];

    setIdeas(prev => [...generatedIdeas, ...prev]);
    setIsGeneratingContent(false);
    logActivity('Agent generated 7 new content ideas for next week', 'agent', '/ideas');
    showToast('7 ideas added', undefined, 5000);
  };

  const planWeeklyPosts = async (params: {
    channelCounts: Record<ChannelId, number>;
    focusOffer: string;
    useClearSearch?: boolean;
    targetStatus?: 'Needs approval' | 'Draft';
  }): Promise<Post[]> => {
    setIsGeneratingContent(true);
    await new Promise(resolve => setTimeout(resolve, 2500));

    const now = Date.now();
    const targetStatus = params.targetStatus || (approvalMode === 'manual' ? 'Needs approval' : 'Scheduled');

    const plannedPosts: Post[] = [
      {
        id: `post-plan-${now}-1`,
        channelId: 'linkedin_personal',
        text: `Why early-stage SaaS architecture should avoid microservices before $1M ARR\n\nMicroservices solve organizational scaling problems, not engineering velocity problems. At seed stage, a well-structured modular monolith ships 5x faster.\n\nKeep it simple until traffic forces you to decouple.`,
        status: targetStatus,
        scheduledDate: '2026-11-03',
        scheduledTime: '18:30',
        slotId: 'lip-1',
        draftedByAgent: true,
        agentTaskId: '#T-4201',
        whyThisPost: 'Targeting Series A CTOs considering premature microservices redesign.',
        author: 'Agent',
        pattern: 'Contrarian breakdown',
        targetKeyword: 'Next.js modular monolith architecture',
        tag: 'Architecture',
        createdTogetherGroupId: `grp-plan-${now}`
      },
      {
        id: `post-plan-${now}-2`,
        channelId: 'x_profile',
        text: `Splitting your codebase into 8 microservices before $1M ARR introduces network latency, distributed logging headaches, and 3x cloud costs.\n\nA single modular monolith handles 100k req/min with zero distributed transaction bugs. Keep it simple.`,
        status: targetStatus,
        scheduledDate: '2026-11-03',
        scheduledTime: '19:00',
        slotId: 'x-2',
        draftedByAgent: true,
        agentTaskId: '#T-4202',
        whyThisPost: 'Accompanying technical hook thread on X for seed founders.',
        author: 'Agent',
        pattern: 'Architecture teardown',
        targetKeyword: 'modular monolith architecture',
        tag: 'Engineering',
        createdTogetherGroupId: `grp-plan-${now}`
      },
      {
        id: `post-plan-${now}-3`,
        channelId: 'facebook_page',
        text: `The $18,000 mistake: What happens when internal ops scripts lack retry queues.\n\nAn agency client ran a daily billing script without exponential backoff or dead-letter queues. When Stripe had a 4-minute hiccup, 140 invoices silently skipped.\n\nHere is how we architect fail-safe webhook pipelines.`,
        status: targetStatus,
        scheduledDate: '2026-11-04',
        scheduledTime: '22:00',
        slotId: 'fb-1',
        draftedByAgent: true,
        agentTaskId: '#T-4203',
        whyThisPost: 'Addresses agency owner operations risk and automation reliability.',
        author: 'Agent',
        pattern: 'Cost dissection',
        targetKeyword: 'idempotent background worker automation',
        tag: 'AI Automation',
        createdTogetherGroupId: `grp-plan-${now}`
      },
      {
        id: `post-plan-${now}-4`,
        channelId: 'linkedin_personal',
        text: `Cut invoice processing from 36 hours to 4 minutes.\n\nMost B2B SaaS teams spend 36 hours manually reviewing and routing invoices each week.\n\nWe engineered an event-driven worker for a logistics scale-up that runs document OCR and validation in 4 minutes flat with zero hallucinated vendor IDs. Full audit trace in Postgres.`,
        status: targetStatus,
        scheduledDate: '2026-11-04',
        scheduledTime: '18:30',
        slotId: 'lip-2',
        draftedByAgent: true,
        agentTaskId: '#T-4204',
        whyThisPost: 'Demonstrating tangible ROI and speed on logistics back-office pipelines.',
        author: 'Agent',
        pattern: 'Before/After benchmark',
        targetKeyword: 'invoice automation worker',
        tag: 'Engineering',
        createdTogetherGroupId: `grp-plan-${now}`
      },
      {
        id: `post-plan-${now}-5`,
        channelId: 'website_blog',
        text: `How we automated multi-channel client onboarding in 12 business days.\n\nWhen a new agency client signs, setup usually requires 12 manual invitations, workspace provisioning, and repository access grants.\n\nWe deployed an automated provisioning bot that executes the entire 22-step checklist in 90 seconds. Full technical architecture breakdown.`,
        status: targetStatus,
        scheduledDate: '2026-11-05',
        scheduledTime: '20:00',
        slotId: 'web-2',
        draftedByAgent: true,
        agentTaskId: '#T-4205',
        whyThisPost: 'High-intent case study article targeting agency technical directors.',
        author: 'Agent',
        pattern: 'Before/After benchmark',
        targetKeyword: 'automated client onboarding workflow',
        tag: 'AI Automation',
        createdTogetherGroupId: `grp-plan-${now}`,
        channelSpecific: {
          websiteData: {
            title: 'How we automated multi-channel client onboarding in 12 business days',
            slug: 'automated-client-onboarding-workflow',
            metaDescription: 'How engineering studios automate agency client onboarding pipelines with zero manual lag.',
            category: 'Engineering',
            targetKeyword: 'automated client onboarding workflow',
            publishMode: 'publish_live',
            seoChecklist: {
              keywordInTitle: true,
              oneH1: true,
              faqSection: true,
              schemaType: 'TechArticle'
            }
          }
        }
      },
      {
        id: `post-plan-${now}-6`,
        channelId: 'x_profile',
        text: `The 4-layer security checklist for production enterprise AI agents:\n\n1/ Deterministic JSON schema verification\n2/ Read-only execution sandboxes\n3/ Human confirmation thresholds on destructive actions\n4/ Immutable audit logs in Postgres\n\nNever let an agent write to production without layer 3.`,
        status: targetStatus,
        scheduledDate: '2026-11-05',
        scheduledTime: '19:00',
        slotId: 'x-4',
        draftedByAgent: true,
        agentTaskId: '#T-4206',
        whyThisPost: 'Actionable security rules removing enterprise deployment hesitation.',
        author: 'Agent',
        pattern: 'Step-by-step framework',
        targetKeyword: 'enterprise AI agent security framework',
        tag: 'AI Automation',
        createdTogetherGroupId: `grp-plan-${now}`
      },
      {
        id: `post-plan-${now}-7`,
        channelId: 'x_profile',
        text: `Why we killed our custom staging server and switched to ephemeral preview deployments.\n\nShared staging servers are where engineering velocity goes to die. Developer A pushes broken migrations, blocking everyone else for two days.\n\nEphemeral branch previews cut review cycles to 45 minutes.`,
        status: targetStatus,
        scheduledDate: '2026-11-06',
        scheduledTime: '19:00',
        slotId: 'x-5',
        draftedByAgent: true,
        agentTaskId: '#T-4207',
        whyThisPost: 'Engineering culture & velocity insight resonate with technical founders.',
        author: 'Agent',
        pattern: 'Founder lesson',
        targetKeyword: 'ephemeral PR preview environments',
        tag: 'Founder Strategy',
        createdTogetherGroupId: `grp-plan-${now}`
      }
    ];

    setPosts(prev => [...plannedPosts, ...prev]);

    // Also add ideas
    const newIdeas: IdeaItem[] = plannedPosts.map(p => ({
      id: `idea-${p.id}`,
      title: p.text.split('\n')[0].substring(0, 75),
      shortNotes: p.whyThisPost,
      painAddressed: p.whyThisPost,
      targetKeyword: p.targetKeyword,
      pattern: p.pattern,
      source: 'Agent plan',
      tag: p.tag,
      targetChannelId: p.channelId,
      suggestedDraft: p.text
    }));
    setIdeas(prev => [...newIdeas, ...prev]);

    setIsGeneratingContent(false);
    logActivity(`Agent planned ${plannedPosts.length} posts for next week's editorial queue`, 'agent', '/publish?tab=queue');
    showToast(`${plannedPosts.length} posts planned for next week`, () => {
      const addedIds = plannedPosts.map(p => p.id);
      setPosts(prev => prev.filter(p => !addedIds.includes(p.id)));
      showToast('Weekly plan undone');
    }, 7000);

    return plannedPosts;
  };

  // Proposals actions
  const acceptProposal = (proposalId: string) => {
    const prop = proposals.find(p => p.id === proposalId);
    if (!prop) return;

    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'accepted' } : p));
    
    if (prop.actionType === 'pause_source') {
      const src = sources.find(s => s.name.includes('Funding News'));
      if (src && src.enabled) {
        toggleSource(src.id);
      }
    }

    logActivity(`Accepted suggestion: "${prop.suggestion.substring(0, 45)}..."`, 'human', '/insights?tab=proposals');
    showToast(`Accepted proposal`);
  };

  const rejectProposal = (proposalId: string, reason: string) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'rejected', rejectionReason: reason } : p));
    logActivity(`Rejected proposal: ${reason}`, 'human');
    showToast(`Proposal rejected`);
  };

  // Auth & Team Methods
  const login = (email: string, password?: string) => {
    if (failedLoginAttempts >= 5 || isLoginLocked) {
      setIsLoginLocked(true);
      return { success: false, locked: true, error: 'Too many attempts. Try again in 10 minutes.' };
    }

    if (email.trim().toLowerCase() === 'wrong@example.com') {
      const nextAttempts = failedLoginAttempts + 1;
      setFailedLoginAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setIsLoginLocked(true);
        return { success: false, locked: true, error: 'Too many attempts. Try again in 10 minutes.' };
      }
      return { success: false, error: 'Email or password is incorrect.' };
    }

    setFailedLoginAttempts(0);
    setIsLoginLocked(false);

    if (currentUser.twoFactorEnabled) {
      return { success: true, requires2fa: true };
    }

    setIsAuthenticated(true);
    localStorage.setItem('kge_auth', 'true');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kge_auth');
    showToast('Signed out');
  };

  const completeTwoFactor = (code: string) => {
    if (code === '000000') {
      return false;
    }
    setIsAuthenticated(true);
    localStorage.setItem('kge_auth', 'true');
    return true;
  };

  const switchUserRole = (role: UserRole) => {
    const roleProfiles: Record<UserRole, { name: string; email: string }> = {
      Owner: { name: 'Alex Mercer', email: 'alex@kinetikdynamics.com' },
      Editor: { name: 'Sarah Connor', email: 'sarah@kinetikdynamics.com' },
      Approver: { name: 'David Chen', email: 'david@kinetikdynamics.com' },
      Viewer: { name: 'Elena Rostova', email: 'elena@investorcapital.com' }
    };
    const prof = roleProfiles[role] || { name: 'Demo User', email: 'user@kinetikdynamics.com' };
    setCurrentUser(prev => ({
      ...prev,
      role,
      name: prof.name,
      email: prof.email
    }));
    showToast(`Switched active role to ${role} (${prof.name})`);
  };

  const updateUserProfile = (data: Partial<CurrentUser>) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
    showToast('Account details updated');
  };

  const setTwoFactorEnabled = (enabled: boolean) => {
    setCurrentUser(prev => ({ ...prev, twoFactorEnabled: enabled }));
    showToast(enabled ? 'Two-step verification enabled' : 'Two-step verification disabled');
  };

  const signOutSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    showToast('Signed out from session');
  };

  const signOutAllOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
    showToast('Signed out of all other active sessions');
  };

  const inviteTeamMember = (email: string, role: UserRole) => {
    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      status: 'Invited',
      lastActive: 'Invited just now'
    };
    setTeamMembers(prev => [...prev, newMember]);
    showToast(`Invitation sent to ${email}`);
  };

  const resendInvite = (id: string) => {
    showToast('Invitation email resent');
  };

  const revokeInvite = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    showToast('Invitation revoked');
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    showToast('Member removed from workspace');
  };

  const restoreSession = (password: string) => {
    if (password.trim().length > 0) {
      setSessionExpiredModalOpen(false);
      showToast('Session restored');
      return true;
    }
    return false;
  };

  const setOnboardingCompleted = (completed: boolean) => {
    setOnboardingCompletedState(completed);
    localStorage.setItem('kge_onboarding_completed', completed ? 'true' : 'false');
  };

  const setOnboardingStep = (step: number) => {
    setOnboardingStepState(step);
    localStorage.setItem('kge_onboarding_step', step.toString());
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const finishOnboarding = (data: OnboardingData) => {
    setOnboardingData(data);
    setOnboardingCompleted(true);

    // Map onboarding offers into Brain offers
    if (data.offers && data.offers.length > 0) {
      const newOffers: Offer[] = data.offers.map((o, idx) => ({
        id: (idx === 0 ? 'ai-sprint' : idx === 1 ? 'mvp-6-weeks' : 'whitelabel-dev') as any,
        name: o.name,
        targetIcps: ['Seed-Stage B2B SaaS Founders'],
        priceRange: o.priceRange,
        timeline: idx === 0 ? '2 weeks' : idx === 1 ? '6 weeks' : 'Ongoing retainer',
        proofCount: 2,
        promise: o.promise,
        deliverables: ['Production deployment', 'Technical documentation', 'Weekly sprint updates'],
        history: [{ date: 'Today', who: currentUser.name, what: 'Created in setup stepper' }]
      }));
      setOffers(newOffers);
    }

    // Map onboarding ICPs into Brain ICPs
    if (data.icps && data.icps.length > 0) {
      const newIcps: Icp[] = data.icps.map((icp, idx) => ({
        id: `icp-${idx + 1}`,
        name: icp.name,
        offerId: 'mvp-6-weeks',
        countries: ['US', 'UK', 'EU'],
        roles: icp.rolesToContact.split(',').map(r => r.trim()),
        leadsCount: 15,
        replyRate: 14.5,
        callsCount: 4,
        winsCount: 1,
        companyType: icp.whoTheyAre,
        companySize: '5-50 employees',
        industries: ['B2B SaaS', 'Digital Services', 'Fintech'],
        buyingTriggers: icp.buyingTriggers.split(',').map(t => t.trim()),
        pains: ['Slow engineering execution', 'Lack of senior technical leadership'],
        objections: [{ objection: 'Do you work in our timezone?', answer: 'Yes, full overlap with US Eastern and UK hours.' }],
        disqualifiers: ['No budget', 'Pre-idea without funding'],
        monthlyPerformance: [{ month: 'Oct 2026', leads: 15, replies: 4, calls: 2, wins: 1 }],
        history: [{ date: 'Today', who: currentUser.name, what: 'Created in setup stepper' }]
      }));
      setIcps(newIcps);
    }

    // If case studies added
    if (data.caseStudies && data.caseStudies.length > 0) {
      const newProofs: ProofItem[] = data.caseStudies.map((cs, idx) => ({
        id: `proof-ob-${idx + 1}`,
        title: cs.title,
        clientType: cs.clientType,
        offerId: 'mvp-6-weeks',
        industry: 'Software',
        result: cs.result,
        canNameClient: cs.canNameClient,
        clientName: cs.canNameClient ? cs.title.split(' ')[0] : undefined,
        timesUsed: 1,
        writeUp: `Delivered full scope in record timeline with validated product impact: ${cs.result}`,
        usedIn: []
      }));
      setProof(prev => [...newProofs, ...prev]);
    }

    logActivity(`Workspace onboarding completed by ${currentUser.name}`, 'human', '/overview');
    showToast('Setup complete. Studio profile and brain loaded.');
  };

  const resetOnboarding = () => {
    setOnboardingCompletedState(false);
    setOnboardingStepState(1);
    localStorage.removeItem('kge_onboarding_completed');
    localStorage.removeItem('kge_onboarding_step');
    localStorage.removeItem('kge_setup_dismissed');
    setSetupChecklistDismissed(false);
    showToast('Onboarding reset. Launching setup stepper.');
  };

  const dismissSetupChecklist = () => {
    setSetupChecklistDismissed(true);
    localStorage.setItem('kge_setup_dismissed', 'true');
    showToast('Setup checklist dismissed');
  };

  const resetDemoData = () => {
    localStorage.removeItem('kge_offers');
    localStorage.removeItem('kge_icps');
    localStorage.removeItem('kge_proof');
    localStorage.removeItem('kge_signals');
    localStorage.removeItem('kge_leads');
    localStorage.removeItem('kge_sources');
    localStorage.removeItem('kge_search_plans');
    localStorage.removeItem('kge_content_workspace');
    localStorage.removeItem('kge_content_v2');
    localStorage.removeItem('kge_proposals');
    localStorage.removeItem('kge_activity');
    localStorage.removeItem('kge_current_user');
    localStorage.removeItem('kge_team_members');
    localStorage.removeItem('kge_sessions');
    localStorage.removeItem('kge_onboarding_data');
    localStorage.removeItem('kge_onboarding_completed');
    localStorage.removeItem('kge_onboarding_step');
    localStorage.removeItem('kge_setup_dismissed');
    localStorage.removeItem('kge_buffer_channels');
    localStorage.removeItem('kge_buffer_posts');
    localStorage.removeItem('kge_buffer_ideas');

    setOffers(initialOffers);
    setIcps(initialIcps);
    setProof(initialProof);
    setSignals(initialSignals);
    setLeads(initialLeads);
    setSources(initialSources);
    setSearchPlans(initialSearchPlans);
    setContent(initialContent);
    setChannels(CHANNELS_INITIAL);
    setPosts(POSTS_INITIAL);
    setIdeas(IDEAS_INITIAL);
    setProposals(initialProposals);
    setActivity(initialActivity);
    setCurrentUser(defaultUser);
    setTeamMembers(initialTeamMembers);
    setSessions(initialSessions);
    setOnboardingData(defaultOnboardingData);
    setOnboardingCompletedState(false);
    setOnboardingStepState(1);
    setSetupChecklistDismissed(false);
    setFailedLoginAttempts(0);
    setIsLoginLocked(false);

    showToast('Reset all mock data to initial demo state');
  };

  return (
    <StoreContext.Provider value={{
      offers,
      updateOffer,
      icps,
      updateIcp,
      proof,
      addProof,
      signals,
      makeLeadFromSignal,
      markSignalAsNoise,
      leads,
      approveLead,
      undoApproveLead,
      rejectLead,
      snoozeLead,
      updateLeadMessage,
      movePipelineStage,
      updateLeadNotes,
      sources,
      toggleSource,
      searchPlans,
      updateSearchPlan,
      addKeywordsToSearchPlans,
      content,
      approvalMode,
      setApprovalMode,
      approvePost,
      rejectPost,
      bulkApprovePosts,
      approvePostDestination,
      rejectPostDestination,
      reschedulePostDestination,
      cancelPostDestination,
      publishNowPostDestination,
      retryPostDestination,
      movePostDate,
      changePostStatus,
      addPost,
      updatePost,
      addIdeasFromWeeklyQuestions,
      planNextWeekContent,
      writeAllDraftsFromIdeas,
      generateNextWeekContent,
      isGeneratingContent,
      
      // Buffer Publishing
      channels,
      posts,
      ideas,
      addPostsBuffer,
      updatePostItem,
      deletePostItem,
      changePostStatusItem,
      approvePostItem,
      approveMultiplePostsItem,
      rejectPostItem,
      shareNowPostItem,
      shareNextPostItem,
      reschedulePostItem,
      retryPostItem,
      fillQueueWithDrafts,
      createDraftsForOpenSlots,
      updateChannelSchedule,
      togglePauseChannel,
      connectChannel,
      disconnectChannel,
      addIdeaItem,
      updateIdeaItem,
      deleteIdeaItem,
      planNextWeekIdeas,
      planWeeklyPosts,

      proposals,
      acceptProposal,
      rejectProposal,
      activity,
      logActivity,
      toasts,
      showToast,
      removeToast,
      
      // Auth & Team
      isAuthenticated,
      currentUser,
      userRole: currentUser.role,
      login,
      logout,
      completeTwoFactor,
      switchUserRole,
      updateUserProfile,
      twoFactorEnabled: currentUser.twoFactorEnabled,
      setTwoFactorEnabled,
      sessions,
      signOutSession,
      signOutAllOtherSessions,
      teamMembers,
      inviteTeamMember,
      resendInvite,
      revokeInvite,
      removeTeamMember,
      sessionExpiredModalOpen,
      setSessionExpiredModalOpen,
      restoreSession,
      failedLoginAttempts,
      isLoginLocked,

      // Onboarding
      onboardingCompleted,
      setOnboardingCompleted,
      onboardingStep,
      setOnboardingStep,
      onboardingData,
      updateOnboardingData,
      finishOnboarding,
      resetOnboarding,
      setupChecklistDismissed,
      dismissSetupChecklist,

      resetDemoData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
