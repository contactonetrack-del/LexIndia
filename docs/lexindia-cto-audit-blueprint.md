# LexIndia CTO Audit and Product Blueprint

Audit date: March 13, 2026

Prepared from:
- Local repository state in `c:\Users\chauh\Downloads\lexindia`
- Live deployment behavior at `https://lexindia.vercel.app`
- Live API responses observed on March 13, 2026

This document is intentionally product, architecture, and execution oriented. It is not a generic legal-tech writeup. It reflects the actual LexIndia build that exists today and defines the incremental v2 needed to turn it into a major Indian legal platform.

## Verified Current-State Facts
- Root requests redirect to a locale-prefixed route with a `308` redirect via `middleware.ts`.
- The live deployment currently exposes multilingual public pages for lawyers, guides, rights, pricing, about, contact, privacy, terms, and lawyer verification.
- `GET /api/stats` returned `{"lawyers":4,"verified":3}` on March 13, 2026.
- `GET /api/lawyers?locale=en` returned 4 seeded lawyers with real profile pages and consultation modes.
- `GET /api/knowledge?locale=en` returned a thin FAQ knowledge base centered on a small number of seeded categories.
- `GET /api/templates?locale=en` returned placeholder template content such as "Sample RTI Application Form" with `[Insert content here]`.
- Booking is partially real: `app/api/appointments/route.ts` creates appointments and Razorpay orders, and `app/api/payment/verify/route.ts` verifies payment signatures.
- Public pricing is inconsistent with billing implementation:
  - `app/pricing/page.tsx` markets Pro at `INR 1,499` and Elite at `INR 3,999`.
  - `app/api/subscriptions/route.ts` charges Pro at `INR 999` and Elite at `INR 2,499`.
  - `app/dashboard/lawyer/LawyerDashboardClient.tsx` also uses `999/2499`.
- Booking UX is inconsistent with billing:
  - `app/book/[id]/BookingPageClient.tsx` markets the first consultation as free.
  - `app/api/appointments/route.ts` still generates a paid Razorpay order based on the lawyer fee.
- The site has SEO plumbing, but the canonical/base-domain configuration assumes `https://lexindia.in`:
  - `lib/i18n/config.ts` hardcodes `SITE_URL = 'https://lexindia.in'`
  - `app/robots.ts` falls back to `https://lexindia.in`
  - The live audited host is `https://lexindia.vercel.app`
- The current Prisma schema contains 22 models, but there is still no first-class statute/section/legal-act graph, no issue intake model, and no editorial workflow model.

## 1. Understand the Product Vision

LexIndia should be built as a 3-pillar Indian legal platform:

1. Public legal help
   - Give citizens a plain-language explanation of rights, process, urgency, documents, authorities, and next steps.
   - Convert confusion into an informed action path.

2. Lawyer marketplace
   - Help citizens discover, compare, trust, and book lawyers.
   - Help lawyers acquire demand, prove credibility, and monetize consultations.

3. Legal knowledge platform
   - Build a large, structured Indian law corpus that is useful for citizens, law students, judiciary aspirants, and search engines.

### Recommended operating thesis
- Acquisition engine: public-help content and issue navigation
- Revenue engine: consultations, subscriptions, premium placement
- Authority engine: structured, reviewed legal knowledge

### LexIndia should optimize for
- National remote-first launch
- Major-city lawyer supply at first
- Public-help-first product sequencing
- Hybrid monetization
- Editorial content with lawyer review, not AI-autopublish

## 2. Forensic Website Audit

### What the website currently is
LexIndia is currently a mixed platform:
- Most visible to users as a multilingual legal-help and lawyer-discovery portal
- Functionally closer to an early legal marketplace MVP than a law firm site
- Content-wise stronger than a typical legal blog, but not yet a true Indian legal knowledge database
- Not yet a mature marketplace because supply, trust systems, payouts, reviews, and lead economics are still shallow

Best classification:

**A multilingual legal-help MVP with an early lawyer marketplace and a partially structured knowledge layer**

### Homepage messaging
- Strengths
  - The headline and hero communicate speed and legal help clearly.
  - Citizen and lawyer entry points are visible.
  - Search-led entry is strong for user intent.
  - The product framing is broader than a simple directory.
- Weaknesses
  - The homepage still compresses three products into one message: legal help, lawyer discovery, and knowledge.
  - "For lawyers" currently routes users toward pricing and onboarding intent, but the value proposition is still thin compared with the actual dashboard depth.
  - The strongest differentiator, public issue guidance for Indian legal problems, is implied rather than made explicit as the core wedge.

### Navigation structure
- Current top-level nav is materially improved versus an earlier MVP:
  - Lawyers
  - Knowledge
  - Guides
  - Templates
  - Rights
  - Pricing
- This is a good start, but the IA still has product overlap:
  - `Knowledge` is FAQ-oriented
  - `Guides` are the actual high-value public-help surface
  - `Rights` has category coverage but shallow detail pages
  - `Templates` is still not production-grade

### Feature availability
- Working or partially working
  - Multilingual shell and locale-aware routing
  - Lawyer directory
  - Lawyer profile pages
  - Booking flow with appointment creation
  - Payment verification
  - Lawyer dashboard
  - Citizen dashboard
  - Guides library
  - Rights category pages
  - AI chat via server route
  - Policies and trust pages
- Partially implemented but not market-ready
  - Reviews and social proof
  - Subscriptions
  - Templates
  - Verification operations
  - Consultation economics
  - Lawyer profile management
  - Content search
  - Knowledge hierarchy

### Content depth
- Strongest current content layer: static guides
  - The repo contains 28 individual guide entries in `app/guides/page.tsx`
  - Guide pages are more useful than the FAQ knowledge base
- Moderate content layer: rights categories
  - Rights taxonomy exists, but detail pages are generic shells rather than deep problem-specific content
- Weakest content layer: legal database
  - No structured acts, sections, punishments, cross references, or versioned law repository
- Templates layer remains non-credible
  - Placeholder content with inflated download counters damages trust

### Legal usefulness
- Useful for a user who needs a first orientation in common consumer, criminal, family, labour, and property questions
- Not yet sufficient for a user who needs:
  - state-specific process
  - act/section-level clarity
  - case-type triage
  - filing workflow support
  - evidence/document checklists tied to issue type
  - court, police, or authority escalation paths

### Trust signals
- Positive
  - Dedicated verification page exists
  - Public legal disclaimer exists
  - Privacy and terms pages exist
  - Lawyer profile pages show verification status, rating, and consultation modes
- Weak
  - Trust narrative is stronger than trust operations
  - Verification is described well, but the data model does not yet support a robust verification case-management workflow
  - Lawyer supply is too small to create marketplace confidence
  - Template downloads and "free consultation" messaging can undermine credibility because the underlying flows are inconsistent

### User journeys
- Citizens can discover lawyers and read guides.
- Citizens cannot yet move through a strong issue-resolution workflow.
- Lawyers can join and subscribe, but the marketplace mechanics are not yet rich enough to make LexIndia a must-have acquisition channel.

### Lawyer engagement potential
- There is enough scaffolding for lawyers to test the platform.
- There is not yet enough verified demand, profile depth, analytics, or workflow maturity for serious lawyer adoption at scale.

### Bottom-line audit
- LexIndia already looks meaningfully more like a platform than a brochure site.
- It does not yet feel like India's trusted legal operating layer.
- The main gap is not "no product."
- The gap is "product surfaces exist, but the knowledge engine, trust engine, and marketplace depth are still too thin."

## 3. Product Scorecard

| Category | Score | Why |
| --- | --- | --- |
| Brand clarity | 6/10 | LexIndia clearly sounds like an Indian legal platform, but the homepage still compresses three different products into one promise. |
| Value proposition | 6/10 | "Get legal help" is understandable, but the sharper wedge should be "understand your issue, take the right next step, then connect to the right lawyer." |
| Public user journey | 5/10 | Users can browse, search, and read guides, but there is no case-type intake, issue severity triage, or procedural action engine. |
| Lawyer onboarding readiness | 5/10 | Registration, pricing, profile editing, and subscriptions exist, but verification operations and self-service profile depth remain limited. |
| Consultation readiness | 5/10 | Booking, appointment creation, and payment verification exist, but the public "first consultation free" message conflicts with backend billing behavior. |
| Legal knowledge depth | 4/10 | Guides are the strongest surface, but the platform still lacks a structured Indian law database, section-level explainers, and procedural depth at scale. |
| Content usefulness | 6/10 | Guides are genuinely useful for top-of-funnel awareness, but rights pages and FAQs are still too shallow for repeated serious use. |
| SEO readiness | 6/10 | Metadata, sitemap, robots, and public content exist, but canonical domain mismatch, thin knowledge depth, and lack of programmatic issue-city coverage limit authority growth. |
| Marketplace readiness | 5/10 | Directory, profiles, booking, and subscriptions exist, but trust, supply density, reviews, lead routing, and payout maturity are not there yet. |
| Monetization readiness | 4/10 | The monetization model is visible, but pricing mismatch and weak demand proof make it operationally fragile. |
| UX clarity | 7/10 | The interface is clean, multilingual, and much more coherent than a rough MVP. The main issue is product overlap, not visual disorder. |
| Trust and credibility | 6/10 | Policy pages and verification messaging help, but seeded scale and placeholder templates create credibility drag. |
| Information architecture | 6/10 | The major surfaces exist, but `Knowledge`, `Guides`, and `Rights` still need a tighter hierarchy and clearer roles. |
| Authority perception | 5/10 | The site feels promising, not authoritative. Authority requires statute data, reviewed legal content depth, and wider lawyer supply. |
| Product scalability | 7/10 | The current stack can scale into a modular monolith, but the data model must be expanded before scale work is meaningful. |

### Scorecard interpretation
- LexIndia is no longer a blank-slate prototype.
- It is a real MVP with a credible base.
- The next jump is not cosmetic. It is structural:
  - stronger legal graph
  - stronger marketplace economics
  - stronger editorial workflow
  - stronger trust operations

## 4. User Journey Simulation

| User problem | Can they understand the law? | Can they find guidance? | Can they find a lawyer? | Missing steps |
| --- | --- | --- | --- | --- |
| Property dispute | Partially. Property guides exist, but mostly at overview level. | Partially. Good for entry-level understanding, weak for dispute workflow. | Yes. Property lawyers can be found. | No dispute triage, no title-check checklist, no mutation/registry workflow, no state-specific property procedure, no draft notice workflow. |
| Cyber crime | Partially. Some cyber reporting guidance exists. | Partially. Enough for awareness, not enough for incident response. | Yes, but supply is thin. | No urgency wizard, no evidence preservation flow, no complaint-status tracker, no police/bank/fraud reporting workflow. |
| Consumer complaint | Yes at a basic level. Guides and FAQs help. | Partially. Users can learn first steps. | Yes. | No complaint builder, no forum/jurisdiction logic, no draft complaint generator, no SLA timeline by issue type. |
| Divorce | Yes at a basic level. Guides explain major distinctions. | Partially. Users can get general orientation. | Yes. | No issue intake for mutual vs contested, no alimony/custody calculator, no document checklist, no court-process roadmap. |
| Criminal accusation | Partially. Arrest and bail guides help. | Partially. There is orientation, but not emergency-grade triage. | Yes. | No anticipatory-bail urgency flow, no police interaction checklist, no emergency connect workflow, no section-based accusation explainer. |

### Journey conclusion
For all five journey types, LexIndia is currently better at:
- first orientation
- basic lawyer discovery

It is weaker at:
- issue diagnosis
- procedural guidance
- operational next-step support
- document readiness
- escalation workflows

That is why the public-help pillar should drive the next 12 months.

## 5. Lawyer Experience Analysis

### Would lawyers realistically join?
Some will test it. Very few will commit serious attention yet.

### Why a lawyer might join today
- Public profile page exists
- Search directory exists
- Consultation booking exists
- Verification page gives some trust framing
- Subscription products and dashboard already exist

### Why a serious lawyer may hesitate
- Too little visible demand
  - Live production only shows four lawyers today
- Too little supply-side differentiation
  - Limited profile richness
  - Limited lead analytics
  - No meaningful conversion funnel reporting
- Pricing trust issue
  - Public pricing, dashboard pricing, and backend subscription pricing are inconsistent
- Verification operations are underspecified
  - No admin verification queue, document lifecycle, or dispute workflow is represented in the current schema
- Profile editing is still constrained
  - Specializations, languages, and consultation modes are still semi-manual
- No robust earnings system
  - No first-class payout ledger
  - No lawyer-side reconciliation, settlement, or dispute dashboard

### Lawyer visibility benefits today
- Moderate for SEO presence
- Low for actual lead volume
- Low for practice-management value

### Lead generation potential today
- Low to moderate
- Good enough for pilot onboarding
- Not yet good enough for sustained paid acquisition of lawyers

### Credibility building potential today
- Moderate
- The verification badge helps
- Multilingual platform positioning helps
- But authority is not yet strong enough to materially enhance a lawyer's brand

### Revenue opportunity today
- Early only
- There is a consultation/payment path, but the marketplace engine is not mature enough to make recurring lawyer revenue predictable

### Lawyer-side verdict
LexIndia is currently:
- interesting to early adopters
- not yet compelling to mainstream lawyers

It becomes compelling when LexIndia can reliably offer:
- issue-qualified leads
- verified user demand
- predictable consultation conversion
- strong public-content referrals
- clear lawyer ROI reporting

## 6. Legal Knowledge Gap Analysis

### What exists today
LexIndia already contains useful public-help content in these buckets:
- criminal law and bail guidance
- family and divorce guidance
- property dispute awareness
- consumer issue basics
- labour and employment basics
- cyber complaint awareness
- rights-oriented educational pages

This means LexIndia is not content-empty. It has the beginning of a useful awareness layer.

### What is missing structurally
The core problem is not only content volume. It is knowledge architecture.

Major gaps:
- No first-class Indian law graph
  - No structured `Act -> Chapter -> Section -> Explanation -> Procedure -> Related Guide` system
- No BNS, BNSS, Bharatiya Sakshya Adhiniyam, CPC, CrPC legacy crosswalk
  - Users cannot move from old IPC terms to new-code explanations cleanly
- No process-first legal workflows
  - FIR filing
  - anticipatory bail
  - domestic violence relief steps
  - consumer complaint filing
  - cheque bounce process
  - labour complaint escalation
- No state-specific overlays
  - property registration, police process, rent rules, stamp-duty context, and local authority routing vary by state
- No practical document layer
  - notices
  - complaints
  - affidavits
  - petition checklists
  - evidence preparation
- No law-student or judiciary-prep structure
  - act summaries
  - section notes
  - case-law references
  - exam-oriented topic clustering
- No editorial review workflow
  - no author, reviewer, lawyer review, legal update, or stale-content queue model

### Category-by-category gap view
| Legal category | Current state | Gap |
| --- | --- | --- |
| Criminal law | Basic guides exist | No statute graph, no charge/section mapping, no police-process flow, no emergency triage |
| FIR and police procedure | Awareness-level only | No stepwise FIR refusal flow, no zero-FIR explainer architecture, no police complaint escalation module |
| Bail process | Some orientation content | No regular vs anticipatory bail workflow engine, no section-linked bail guidance |
| Civil disputes | Fragmented | No procedural map for notice, filing, limitation, evidence, interim relief |
| Property law | Entry-level awareness | No mutation, title, registry, partition, possession, encroachment, RERA, or rent subclusters |
| Family law | Good introductory coverage | No custody, maintenance, DV, 125 CrPC-equivalent workflow, no court-process timeline |
| Consumer law | Basic awareness | No complaint builder, jurisdiction rules, filing timeline, evidence checklist |
| Cyber law | Thin but relevant | No digital evidence workflow, bank/freeze/escalation flow, cyber portal integration logic |
| Employment law | Introductory only | No wage, termination, harassment, gratuity, PF, labour authority escalation paths |
| Legal rights awareness | Broad but shallow | No citizen-segmented rights graph by women, tenants, employees, accused, senior citizens, students |

### Knowledge verdict
LexIndia has legal content, but not yet a legal knowledge system.

To become a serious Indian legal platform, it must move from:
- page collection

to:
- structured legal knowledge graph with reviewed explanations, procedures, examples, and lawyer handoff

## 7. Feature Gap Analysis

### Feature classification
| Feature | Status | Why |
| --- | --- | --- |
| Multilingual routing and locale structure | Strong | The product already routes by locale and presents a broad multilingual shell |
| Public lawyer directory | Strong | Lawyer listing pages and detail pages are live |
| Public lawyer profiles | Strong | Profiles include specialization, language, mode, experience, and fee basics |
| Basic payments and booking plumbing | Strong | Razorpay order creation and payment verification already exist |
| Guide library | Strong | There is a visible body of legal-help pages across multiple issue categories |
| Homepage entry points | Strong | Citizens and lawyers both have clear entry paths |
| Consultation booking UX | Weak | The booking path exists, but pricing and "first consultation free" messaging are inconsistent |
| Lawyer subscription monetization | Weak | Subscriptions exist, but public pricing, dashboard pricing, and API pricing are misaligned |
| FAQ knowledge surface | Weak | Seeded knowledge exists, but it is too shallow and taxonomy-light |
| Rights navigation | Weak | Rights pages exist, but they are not deep, segmented, or operationally useful |
| Templates module | Weak | The live templates are placeholder content rather than trustworthy legal-document products |
| AI legal assistant | Weak | Presentationally useful, but not yet grounded on a reviewed legal corpus |
| Lawyer dashboard | Weak | Early foundation exists, but analytics, lead reporting, and earnings systems are thin |
| Reviews and social proof loop | Weak | Not yet strong enough to materially influence marketplace trust |
| Search system | Missing | No cross-entity legal and lawyer search engine with facets and ranking |
| Legal act and section database | Missing | No statute-first database for Indian laws and sections |
| Citizen issue intake wizard | Missing | No structured triage for urgency, location, facts, documents, and next steps |
| Lead routing engine | Missing | No intake-to-lawyer matching or qualification flow |
| Editorial CMS workflow | Missing | Legal content is not managed through a formal review pipeline |
| Verification operations console | Missing | No first-class admin queue for lawyer document review and approval |
| Availability engine | Missing | No real supply-side slot management model |
| Payout and settlement ledger | Missing | No operational earnings and payout reconciliation layer |
| Programmatic SEO landing pages | Missing | No scalable issue x city x lawyer and law x section public page engine |
| Content freshness monitoring | Missing | No stale-content and legal-update review system |

### Product gap summary
LexIndia already proves that the marketable surface exists:
- multilingual legal-help UX
- lawyer discovery
- payments
- starter content

The missing layer is the operating layer:
- structured intake
- structured law database
- structured supply management
- structured editorial review
- structured trust and reconciliation

## 8. System Architecture Design

### Recommended architecture principle
Do not jump into microservices. LexIndia should evolve into a modular monolith first.

Why:
- the current stack is already `Next.js + Prisma + PostgreSQL`
- product complexity is still domain complexity, not traffic complexity
- consistency matters more than service isolation at this stage
- editorial, marketplace, knowledge, and payments need shared transactions and shared auth

### Ideal v2 architecture

#### Frontend layer
- `Next.js App Router`
- Server Components for SEO-heavy public pages
- Client Components for search, intake wizard, booking, dashboard, chat-like AI interfaces
- Locale-aware routing for English and Hindi first
- Design system with reusable legal-content components and marketplace cards

#### Backend layer
- `Next.js` route handlers as BFF plus internal service modules
- Domain modules inside the monolith:
  - auth and identity
  - public-help and intake
  - lawyer marketplace
  - bookings and consultations
  - payments and payouts
  - legal knowledge and law graph
  - editorial review
  - search indexing
  - AI gateway
  - admin and trust operations

#### Database layer
- `PostgreSQL` as source of truth for:
  - users
  - lawyers
  - bookings
  - payments
  - reviews
  - issue intake
  - legal taxonomy
  - law graph metadata
  - moderation and verification state

#### Search layer
- `OpenSearch`
- Separate indexed document types:
  - lawyers
  - guides
  - FAQs
  - acts
  - sections
  - templates
  - issue hubs

#### Cache and queue layer
- `Redis`
- Use cases:
  - rate limiting
  - cached search aggregates
  - booking locks
  - notification queues
  - content reindex jobs
  - AI request throttling

#### Content management layer
- `Sanity` as headless CMS for:
  - guides
  - articles
  - FAQs
  - rights pages
  - templates
  - law explainers
- Content publish flow should write publish metadata into PostgreSQL and trigger search index sync

#### File and document storage
- `S3` or `Cloudflare R2`
- Store:
  - lawyer verification docs
  - template files
  - consultation attachments
  - editorial assets

#### Integrations
- `Razorpay` for payments
- `Resend` or `Postmark` for email
- `Twilio` or an Indian SMS/WhatsApp provider later for reminders
- `Jitsi` or equivalent for video consults
- `PostHog` plus `GA4` for analytics

#### AI layer
- Server-side AI gateway only
- Retrieval grounded on approved acts, sections, guides, FAQs, and templates
- AI outputs should support:
  - public Q and A
  - issue summarization
  - checklist generation
  - lawyer handoff
  - editor draft assist
- AI should not publish content directly

### Architecture flow
```text
User Web App
    |
    v
Next.js App Router + BFF
    |
    +--> Auth and Identity Module
    +--> Public Help and Intake Module
    +--> Lawyer Marketplace Module
    +--> Booking and Payment Module
    +--> Legal Knowledge Module
    +--> Editorial Review Module
    +--> AI Gateway Module
    +--> Admin and Trust Module
    |
    +--> PostgreSQL
    +--> Redis
    +--> OpenSearch
    +--> Sanity
    +--> S3/R2
    +--> Razorpay / Email / Analytics providers
```

### Why this architecture fits LexIndia
- Public-help pages stay fast and indexable
- Marketplace and bookings remain transactional
- Knowledge corpus becomes structured and searchable
- Editorial workflow is separated from code deploys
- AI is constrained by reviewed content instead of free-form hallucination
- The company can ship fast without prematurely splitting systems

## 9. Database Schema Design

### Schema design principles
- Keep transactional truth in PostgreSQL
- Separate public listing data from operational marketplace state
- Model legal knowledge as a graph, not as flat blog posts
- Attach review and moderation state to anything that affects trust
- Preserve multilingual support at the data model level

### Core and extended tables
| Table | Purpose | Key fields | Relationships |
| --- | --- | --- | --- |
| `users` | Identity for citizens, lawyers, editors, admins | `id`, `email`, `phone`, `name`, `role`, `locale`, `status`, `created_at` | One-to-one with `lawyers` for lawyer accounts; one-to-many with `bookings`, `consultations`, `reviews`, `issue_intakes` |
| `lawyers` | Operational supply-side record | `id`, `user_id`, `bar_council_id`, `verification_status`, `subscription_plan_id`, `years_experience`, `avg_rating`, `response_time_minutes`, `is_listed`, `created_at` | Belongs to `users`; one-to-one with `lawyer_profiles`; one-to-many with `availability_slots`, `bookings`, `consultations`, `reviews`, `payouts`, `lawyer_verification_cases` |
| `lawyer_profiles` | Public-facing profile data | `id`, `lawyer_id`, `slug`, `headline`, `bio`, `city`, `state`, `court_levels`, `consultation_modes`, `languages`, `practice_areas`, `fees_json`, `seo_title`, `seo_description` | Belongs to `lawyers`; used by search documents and public listing pages |
| `legal_categories` | Content and law taxonomy | `id`, `name`, `slug`, `parent_id`, `category_type`, `locale`, `sort_order` | Self-referential tree; linked to `legal_articles`, `legal_guides`, `legal_faqs`, `issue_types`, `legal_acts` |
| `legal_articles` | Long-form explainers and awareness content | `id`, `title`, `slug`, `summary`, `body`, `locale`, `status`, `author_id`, `reviewed_by`, `published_at`, `category_id` | Belongs to `legal_categories`; review tracked in `content_review_logs` |
| `legal_guides` | Step-by-step public-help content | `id`, `title`, `slug`, `intro`, `eligibility`, `steps_json`, `documents_json`, `authority_json`, `faq_json`, `locale`, `status`, `category_id`, `issue_type_id` | Belongs to `legal_categories` and optional `issue_types`; linked to `search_documents` |
| `legal_faqs` | Reusable FAQ answers | `id`, `question`, `answer`, `locale`, `status`, `category_id`, `issue_type_id`, `published_at` | Belongs to `legal_categories` and optional `issue_types` |
| `legal_acts` | Registry of Indian acts and codes | `id`, `name`, `short_name`, `slug`, `jurisdiction`, `act_year`, `act_type`, `status`, `replaced_by_act_id` | One-to-many with `act_versions`; one-to-many with `law_sections`; self-reference for replaced acts |
| `law_sections` | Section-level legal knowledge node | `id`, `act_id`, `act_version_id`, `section_number`, `section_slug`, `heading`, `bare_text`, `plain_english_explanation`, `plain_hindi_explanation`, `ingredients_json`, `punishment_summary`, `procedure_notes`, `status` | Belongs to `legal_acts` and `act_versions`; one-to-many with `section_aliases`; linked to `issue_types` through join tables if needed |
| `bookings` | Commercial reservation object before or around consult delivery | `id`, `user_id`, `lawyer_id`, `issue_type_id`, `scheduled_at`, `consultation_mode`, `status`, `fee_amount`, `discount_amount`, `payment_status`, `payment_order_id`, `source` | Belongs to `users`, `lawyers`, optional `issue_types`; one-to-one or one-to-many with `consultations` |
| `consultations` | Service-delivery record | `id`, `booking_id`, `user_id`, `lawyer_id`, `status`, `session_notes`, `follow_up_required`, `completed_at`, `room_url` | Belongs to `bookings`, `users`, `lawyers`; can spawn `reviews` |
| `reviews` | Trust and quality feedback | `id`, `user_id`, `lawyer_id`, `consultation_id`, `rating`, `review_text`, `status`, `published_at` | Belongs to `users`, `lawyers`, and `consultations`; only verified consults should generate eligible reviews |
| `act_versions` | Versioning for amended or replaced statutes | `id`, `act_id`, `version_label`, `effective_from`, `effective_to`, `source_url`, `notes`, `status` | Belongs to `legal_acts`; one-to-many with `law_sections` |
| `section_aliases` | Alternate references and legacy mappings | `id`, `law_section_id`, `alias_text`, `alias_type`, `locale`, `source_note` | Belongs to `law_sections`; supports IPC-to-BNS and multilingual lookup |
| `issue_types` | Normalized legal problem taxonomy | `id`, `name`, `slug`, `domain_category_id`, `urgency_level`, `default_cta`, `default_checklist_json` | Belongs to `legal_categories`; linked to guides, FAQs, intakes, leads, bookings |
| `issue_intakes` | Citizen diagnostic input | `id`, `user_id`, `issue_type_id`, `city`, `state`, `language`, `urgency_score`, `facts_json`, `documents_json`, `recommended_next_steps_json`, `match_status`, `created_at` | Belongs to `users` and `issue_types`; one-to-many with `leads` |
| `leads` | Qualified marketplace demand unit | `id`, `issue_intake_id`, `lawyer_id`, `lead_status`, `assigned_at`, `accepted_at`, `rejected_reason`, `quoted_fee` | Belongs to `issue_intakes` and `lawyers`; may convert into `bookings` |
| `lawyer_verification_cases` | Review workflow for lawyer trust | `id`, `lawyer_id`, `case_status`, `submitted_at`, `reviewed_at`, `reviewed_by`, `risk_flags_json`, `notes` | Belongs to `lawyers`; can reference document storage rows if modeled separately |
| `availability_slots` | Structured supply scheduling | `id`, `lawyer_id`, `start_at`, `end_at`, `mode`, `slot_status`, `hold_token`, `timezone` | Belongs to `lawyers`; may be linked to `bookings` when reserved |
| `marketplace_plans` | Subscription and listing plans | `id`, `name`, `slug`, `monthly_price`, `annual_price`, `benefits_json`, `lead_cap`, `priority_boost`, `status` | Referenced by `lawyers.subscription_plan_id` |
| `payouts` | Settlement ledger for lawyer earnings | `id`, `lawyer_id`, `booking_id`, `gross_amount`, `platform_fee`, `tax_amount`, `net_amount`, `payout_status`, `settled_at`, `external_reference` | Belongs to `lawyers` and optional `bookings` |
| `search_documents` | Search index staging metadata | `id`, `entity_type`, `entity_id`, `locale`, `title`, `excerpt`, `keywords_json`, `search_status`, `indexed_at` | Mirrors searchable entities such as lawyers, guides, FAQs, acts, sections |
| `content_review_logs` | Editorial and legal review audit trail | `id`, `entity_type`, `entity_id`, `action`, `actor_id`, `notes`, `created_at` | Belongs to reviewable content and users |

### Recommended supporting enums and states
- `user.role`: citizen, lawyer, editor, admin, support
- `lawyers.verification_status`: draft, submitted, under_review, approved, rejected, suspended
- `bookings.status`: pending, awaiting_payment, confirmed, cancelled, completed, refunded, disputed
- `consultations.status`: scheduled, in_progress, completed, no_show, follow_up_required
- `content.status`: draft, in_review, lawyer_reviewed, approved, published, archived
- `leads.lead_status`: new, routed, viewed, accepted, rejected, expired, converted

### Schema verdict
This schema turns LexIndia from:
- directory plus blog

into:
- legal-help operating system plus law graph plus trusted marketplace

## 10. API Structure

### API design principles
- Version all APIs with `/api/v1`
- Separate public read APIs from authenticated citizen, lawyer, editor, and admin APIs
- Keep write paths transactional and idempotent where payments are involved
- Return structured objects that can serve both web UI and future mobile apps

### Public discovery APIs
| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/lawyers` | Search lawyers by city, language, practice area, mode, price, rating, and verification |
| `GET /api/v1/lawyers/{slug}` | Fetch a full lawyer public profile |
| `GET /api/v1/legal-guides` | List public guides with filters by issue, category, locale, and popularity |
| `GET /api/v1/legal-guides/{slug}` | Fetch one guide page |
| `GET /api/v1/legal-articles` | List explainers and awareness articles |
| `GET /api/v1/legal-articles/{slug}` | Fetch one article |
| `GET /api/v1/legal-faqs` | Search FAQs by category and issue type |
| `GET /api/v1/legal-acts` | List acts and codes such as BNS, BNSS, Consumer Protection Act |
| `GET /api/v1/legal-acts/{actSlug}` | Fetch act detail and metadata |
| `GET /api/v1/legal-acts/{actSlug}/sections` | List sections for a given act |
| `GET /api/v1/legal-acts/{actSlug}/sections/{sectionSlug}` | Fetch one section with explanations, punishment, and related guides |
| `GET /api/v1/search` | Cross-entity search across lawyers, guides, FAQs, acts, and sections |

### Citizen intake and matching APIs
| Endpoint | Purpose |
| --- | --- |
| `POST /api/v1/intakes` | Create a structured issue intake |
| `GET /api/v1/intakes/{id}` | Retrieve a citizen intake with recommended next steps |
| `POST /api/v1/intakes/{id}/lead` | Convert an intake into a lead request |
| `POST /api/v1/intakes/{id}/match` | Run lawyer matching and return ranked recommendations |

### Booking and consultation APIs
| Endpoint | Purpose |
| --- | --- |
| `POST /api/v1/bookings` | Create a booking draft from lawyer plus issue selection |
| `POST /api/v1/bookings/{id}/payment-order` | Create a Razorpay order for the booking |
| `POST /api/v1/payments/webhooks/razorpay` | Receive verified payment events |
| `GET /api/v1/users/me/bookings` | Citizen booking history |
| `GET /api/v1/lawyers/me/bookings` | Lawyer booking queue |
| `PATCH /api/v1/bookings/{id}` | Cancel, reschedule, confirm, or refund subject to policy |
| `POST /api/v1/consultations/{id}/notes` | Add lawyer notes and follow-up items |
| `POST /api/v1/consultations/{id}/messages` | Add secure consultation messages or attachments |
| `POST /api/v1/reviews` | Submit a review for a completed, verified consultation |

### Lawyer onboarding and marketplace APIs
| Endpoint | Purpose |
| --- | --- |
| `POST /api/v1/lawyers/apply` | Start lawyer onboarding |
| `PATCH /api/v1/lawyers/me/profile` | Update profile, fees, practice areas, and language data |
| `POST /api/v1/lawyers/me/documents` | Upload bar registration and verification documents |
| `POST /api/v1/lawyers/me/availability` | Create or update availability slots |
| `GET /api/v1/lawyers/me/analytics` | Return views, leads, bookings, conversion, and revenue |
| `POST /api/v1/lawyers/me/subscription` | Start or update a marketplace plan |

### Editorial and admin APIs
| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/admin/verification-cases` | Review queue for lawyer verification |
| `PATCH /api/v1/admin/verification-cases/{id}` | Approve, reject, or request resubmission |
| `GET /api/v1/admin/content/review-queue` | Editorial content queue |
| `PATCH /api/v1/admin/content/{type}/{id}` | Publish, archive, or send back content |
| `POST /api/v1/admin/search/reindex` | Trigger search reindex jobs |

### AI-assisted APIs
| Endpoint | Purpose |
| --- | --- |
| `POST /api/v1/ai/legal-question` | Answer a legal question with grounded citations and disclaimers |
| `POST /api/v1/ai/intake-draft` | Convert free-form citizen text into structured intake data |
| `POST /api/v1/ai/lawyer-match` | Explain lawyer-match reasoning using issue, city, language, and urgency |
| `POST /api/v1/ai/document-assist` | Help generate first drafts or checklists for supported document types |

### API access model
- Public read: anonymous
- Citizen write: authenticated user
- Lawyer write: authenticated lawyer role
- Editorial write: editor role
- Admin write: admin role
- AI write: authenticated or rate-limited anonymous depending on surface

## 11. Law Knowledge Database Model

### Target legal information structure
```text
Legal Domain
    |
    +-- Act or Code
            |
            +-- Act Version
                    |
                    +-- Chapter or Part
                            |
                            +-- Section
                                    |
                                    +-- Bare Text
                                    +-- Plain-Language Explanation
                                    +-- Ingredients or Conditions
                                    +-- Punishment or Consequence
                                    +-- Procedure and Practical Use
                                    +-- Examples
                                    +-- Related Guides
                                    +-- Related Lawyers
```

### How IPC, BNS, BNSS, and other laws should be stored
- `legal_acts`
  - one record per act or code
  - examples: IPC, BNS, BNSS, Consumer Protection Act, Transfer of Property Act
- `act_versions`
  - preserves history when a law is amended, replaced, or repealed
- `law_sections`
  - one record per section under a specific act version
- `section_aliases`
  - stores alternate references such as:
    - "IPC 420"
    - "BNS cheating"
    - Hindi alias
    - common search phrase

### Section record content model
Each section should store:
- formal section number
- heading
- official bare text
- plain English explanation
- plain Hindi explanation
- ingredients or legal elements
- punishment summary
- bailable or non-bailable metadata where relevant
- cognizable metadata where relevant
- court or procedure notes where relevant
- common real-life examples
- related issue types
- related guides
- last reviewed date
- reviewed by lawyer or editor

### Case example strategy
Do not start with full case-law research at scale. Start with:
- simplified practical examples
- common misuse or misunderstanding notes
- when to consult a lawyer
- landmark-case references only for high-value pages

Later, add:
- curated case-law summaries
- judicial interpretation notes
- exam-oriented notes for students

### Publication workflow for law content
1. Source official text from gazette or trusted official publication.
2. Create or update act version record.
3. Generate draft section explainer.
4. Review by editor and lawyer reviewer.
5. Publish to public routes and search index.
6. Re-review when the law changes or freshness SLA expires.

### Why this model matters
Without a law graph, LexIndia cannot become:
- a trustworthy Indian legal knowledge platform
- a high-quality legal search destination
- a strong AI-grounded legal assistant
- an authority asset that compounds over time

## 12. Lawyer Marketplace Design

### Marketplace objective
The marketplace should not behave like a generic lead directory.

It should behave like:
- issue-qualified discovery
- trusted booking
- measurable lawyer ROI

### Citizen flow
1. User lands on an issue page, guide, search page, or AI assistant.
2. User selects issue type, city, language, urgency, and consultation preference.
3. LexIndia shows:
   - immediate next steps
   - authority contact recommendations where relevant
   - document checklist
   - ranked lawyers
4. User compares lawyer profiles with verified badges, experience, fees, modes, languages, and reviews.
5. User books a slot or requests callback.
6. After consultation, user gets follow-up notes and review prompt.

### Lawyer flow
1. Lawyer applies and creates account.
2. Lawyer submits bar registration and supporting verification documents.
3. Admin reviews verification case.
4. Approved lawyer completes public profile, fees, availability, and issue preferences.
5. Lawyer receives matched leads and bookings.
6. Lawyer tracks views, leads, conversion, revenue, reviews, and payouts.

### Required marketplace modules
- Profile and listing module
- Verification and trust module
- Availability and scheduling module
- Lead routing and matching module
- Booking and payment module
- Review and dispute module
- Subscription and ranking module
- Payout and settlement module

### Lawyer ranking model
Recommended ranking inputs:
- issue-type fit
- location fit
- language fit
- verification status
- response speed
- review quality
- consultation completion rate
- pricing reasonableness
- subscription boost within policy limits

### Marketplace trust rules
- Only approved lawyers should be publicly listed.
- Only completed and verified consultations should create public review eligibility.
- Badges must have a real operational state machine behind them.
- Complaint and report-a-lawyer workflows must exist before marketplace scale.
- Profiles should clearly distinguish:
  - verified lawyer
  - profile completeness
  - consultation modes
  - fee transparency

### Indian regulatory note
Because Indian legal advertising norms are sensitive, LexIndia should frame lawyer pages as:
- verified professional listings
- expertise and service discovery
- consultation facilitation

It should avoid:
- exaggerated promotional claims
- misleading comparative superlatives
- fake scarcity or fake badges

## 13. Legal Content Architecture

### Scalable knowledge tree
```text
Legal Knowledge
    |
    +-- Criminal Law
    +-- Family Law
    +-- Property Law
    +-- Consumer Law
    +-- Cyber Law
    +-- Labour and Employment
    +-- Civil Procedure
    +-- Police and FIR
    +-- Rights and Welfare
    +-- Company and Startup Law
    +-- Tax and Compliance
    +-- Law Student Resources
    +-- Judiciary Preparation
```

### Content types
- Guides
- Articles
- Rights pages
- Acts and sections
- FAQs
- Templates
- Glossary pages
- City and issue landing pages

### Scaling structure
For each legal domain, LexIndia should build this content stack:
- Domain hub
- Issue pages
- Procedure pages
- Act and section pages
- FAQs
- Templates and notice pages
- Lawyer conversion pages

Example for cyber law:
- `/guides/cyber-law`
- `/guides/what-to-do-after-cyber-fraud`
- `/guides/how-to-report-cyber-crime-in-india`
- `/laws/information-technology-act`
- `/laws/bns/section-...`
- `/templates/cyber-fraud-complaint`
- `/lawyers/bengaluru/cyber-law`

### Multilingual scaling
- Stage 1
  - English and Hindi
- Stage 2
  - Bengali, Marathi, Tamil, Telugu
- Stage 3
  - Expand according to search demand and lawyer supply concentration

### Editorial scaling rules
- One canonical source page per topic per locale
- Reusable FAQ blocks
- Reusable checklist blocks
- Reusable authority-contact blocks
- Reusable act and section references
- Mandatory freshness review on volatile legal topics

## 14. SEO Traffic Strategy

### SEO thesis
LexIndia should win traffic through issue-led and question-led legal search, not through vague brand pages.

Primary SEO clusters:
- problem-led
- question-led
- act-led
- section-led
- city-led lawyer discovery
- rights-led awareness

### High-value content clusters
- "How to file an FIR in India"
- "What to do after cyber fraud"
- "Consumer complaint against online shopping fraud"
- "Mutual consent divorce process in India"
- "What to do if police refuse to register FIR"
- "Tenant rights in Delhi"
- "Cheque bounce case process"
- "BNS section for criminal intimidation"
- "Anticipatory bail process in India"
- "How to recover salary from employer in India"

### SEO URL architecture
- `/guides/criminal-law`
- `/guides/how-to-file-fir`
- `/guides/anticipatory-bail-process`
- `/rights/women`
- `/rights/tenants`
- `/laws/bns`
- `/laws/bns/section-351`
- `/laws/bnss`
- `/lawyers/delhi/property-law`
- `/lawyers/mumbai/divorce-lawyer`

### On-page SEO requirements
- Unique title and meta description for every public page
- Canonical tags from one normalized production host
- Breadcrumb schema
- FAQ schema for FAQ-heavy pages
- HowTo schema for procedure pages
- LegalService and Person schema for lawyer pages
- Article or DefinedTerm schema for guide and section pages

### Content flywheel
1. Publish issue and procedure content.
2. Capture question-based search.
3. Convert traffic into intake and lawyer discovery.
4. Learn which issues convert.
5. Expand into city and law-section pages.
6. Feed search and AI with reviewed content.

### Immediate SEO fixes
- Normalize the production base URL and canonical system.
- Remove `lexindia.in` assumptions unless that domain is actually live.
- Do not mass-generate city pages before ranking and filter quality improve.
- Replace placeholder templates because thin or misleading pages damage trust and crawl quality.

## 15. AI Implementation Tasks for Antigravity IDE

### Foundation and Trust
| Task Title | Priority | Description | Component | Expected Output |
| --- | --- | --- | --- | --- |
| Normalize canonical domain config | P0 | Replace hardcoded `lexindia.in` assumptions with a single environment-driven production URL source | Platform foundation | Shared canonical/base URL config used by metadata, sitemap, robots, and structured data |
| Fix pricing source of truth | P0 | Unify subscription pricing across public pricing page, dashboard, and billing API | Marketplace billing | One shared pricing config and no user-visible mismatch |
| Fix booking fee messaging | P0 | Remove or correctly implement the "first consultation free" promise in the booking funnel | Booking funnel | Booking UI and payment logic are consistent |
| Replace placeholder template trust signals | P0 | Remove fake or placeholder template value cues until real template assets exist | Public content | Templates no longer overstate completeness or legal reliability |
| Add lawyer verification state machine | P0 | Model lawyer verification lifecycle with submission, review, approval, rejection, suspension, and resubmission states | Trust and verification | Persistent state machine across schema and service layer |
| Build verification case admin queue | P0 | Create admin interfaces and APIs for reviewing lawyer verification submissions | Admin trust console | Review queue for verification decisions |
| Add verification document model | P0 | Create a structured model for uploaded verification docs, review notes, and validation outcomes | Trust and storage | Verification docs tracked with auditability |
| Create trust incident reporting workflow | P1 | Add report-a-lawyer submission, triage, and enforcement path | Trust and support | Trust incident intake and profile-flag workflow |

### Marketplace Core
| Task Title | Priority | Description | Component | Expected Output |
| --- | --- | --- | --- | --- |
| Create `lawyers` operational model | P0 | Separate marketplace supply state from public profile presentation | Marketplace data model | New lawyer entity and service layer with operational status |
| Add availability slot inventory | P0 | Support real slot creation, locking, and booking conversion | Scheduling | Bookable availability inventory |
| Build lawyer availability editor | P1 | Let lawyers manage hours, blackout windows, and consultation modes | Lawyer dashboard | Self-service availability management UI |
| Create lead model and intake-to-lead flow | P0 | Convert structured issue intake into routable marketplace leads | Marketplace matching | Lead objects linked to intakes and lawyers |
| Build lawyer match ranking service | P1 | Rank lawyers using issue, language, location, verification, fee, and responsiveness | Marketplace discovery | Explainable ranking service |
| Split booking from consultation session | P1 | Separate commerce lifecycle from service-delivery lifecycle | Booking architecture | Cleaner status transitions and reporting |
| Add payout ledger | P1 | Track gross, fees, taxes, net payable, settlement, and disputes | Earnings and finance | Reliable payout ledger |
| Build lawyer analytics endpoint | P1 | Expose views, leads, bookings, conversion, revenue, and ratings for lawyers | Lawyer dashboard | Marketplace analytics API |

### Public Help and Intake
| Task Title | Priority | Description | Component | Expected Output |
| --- | --- | --- | --- | --- |
| Build citizen issue intake wizard | P0 | Create a guided issue-diagnosis flow for issue type, urgency, city, language, and facts | Public-help UX | Structured intake experience |
| Add urgency rules by issue type | P1 | Implement emergency logic for arrest, domestic violence, cyber fraud, and police refusal scenarios | Public-help rules engine | Priority banners and faster escalation paths |
| Generate issue-specific next-step checklists | P1 | Produce reusable next-step outputs from issue rules and guide content | Public-help engine | Checklist cards tailored to issue types |
| Add authority and contact recommendation service | P1 | Recommend police, cyber portal, NALSA, labour office, consumer forum, or court resources by issue type | Public-help engine | Contextual authority recommendations |
| Add document checklist service | P1 | Map issue types to likely document requirements and evidence preparation hints | Public-help engine | Document readiness module |
| Add issue-to-lawyer CTA mapping | P1 | Tailor lawyer CTA copy and match criteria by issue type and urgency | Conversion layer | Higher-intent lawyer handoff modules |

### Knowledge Engine and Law Graph
| Task Title | Priority | Description | Component | Expected Output |
| --- | --- | --- | --- | --- |
| Introduce `legal_acts` model | P0 | Create an act registry for BNS, BNSS, Consumer Protection Act, and other laws | Knowledge data model | First-class act entities |
| Introduce `act_versions` model | P1 | Support amendments, replacements, and future law changes | Knowledge data model | Versioned statute history |
| Introduce `law_sections` model | P0 | Store section number, heading, bare text, explanation, and punishment data | Knowledge data model | Section graph with public-read capability |
| Introduce `section_aliases` model | P1 | Add multilingual aliases and IPC-to-BNS or old-to-new code mapping | Knowledge search | Better legal lookup and migration handling |
| Create `issue_types` taxonomy | P0 | Normalize legal problems used across content, intake, matching, and analytics | Knowledge and marketplace core | Shared issue taxonomy |
| Create `legal_guides` CMS-backed model | P0 | Move guide content from hardcoded data toward managed entities | Editorial platform | Guides stored as publishable records |
| Create `legal_articles` CMS-backed model | P1 | Support explainers, glossary pages, awareness pages, and updates | Editorial platform | Flexible article model |
| Create `legal_faqs` CMS-backed model | P1 | Replace thin seeded FAQ storage with scalable managed content | Editorial platform | Searchable FAQ corpus |
| Add content review logs | P1 | Track author, editor, lawyer reviewer, and publish actions | Editorial workflow | Auditable content history |
| Build law graph sync pipeline | P1 | Push approved acts, sections, and legal pages into search and AI grounding stores | Knowledge platform | Publish-to-index automation |

### Content and Templates
| Task Title | Priority | Description | Component | Expected Output |
| --- | --- | --- | --- | --- |
| Migrate guides into Sanity | P0 | Move guide content from code files into editorial CMS | Editorial CMS | Editable guide collection |
| Create rights detail page schema | P1 | Replace generic rights pages with structured modules for scope, remedies, authorities, and FAQs | Rights content | Rich rights-page model |
| Build template content model | P1 | Store real template metadata, versioning, disclaimers, and downloadable assets | Templates platform | Trustworthy template records |
| Add template preview pages | P1 | Show disclaimers, preview scope, eligibility, and related guide links before download | Templates UX | High-trust template detail pages |
| Add multilingual content fallback policy | P1 | Define English source, Hindi priority, and fallback behavior across content entities | Editorial platform | Predictable multilingual rendering |
| Add law student and judiciary taxonomy | P2 | Prepare optional academic content buckets such as notes, summaries, and exam prep | Knowledge taxonomy | Expandable academic taxonomy |

### Search and SEO
| Task Title | Priority | Description | Component | Expected Output |
| --- | --- | --- | --- | --- |
| Add OpenSearch indexer | P1 | Index lawyers, guides, FAQs, acts, sections, and templates into a unified search layer | Search platform | Search indexing pipeline |
| Build cross-entity search API | P1 | Return mixed results with facets, filters, and ranking | Search API | `/api/v1/search` endpoint |
| Add city x issue landing page generator | P1 | Generate pages such as `/lawyers/delhi/property-law` with filter-backed data | SEO growth | Scalable marketplace landing pages |
| Add act and section public routes | P0 | Publish indexable public pages for acts and sections with structured data | Knowledge SEO | Searchable statute pages |
| Add issue-hub pages | P1 | Build public hubs for criminal, family, property, consumer, cyber, and labour topics | SEO architecture | Hub-and-spoke legal information layer |
| Add structured data coverage | P1 | Expand schema markup for guides, lawyers, FAQs, acts, sections, and breadcrumbs | SEO foundation | Stronger SERP eligibility |

### AI and Automation
| Task Title | Priority | Description | Component | Expected Output |
| --- | --- | --- | --- | --- |
| Build AI gateway service layer | P0 | Centralize provider abstraction, prompts, safety guards, logging, and fallbacks | AI platform | Reusable AI orchestration layer |
| Ground AI on approved corpus | P0 | Restrict AI responses to reviewed guides, FAQs, acts, and sections with citations | AI safety | Safer answer generation with source references |
| Add AI-to-intake conversion | P1 | Turn AI chat outputs into structured intake and lawyer handoff flows | AI conversion | AI conversations that feed marketplace funnels |
| Add AI draft assist for legal content | P2 | Provide editor-facing draft generation with mandatory human review | Editorial AI tooling | Faster content drafting workflow |

### Analytics, Ops, and Reliability
| Task Title | Priority | Description | Component | Expected Output |
| --- | --- | --- | --- | --- |
| Add PostHog event taxonomy | P1 | Track search, intake, profile view, booking, payment, review, and drop-off events | Product analytics | Unified event model |
| Add revenue reconciliation jobs | P1 | Reconcile Razorpay payments, booking states, refunds, and payouts daily | Finance ops | Automated payment reconciliation |
| Add Redis rate limits across sensitive APIs | P1 | Extend rate limiting beyond current endpoints to booking, auth, AI, and search surfaces | Reliability and abuse prevention | Consistent API protection |
| Add background queue for notifications and indexing | P1 | Offload email, search indexing, reminder, and AI jobs into async workers | Platform infrastructure | Queue-backed job processing |
| Add admin dashboard for marketplace health | P2 | Show supply, demand, conversion, verification backlog, and content backlog metrics | Internal ops | Operational admin dashboard |
| Add content freshness monitoring | P2 | Flag guides, rights pages, and section pages for re-review based on freshness rules | Editorial ops | Stale-content review queue |

## 16. Product Roadmap

### Phase 1: Critical fixes and trust alignment
Focus:
- normalize base URL and canonical logic
- fix pricing source of truth
- fix booking fee mismatch
- create lawyer verification state machine
- build verification review queue
- clean up placeholder template trust issues

Exit criteria:
- no pricing mismatch
- no booking promise mismatch
- verification workflow is operational
- trust-critical public pages are accurate

### Phase 2: Core public-help build
Focus:
- issue intake wizard
- issue taxonomy
- urgency rules
- next-step checklist engine
- authority recommendations
- document checklists
- stronger rights detail pages

Exit criteria:
- top issue types each have:
  - guide
  - checklist
  - issue intake
  - lawyer handoff path

### Phase 3: Lawyer marketplace maturity
Focus:
- first-class `lawyers` model
- availability slots
- lead routing
- ranking service
- payout ledger
- lawyer analytics

Exit criteria:
- measurable lead-to-booking funnel
- lawyer dashboards show real ROI metrics
- marketplace economics can be evaluated by cohort

### Phase 4: Legal knowledge platform
Focus:
- acts and sections database
- guide migration to CMS
- FAQ migration
- review logs
- law graph indexing
- public act and section pages

Exit criteria:
- LexIndia becomes a structured legal knowledge destination, not just a guide collection

### Phase 5: Traffic growth and monetization scale
Focus:
- unified search
- issue hubs
- act and section SEO growth
- city x issue landing pages
- grounded AI answers
- analytics and internal ops dashboards
- hybrid monetization optimization

Exit criteria:
- SEO growth tied to conversion
- higher lawyer retention from visible ROI
- stable hybrid revenue through consultations, subscriptions, and premium placement

## 17. Final Strategic Verdict

### What LexIndia currently is
LexIndia is currently:
- a promising multilingual legal-help MVP
- an early lawyer marketplace
- a public-content platform with real utility
- a booking and billing flow that is partially real but still inconsistent in key trust areas
- a knowledge layer that is helpful but not yet structured enough to create defensible authority

### What LexIndia should become
LexIndia should become:

**India's issue-first legal operating layer for citizens and lawyers**

That means:
- citizens come to understand the problem
- learn rights and urgency
- see the next procedural steps
- gather documents
- connect to the right lawyer

At the same time:
- lawyers use LexIndia to acquire qualified demand
- prove credibility
- convert consultations
- build trusted digital presence

And underneath both:
- LexIndia builds a durable Indian legal knowledge graph that compounds in search, trust, and AI quality

### How LexIndia can become a major legal platform in India
1. Use public-help as the wedge, not a generic lawyer directory.
2. Build issue intake and law graph before trying to scale supply aggressively.
3. Convert content into a reviewed legal knowledge system, not a loose blog.
4. Make trust operational through verification, reviews, payouts, and incident workflows.
5. Build SEO around legal problems, procedures, laws, sections, and cities.
6. Use AI as an accelerator and routing layer, not as unsupervised legal truth.

### Founder-level recommendations
- Do not position LexIndia as just another lawyer marketplace.
- Position it as: understand the issue, know your rights, take the next step, connect to the right lawyer.
- Protect trust aggressively. In legal-tech, one trust failure destroys three growth loops at once.
- Build the law graph early because it becomes the base layer for SEO, AI, navigation, and long-term authority.
- Treat lawyers as a marketplace-side product, not just a profile upload form.
- Make the first 12 months content-led and intake-led, with lawyer monetization layered on top of genuine user outcomes.

### Strategic conclusion
LexIndia is currently a promising multilingual legal-help MVP. It should evolve into a public-help-first Indian legal platform with a strong law graph, a trusted lawyer marketplace, and a reviewed legal knowledge engine. If it executes in that order, it can become a serious national legal platform rather than a thin directory with content around it.
