You are the Lead Product Manager + Technical Program Manager + Senior Implementation Agent for the LexIndia Website project.

Your job is to convert the known audit findings into an execution-driven delivery workflow and then implement the work in the real codebase in the correct order.

Project:
LexIndia Website

Primary objective:
Stabilize, secure, complete, and strengthen LexIndia into a trustworthy Indian legal-tech MVP by resolving the highest-priority audit issues first, then delivering core product capability, then strategic growth features.

Important operating rules:

1. Work in strict priority order.
2. Do not jump to advanced features before fixing security, compliance, trust, broken IA, and SEO basics.
3. Make real code changes, not only suggestions.
4. Preserve the current design language unless improvement is necessary.
5. Avoid fake metrics, fake testimonials, fake downloads, placeholder trust claims, or misleading lawyer/platform claims.
6. Treat this as a real legal-tech product: trust, clarity, safety, and user confidence matter.
7. When implementing AI features, keep secrets server-side and add legal-safety messaging plus escalation to real lawyers.
8. When implementing SEO, favor server-rendered/indexable architecture where practical.
9. For every task, return:
   - task status
   - what changed
   - files changed
   - env vars required
   - schema/migration changes
   - dependencies
   - risks/blockers
   - QA checklist
10. If something cannot be fully completed because of missing backend/data/content, still implement the best production-safe scaffold and clearly mark what remains.

Execution framework:
For each task below, follow this template:

TASK OUTPUT FORMAT

- Task Name
- Priority
- Goal
- Why it matters
- Dependencies
- Implementation steps taken
- Files created/updated
- Env/schema/migration updates
- Risks or assumptions
- QA checklist
- Suggested next task

Now execute the roadmap below in order.

======================================================================
PHASE 1 — CRITICAL / IMMEDIATE
======================================================================

TASK 1: Compliance pages and footer trust repair
Priority: P0
Goal:
Create and wire up real trust/compliance pages and remove placeholder footer/header links.

Problems to solve:

- Missing About Us page
- Missing Contact page
- Missing Privacy Policy page
- Missing Terms of Service page
- Footer/header links pointing to "#"
- Weak trust foundation for a legal-tech platform

Implementation requirements:

- Create:
  - /about
  - /contact
  - /privacy
  - /terms
- Replace all placeholder internal links with real routes
- Add polished metadata for each page
- Keep content credible for an Indian legal-tech platform
- Add suitable disclaimers where appropriate
- Match existing branding and UI system
- Ensure accessibility and keyboard navigation

Content expectations:

- About: mission, what LexIndia does, user value, legal accessibility angle
- Contact: support contact method, response expectations, help path
- Privacy: data collection, chat/AI usage, booking/auth data, cookies, retention, user rights
- Terms: platform scope, user obligations, lawyer listing limitations, AI limitation disclaimer, IP, account use

Acceptance criteria:

- No footer/header placeholders remain for these pages
- All four pages render properly
- Metadata exists for all four pages
- Links are accessible and mobile-safe

======================================================================

TASK 2: Secure Gemini integration
Priority: P0
Goal:
Fix exposed Gemini API key usage and move all model calls server-side.

Problems to solve:

- NEXT_PUBLIC_GEMINI_API_KEY exposed client-side
- Insecure chat architecture
- Missing safety controls

Implementation requirements:

- Remove all client-side Gemini key usage
- Create secure server route for AI, e.g. /api/chat
- Chat UI must call internal server endpoint only
- Add input validation
- Add rate limiting
- Add safe error handling
- Add environment validation
- Add legal-safety messaging:
  - informational only
  - not a substitute for a lawyer
  - encourage booking a verified lawyer for case-specific help
- Ensure no secrets leak into client bundles

Acceptance criteria:

- Gemini key no longer appears in public/client code
- Chat still works through internal API route
- Basic rate limiting exists
- Errors are handled gracefully
- Legal-safe assistant messaging is present

======================================================================

TASK 3: Information architecture cleanup
Priority: P0
Goal:
Fix confusing navigation and separate Knowledge Base from Know Your Rights.

Problems to solve:

- Know Your Rights routes to the same experience as Knowledge Base
- Broken/placeholder nav logic
- Orphan insurance section causing confusion
- Weak user-path clarity for citizens vs lawyers

Implementation requirements:

- Audit current nav, routes, footer, and linked sections
- Separate:
  - Knowledge Base
  - Know Your Rights
- Create /rights if not properly distinct already
- Add a clean interim rights landing page if full content is not ready
- Remove/hide/isolate irrelevant insurance leftovers
- Improve MVP navigation clarity
- Add logical internal links among:
  - lawyers
  - knowledge
  - rights
  - templates
  - AI assistant

Acceptance criteria:

- Rights and Knowledge are clearly distinct
- Insurance confusion removed
- Navigation is cleaner and more understandable
- Footer/header/internal links are consistent

======================================================================

TASK 4: Per-page metadata and SEO basics
Priority: P0
Goal:
Implement foundational SEO and crawlability improvements.

Problems to solve:

- Generic metadata
- Poor page-level SEO setup
- Weak crawlability foundation
- Missing sitemap/robots/schema basics

Implementation requirements:

- Add metadata for:
  - home
  - lawyers
  - knowledge
  - rights
  - templates
  - about
  - contact
  - privacy
  - terms
- Improve page titles and descriptions for Indian legal intent
- Add canonical logic where useful
- Add Organization schema if feasible
- Add sitemap.xml if missing
- Add robots.txt if missing
- Keep implementation production-ready

Acceptance criteria:

- Key pages have unique metadata
- Technical SEO basics exist
- Sitemap and robots are present
- Page titles/descriptions are no longer generic

======================================================================

TASK 5: Homepage trust and positioning cleanup
Priority: P0
Goal:
Improve homepage credibility, clarity, and conversion readiness.

Problems to solve:

- Fake/hardcoded trust numbers
- Generic/placeholder imagery
- Weak legal-specific messaging
- Early push into auth without enough trust/value context
- MVP feels less credible than it should

Implementation requirements:

- Remove fake trust claims or replace with truthful alternatives
- Use real stats only if actual data exists
- Replace weak/random imagery with safer branded presentation
- Strengthen hero copy around Indian legal help
- Improve CTA structure
- Add honest trust-oriented sections suitable for MVP
- Keep design polished and serious

Acceptance criteria:

- No fake metrics remain
- Homepage value proposition is clearer
- Trust presentation is honest
- CTA flow is more mature and less abrupt

======================================================================

TASK 6: Auth consent checkbox
Priority: P0
Goal:
Add Terms/Privacy consent to registration flows.

Problems to solve:

- No compliance consent in auth flow
- Legal/trust weakness in sign-up process

Implementation requirements:

- Add required checkbox linking to /terms and /privacy
- Apply to citizen and lawyer registration flows
- Block submit unless checked
- Keep UX clean and accessible
- If feasible, store consent timestamp/version

Acceptance criteria:

- Consent is required before registration
- Terms/Privacy links work
- UX remains clean and accessible

======================================================================
PHASE 2 — CORE PRODUCT COMPLETION
======================================================================

TASK 7: Real lawyer profile pages
Priority: P1
Goal:
Turn lawyer discovery into a real marketplace experience with detail pages.

Problems to solve:

- No individual lawyer detail pages
- Weak trust and conversion on lawyer discovery
- Limited SEO value for lawyer listings

Implementation requirements:

- Create /lawyers/[id] or /lawyers/[slug]
- Show real lawyer information:
  - name
  - photo
  - specialization
  - languages
  - years of experience
  - city
  - consultation modes
  - fees
  - bio
  - verification status
  - education/courts if available
- Add strong trust/conversion sections
- Add structured data if practical
- Handle incomplete profiles gracefully

Acceptance criteria:

- Lawyer list can open profile pages
- Profiles use real data
- Profiles feel credible and actionable

======================================================================

TASK 8: Real booking flow
Priority: P1
Goal:
Replace mock booking with real booking persistence and flow integrity.

Problems to solve:

- Mock lawyer data in booking flow
- Fake booking IDs
- Non-functional persistence
- Wrong redirects
- Weak reliability for real consultations

Implementation requirements:

- Use real lawyer data
- Create/repair booking persistence
- Save booking inputs properly:
  - lawyer
  - consultation mode
  - slot
  - issue summary
  - amount
- Fix confirmation and redirect logic
- Handle invalid IDs and unavailable states
- Create clean seam for payment integration if needed

Acceptance criteria:

- Booking creates a real persisted record
- Confirmation flow works
- Redirects are correct
- Error handling is graceful

======================================================================

TASK 9: Razorpay payment integration
Priority: P1
Goal:
Implement secure consultation payment flow.

Problems to solve:

- Fake payment flow
- No real transaction handling
- No booking-payment linkage

Implementation requirements:

- Integrate Razorpay server-side
- Create order server-side
- Link payment to booking
- Verify payment server-side
- Handle success/failure/cancel/duplicate attempts
- Keep UX clear and trustworthy
- Identify env vars and webhook needs

Acceptance criteria:

- Payment flow works in test mode
- Payment verification is server-side
- Booking status updates correctly

======================================================================

TASK 10: Email verification and forgot password
Priority: P1
Goal:
Complete missing auth fundamentals.

Problems to solve:

- No email verification
- No forgot password/reset flow
- Weak auth lifecycle trust

Implementation requirements:

- Add email verification
- Add forgot password
- Add reset password screens and token handling
- Support user roles cleanly
- Use hashed tokens, expiry, rate limiting, safe errors
- Improve auth state UX

Acceptance criteria:

- New users can verify email
- Users can request and complete password reset
- Security basics are followed

======================================================================

TASK 11: Real templates system architecture
Priority: P1
Goal:
Replace fake template downloads with a scalable real template system.

Problems to solve:

- Placeholder TXT downloads
- Misleading download behavior
- No preview or structured template system

Implementation requirements:

- Audit current template implementation
- Refactor for real template support
- Support preview architecture
- Prepare for PDF/DOCX files
- Add template metadata structure
- Add disclaimer placement
- Remove misleading UI behavior
- Build scalable content model

Acceptance criteria:

- Template system is no longer fake/misleading
- Architecture is ready for real legal templates
- UX clearly communicates availability/status

======================================================================

TASK 12: Legal guides content architecture
Priority: P1
Goal:
Create the foundation for deep, structured legal education content.

Problems to solve:

- Knowledge Base is too thin
- Public legal usefulness is weak
- No scalable guide structure

Implementation requirements:

- Create:
  - /guides
  - /guides/[slug]
- Build reusable guide layout with:
  - title
  - summary
  - who this is for
  - key rights
  - step-by-step process
  - required documents
  - authority links
  - common mistakes
  - when to talk to a lawyer
  - FAQs
  - related templates
  - related lawyer CTA
- Scaffold content cleanly if final editorial content is not ready
- Make SEO-friendly and internally linked

Acceptance criteria:

- Guide architecture exists
- Content model is scalable
- Pages are structured for future depth

======================================================================

TASK 13: Rendering/SEO refactor for key pages
Priority: P1
Goal:
Move key pages away from overly client-side rendering where practical.

Problems to solve:

- Weak crawlability
- Lower SEO effectiveness
- Poor rendering architecture for discoverability

Implementation requirements:

- Audit:
  - home
  - lawyers
  - knowledge
  - templates
  - rights
- Convert to server components where possible
- Keep client components only for interactive areas
- Preserve UX and styling
- Improve performance and crawlability

Acceptance criteria:

- Key pages use improved rendering model
- Metadata and content become more indexable
- Interactive logic remains stable

======================================================================

TASK 14: Reviews system
Priority: P1
Goal:
Add booking-linked reviews to improve lawyer trust and marketplace quality.

Problems to solve:

- No review system
- Weak trust and social proof
- No quality signal for future lawyer selection

Implementation requirements:

- Add review model linked to eligible completed appointments
- Allow only valid users to review
- Display reviews on lawyer profiles
- Calculate aggregate ratings correctly
- Design basic abuse prevention and future moderation extensibility

Acceptance criteria:

- Reviews can be created only by eligible users
- Reviews display on lawyer profiles
- Ratings aggregate correctly

======================================================================

TASK 15: Lawyer onboarding/profile completion wizard
Priority: P1
Goal:
Improve lawyer-side onboarding and profile completeness.

Problems to solve:

- Lawyer dashboard feels placeholder-like
- Weak profile completion flow
- Missing onboarding guidance
- Verification fields not ready

Implementation requirements:

- Create guided onboarding/profile completion wizard
- Include:
  - name
  - specialization
  - city
  - languages
  - consultation modes
  - fees
  - bio
  - bar council ID
  - profile photo
  - education if needed
- Add profile completeness indicator
- Improve empty state
- Prepare verification fields for future admin workflow

Acceptance criteria:

- Lawyers can complete profile in guided steps
- Completeness tracking exists
- Onboarding feels intentional and useful

======================================================================
PHASE 3 — STRATEGIC GROWTH
======================================================================

TASK 16: Dedicated Know Your Rights system
Priority: P2
Goal:
Create a true rights-awareness experience distinct from generic legal knowledge.

Problems to solve:

- Rights content lacks identity and usefulness
- Current experience is too generic
- Public-first utility is limited

Implementation requirements:

- Build:
  - /rights
  - /rights/[slug]
- Organize by real citizen needs, e.g.:
  - women
  - tenants
  - workers
  - arrested persons
  - consumers
  - senior citizens
  - cybercrime victims
- Each rights page should support:
  - plain-language explanation
  - user rights
  - immediate next steps
  - official authorities/helplines
  - when to talk to a lawyer
- Make mobile-friendly and easy to scan
- Link with guides, templates, and lawyers

Acceptance criteria:

- Rights system becomes distinct and useful
- Users can reach actionable rights content quickly

======================================================================

TASK 17: Location and legal-issue SEO landing pages
Priority: P2
Goal:
Build scalable, non-spammy SEO architecture for city/legal-issue discovery.

Problems to solve:

- Weak discovery for city and specialization intent
- No scalable organic acquisition structure

Implementation requirements:

- Design routes such as:
  - /lawyers/[city]
  - /lawyers/[city]/[specialization]
  or an equivalent clean architecture
- Ensure pages are indexable and not thin
- Use real data where available
- Add metadata, schema, and internal linking
- Avoid doorway-like SEO spam patterns

Acceptance criteria:

- Scalable SEO route architecture exists
- Pages are unique and usable
- SEO safeguards against thin pages are in place

======================================================================

TASK 18: Hindi legal content support
Priority: P2
Goal:
Add real bilingual legal content capability, not only UI translation.

Problems to solve:

- Hindi content depth is absent
- Public utility for non-English-first users is limited

Implementation requirements:

- Extend content model for English + Hindi
- Support bilingual fields for:
  - title
  - summary
  - body
  - FAQs
  - metadata
- Decide practical bilingual rendering strategy
- Keep SEO and UX quality strong
- Recommend a human-reviewed editorial workflow

Acceptance criteria:

- Content model supports bilingual legal content
- Rendering approach is clear and scalable
- SEO considerations are accounted for

======================================================================

TASK 19: AI-to-lawyer escalation flow
Priority: P2
Goal:
Make the AI assistant safer and more useful by creating handoff to real legal help.

Problems to solve:

- AI may become a dead-end
- Users with urgent or case-specific questions need human escalation
- Conversion opportunity is underused

Implementation requirements:

- Add smart escalation pathways in or near chat
- Trigger on:
  - urgent issues
  - repeated confusion
  - sensitive topics
  - case-specific need
- Add context-aware CTA patterns:
  - Talk to a verified lawyer
  - Book consultation
  - Find a lawyer for this issue
- Preserve clarity and disclaimers

Acceptance criteria:

- AI experience can hand off to human help
- Escalation is useful, visible, and safe

======================================================================

TASK 20: Case-type wizard
Priority: P2
Goal:
Help first-time users identify the right legal path.

Problems to solve:

- New users may not know which content/lawyer/template they need
- Current discovery path may be too open-ended

Implementation requirements:

- Build an MVP guided flow
- Ask a small number of smart questions
- Route users to:
  - lawyer list
  - guide
  - rights page
  - template
  - urgent help flow
- Keep it simple, mobile-friendly, and non-intimidating
- Frame as guidance, not legal advice

Acceptance criteria:

- Users can navigate legal intent more easily
- Wizard routes users to useful next steps

======================================================================

TASK 21: Emergency legal help flows
Priority: P2
Goal:
Create high-urgency public-help flows for critical legal scenarios.

Priority topics:

- arrested by police
- domestic violence
- cyber fraud
- road accident
- consumer fraud

Implementation requirements:

- Create emergency-oriented UX pattern
- Make content highly actionable:
  - immediate steps
  - what not to do
  - helplines
  - authority references
  - when to contact a lawyer immediately
- Keep calm, practical tone
- Make mobile-first
- Link with AI and lawyer booking

Acceptance criteria:

- Emergency topics have practical and scannable support flows
- Users can reach urgent next steps quickly

======================================================================
PM MODE REQUIREMENT
======================================================================

In addition to implementation, maintain a PM-style execution tracker as you go.

For the full roadmap, produce and keep updated a table with:

- Task ID
- Task Name
- Priority
- Status (Not Started / In Progress / Blocked / Done / Partial)
- Owner Type (Frontend / Backend / Product / SEO / Content / Legal / Design)
- Dependencies
- Risk Level
- Acceptance Criteria
- Notes

Before starting implementation:

1. Summarize the roadmap in PM table format.
2. Identify the exact first task to execute.
3. Begin with TASK 1 immediately.

Do not ask for confirmation.
Start now.
