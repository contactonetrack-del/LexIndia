export type GuideRegistryItem = {
  title: string;
  slug: string;
  readTime: number;
};

export type GuideRegistryCategory = {
  title: string;
  slug: string;
  guides: GuideRegistryItem[];
};

export const PUBLISHED_GUIDE_SLUGS = [
  'road-accident-emergency',
  'how-to-file-fir',
  'tenant-rights-india',
  'understanding-bail',
  'divorce-india-guide',
  'domestic-violence-act-guide',
  'file-consumer-complaint',
  'how-to-file-rti',
] as const;

const PUBLISHED_GUIDE_SLUG_SET = new Set<string>(PUBLISHED_GUIDE_SLUGS);

export const GUIDE_CATEGORY_REGISTRY: GuideRegistryCategory[] = [
  {
    title: 'Emergency and Accidents',
    slug: 'emergency-law',
    guides: [
      {
        title: 'Road Accidents: Immediate Legal Steps and What Not to Do',
        slug: 'road-accident-emergency',
        readTime: 7,
      },
    ],
  },
  {
    title: 'Criminal Law',
    slug: 'criminal-law',
    guides: [
      { title: 'What to Do When Arrested by Police in India', slug: 'arrested-by-police', readTime: 8 },
      { title: 'How to File an FIR: Step-by-Step Guide', slug: 'how-to-file-fir', readTime: 6 },
      { title: 'Understanding Bail: Types and How to Get Bail', slug: 'understanding-bail', readTime: 7 },
      { title: 'Anticipatory Bail: When and How to Apply', slug: 'anticipatory-bail', readTime: 6 },
      { title: 'Free Legal Aid Under NALSA: Who Qualifies', slug: 'free-legal-aid-nalsa', readTime: 5 },
    ],
  },
  {
    title: 'Family Law',
    slug: 'family-law',
    guides: [
      { title: 'Divorce in India: Mutual Consent vs Contested', slug: 'divorce-india-guide', readTime: 10 },
      { title: 'Child Custody Laws in India Explained', slug: 'child-custody-india', readTime: 8 },
      { title: 'Maintenance and Alimony: Your Rights After Divorce', slug: 'maintenance-alimony-rights', readTime: 7 },
      { title: 'Marriage Registration in India: How to Register', slug: 'marriage-registration-india', readTime: 5 },
      { title: 'Domestic Violence Act 2005: A Complete Guide', slug: 'domestic-violence-act-guide', readTime: 9 },
    ],
  },
  {
    title: 'Property Law',
    slug: 'property-law',
    guides: [
      { title: 'Tenant Rights in India: What Your Landlord Cannot Do', slug: 'tenant-rights-india', readTime: 8 },
      { title: 'Property Registration: Process and Documents Needed', slug: 'property-registration-guide', readTime: 7 },
      { title: 'How to Dispute an Illegal Eviction', slug: 'illegal-eviction-dispute', readTime: 6 },
      { title: 'Property Inheritance Laws in India', slug: 'property-inheritance-india', readTime: 9 },
      { title: 'RERA: Your Rights as a Home Buyer', slug: 'rera-home-buyer-rights', readTime: 7 },
    ],
  },
  {
    title: 'Consumer Law',
    slug: 'consumer-law',
    guides: [
      { title: 'How to File a Consumer Court Complaint in India', slug: 'file-consumer-complaint', readTime: 7 },
      { title: 'E-Commerce Fraud: Getting a Refund From Flipkart or Amazon', slug: 'ecommerce-refund-fraud', readTime: 6 },
      { title: 'Insurance Claim Rejection: How to Contest It', slug: 'insurance-claim-rejection', readTime: 7 },
      { title: 'Defective Product Claims Under Consumer Protection Act', slug: 'defective-product-claim', readTime: 6 },
    ],
  },
  {
    title: 'Labour and Employment',
    slug: 'labour-law',
    guides: [
      { title: 'Wrongful Termination in India: Your Options', slug: 'wrongful-termination-india', readTime: 8 },
      { title: 'PF (Provident Fund): How to Withdraw and Claim', slug: 'pf-withdrawal-claim-guide', readTime: 6 },
      { title: 'Gratuity: Who Gets It and How to Claim', slug: 'gratuity-claim-guide', readTime: 5 },
      { title: 'POSH Act: Filing a Sexual Harassment Complaint at Work', slug: 'posh-act-complaint-guide', readTime: 8 },
    ],
  },
  {
    title: 'Civil and General',
    slug: 'civil-law',
    guides: [
      { title: 'How to File an RTI (Right to Information) Application', slug: 'how-to-file-rti', readTime: 6 },
      { title: 'Cybercrime Reporting in India: Step-by-Step', slug: 'cybercrime-reporting-india', readTime: 7 },
      { title: 'How to Write a Legal Notice', slug: 'how-to-write-legal-notice', readTime: 5 },
    ],
  },
];

export type GuideRegistrySeedRecord = {
  slug: string;
  title: string;
  category: string;
  readTime: number;
  hasPublishedContent: boolean;
  editorialStatus: 'DRAFT' | 'APPROVED';
};

export const GUIDE_REGISTRY_SEED_RECORDS: GuideRegistrySeedRecord[] =
  GUIDE_CATEGORY_REGISTRY.flatMap((category) =>
    category.guides.map((guide) => {
      const hasPublishedContent = PUBLISHED_GUIDE_SLUG_SET.has(guide.slug);

      return {
        slug: guide.slug,
        title: guide.title,
        category: category.title,
        readTime: guide.readTime,
        hasPublishedContent,
        editorialStatus: hasPublishedContent ? 'APPROVED' : 'DRAFT',
      };
    })
  );

export function getPublishedGuideSlugSet() {
  return new Set(PUBLISHED_GUIDE_SLUGS);
}
