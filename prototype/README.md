# Kinetik Growth Engine

A static, clickable UI prototype for **Kinetik Dynamics**, a boutique software studio selling web/app development, AI automation sprints, and 6-week MVP builds to businesses in the US, UK, and EU.

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **React Router v7**, and **Lucide Icons** (stroke 1.5, 16px).

---

## 1. Running the Prototype Locally

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Build production bundle and run type checks
npm run build
```

Dev server default URL: `http://localhost:5173/`

---

## 2. Routes & Navigation Sitemap

| Route | Nav Group | Screen Description |
|---|---|---|
| `/login` | Auth | Centered 400px sign-in form with email/password show-hide, lock after 5 tries, Google SSO, inline validation |
| `/two-factor` | Auth | 6-digit auto-advance verification code input, paste support, backup code fallback, 30s resend timer |
| `/forgot-password` | Auth | Password reset request form with generic confirmation state (no account enumeration) |
| `/reset-password` | Auth | Dynamic password reset form with live rule satisfaction checklist (12+ chars, common password check) |
| `/accept-invite` | Auth | Team invite acceptance form ("Invited as Editor") with expired link state toggle |
| `/onboarding` | Onboarding | 5-step full-page stepper: Business profile, 4s web crawler simulation, editable Offers/ICPs cards, Proof/Voice, Connections, Limits |
| `/` or `/overview` | Overview | Setup checklist card (dismissible), "Needs you" items, rolling 30-day metrics, conversion funnel, recent activity |
| `/account` | User Menu | Profile, email change with password check, password change, 2FA setup modal (QR code + 8 backup codes), timezone, session manager |
| `/brain/offers` | Brain | Table of 3 core offers, First-run setup 3-step onboarding flow modal |
| `/brain/offers/:id` | Brain | Detail edit form for promise, deliverables, and Version History log |
| `/brain/icps` | Brain | ICP table (4 ICPs) with firmographics, reply/win rates (empty state if no ICPs) |
| `/brain/icps/:id` | Brain | Definition, monthly performance, change history, and "Preview Matches" modal |
| `/brain/proof` | Brain | 8 client case studies with drawer showing write-up, confidentiality, and citation history |
| `/leads/queue` | Leads | Split view lead queue with 7-section detail, validation checks, duplicate detection, and 5s Undo toast (viewer restricted) |
| `/leads/pipeline` | Leads | 8-stage Kanban board with auto-synced columns, drag & drop, Lost reason modal, and timeline drawer |
| `/leads/signals` | Leads | Searchable feed of 60 raw captured signals with "Make lead" and "Mark as noise" actions |
| `/leads/sources` | Leads | 7 background collectors, on/off kill switches, error diagnostic drawer, and ClearSearch keywords importer |
| `/publish` | Content | Buffer-style Publishing UX: 240px channel panel, 5 tabs (Queue, Calendar, Drafts, Approvals, Sent), dashed open slots, running-out banner, 4-step connect modal, posting schedules, Composer |
| `/ideas` | Content | Ideas workspace: Quick input, Plan next week stepper (3s agent progress), Write drafts for open slots, Weekly questions retrospective card, Patterns & Swipe file tabs |
| `/insights` | Insights | Segment reply/win rate tables with in-cell horizontal bars, sample sizes, and agent proposals |
| `/settings` | Settings | 7 tabs: Connections, AI providers, Approvals & limits, Compliance, Tokens (owner only), Notifications, Team (members table & invite modal) |
| `/404` | Errors | Not Found page: "This page doesn't exist" with link to Overview |
| `/no-access` | Errors | No Access page: "You don't have permission to view this. Ask an owner for access." |

> Note: Legacy routes (`/content`, `/content/plan`, `/content/calendar`, `/content/compose`, `/content/approvals`, `/content/posts`, `/content/patterns`) automatically redirect to `/publish` or `/ideas`. Overview's "Needs you" row deep-links directly to `/publish?tab=approvals`.

---

## 3. Mock Data Structure (`src/mock/`)

All domain data resides in decoupled mock files in `src/mock/`:

- [`src/mock/destinations.ts`](file:///d:/Projects/Growth%20Engine/src/mock/destinations.ts): 5 publishing destination definitions, connection statuses, posting windows (audience NY vs Dhaka timezone), and helper utilities.
- [`src/mock/offers.ts`](file:///d:/Projects/Growth%20Engine/src/mock/offers.ts): 3 studio packages (AI Automation Sprint, MVP in 6 Weeks, White-label Development).
- [`src/mock/icps.ts`](file:///d:/Projects/Growth%20Engine/src/mock/icps.ts): 4 Ideal Client Profiles with buying triggers, objections/answers, and disqualifiers.
- [`src/mock/proof.ts`](file:///d:/Projects/Growth%20Engine/src/mock/proof.ts): 8 verified studio case studies with quantitative results and client confidentiality status.
- [`src/mock/leads.ts`](file:///d:/Projects/Growth%20Engine/src/mock/leads.ts): 35 leads across pipeline stages, including 5 in queue (one failing duplicate checks, one with CAN-SPAM warning).
- [`src/mock/signals.ts`](file:///d:/Projects/Growth%20Engine/src/mock/signals.ts): 60 raw signals from Hacker News, Reddit, Indeed, Product Hunt, and Agency RFPs.
- [`src/mock/sources.ts`](file:///d:/Projects/Growth%20Engine/src/mock/sources.ts): 7 scrapers/collectors (including 1 rate-limited) and search plan keyword queries.
- [`src/mock/content.ts`](file:///d:/Projects/Growth%20Engine/src/mock/content.ts): Exactly 28 content items fixed at Thursday, 29 October 2026. Stages: 6 Ideas, 4 Drafts, 3 Needs approval, 7 Scheduled, and 8 Published. Features `post-dest-fail` (LinkedIn/FB published, X failed with daily limit reached), `post-dest-web-draft` (CMS draft), weekly questions source idea, and 2 items with linked deals ($28,000 and $45,000).
- [`src/mock/proposals.ts`](file:///d:/Projects/Growth%20Engine/src/mock/proposals.ts): 6 empirical agent recommendations with evidence and past decision logs.
- [`src/mock/activity.ts`](file:///d:/Projects/Growth%20Engine/src/mock/activity.ts): Last 10 studio events with Asia/Dhaka timestamps and actor tags.
- [`src/mock/connections.ts`](file:///d:/Projects/Growth%20Engine/src/mock/connections.ts): Status of Instantly/Smartlead, ClearSearch, LinkedIn, X, and Hunter, plus compliance rules for US, UK, and EU.

State mutations (approving leads, moving deals, scheduling posts, toggling collectors) are handled by a reactive store ([`src/context/StoreContext.tsx`](file:///d:/Projects/Growth%20Engine/src/context/StoreContext.tsx)) synced to `localStorage`.

---

## 4. Laravel + Inertia.js Migration Mapping

When porting this React prototype to Laravel 11 + Inertia.js (React / Vue), map components as follows:

| Prototype File | Laravel Controller & Inertia Page | Inertia Props to Pass |
|---|---|---|
| [`src/pages/Overview/OverviewPage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Overview/OverviewPage.tsx) | `OverviewController@index` → `Pages/Overview.tsx` | `pendingCounts`, `stats30d`, `funnelStats`, `recentActivity` |
| [`src/pages/Brain/OffersPage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Brain/OffersPage.tsx) | `OfferController@index` → `Pages/Brain/Offers/Index.tsx` | `offers` |
| [`src/pages/Brain/OfferDetailPage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Brain/OfferDetailPage.tsx) | `OfferController@show` → `Pages/Brain/Offers/Show.tsx` | `offer`, `linkedProofs`, `history` |
| [`src/pages/Brain/IcpsPage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Brain/IcpsPage.tsx) | `IcpController@index` → `Pages/Brain/Icps/Index.tsx` | `icps` |
| [`src/pages/Brain/IcpDetailPage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Brain/IcpDetailPage.tsx) | `IcpController@show` → `Pages/Brain/Icps/Show.tsx` | `icp`, `monthlyMetrics`, `history` |
| [`src/pages/Brain/ProofPage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Brain/ProofPage.tsx) | `ProofController@index` → `Pages/Brain/Proof/Index.tsx` | `proofs`, `offers` |
| [`src/pages/Leads/QueuePage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Leads/QueuePage.tsx) | `LeadQueueController@index` → `Pages/Leads/Queue.tsx` | `waitingLeads`, `filters`, `offers`, `proofs` |
| [`src/pages/Leads/PipelinePage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Leads/PipelinePage.tsx) | `PipelineController@index` → `Pages/Leads/Pipeline.tsx` | `dealsByStage`, `totalPipelineValue` |
| [`src/pages/Leads/SignalsPage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Leads/SignalsPage.tsx) | `SignalController@index` → `Pages/Leads/Signals.tsx` | `signals` (paginated), `activeFilters` |
| [`src/pages/Leads/SourcesPage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Leads/SourcesPage.tsx) | `SourceController@index` → `Pages/Leads/Sources.tsx` | `collectors`, `searchPlans`, `suggestedKeywords` |
| [`src/pages/Content/ContentWorkspacePage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Content/ContentWorkspacePage.tsx) | `ContentWorkspaceController@index` → `Pages/Content/Index.tsx` | `contentItems`, `weeklyQuestions`, `destinations` |
| [`src/pages/Content/PatternsPage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Content/PatternsPage.tsx) | `ContentPatternController@index` → `Pages/Content/Patterns.tsx` | `patterns`, `swipeFile` |
| [`src/pages/Insights/InsightsPage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Insights/InsightsPage.tsx) | `InsightController@index` → `Pages/Insights/Index.tsx` | `channelMetrics`, `topicMetrics`, `proposals` |
| [`src/pages/Settings/SettingsPage.tsx`](file:///d:/Projects/Growth%20Engine/src/pages/Settings/SettingsPage.tsx) | `SettingController@index` → `Pages/Settings/Index.tsx` | `connections`, `complianceRules`, `tokens` |

---

## 5. Design Principles Adhered To

- **Restrained Typography & Neutral Aesthetics**: Neutral grays (`#f9fafb`, `#111827`, border `#e5e7eb`), Inter font, `font-mono tabular-nums` for all metrics.
- **One Accent Color**: Single blue (`#2563eb`), with green/amber/red strictly reserved for statuses and warnings.
- **No Decoration**: No emojis, no glassmorphism, no gradient blobs, no sparkles, no "AI badges", no marketing fluff.
- **Human-in-the-Loop Safeguards**: AI drafts are attributed with plain text `"Drafted by agent · task #T-..."`. Validation checks stop duplicate outreach. 5-second undo toast allows reversing accidental approvals.
- **Keyboard Shortcuts**: `⌘K` or `Ctrl+K` for command navigation, `Esc` to close drawers/modals, `↑`/`↓` to navigate queue, and `A` / `R` to approve/reject leads.
