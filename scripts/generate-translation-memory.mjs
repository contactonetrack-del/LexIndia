import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, 'lib', 'content', 'translation-memory.json');
const SUPPORTED_LOCALES = ['hi', 'bn', 'te', 'mr', 'ta', 'gu', 'ur', 'kn', 'or', 'pa', 'ml', 'bho', 'bh'];
const BATCH_SEPARATOR = '\n<lx-sep/>\n';
const MAX_BATCH_LENGTH = 1400;

function loadBlock(filePath, startToken, endToken, replaceWith = 'module.exports = {') {
  const source = fs.readFileSync(path.join(ROOT, filePath), 'utf8');
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken, start);

  if (start === -1 || end === -1) {
    throw new Error(`Unable to extract block from ${filePath}`);
  }

  const block = source
    .slice(start, end)
    .replace(startToken, replaceWith)
    .replace(/ as const;?/g, '');

  const context = {
    module: { exports: {} },
    exports: {},
    Activity: 'Activity',
    AlertTriangle: 'AlertTriangle',
    Bot: 'Bot',
    Car: 'Car',
    CheckCircle: 'CheckCircle',
    ChevronRight: 'ChevronRight',
    CreditCard: 'CreditCard',
    Database: 'Database',
    Eye: 'Eye',
    Heart: 'Heart',
    Shield: 'Shield',
    ShieldCheck: 'ShieldCheck',
    Scale: 'Scale',
    Users: 'Users',
    UserCheck: 'UserCheck',
    Home: 'Home',
    Lock: 'Lock',
    Mail: 'Mail',
    Phone: 'Phone',
    Plane: 'Plane',
    Plus: 'Plus',
    Search: 'Search',
    ShoppingCart: 'ShoppingCart',
    Briefcase: 'Briefcase',
    FileText: 'FileText',
    BookOpen: 'BookOpen',
    ArrowRight: 'ArrowRight',
    Check: 'Check',
    FileCheck: 'FileCheck',
    Star: 'Star',
    X: 'X',
    XCircle: 'XCircle',
  };

  vm.createContext(context);
  vm.runInContext(block, context);
  return context.module.exports;
}

function normalizeText(value) {
  return value
    .replace(/Â·/g, '·')
    .replace(/â€”/g, '—')
    .replace(/â€“/g, '–')
    .trim();
}

function sanitizeTranslation(value, locale) {
  let sanitized = value.replace(/\r\n/g, '\n').trim();

  if (locale === 'bho' || locale === 'bh') {
    sanitized = sanitized
      .replace(/^\u0915\u0947 \u092c\u093e\s*\n+/u, '')
      .replace(/^\u0915\u0947 \u092c\u093e\s+/u, '');
  }

  if (locale === 'or') {
    sanitized = sanitized
      .split('\n')
      .map((line) => line.replace(/[ \t]*\|[ \t]*/gu, '').trimEnd())
      .join('\n');
  }

  return sanitized.replace(/\n{3,}/g, '\n\n').trim();
}

function shouldFallbackToHindi(value, locale) {
  if (locale !== 'bho' && locale !== 'bh') {
    return false;
  }

  return (
    /^\u0915\u0947 \u092c\u093e/u.test(value) ||
    /\s+\u0915\u0947 \u092c\u093e$/u.test(value) ||
    /\u092c\u0924\u093e\u0935\u0932 \u0917\u0907\u0932 \u092c\u093e|\u092c\u093e\u0930\u0947 \u092e\u0947\u0902 \u092c\u0924\u093e\u0935\u0932 \u0917\u0907\u0932 \u092c\u093e/u.test(
      value
    )
  );
}

function collectStrings(value, targetSet, skipKeys = new Set(), currentKey = '') {
  if (typeof value === 'string') {
    const normalized = normalizeText(value);
    if (!normalized) return;
    if (/^https?:\/\//.test(normalized)) return;
    if (/^[A-Z0-9_/-]+$/.test(normalized)) return;
    targetSet.add(normalized);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectStrings(entry, targetSet, skipKeys, currentKey));
    return;
  }

  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      if (skipKeys.has(key)) continue;
      collectStrings(entry, targetSet, skipKeys, key);
    }
  }
}

function buildBatches(strings) {
  const batches = [];
  let current = [];
  let length = 0;

  for (const text of strings) {
    const nextLength = length + text.length + (current.length ? BATCH_SEPARATOR.length : 0);
    if (current.length && nextLength > MAX_BATCH_LENGTH) {
      batches.push(current);
      current = [text];
      length = text.length;
    } else {
      current.push(text);
      length = nextLength;
    }
  }

  if (current.length) {
    batches.push(current);
  }

  return batches;
}

async function translateBatch(texts, locale) {
  const translateSingle = async (text) => {
    const url = 'https://translate.googleapis.com/translate_a/single'
      + `?client=gtx&sl=en&tl=${locale}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Translation request failed for ${locale}: ${response.status}`);
    }

    const data = await response.json();
    return data[0].map((entry) => entry[0]).join('').trim();
  };

  if (texts.length === 1) {
    return [sanitizeTranslation(await translateSingle(texts[0]), locale)];
  }

  const joined = texts.join(BATCH_SEPARATOR);
  const url = 'https://translate.googleapis.com/translate_a/single'
    + `?client=gtx&sl=en&tl=${locale}&dt=t&q=${encodeURIComponent(joined)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Translation request failed for ${locale}: ${response.status}`);
  }

  const data = await response.json();
  const translated = data[0].map((entry) => entry[0]).join('');
  const parts = translated.split('<lx-sep/>').map((part) => part.trim());

  if (parts.length === texts.length) {
    return parts.map((part) => sanitizeTranslation(part, locale));
  }

  const fallbackResults = [];
  for (const text of texts) {
    fallbackResults.push(sanitizeTranslation(await translateSingle(text), locale));
  }
  return fallbackResults;
}

function buildSourceStrings() {
  const strings = new Set();

  const guides = loadBlock(
    'app/guides/[slug]/page.tsx',
    'const GUIDES: Record<string, GuideContent> = {',
    '\n\nconst GUIDE_PAGE_COPY',
    'module.exports = {'
  );
  collectStrings(guides, strings, new Set(['slug', 'categorySlug', 'url', 'contact']));

  const guideDetailCopy = loadBlock(
    'app/guides/[slug]/page.tsx',
    'const GUIDE_PAGE_COPY = {',
    '\n\n// Fallback for guides not yet written',
    'module.exports = {'
  );
  collectStrings(guideDetailCopy, strings);

  const guideCategories = loadBlock(
    'app/guides/page.tsx',
    'const GUIDE_CATEGORIES: GuideCategory[] = [',
    '\n\nexport default async function GuidesPage()',
    'module.exports = ['
  );
  collectStrings(guideCategories, strings, new Set(['slug', 'toneClass', 'iconClass', 'iconBgClass', 'icon']));

  const guidePageCopy = loadBlock(
    'app/guides/page.tsx',
    '  const copy = localizeTreeFromMemory({',
    ' as const, locale);\n  const localizedCategories',
    'module.exports = {'
  );
  collectStrings(guidePageCopy, strings);

  const chatbotCopy = loadBlock(
    'components/Chatbot.tsx',
    'const COPY = {',
    '\n\nconst INITIAL_MESSAGE',
    'module.exports = {'
  );
  collectStrings(chatbotCopy, strings);

  const initialMessage = loadBlock(
    'components/Chatbot.tsx',
    'const INITIAL_MESSAGE: Message = {',
    '\n\nexport default function Chatbot()',
    'module.exports = {'
  );
  collectStrings(initialMessage, strings);

  const caseWorkspaceCopy = loadBlock(
    'components/dashboard/CaseWorkspace.tsx',
    'const COPY = {',
    '\n\nexport default function CaseWorkspace',
    'module.exports = {'
  );
  collectStrings(caseWorkspaceCopy, strings);

  const reviewModalCopy = loadBlock(
    'components/dashboard/ReviewModal.tsx',
    'const COPY = {',
    '\n\nexport default function ReviewModal',
    'module.exports = {'
  );
  collectStrings(reviewModalCopy, strings);

  const privacySections = loadBlock(
    'app/privacy/page.tsx',
    'const PRIVACY_SECTIONS = [',
    '\n\nconst PRIVACY_PAGE = {',
    'module.exports = ['
  );
  collectStrings(privacySections, strings, new Set(['icon']));

  const privacyPage = loadBlock(
    'app/privacy/page.tsx',
    'const PRIVACY_PAGE = {',
    '\n\nexport async function generateMetadata()',
    'module.exports = {'
  );
  collectStrings(privacyPage, strings);

  const termsSections = loadBlock(
    'app/terms/page.tsx',
    'const TERMS_SECTIONS = [',
    '\n\nconst TERMS_PAGE = {',
    'module.exports = ['
  );
  collectStrings(termsSections, strings, new Set(['icon']));

  const termsPage = loadBlock(
    'app/terms/page.tsx',
    'const TERMS_PAGE = {',
    '\n\nexport async function generateMetadata()',
    'module.exports = {'
  );
  collectStrings(termsPage, strings);

  const disclaimerSections = loadBlock(
    'app/disclaimer/page.tsx',
    'const DISCLAIMER_SECTIONS = [',
    '\n\nconst DISCLAIMER_PAGE = {',
    'module.exports = ['
  );
  collectStrings(disclaimerSections, strings, new Set(['icon']));

  const disclaimerPage = loadBlock(
    'app/disclaimer/page.tsx',
    'const DISCLAIMER_PAGE = {',
    '\n\nexport async function generateMetadata()',
    'module.exports = {'
  );
  collectStrings(disclaimerPage, strings);

  const insurancePage = loadBlock(
    'app/insurance/page.tsx',
    'const INSURANCE_PAGE = {',
    '\n\nconst INSURANCE_CATEGORIES = [',
    'module.exports = {'
  );
  collectStrings(insurancePage, strings);

  const insuranceCategories = loadBlock(
    'app/insurance/page.tsx',
    'const INSURANCE_CATEGORIES = [',
    '\n\nexport async function generateMetadata()',
    'module.exports = ['
  );
  collectStrings(insuranceCategories, strings, new Set(['icon', 'href', 'color']));

  const healthInsurancePage = loadBlock(
    'app/insurance/health/page.tsx',
    'const HEALTH_INSURANCE_PAGE = {',
    '\n\nexport default function HealthInsuranceListing()',
    'module.exports = {'
  );
  collectStrings(healthInsurancePage, strings);

  const verifyLawyersPage = loadBlock(
    'app/verify-lawyers/page.tsx',
    'const VERIFY_LAWYERS_PAGE = {',
    '\n\nconst VERIFICATION_STEPS = [',
    'module.exports = {'
  );
  collectStrings(verifyLawyersPage, strings);

  const verificationSteps = loadBlock(
    'app/verify-lawyers/page.tsx',
    'const VERIFICATION_STEPS = [',
    '\n\nconst VERIFIED_INDICATORS = [',
    'module.exports = ['
  );
  collectStrings(
    verificationSteps,
    strings,
    new Set(['number', 'icon', 'color', 'iconColor', 'iconBg'])
  );

  const verifiedIndicators = loadBlock(
    'app/verify-lawyers/page.tsx',
    'const VERIFIED_INDICATORS = [',
    '\n\nconst NOT_VERIFIED_INDICATORS = [',
    'module.exports = ['
  );
  collectStrings(verifiedIndicators, strings);

  const notVerifiedIndicators = loadBlock(
    'app/verify-lawyers/page.tsx',
    'const NOT_VERIFIED_INDICATORS = [',
    '\n\nconst USER_RIGHTS = [',
    'module.exports = ['
  );
  collectStrings(notVerifiedIndicators, strings);

  const userRights = loadBlock(
    'app/verify-lawyers/page.tsx',
    'const USER_RIGHTS = [',
    '\n\nconst FAQS = [',
    'module.exports = ['
  );
  collectStrings(userRights, strings);

  const verificationFaqs = loadBlock(
    'app/verify-lawyers/page.tsx',
    'const FAQS = [',
    '\n\nexport async function generateMetadata()',
    'module.exports = ['
  );
  collectStrings(verificationFaqs, strings);

  const forgotPasswordPage = loadBlock(
    'app/forgot-password/page.tsx',
    'const FORGOT_PASSWORD_PAGE = {',
    '\n\nexport default function ForgotPasswordPage()',
    'module.exports = {'
  );
  collectStrings(forgotPasswordPage, strings);

  const resetPasswordPage = loadBlock(
    'app/reset-password/page.tsx',
    'const RESET_PASSWORD_PAGE = {',
    '\n\nfunction ResetPasswordForm()',
    'module.exports = {'
  );
  collectStrings(resetPasswordPage, strings);

  const verifyEmailPage = loadBlock(
    'app/verify-email/page.tsx',
    'const VERIFY_EMAIL_PAGE = {',
    '\n\nexport default async function VerifyEmailPage(',
    'module.exports = {'
  );
  collectStrings(verifyEmailPage, strings);

  const evaluatePage = loadBlock(
    'app/evaluate/page.tsx',
    'const EVALUATE_PAGE = {',
    '\n\nexport default function PreScreeningPage()',
    'module.exports = {'
  );
  collectStrings(evaluatePage, strings);

  [
    'Free Legal Aid (NALSA)',
    'Women, children, SC/ST members, industrial workmen, and persons with limited annual income may be eligible for free legal aid.',
    'Apply for Free Aid',
    'Official Government Resources',
    'eCourts Services',
    'Check case status, court orders, and cause lists across District Courts in India.',
    'Tele-Law',
    'Access pre-litigation advice through video conferencing by panel lawyers.',
    'Have a specific question not covered here?',
    'A short call with a verified lawyer can help you understand the next step with confidence.',
    'Talk to a Lawyer',
    "Can't find what you're looking for?",
    'All',
    'Criminal',
    'Civil Rights',
    'Civil / Corporate',
    'Property',
    'General',
    'Disclaimer:',
    'These templates are general guides. Laws vary by state, so have a verified lawyer review the final draft before submission.',
    'downloads',
    'Need help drafting a custom document?',
    'Get a verified lawyer to draft or review notices, agreements, and complaints for your case.',
    'Find a Lawyer',
    'Find a Lawyer Now',
    'Filter by category',
    'Download {title} as text file',
    '[Insert Content Here]',
    'File size must be less than 5MB',
    'In consultation',
    'Send the first message to start this consultation chat.',
    'Attachment',
    'Attach file',
    'Type your message',
    'Book your first consultation with a verified lawyer to get personalized legal advice.',
    'Book new',
    'Find a verified lawyer',
    'Pending',
    'Confirmed',
    'Completed',
    'Cancelled',
    'Legal expert',
    'Profile',
    'Invoice',
    'Message workspace',
    'Join video call',
    'Leave a review',
    'View public profile',
    'Profile completeness',
    'Complete your profile details in edit profile to rank higher in searches.',
    'Your profile is fully complete.',
    'Funds in escrow',
    'Pending verification by clients',
    'Settled earnings',
    'Total lifetime payouts completed',
    'Verified',
    'yrs',
    'No appointments yet',
    'When citizens book consultations with you, they appear here. Complete your profile to attract more clients.',
    'Enhance profile',
    'Receipt',
    'Case file',
    'Close file',
    'Mark complete',
    'Appointment status updated.',
    'Failed to update status.',
    'Network error. Please try again.',
    'Consultation marked completed and funds marked eligible.',
    'Failed to mark complete.',
    'Edit your profile',
    'Professional bio',
    'Visible on your public profile',
    'Describe your expertise, experience, and approach to legal practice.',
    'City',
    'State',
    'Years of experience',
    'Consultation fee (INR per hour)',
    'Note',
    'Specializations, languages, and consultation modes can be updated via hello@lexindia.in while self-service settings are in beta.',
    'Save changes',
    'Preview profile',
    'Profile updated successfully.',
    'Subscription and badges',
    'Boost your visibility and rank higher in search results across LexIndia.',
    'Current tier',
    'Active until',
    'Current plan',
    'Recommended',
    'per month',
    'Upgrade to',
    'Failed to load payment SDK.',
    'Payment verification failed.',
    'Payment failed.',
    'An error occurred while initializing payment.',
    'Subscription upgraded successfully. Reloading.',
    'Membership',
    'Basic',
    'Pro',
    'Elite',
    'Visible PRO badge',
    'Boosted directory ranking',
    'Zero platform commission escrow',
    'Premium ELITE badge',
    'Priority ranking',
    'Dedicated account manager',
    'Private Case File:',
    'Confidential',
    'No private notes have been added to this consultation yet.',
    'Encrypted Memo',
    'Document legal strategies, case references, or internal memos here...',
    'Save Note to Case File',
    'Please select a rating',
    'Failed to submit review',
    'Review submitted successfully!',
    'Rate Your Consultation',
    'How was your experience with',
    '?',
    'Additional Comments (Optional)',
    'Share details of your experience to help others...',
    'Submitting...',
    'Submit Review',
    'Trusted by top legal professionals and featured in',
    'Popular Searches:',
    'Police Complaint / FIR Format',
    'Standard format for drafting a written complaint to the police station in-charge.',
    'Sample Police Complaint / FIR Format\n\nThis sample is for general awareness. Review with a lawyer before official use.\n\n[Insert content here]',
    'RTI Application Form',
    'Format to file a Right to Information request to a government department.',
    'Sample RTI Application Form\n\nThis sample is for general awareness. Review with a lawyer before official use.\n\n[Insert content here]',
    'Legal Notice for Unpaid Dues',
    'Draft legal notice to recover money from a defaulter.',
    'Sample Legal Notice for Unpaid Dues\n\nThis sample is for general awareness. Review with a lawyer before official use.\n\n[Insert content here]',
    'Standard Rent Agreement',
    '11-month residential rent agreement format for landlord and tenant use.',
    'Sample Standard Rent Agreement\n\nThis sample is for general awareness. Review with a lawyer before official use.\n\n[Insert content here]',
    'General Name Change Affidavit',
    'Affidavit format commonly used for gazette name change publication.',
    'Sample General Name Change Affidavit\n\nThis sample is for general awareness. Review with a lawyer before official use.\n\n[Insert content here]',
    'Arrest Rights',
    'Basic rights and safeguards available during arrest.',
    'What are my rights if the police arrest me?',
    'You must be informed of the grounds of arrest, allowed to consult a lawyer, produced before a magistrate within 24 hours, and allowed to notify a relative or friend.',
    'Can the police arrest a woman at night?',
    'Usually no. Night arrests of women require exceptional circumstances, a woman police officer, and prior magistrate permission.',
    'Domestic Violence',
    'Protection orders, complaint filing, and free legal aid basics.',
    'How do I file a domestic violence complaint?',
    'You can approach the police station, a Protection Officer, a registered Service Provider, or file directly before the Magistrate under the Protection of Women from Domestic Violence Act, 2005.',
    'Can I get free legal aid for a domestic violence case?',
    'Yes. Women are entitled to free legal aid under the Legal Services Authorities Act, 1987, regardless of income.',
    'Consumer Rights',
    'Complaint filing, refund disputes, and consumer commission access.',
    'How do I file a consumer complaint against a company?',
    'You can file online through e-Daakhil or approach the appropriate Consumer Disputes Redressal Commission depending on claim value.',
    'An Indian legal-tech platform connecting citizens with verified lawyers, legal knowledge, and AI-powered legal information.',
    'Skip to content',
    'Toggle theme',
    'Switch theme',
    'Select language',
    'Toggle menu',
    'Open accessibility controls',
    'Close accessibility controls',
    'Accessibility',
    'Text Size',
    'Normal text size',
    'Large text size',
    'Extra large text size',
    'Ready to discuss your legal matter?',
    'Get matched with a verified expert. The first consultation is free.',
    'Know Your Rights. Protect Your Future.',
    'Join readers receiving legal updates, free templates, and practical guidance every week.',
    'Weekly updates',
    'Free handbook',
    'No spam',
    "You're on the list!",
    'Check your inbox for your legal rights handbook.',
    'Email address',
    'Enter your email address',
    'Subscribing...',
    'Get Free Handbook',
    'We respect your privacy. Unsubscribe at any time.',
    'Something went wrong',
    'An unexpected error occurred. Please try again or contact support if the issue persists.',
    'Try again',
    'Account type',
    'Close dialog',
    "Wait! Don't Miss Out",
    "Get our exclusive 'Citizen Legal Rights Handbook' before you go. Completely free.",
    'Handbook Sent!',
    "Check your inbox. We've sent the PDF guide to your email address.",
    'Enter your email address...',
    'Sending...',
    'Download Free Handbook',
    'We hate spam. Unsubscribe at any time.',
    'Close notification',
    '{name} booked a consultation with {lawyer} from {location}',
    '{name} downloaded the {document}',
    '{name} booked a video call with {lawyer} from {location}',
    '{name} found a trusted lawyer in {location}',
    '{name} saved on the first consultation',
    'Page Not Found',
    "The page you're looking for doesn't exist or has been moved.",
    'Go Home',
    'Find Lawyers',
    'Failed to fetch knowledge base',
    'Failed to fetch templates',
    'Too many requests. Please slow down.',
    'Failed to fetch lawyers',
    'LexIndia Subscription',
    '{tier} tier subscription',
    'Appointment not found',
    'This consultation record does not exist or was removed.',
    'Access denied',
    'You are not authorized to view this communication channel.',
    'Return to dashboard',
    'Back to dashboard',
    'Secure messaging',
    'Appointment',
    'Your lawyer',
    'Your client',
    'This chat is end-to-end bridged. Messages cannot be deleted once delivered. Treat all files attached as privileged attorney-client communication.',
    'Room closed',
    'You are not authorized to join this conference.',
    'Consultation unavailable',
    'Video rooms are only accessible for confirmed consultations.',
    'Leave room',
    'LexIndia secure video',
    'Citizen',
    'Client',
    'Lawyer',
    'Video',
    'Call',
    'Chat',
    'No invoice required',
    'This consultation was marked as free.',
    'Establishing secure end-to-end peer connection.',
    'Email is required',
    'If an account exists, a reset email has been sent.',
    'Reset email sent!',
    'Internal server error',
    'Missing token or password',
    'Invalid or expired token',
    'Token has expired',
    'User not found',
    'Password updated successfully',
    'No Co-pay',
    'No Limit',
    '3 Years',
    '4 Years',
    '2 Years',
    'Single Private Room',
    '4X Coverage',
    'Protect Benefit',
    'Preventive Health Checkup',
    'Unlimited Automatic Recharge',
    'AYUSH Treatment',
    'Annual Health Checkup',
    'Bariatric Surgery Cover',
    'Maternity Cover',
    'Outpatient Dental/Ophthalmic',
    'Domestic Evacuation',
    'Wellness Program',
    'Teleconsultation',
    'Booster+ Benefit',
    'Safeguard Benefit',
    'LiveHealthy Discount',
  ].forEach((value) => strings.add(normalizeText(value)));

  return [...strings].sort();
}

async function main() {
  const sourceStrings = buildSourceStrings();
  const existing = fs.existsSync(OUTPUT_PATH)
    ? JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'))
    : {};

  const memory = {};
  for (const text of sourceStrings) {
    memory[text] = Object.fromEntries(
      Object.entries(existing[text] ?? {}).map(([locale, value]) => [
        locale,
        sanitizeTranslation(String(value), locale),
      ])
    );
  }

  for (const locale of SUPPORTED_LOCALES) {
    const missing = sourceStrings.filter((text) => !memory[text]?.[locale]);
    if (!missing.length) {
      continue;
    }

    for (const batch of buildBatches(missing)) {
      const translated = await translateBatch(batch, locale);
      batch.forEach((text, index) => {
        memory[text][locale] = translated[index];
      });
    }
  }

  for (const text of sourceStrings) {
    for (const locale of ['bho', 'bh']) {
      const candidate = memory[text]?.[locale];
      if (candidate && shouldFallbackToHindi(candidate, locale) && memory[text]?.hi) {
        memory[text][locale] = memory[text].hi;
      }
    }
  }

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(memory, null, 2)}\n`, 'utf8');
  console.log(`Wrote translation memory with ${sourceStrings.length} source strings to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
