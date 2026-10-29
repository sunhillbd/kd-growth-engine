import { ProofItem } from '../types';

export const initialProof: ProofItem[] = [
  {
    id: 'proof-1',
    title: 'Automated Invoice & Manifest Extraction for Freight Forwarder',
    clientType: 'SMB Logistics Operator (80 staff)',
    offerId: 'ai-sprint',
    industry: 'Logistics & Supply Chain',
    result: 'Reduced document processing turnaround from 36 hours to 4 minutes; 99.2% OCR accuracy on messy scans.',
    canNameClient: true,
    clientName: 'Portline Global Freight (Southampton, UK)',
    timesUsed: 14,
    writeUp: 'Deployed an automated document ingestion pipeline combining Claude 3.5 Sonnet extraction with custom validation rules. The system hooks into Portline\'s email inbox, extracts line items from international customs bills of lading and supplier invoices, cross-references tariff codes, and pushes clean JSON directly into their CargoWise enterprise system. Human operators only review items flagged below 95% confidence score.',
    usedIn: [
      { type: 'lead', id: 'lead-1', title: 'AeroTrans Logistics outreach brief', date: '2026-10-26' },
      { type: 'lead', id: 'lead-3', title: 'Meridian Supply invoice brief', date: '2026-10-24' },
      { type: 'post', id: 'post-101', title: 'LinkedIn case breakdown on logistics automation', date: '2026-10-22' }
    ]
  },
  {
    id: 'proof-2',
    title: 'Fintech Seed Startup: Production B2B Billing Portal in 5 Weeks',
    clientType: 'Funded Pre-seed Startup ($1.2M)',
    offerId: 'mvp-6-weeks',
    industry: 'Fintech / Payments',
    result: 'Delivered MVP 1 week ahead of deadline; client closed $340k ARR within 90 days of product launch.',
    canNameClient: true,
    clientName: 'PayLedger Technologies (San Francisco, CA)',
    timesUsed: 12,
    writeUp: 'PayLedger had raised a seed round but was stalled on engineering hiring. Kinetik designed and built their entire B2B recurring billing and vendor disbursement portal from scratch using Next.js 15, PostgreSQL, Supabase, and Stripe Connect. Included enterprise role-based access control (RBAC), multi-entity audit logging, and automated compliance reporting.',
    usedIn: [
      { type: 'lead', id: 'lead-2', title: 'Founding Engineer outreach to OrbitFin', date: '2026-10-27' },
      { type: 'post', id: 'post-103', title: 'Why founders should not wait 4 months to hire before building MVP', date: '2026-10-18' }
    ]
  },
  {
    id: 'proof-3',
    title: 'White-label React & Mobile Dev for London Digital Agency',
    clientType: 'Brand & Digital Agency (35 staff)',
    offerId: 'whitelabel-dev',
    industry: 'Creative & Agency Services',
    result: 'Rescued delayed enterprise client build; generated $140k in billables for agency partner over 9-month retainer.',
    canNameClient: false,
    clientName: 'Confidential London Digital Studio',
    timesUsed: 9,
    writeUp: 'A premier London design agency won an interactive web portal RFP for a luxury retail client but lacked in-house React Native and GraphQL engineers. Kinetik provided two embedded senior engineers who joined the agency Slack under @agency.co email handles, delivered 18 consecutive 2-week sprints with zero missed releases, and handled all client-facing technical architecture calls.',
    usedIn: [
      { type: 'lead', id: 'lead-4', title: 'Canvas Creative Director white-label brief', date: '2026-10-25' },
      { type: 'post', id: 'post-105', title: 'How agencies scale past $3M without bloating permanent payroll', date: '2026-10-15' }
    ]
  },
  {
    id: 'proof-4',
    title: 'AI Customer Ticket Routing & Triage for PropTech Marketplace',
    clientType: 'SMB Property Management (45 staff)',
    offerId: 'ai-sprint',
    industry: 'PropTech / Real Estate',
    result: 'Cut weekend response times from 18 hours to 2 minutes; resolved 42% of tier-1 tenant maintenance tickets autonomously.',
    canNameClient: true,
    clientName: 'UrbanKey Rentals (Chicago, IL)',
    timesUsed: 8,
    writeUp: 'UrbanKey was swamped with 1,200 maintenance requests each weekend. Kinetik built an intelligent triage agent connected to their Zendesk and property database. The agent verifies tenant lease status, categorizes emergencies (gas leaks vs leaky faucets), drafts pre-approved vendor dispatch requests, and updates tenants via SMS.',
    usedIn: [
      { type: 'lead', id: 'lead-5', title: 'TenancyOps triage lead brief', date: '2026-10-27' },
      { type: 'post', id: 'post-107', title: 'AI in operations: triage vs full replacement', date: '2026-10-10' }
    ]
  },
  {
    id: 'proof-5',
    title: 'Legal Contract Review & Clause Comparison Engine in 6 Weeks',
    clientType: 'Bootstrapped Founder / Legal Boutique',
    offerId: 'mvp-6-weeks',
    industry: 'LegalTech',
    result: 'Automated 70% of standard non-disclosure and vendor master services agreement review steps.',
    canNameClient: false,
    clientName: 'Tier 1 European Boutique Firm',
    timesUsed: 7,
    writeUp: 'Engineered a specialized web workspace allowing corporate attorneys to upload redline agreements, compare clauses against their approved standard language library, and highlight risk deviations with citations. Built with Next.js, FastAPI, pgvector, and private European cloud infrastructure.',
    usedIn: [
      { type: 'post', id: 'post-108', title: 'Evaluating LLMs on structured legal documents', date: '2026-10-08' }
    ]
  },
  {
    id: 'proof-6',
    title: 'Custom Headless E-commerce Portal for B2B Wholesale Distributor',
    clientType: 'Mid-Market Distributor ($18M revenue)',
    offerId: 'mvp-6-weeks',
    industry: 'Wholesale & B2B Commerce',
    result: 'Migrated 300 tier-1 wholesale accounts off phone/fax orders; processed $2.1M in online volume in first 60 days.',
    canNameClient: true,
    clientName: 'Apex Industrial Parts (Birmingham, UK)',
    timesUsed: 6,
    writeUp: 'Replaced a legacy 2004 ERP terminal interface with a modern, high-speed wholesale ordering portal. Integrated with custom ERP inventory APIs, tier-based pricing calculators, and recurring purchase approval workflows.',
    usedIn: [
      { type: 'lead', id: 'lead-7', title: 'Midland Supplies modernization brief', date: '2026-10-19' }
    ]
  },
  {
    id: 'proof-7',
    title: 'Multi-Tenant SaaS Scaffold for Healthcare Credentialing',
    clientType: 'Funded HealthTech Startup ($2M Seed)',
    offerId: 'mvp-6-weeks',
    industry: 'HealthTech',
    result: 'Completed HIPAA-compliant credentialing engine in 38 days, meeting investor milestone for Series A kickoff.',
    canNameClient: false,
    clientName: 'Confidential US HealthTech Venture',
    timesUsed: 5,
    writeUp: 'Architected and implemented an encrypted medical credential tracking portal with audit trails, AWS KMS encryption, automated license verification scrapers, and clinical supervisor sign-off forms.',
    usedIn: [
      { type: 'post', id: 'post-110', title: 'HIPAA compliance checklists for early stage founders', date: '2026-10-02' }
    ]
  },
  {
    id: 'proof-8',
    title: 'Overflow Frontend Development for Dutch Interactive Agency',
    clientType: 'Design Studio (20 staff)',
    offerId: 'whitelabel-dev',
    industry: 'Digital Experience / Creative',
    result: 'Delivered 3 marketing microsites on time during peak Q4 campaign season with zero client QA defects.',
    canNameClient: true,
    clientName: 'Studio Noord (Amsterdam, Netherlands)',
    timesUsed: 4,
    writeUp: 'Provided senior React/TypeScript bandwidth during their annual creative crunch. Managed component library styling, GSAP animations, and accessibility audits.',
    usedIn: [
      { type: 'lead', id: 'lead-8', title: 'Dutch Agency referral brief', date: '2026-10-14' }
    ]
  }
];
