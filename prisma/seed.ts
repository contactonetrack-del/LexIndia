// @ts-nocheck
import { PrismaClient } from '@prisma/client';

import {
  GUIDE_REGISTRY_SEED_RECORDS,
} from '@/lib/content/guides-registry';
import {
  LEGAL_ACT_TIMELINE_SEED_RECORDS,
  LEGAL_ACT_RELATION_SEED_RECORDS,
  LAW_SECTION_HISTORY_SEED_RECORDS,
  LAW_SECTION_CROSSWALK_SEED_RECORDS,
  LAW_SECTION_ALIAS_SEED_RECORDS,
  LAW_VERSION_SEED_RECORDS,
  LEGAL_ISSUE_TOPICS_SEED_RECORDS,
} from '@/lib/content/law-metadata';
import { LAW_REGISTRY_SEED_RECORDS } from '@/lib/content/law-registry';
import {
  SEEDED_FAQ_CATEGORIES,
  SEEDED_LANGUAGES,
  SEEDED_SPECIALIZATIONS,
  SEEDED_TEMPLATES,
} from '@/lib/content/seed-data';
import { RIGHT_REGISTRY_SEED_RECORDS } from '@/lib/content/rights';
import { AVAILABILITY_TIME_OPTIONS } from '@/lib/availability';
import { SUPPORTED_LOCALES } from '@/lib/i18n/config';
import { getDisplayLocale } from '@/lib/i18n/display-locale';

const prisma = new PrismaClient();

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toOptionalDate(date?: string) {
  return date ? new Date(`${date}T00:00:00.000Z`) : null;
}

function buildDefaultSectionAliases(sectionKey: string) {
  const normalizedKey = normalizeSearchText(sectionKey);
  const aliases = new Set<string>([sectionKey, normalizedKey]);
  const sectionMatch = sectionKey.match(/^Section\s+(.+)$/i);
  const articleMatch = sectionKey.match(/^Article\s+(.+)$/i);

  if (sectionMatch) {
    const number = sectionMatch[1].trim();
    aliases.add(`sec ${number}`);
    aliases.add(`s ${number}`);
    aliases.add(`section ${number}`);
  }

  if (articleMatch) {
    const number = articleMatch[1].trim();
    aliases.add(`article ${number}`);
    aliases.add(`art ${number}`);
  }

  return [...aliases].map((alias) => ({
    alias,
    normalizedAlias: normalizeSearchText(alias),
  }));
}

const MOCK_LAWYERS = [
  {
    id: '1',
    name: 'Adv. Rajesh Kumar',
    image: 'https://picsum.photos/seed/lawyer1/200/200',
    city: 'New Delhi',
    bio: 'Focuses on criminal defence, bail strategy, and urgent family law hearings.',
    experience: 12,
    rating: 4.8,
    reviews: 156,
    fee: 1500,
    languages: ['English', 'Hindi', 'Punjabi'],
    specializations: ['Criminal Law', 'Family Law'],
    modes: ['VIDEO', 'CALL', 'IN_PERSON'],
    barCouncilID: 'DL/2012/1432',
    verified: true,
  },
  {
    id: '2',
    name: 'Adv. Priya Sharma',
    image: 'https://picsum.photos/seed/lawyer2/200/200',
    city: 'Mumbai',
    bio: 'Works on corporate advisory, property transfers, and high-value documentation.',
    experience: 8,
    rating: 4.9,
    reviews: 203,
    fee: 2000,
    languages: ['English', 'Hindi', 'Marathi'],
    specializations: ['Corporate Law', 'Property Law'],
    modes: ['VIDEO', 'CHAT'],
    barCouncilID: 'MH/2017/8891',
    verified: true,
  },
  {
    id: '3',
    name: 'Adv. Amit Patel',
    image: 'https://picsum.photos/seed/lawyer3/200/200',
    city: 'Ahmedabad',
    bio: 'Handles civil recovery disputes and consumer complaints for individuals and families.',
    experience: 15,
    rating: 4.7,
    reviews: 89,
    fee: 1200,
    languages: ['English', 'Gujarati', 'Hindi'],
    specializations: ['Civil Law', 'Consumer Protection'],
    modes: ['CALL', 'IN_PERSON'],
    barCouncilID: 'GJ/2009/4428',
    verified: true,
  },
  {
    id: '4',
    name: 'Adv. Sneha Reddy',
    image: 'https://picsum.photos/seed/lawyer4/200/200',
    city: 'Hyderabad',
    bio: 'Supports clients on cyber incidents, digital evidence, and family dispute strategy.',
    experience: 5,
    rating: 4.6,
    reviews: 45,
    fee: 800,
    languages: ['English', 'Telugu'],
    specializations: ['Cyber Law', 'Family Law'],
    modes: ['VIDEO', 'CALL', 'CHAT'],
    barCouncilID: 'TS/2023/0194',
    verified: false,
  },
];

const SEEDED_AVAILABILITY_BY_LAWYER: Record<string, Array<{ weekday: number; time: string }>> = {
  '1': [
    { weekday: 1, time: AVAILABILITY_TIME_OPTIONS[1] },
    { weekday: 1, time: AVAILABILITY_TIME_OPTIONS[4] },
    { weekday: 2, time: AVAILABILITY_TIME_OPTIONS[2] },
    { weekday: 3, time: AVAILABILITY_TIME_OPTIONS[1] },
    { weekday: 4, time: AVAILABILITY_TIME_OPTIONS[5] },
    { weekday: 5, time: AVAILABILITY_TIME_OPTIONS[6] },
  ],
  '2': [
    { weekday: 1, time: AVAILABILITY_TIME_OPTIONS[0] },
    { weekday: 2, time: AVAILABILITY_TIME_OPTIONS[3] },
    { weekday: 3, time: AVAILABILITY_TIME_OPTIONS[4] },
    { weekday: 4, time: AVAILABILITY_TIME_OPTIONS[1] },
    { weekday: 5, time: AVAILABILITY_TIME_OPTIONS[5] },
  ],
  '3': [
    { weekday: 2, time: AVAILABILITY_TIME_OPTIONS[1] },
    { weekday: 2, time: AVAILABILITY_TIME_OPTIONS[5] },
    { weekday: 4, time: AVAILABILITY_TIME_OPTIONS[2] },
    { weekday: 6, time: AVAILABILITY_TIME_OPTIONS[3] },
  ],
  '4': [
    { weekday: 1, time: AVAILABILITY_TIME_OPTIONS[2] },
    { weekday: 3, time: AVAILABILITY_TIME_OPTIONS[4] },
    { weekday: 5, time: AVAILABILITY_TIME_OPTIONS[1] },
    { weekday: 6, time: AVAILABILITY_TIME_OPTIONS[6] },
  ],
};

const SPECIALIZATION_TRANSLATIONS = Object.fromEntries(
  SEEDED_SPECIALIZATIONS.map((specialization) => [specialization.name, specialization.translations.name])
);

const BIO_TEMPLATE = {
  en: (city: string, specialties: string) =>
    `Practises in ${city} with a focus on ${specialties}. Helps clients with strategy, drafting, and hearings.`,
  hi: (city: string, specialties: string) =>
    `${city} में ${specialties} पर फोकस के साथ प्रैक्टिस करती/करते हैं। रणनीति, ड्राफ्टिंग और सुनवाई में सहायता करती/करते हैं।`,
  bn: (city: string, specialties: string) =>
    `${city}-এ ${specialties} বিষয়ক কাজ করেন। কৌশল, খসড়া এবং শুনানির জন্য সহায়তা দেন।`,
  te: (city: string, specialties: string) =>
    `${city} లో ${specialties} పై దృష్టితో ప్రాక్టీస్ చేస్తారు. వ్యూహం, డ్రాఫ్టింగ్ మరియు విచారణ సహాయం అందిస్తారు.`,
  mr: (city: string, specialties: string) =>
    `${city} येथे ${specialties} विषयांवर लक्ष केंद्रित करून प्रॅक्टिस करतात. रणनीती, मसुदा आणि सुनावणीस मदत करतात.`,
  ta: (city: string, specialties: string) =>
    `${city} நகரத்தில் ${specialties} மீது கவனம் கொண்டு செயல்படுகிறார். மூலோபாயம், வரைவுகள் மற்றும் விசாரணைகளில் உதவுகிறார்.`,
  gu: (city: string, specialties: string) =>
    `${city} માં ${specialties} પર ધ્યાન કેન્દ્રિત કરીને પ્રેક્ટિસ કરે છે. રણનીતિ, ડ્રાફ્ટિંગ અને હિયરિંગમાં સહાય કરે છે.`,
  ur: (city: string, specialties: string) =>
    `${city} میں ${specialties} پر توجہ کے ساتھ پریکٹس کرتے ہیں۔ حکمتِ عملی، ڈرافٹنگ اور سماعت میں مدد دیتے ہیں۔`,
  kn: (city: string, specialties: string) =>
    `${city} ನಲ್ಲಿ ${specialties} ಮೇಲೆ ಗಮನಹರಿಸಿ ಪ್ರಾಕ್ಟೀಸ್ ಮಾಡುತ್ತಾರೆ. ತಂತ್ರ, ಡ್ರಾಫ್ಟಿಂಗ್ ಮತ್ತು ವಿಚಾರಣೆಗೆ ಸಹಾಯ ಮಾಡುತ್ತಾರೆ.`,
  or: (city: string, specialties: string) =>
    `${city} ରେ ${specialties} ଉପରେ ଗୁରୁତ୍ୱ ଦେଇ ପ୍ରାକ୍ଟିସ କରନ୍ତି। କୌଶଳ, ଡ୍ରାଫ୍ଟିଂ ଏବଂ ଶୁଣାଣିରେ ସହାୟତା କରନ୍ତି।`,
  pa: (city: string, specialties: string) =>
    `${city} ਵਿੱਚ ${specialties} ਉੱਤੇ ਧਿਆਨ ਨਾਲ ਪ੍ਰੈਕਟਿਸ ਕਰਦੇ ਹਨ। ਰਣਨੀਤੀ, ਡਰਾਫਟਿੰਗ ਅਤੇ ਸੁਣਵਾਈ ਵਿੱਚ ਸਹਾਇਤਾ ਕਰਦੇ ਹਨ।`,
  ml: (city: string, specialties: string) =>
    `${city} ൽ ${specialties} മേഖലയിൽ ശ്രദ്ധകേന്ദ്രീകരിച്ച് പ്രവർത്തിക്കുന്നു. തന്ത്രം, ഡ്രാഫ്റ്റിംഗ്, ഹിയറിംഗ് എന്നിവയിൽ സഹായിക്കുന്നു.`,
  bho: (city: string, specialties: string) =>
    `${city} में ${specialties} पर फोकस करके प्रैक्टिस करेलें। रणनीति, ड्राफ्टिंग आ सुनवाई में मदद करेलें।`,
  bh: (city: string, specialties: string) =>
    `${city} मे ${specialties} पर ध्यान दैत प्रैक्टिस करैत छथि। रणनीति, ड्राफ्टिंग आ सुनवाइमे सहायता करैत छथि।`,
} satisfies Record<(typeof SUPPORTED_LOCALES)[number], (city: string, specialties: string) => string>;

function buildLocalizedBio(lawyer: (typeof MOCK_LAWYERS)[number], locale: (typeof SUPPORTED_LOCALES)[number]) {
  const formatter = new Intl.ListFormat(getDisplayLocale(locale), {
    style: 'long',
    type: 'conjunction',
  });
  const specialties = formatter.format(
    lawyer.specializations.map(
      (name) => SPECIALIZATION_TRANSLATIONS[name]?.[locale] ?? name
    )
  );

  return BIO_TEMPLATE[locale](lawyer.city, specialties);
}

async function seedLanguages() {
  for (const language of SEEDED_LANGUAGES) {
    const record = await prisma.language.upsert({
      where: { name: language.name },
      update: {},
      create: { name: language.name },
    });

    await Promise.all(
      SUPPORTED_LOCALES.map((locale) =>
        prisma.languageTranslation.upsert({
          where: {
            languageId_locale: {
              languageId: record.id,
              locale,
            },
          },
          update: {
            name: language.translations[locale],
          },
          create: {
            languageId: record.id,
            locale,
            name: language.translations[locale],
          },
        })
      )
    );
  }
}

async function seedSpecializations() {
  for (const specialization of SEEDED_SPECIALIZATIONS) {
    const record = await prisma.specialization.upsert({
      where: { name: specialization.name },
      update: { description: specialization.description },
      create: {
        name: specialization.name,
        description: specialization.description,
      },
    });

    await Promise.all(
      SUPPORTED_LOCALES.map((locale) =>
        prisma.specializationTranslation.upsert({
          where: {
            specializationId_locale: {
              specializationId: record.id,
              locale,
            },
          },
          update: {
            name: specialization.translations.name[locale],
            description: specialization.translations.description[locale],
          },
          create: {
            specializationId: record.id,
            locale,
            name: specialization.translations.name[locale],
            description: specialization.translations.description[locale],
          },
        })
      )
    );
  }
}

async function seedLawyers() {
  for (const lawyer of MOCK_LAWYERS) {
    const email = `lawyer${lawyer.id}@lexindia.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: lawyer.name,
        email,
        role: 'LAWYER',
        image: lawyer.image,
      },
    });

    const lawyerProfile = await prisma.lawyerProfile.upsert({
      where: { userId: user.id },
      update: {
        city: lawyer.city,
        experienceYears: lawyer.experience,
        rating: lawyer.rating,
        reviewCount: lawyer.reviews,
        consultationFee: lawyer.fee,
        isVerified: lawyer.verified,
        barCouncilID: lawyer.barCouncilID,
        bio: lawyer.bio,
        languages: {
          set: lawyer.languages.map((name) => ({ name })),
        },
        specializations: {
          set: lawyer.specializations.map((name) => ({ name })),
        },
      },
      create: {
        userId: user.id,
        city: lawyer.city,
        experienceYears: lawyer.experience,
        rating: lawyer.rating,
        reviewCount: lawyer.reviews,
        consultationFee: lawyer.fee,
        isVerified: lawyer.verified,
        barCouncilID: lawyer.barCouncilID,
        bio: lawyer.bio,
        languages: {
          connect: lawyer.languages.map((name) => ({ name })),
        },
        specializations: {
          connect: lawyer.specializations.map((name) => ({ name })),
        },
      },
    });

    await Promise.all(
      SUPPORTED_LOCALES.map((locale) =>
        prisma.lawyerProfileTranslation.upsert({
          where: {
            lawyerProfileId_locale: {
              lawyerProfileId: lawyerProfile.id,
              locale,
            },
          },
          update: {
            bio: buildLocalizedBio(lawyer, locale),
          },
          create: {
            lawyerProfileId: lawyerProfile.id,
            locale,
            bio: buildLocalizedBio(lawyer, locale),
          },
        })
      )
    );

    for (const mode of lawyer.modes) {
      await prisma.lawyerConsultationMode.upsert({
        where: {
          mode_lawyerProfileId: {
            mode,
            lawyerProfileId: lawyerProfile.id,
          },
        },
        update: {},
        create: {
          mode,
          lawyerProfileId: lawyerProfile.id,
        },
      });
    }

    await prisma.availabilitySlot.deleteMany({
      where: { lawyerProfileId: lawyerProfile.id },
    });

    await prisma.availabilitySlot.createMany({
      data: (SEEDED_AVAILABILITY_BY_LAWYER[lawyer.id] ?? []).map((slot) => ({
        lawyerProfileId: lawyerProfile.id,
        weekday: slot.weekday,
        time: slot.time,
      })),
    });

    const existingVerificationCase = await prisma.lawyerVerificationCase.findFirst({
      where: { lawyerProfileId: lawyerProfile.id },
      orderBy: { submittedAt: 'desc' },
    });

    const verificationCaseData = {
      submittedBarCouncilId: lawyer.barCouncilID,
      identityDocumentUrl: `https://example.com/verification/${lawyer.id}/identity.pdf`,
      enrollmentCertificateUrl: `https://example.com/verification/${lawyer.id}/enrolment.pdf`,
      lawyerNotes: lawyer.verified
        ? 'Seeded as an approved verification case.'
        : 'Seeded as an under-review verification case.',
      adminNotes: lawyer.verified ? 'Seeded verification approved.' : null,
      status: lawyer.verified ? 'APPROVED' : 'UNDER_REVIEW',
      reviewedAt: lawyer.verified ? new Date('2026-03-01T10:00:00.000Z') : null,
    };

    if (existingVerificationCase) {
      await prisma.lawyerVerificationCase.update({
        where: { id: existingVerificationCase.id },
        data: verificationCaseData,
      });
    } else {
      await prisma.lawyerVerificationCase.create({
        data: {
          lawyerProfileId: lawyerProfile.id,
          ...verificationCaseData,
        },
      });
    }
  }
}

async function seedKnowledgeBase() {
  for (const category of SEEDED_FAQ_CATEGORIES) {
    const categoryRecord = await prisma.fAQCategory.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: {
        name: category.name,
        description: category.description,
      },
    });

    await Promise.all(
      SUPPORTED_LOCALES.map((locale) =>
        prisma.fAQCategoryTranslation.upsert({
          where: {
            categoryId_locale: {
              categoryId: categoryRecord.id,
              locale,
            },
          },
          update: {
            name: category.translations.name[locale],
            description: category.translations.description[locale],
          },
          create: {
            categoryId: categoryRecord.id,
            locale,
            name: category.translations.name[locale],
            description: category.translations.description[locale],
          },
        })
      )
    );

    for (const faq of category.faqs) {
      const existingFaq = await prisma.fAQ.findFirst({
        where: {
          categoryId: categoryRecord.id,
          question: faq.question,
        },
      });

      const faqRecord = existingFaq
        ? await prisma.fAQ.update({
            where: { id: existingFaq.id },
            data: {
              answer: faq.answer,
              editorialStatus: 'APPROVED',
              reviewerNotes: 'Seeded as approved FAQ knowledge.',
              reviewedAt: new Date('2026-03-13T08:00:00.000Z'),
            },
          })
        : await prisma.fAQ.create({
            data: {
              categoryId: categoryRecord.id,
              question: faq.question,
              answer: faq.answer,
              editorialStatus: 'APPROVED',
              reviewerNotes: 'Seeded as approved FAQ knowledge.',
              reviewedAt: new Date('2026-03-13T08:00:00.000Z'),
            },
          });

      const existingReviewLog = await prisma.fAQReviewLog.findFirst({
        where: {
          faqId: faqRecord.id,
          status: 'APPROVED',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!existingReviewLog) {
        await prisma.fAQReviewLog.create({
          data: {
            faqId: faqRecord.id,
            status: 'APPROVED',
            notes: 'Seeded as approved FAQ knowledge.',
          },
        });
      }

      await Promise.all(
        SUPPORTED_LOCALES.map((locale) =>
          prisma.fAQTranslation.upsert({
            where: {
              faqId_locale: {
                faqId: faqRecord.id,
                locale,
              },
            },
            update: {
              question: faq.translations.question[locale],
              answer: faq.translations.answer[locale],
            },
            create: {
              faqId: faqRecord.id,
              locale,
              question: faq.translations.question[locale],
              answer: faq.translations.answer[locale],
            },
          })
        )
      );
    }
  }
}

async function seedGuideRegistry() {
  for (const guide of GUIDE_REGISTRY_SEED_RECORDS) {
    const guideRecord = await prisma.guideEntry.upsert({
      where: { slug: guide.slug },
      update: {
        title: guide.title,
        category: guide.category,
        readTime: guide.readTime,
        hasPublishedContent: guide.hasPublishedContent,
        editorialStatus: guide.editorialStatus,
        reviewerNotes: guide.hasPublishedContent
          ? 'Seeded as a reviewed live guide.'
          : 'Guide topic exists in the library but public copy is still in progress.',
        reviewedAt: guide.hasPublishedContent ? new Date('2026-03-13T08:00:00.000Z') : null,
      },
      create: {
        slug: guide.slug,
        title: guide.title,
        category: guide.category,
        readTime: guide.readTime,
        hasPublishedContent: guide.hasPublishedContent,
        editorialStatus: guide.editorialStatus,
        reviewerNotes: guide.hasPublishedContent
          ? 'Seeded as a reviewed live guide.'
          : 'Guide topic exists in the library but public copy is still in progress.',
        reviewedAt: guide.hasPublishedContent ? new Date('2026-03-13T08:00:00.000Z') : null,
      },
    });

    const existingReviewLog = await prisma.guideReviewLog.findFirst({
      where: {
        guideId: guideRecord.id,
        status: guide.editorialStatus,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!existingReviewLog) {
      await prisma.guideReviewLog.create({
        data: {
          guideId: guideRecord.id,
          status: guide.editorialStatus,
          notes: guide.hasPublishedContent
            ? 'Seeded as a reviewed live guide.'
            : 'Guide topic listed, but content is still being drafted.',
        },
      });
    }
  }
}

async function seedRightsRegistry() {
  for (const right of RIGHT_REGISTRY_SEED_RECORDS) {
    const rightRecord = await prisma.rightEntry.upsert({
      where: { slug: right.slug },
      update: {
        title: right.title,
        editorialStatus: right.editorialStatus,
        reviewerNotes: 'Seeded as a reviewed rights summary page.',
        reviewedAt: new Date('2026-03-13T08:00:00.000Z'),
      },
      create: {
        slug: right.slug,
        title: right.title,
        editorialStatus: right.editorialStatus,
        reviewerNotes: 'Seeded as a reviewed rights summary page.',
        reviewedAt: new Date('2026-03-13T08:00:00.000Z'),
      },
    });

    const existingReviewLog = await prisma.rightReviewLog.findFirst({
      where: {
        rightId: rightRecord.id,
        status: right.editorialStatus,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!existingReviewLog) {
      await prisma.rightReviewLog.create({
        data: {
          rightId: rightRecord.id,
          status: right.editorialStatus,
          notes: 'Seeded as a reviewed rights summary page.',
        },
      });
    }
  }
}

async function seedLawRegistry() {
  for (const act of LAW_REGISTRY_SEED_RECORDS) {
    const actRecord = await prisma.legalAct.upsert({
      where: { slug: act.slug },
      update: {
        shortCode: act.shortCode,
        title: act.title,
        description: act.description,
        sourceAuthority: act.sourceAuthority,
        sourceUrl: act.sourceUrl,
        sourcePdfUrl: act.sourcePdfUrl,
        editorialStatus: act.editorialStatus,
        reviewerNotes: act.reviewerNotes,
        reviewedAt:
          act.editorialStatus === 'APPROVED'
            ? new Date('2026-03-13T08:00:00.000Z')
            : null,
      },
      create: {
        slug: act.slug,
        shortCode: act.shortCode,
        title: act.title,
        description: act.description,
        sourceAuthority: act.sourceAuthority,
        sourceUrl: act.sourceUrl,
        sourcePdfUrl: act.sourcePdfUrl,
        editorialStatus: act.editorialStatus,
        reviewerNotes: act.reviewerNotes,
        reviewedAt:
          act.editorialStatus === 'APPROVED'
            ? new Date('2026-03-13T08:00:00.000Z')
            : null,
      },
    });

    const existingActReviewLog = await prisma.legalActReviewLog.findFirst({
      where: {
        legalActId: actRecord.id,
        status: act.editorialStatus,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!existingActReviewLog) {
      await prisma.legalActReviewLog.create({
        data: {
          legalActId: actRecord.id,
          status: act.editorialStatus,
          notes: act.reviewerNotes,
        },
      });
    }

    for (const section of act.sections) {
      const sectionRecord = await prisma.lawSection.upsert({
        where: {
          actId_sectionKey: {
            actId: actRecord.id,
            sectionKey: section.sectionKey,
          },
        },
        update: {
          title: section.title,
          sectionText: section.sectionText,
          plainEnglish: section.plainEnglish,
          punishmentSummary: section.punishmentSummary,
          practicalGuidance: section.practicalGuidance,
          exampleScenario: section.exampleScenario,
          editorialStatus: section.editorialStatus,
          reviewerNotes: section.reviewerNotes,
          reviewedAt:
            section.editorialStatus === 'APPROVED'
              ? new Date('2026-03-13T08:00:00.000Z')
              : null,
        },
        create: {
          actId: actRecord.id,
          sectionKey: section.sectionKey,
          title: section.title,
          sectionText: section.sectionText,
          plainEnglish: section.plainEnglish,
          punishmentSummary: section.punishmentSummary,
          practicalGuidance: section.practicalGuidance,
          exampleScenario: section.exampleScenario,
          editorialStatus: section.editorialStatus,
          reviewerNotes: section.reviewerNotes,
          reviewedAt:
            section.editorialStatus === 'APPROVED'
              ? new Date('2026-03-13T08:00:00.000Z')
              : null,
        },
      });

      const existingSectionReviewLog = await prisma.lawSectionReviewLog.findFirst({
        where: {
          lawSectionId: sectionRecord.id,
          status: section.editorialStatus,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!existingSectionReviewLog) {
        await prisma.lawSectionReviewLog.create({
          data: {
            lawSectionId: sectionRecord.id,
            status: section.editorialStatus,
            notes: section.reviewerNotes,
          },
        });
      }
    }
  }
}

async function seedLawMetadata() {
  const acts = await prisma.legalAct.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      sourceAuthority: true,
      sourceUrl: true,
      sourcePdfUrl: true,
      sections: {
        select: {
          id: true,
          sectionKey: true,
          title: true,
        },
      },
    },
  });

  const actIdBySlug = new Map(acts.map((act) => [act.slug, act.id]));
  const sectionIdByReference = new Map(
    acts.flatMap((act) =>
      act.sections.map((section) => [`${act.slug}::${section.sectionKey}`, section.id] as const)
    )
  );

  const issueTopicSlugsByAct = new Map<string, Set<string>>();
  const issueTopicSlugsBySection = new Map<string, Set<string>>();

  for (const topic of LEGAL_ISSUE_TOPICS_SEED_RECORDS) {
    await prisma.legalIssueTopic.upsert({
      where: { slug: topic.slug },
      update: {
        title: topic.title,
        description: topic.description,
        searchKeywords: topic.searchKeywords.join(' '),
      },
      create: {
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        searchKeywords: topic.searchKeywords.join(' '),
      },
    });

    for (const actSlug of topic.actSlugs ?? []) {
      if (!issueTopicSlugsByAct.has(actSlug)) {
        issueTopicSlugsByAct.set(actSlug, new Set());
      }

      issueTopicSlugsByAct.get(actSlug)?.add(topic.slug);
    }

    for (const sectionRef of topic.sectionRefs ?? []) {
      const key = `${sectionRef.actSlug}::${sectionRef.sectionKey}`;
      if (!issueTopicSlugsBySection.has(key)) {
        issueTopicSlugsBySection.set(key, new Set());
      }

      issueTopicSlugsBySection.get(key)?.add(topic.slug);
    }
  }

  for (const act of acts) {
    await prisma.legalAct.update({
      where: { id: act.id },
      data: {
        issueTopics: {
          set: [...(issueTopicSlugsByAct.get(act.slug) ?? [])].map((slug) => ({ slug })),
        },
      },
    });
  }

  for (const [sectionReference, sectionId] of sectionIdByReference.entries()) {
    await prisma.lawSection.update({
      where: { id: sectionId },
      data: {
        issueTopics: {
          set: [...(issueTopicSlugsBySection.get(sectionReference) ?? [])].map((slug) => ({
            slug,
          })),
        },
      },
    });
  }

  for (const actVersionRecord of LAW_VERSION_SEED_RECORDS) {
    const actId = actIdBySlug.get(actVersionRecord.actSlug);

    if (!actId) {
      continue;
    }

    await prisma.legalActVersion.deleteMany({
      where: {
        actId,
        versionLabel: {
          notIn: actVersionRecord.versions.map((version) => version.versionLabel),
        },
      },
    });

    if (actVersionRecord.versions.some((version) => version.isCurrent)) {
      await prisma.legalActVersion.updateMany({
        where: { actId },
        data: { isCurrent: false },
      });
    }

    for (const version of actVersionRecord.versions) {
      await prisma.legalActVersion.upsert({
        where: {
          actId_versionLabel: {
            actId,
            versionLabel: version.versionLabel,
          },
        },
        update: {
          status: version.status,
          commencementDate: toOptionalDate(version.commencementDate),
          effectiveFrom: toOptionalDate(version.effectiveFrom),
          effectiveTo: toOptionalDate(version.effectiveTo),
          updateSummary: version.updateSummary,
          officialSourceUrl: version.officialSourceUrl ?? null,
          officialPdfUrl: version.officialPdfUrl ?? null,
          isCurrent: version.isCurrent,
          displayOrder: version.displayOrder ?? 0,
        },
        create: {
          actId,
          versionLabel: version.versionLabel,
          status: version.status,
          commencementDate: toOptionalDate(version.commencementDate),
          effectiveFrom: toOptionalDate(version.effectiveFrom),
          effectiveTo: toOptionalDate(version.effectiveTo),
          updateSummary: version.updateSummary,
          officialSourceUrl: version.officialSourceUrl ?? null,
          officialPdfUrl: version.officialPdfUrl ?? null,
          isCurrent: version.isCurrent,
          displayOrder: version.displayOrder ?? 0,
        },
      });
    }
  }

  const aliasRecordsBySectionId = new Map<
    string,
    Array<{ alias: string; normalizedAlias: string; locale: string | null; aliasType: string }>
  >();

  for (const act of acts) {
    for (const section of act.sections) {
      aliasRecordsBySectionId.set(
        section.id,
        buildDefaultSectionAliases(section.sectionKey).map((alias) => ({
          ...alias,
          locale: null,
          aliasType: 'SEARCH',
        }))
      );
    }
  }

  for (const aliasSeedRecord of LAW_SECTION_ALIAS_SEED_RECORDS) {
    const sectionId = sectionIdByReference.get(
      `${aliasSeedRecord.actSlug}::${aliasSeedRecord.sectionKey}`
    );

    if (!sectionId) {
      continue;
    }

    const existing = aliasRecordsBySectionId.get(sectionId) ?? [];
    aliasRecordsBySectionId.set(
      sectionId,
      existing.concat(
        aliasSeedRecord.aliases.map((aliasRecord) => ({
          alias: aliasRecord.alias,
          normalizedAlias: normalizeSearchText(aliasRecord.alias),
          locale: aliasRecord.locale ?? null,
          aliasType: aliasRecord.aliasType ?? 'SEARCH',
        }))
      )
    );
  }

  for (const [sectionId, aliasRecords] of aliasRecordsBySectionId.entries()) {
    const dedupedAliases = Array.from(
      new Map(
        aliasRecords.map((record) => [
          `${record.normalizedAlias}::${record.locale ?? ''}`,
          record,
        ])
      ).values()
    );

    await prisma.lawSectionAlias.deleteMany({
      where: { lawSectionId: sectionId },
    });

    await prisma.lawSectionAlias.createMany({
      data: dedupedAliases.map((record) => ({
        lawSectionId: sectionId,
        alias: record.alias,
        normalizedAlias: record.normalizedAlias,
        locale: record.locale,
        aliasType: record.aliasType,
      })),
    });
  }

  const relationData = LEGAL_ACT_RELATION_SEED_RECORDS.flatMap((record) => {
    const fromActId = actIdBySlug.get(record.fromActSlug);
    const toActId = actIdBySlug.get(record.toActSlug);

    if (!fromActId || !toActId) {
      return [];
    }

    return [
      {
        fromActId,
        toActId,
        relationType: record.relationType,
        summary: record.summary,
        effectiveFrom: toOptionalDate(record.effectiveFrom),
      },
    ];
  });

  if (relationData.length > 0) {
    const involvedActIds = [...new Set(relationData.flatMap((record) => [record.fromActId, record.toActId]))];

    await prisma.legalActRelation.deleteMany({
      where: {
        fromActId: { in: involvedActIds },
        toActId: { in: involvedActIds },
      },
    });

    await prisma.legalActRelation.createMany({
      data: relationData,
    });
  }

  const crosswalkData = LAW_SECTION_CROSSWALK_SEED_RECORDS.flatMap((record) => {
    const fromSectionId = sectionIdByReference.get(`${record.fromActSlug}::${record.fromSectionKey}`);
    const toSectionId = sectionIdByReference.get(`${record.toActSlug}::${record.toSectionKey}`);

    if (!fromSectionId || !toSectionId) {
      return [];
    }

    return [
      {
        fromSectionId,
        toSectionId,
        relationType: record.relationType ?? 'SUCCESSOR',
        summary: record.summary,
      },
    ];
  });

  if (crosswalkData.length > 0) {
    const involvedSectionIds = [
      ...new Set(crosswalkData.flatMap((record) => [record.fromSectionId, record.toSectionId])),
    ];

    await prisma.lawSectionCrosswalk.deleteMany({
      where: {
        fromSectionId: { in: involvedSectionIds },
        toSectionId: { in: involvedSectionIds },
      },
    });

    await prisma.lawSectionCrosswalk.createMany({
      data: crosswalkData,
    });
  }

  const currentVersionByActSlug = new Map(
    LAW_VERSION_SEED_RECORDS.map((record) => [
      record.actSlug,
      record.versions.find((version) => version.isCurrent) ?? record.versions[0] ?? null,
    ])
  );

  const timelineRecordsByActId = new Map<string, Array<{
    title: string;
    summary: string | null;
    eventType: string;
    eventDate: Date | null;
    sourceLabel: string | null;
    sourceUrl: string | null;
    sourcePdfUrl: string | null;
    displayOrder: number;
  }>>();

  const pushActTimelineRecord = (
    actId: string,
    record: {
      title: string;
      summary: string | null;
      eventType: string;
      eventDate: Date | null;
      sourceLabel: string | null;
      sourceUrl: string | null;
      sourcePdfUrl: string | null;
      displayOrder: number;
    }
  ) => {
    if (!timelineRecordsByActId.has(actId)) {
      timelineRecordsByActId.set(actId, []);
    }

    timelineRecordsByActId.get(actId)?.push(record);
  };

  for (const actVersionRecord of LAW_VERSION_SEED_RECORDS) {
    const actId = actIdBySlug.get(actVersionRecord.actSlug);

    if (!actId) {
      continue;
    }

    for (const version of actVersionRecord.versions) {
      if (version.commencementDate) {
        pushActTimelineRecord(actId, {
          title: version.isCurrent ? 'Current version commenced' : 'Version commenced',
          summary: version.updateSummary,
          eventType: 'COMMENCED',
          eventDate: toOptionalDate(version.commencementDate),
          sourceLabel: 'Official government source',
          sourceUrl: version.officialSourceUrl ?? null,
          sourcePdfUrl: version.officialPdfUrl ?? null,
          displayOrder: (version.displayOrder ?? 0) + 10,
        });
      }

      if (
        version.effectiveFrom &&
        version.effectiveFrom !== version.commencementDate
      ) {
        pushActTimelineRecord(actId, {
          title: version.isCurrent ? 'Current version effective' : 'Version effective',
          summary: version.updateSummary,
          eventType: 'UPDATED',
          eventDate: toOptionalDate(version.effectiveFrom),
          sourceLabel: 'Official government source',
          sourceUrl: version.officialSourceUrl ?? null,
          sourcePdfUrl: version.officialPdfUrl ?? null,
          displayOrder: (version.displayOrder ?? 0) + 12,
        });
      }

      if (version.effectiveTo) {
        pushActTimelineRecord(actId, {
          title: version.isCurrent ? 'Current version period closes' : 'Historical version period ended',
          summary: version.updateSummary,
          eventType: version.status === 'HISTORICAL' ? 'SUPERSEDED' : 'UPDATED',
          eventDate: toOptionalDate(version.effectiveTo),
          sourceLabel: 'Official government source',
          sourceUrl: version.officialSourceUrl ?? null,
          sourcePdfUrl: version.officialPdfUrl ?? null,
          displayOrder: (version.displayOrder ?? 0) + 14,
        });
      }
    }
  }

  for (const relationRecord of LEGAL_ACT_RELATION_SEED_RECORDS) {
    const fromActId = actIdBySlug.get(relationRecord.fromActSlug);
    const toActId = actIdBySlug.get(relationRecord.toActSlug);

    if (!fromActId || !toActId) {
      continue;
    }

    const effectiveFrom = toOptionalDate(relationRecord.effectiveFrom);
    pushActTimelineRecord(fromActId, {
      title: relationRecord.relationType === 'SUPERSEDED_BY' ? 'Code transition' : 'Related act link',
      summary: relationRecord.summary,
      eventType: relationRecord.relationType === 'SUPERSEDED_BY' ? 'SUPERSEDED' : 'TRANSITION',
      eventDate: effectiveFrom,
      sourceLabel: null,
      sourceUrl: null,
      sourcePdfUrl: null,
      displayOrder: 90,
    });
    pushActTimelineRecord(toActId, {
      title: relationRecord.relationType === 'SUPERSEDED_BY' ? 'Current code transition' : 'Related act link',
      summary: relationRecord.summary,
      eventType: 'TRANSITION',
      eventDate: effectiveFrom,
      sourceLabel: null,
      sourceUrl: null,
      sourcePdfUrl: null,
      displayOrder: 92,
    });
  }

  for (const timelineRecord of LEGAL_ACT_TIMELINE_SEED_RECORDS) {
    const actId = actIdBySlug.get(timelineRecord.actSlug);

    if (!actId) {
      continue;
    }

    pushActTimelineRecord(actId, {
      title: timelineRecord.title,
      summary: timelineRecord.summary,
      eventType: timelineRecord.eventType,
      eventDate: toOptionalDate(timelineRecord.eventDate),
      sourceLabel: timelineRecord.sourceLabel ?? null,
      sourceUrl: timelineRecord.sourceUrl ?? null,
      sourcePdfUrl: timelineRecord.sourcePdfUrl ?? null,
      displayOrder: timelineRecord.displayOrder ?? 0,
    });
  }

  if (timelineRecordsByActId.size > 0) {
    const involvedActIds = [...timelineRecordsByActId.keys()];

    await prisma.legalActTimelineEvent.deleteMany({
      where: { actId: { in: involvedActIds } },
    });

    const timelineRows = [...timelineRecordsByActId.entries()].flatMap(([actId, records]) =>
      records
        .sort((left, right) => {
          const leftDate = left.eventDate?.getTime() ?? 0;
          const rightDate = right.eventDate?.getTime() ?? 0;

          if (left.displayOrder !== right.displayOrder) {
            return left.displayOrder - right.displayOrder;
          }

          return leftDate - rightDate;
        })
        .map((record, index) => ({
          actId,
          title: record.title,
          summary: record.summary,
          eventType: record.eventType,
          eventDate: record.eventDate,
          sourceLabel: record.sourceLabel,
          sourceUrl: record.sourceUrl,
          sourcePdfUrl: record.sourcePdfUrl,
          displayOrder: record.displayOrder + index,
        }))
    );

    await prisma.legalActTimelineEvent.createMany({
      data: timelineRows,
    });
  }

  const sectionHistoryRecordsBySectionId = new Map<string, Array<{
    title: string;
    summary: string | null;
    entryType: string;
    eventDate: Date | null;
    sourceLabel: string | null;
    sourceUrl: string | null;
    sourcePdfUrl: string | null;
    displayOrder: number;
  }>>();

  const pushSectionHistoryRecord = (
    sectionId: string,
    record: {
      title: string;
      summary: string | null;
      entryType: string;
      eventDate: Date | null;
      sourceLabel: string | null;
      sourceUrl: string | null;
      sourcePdfUrl: string | null;
      displayOrder: number;
    }
  ) => {
    if (!sectionHistoryRecordsBySectionId.has(sectionId)) {
      sectionHistoryRecordsBySectionId.set(sectionId, []);
    }

    sectionHistoryRecordsBySectionId.get(sectionId)?.push(record);
  };

  for (const act of acts) {
    const currentVersion = currentVersionByActSlug.get(act.slug);

    for (const section of act.sections) {
      pushSectionHistoryRecord(section.id, {
        title: 'Current official citation',
        summary: `${section.sectionKey} is currently indexed on LexIndia under ${act.title}. Cross-check the official source whenever the exact statutory wording matters.`,
        entryType: 'CURRENT_CITATION',
        eventDate: toOptionalDate(currentVersion?.effectiveFrom ?? currentVersion?.commencementDate),
        sourceLabel: act.sourceAuthority ?? 'Official government source',
        sourceUrl: act.sourceUrl ?? null,
        sourcePdfUrl: act.sourcePdfUrl ?? null,
        displayOrder: 10,
      });

      if (currentVersion?.effectiveTo) {
        pushSectionHistoryRecord(section.id, {
          title: 'Historical period note',
          summary: `${section.sectionKey} belongs to a historical code period that LexIndia retains for legacy FIR, pleading, and order references.`,
          entryType: 'COMMENCEMENT',
          eventDate: toOptionalDate(currentVersion.effectiveTo),
          sourceLabel: act.sourceAuthority ?? 'Official government source',
          sourceUrl: act.sourceUrl ?? null,
          sourcePdfUrl: act.sourcePdfUrl ?? null,
          displayOrder: 12,
        });
      }
    }
  }

  for (const crosswalkRecord of LAW_SECTION_CROSSWALK_SEED_RECORDS) {
    const fromSectionId = sectionIdByReference.get(
      `${crosswalkRecord.fromActSlug}::${crosswalkRecord.fromSectionKey}`
    );
    const toSectionId = sectionIdByReference.get(
      `${crosswalkRecord.toActSlug}::${crosswalkRecord.toSectionKey}`
    );

    if (!fromSectionId || !toSectionId) {
      continue;
    }

    pushSectionHistoryRecord(fromSectionId, {
      title: 'Current-code crosswalk',
      summary: crosswalkRecord.summary,
      entryType: 'CROSSWALK',
      eventDate: toOptionalDate('2024-07-01'),
      sourceLabel: null,
      sourceUrl: null,
      sourcePdfUrl: null,
      displayOrder: 30,
    });
    pushSectionHistoryRecord(toSectionId, {
      title: 'Legacy-code reference',
      summary: crosswalkRecord.summary,
      entryType: 'LEGACY_REFERENCE',
      eventDate: toOptionalDate('2024-07-01'),
      sourceLabel: null,
      sourceUrl: null,
      sourcePdfUrl: null,
      displayOrder: 32,
    });
  }

  for (const historyRecord of LAW_SECTION_HISTORY_SEED_RECORDS) {
    const sectionId = sectionIdByReference.get(`${historyRecord.actSlug}::${historyRecord.sectionKey}`);

    if (!sectionId) {
      continue;
    }

    pushSectionHistoryRecord(sectionId, {
      title: historyRecord.title,
      summary: historyRecord.summary,
      entryType: historyRecord.entryType,
      eventDate: toOptionalDate(historyRecord.eventDate),
      sourceLabel: historyRecord.sourceLabel ?? null,
      sourceUrl: historyRecord.sourceUrl ?? null,
      sourcePdfUrl: historyRecord.sourcePdfUrl ?? null,
      displayOrder: historyRecord.displayOrder ?? 0,
    });
  }

  if (sectionHistoryRecordsBySectionId.size > 0) {
    const involvedSectionIds = [...sectionHistoryRecordsBySectionId.keys()];

    await prisma.lawSectionHistoryEntry.deleteMany({
      where: { lawSectionId: { in: involvedSectionIds } },
    });

    const historyRows = [...sectionHistoryRecordsBySectionId.entries()].flatMap(
      ([lawSectionId, records]) =>
        records
          .sort((left, right) => {
            const leftDate = left.eventDate?.getTime() ?? 0;
            const rightDate = right.eventDate?.getTime() ?? 0;

            if (left.displayOrder !== right.displayOrder) {
              return left.displayOrder - right.displayOrder;
            }

            return leftDate - rightDate;
          })
          .map((record, index) => ({
            lawSectionId,
            title: record.title,
            summary: record.summary,
            entryType: record.entryType,
            eventDate: record.eventDate,
            sourceLabel: record.sourceLabel,
            sourceUrl: record.sourceUrl,
            sourcePdfUrl: record.sourcePdfUrl,
            displayOrder: record.displayOrder + index,
          }))
    );

    await prisma.lawSectionHistoryEntry.createMany({
      data: historyRows,
    });
  }
}

async function rebuildSearchDocuments() {
  const [guides, rights, acts] = await Promise.all([
    prisma.guideEntry.findMany({
      where: {
        editorialStatus: 'APPROVED',
        hasPublishedContent: true,
      },
      orderBy: { slug: 'asc' },
      select: {
        slug: true,
        title: true,
        category: true,
      },
    }),
    prisma.rightEntry.findMany({
      where: { editorialStatus: 'APPROVED' },
      orderBy: { slug: 'asc' },
      select: {
        slug: true,
        title: true,
      },
    }),
    prisma.legalAct.findMany({
      where: { editorialStatus: 'APPROVED' },
      orderBy: { slug: 'asc' },
      select: {
        slug: true,
        title: true,
        shortCode: true,
        description: true,
        issueTopics: {
          select: {
            title: true,
            description: true,
            searchKeywords: true,
          },
        },
        outgoingRelations: {
          select: {
            relationType: true,
            summary: true,
            toAct: {
              select: {
                slug: true,
                shortCode: true,
                title: true,
              },
            },
          },
        },
        incomingRelations: {
          select: {
            relationType: true,
            summary: true,
            fromAct: {
              select: {
                slug: true,
                shortCode: true,
                title: true,
              },
            },
          },
        },
        versions: {
          orderBy: [{ isCurrent: 'desc' }, { displayOrder: 'asc' }],
          select: {
            isCurrent: true,
            versionLabel: true,
            updateSummary: true,
            status: true,
          },
        },
        timelineEvents: {
          orderBy: [{ displayOrder: 'asc' }, { eventDate: 'asc' }],
          select: {
            title: true,
            summary: true,
            eventType: true,
          },
        },
        sections: {
          where: { editorialStatus: 'APPROVED' },
          orderBy: { sectionKey: 'asc' },
          select: {
            sectionKey: true,
            title: true,
            plainEnglish: true,
            sectionText: true,
            aliases: {
              orderBy: { alias: 'asc' },
              select: { alias: true },
            },
            issueTopics: {
              select: {
                title: true,
                description: true,
                searchKeywords: true,
              },
            },
            outgoingCrosswalks: {
              select: {
                relationType: true,
                summary: true,
                toSection: {
                  select: {
                    sectionKey: true,
                    title: true,
                    act: {
                      select: {
                        slug: true,
                        shortCode: true,
                        title: true,
                      },
                    },
                  },
                },
              },
            },
            incomingCrosswalks: {
              select: {
                relationType: true,
                summary: true,
                fromSection: {
                  select: {
                    sectionKey: true,
                    title: true,
                    act: {
                      select: {
                        slug: true,
                        shortCode: true,
                        title: true,
                      },
                    },
                  },
                },
              },
            },
            historyEntries: {
              orderBy: [{ displayOrder: 'asc' }, { eventDate: 'asc' }],
              select: {
                title: true,
                summary: true,
                entryType: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const documents = [
    ...guides.map((guide) => ({
      documentType: 'GUIDE',
      entitySlug: guide.slug,
      locale: 'en',
      href: `/guides/${guide.slug}`,
      title: guide.title,
      description: guide.category,
      searchText: [guide.title, guide.category, guide.slug].join(' '),
      rankBoost: 1.0,
      isPublished: true,
    })),
    ...rights.map((right) => ({
      documentType: 'RIGHT',
      entitySlug: right.slug,
      locale: 'en',
      href: `/rights/${right.slug}`,
      title: right.title,
      description: 'Reviewed rights summary',
      searchText: [right.title, right.slug, 'rights summary legal help'].join(' '),
      rankBoost: 0.95,
      isPublished: true,
    })),
    ...acts.flatMap((act) => {
      const currentVersion = act.versions.find((version) => version.isCurrent) ?? act.versions[0];
      const actIssueTerms = act.issueTopics.flatMap((topic) => [
        topic.title,
        topic.description ?? '',
        topic.searchKeywords ?? '',
      ]);
      const actRelationTerms = [
        ...act.outgoingRelations.flatMap((relation) => [
          relation.relationType,
          relation.summary ?? '',
          relation.toAct.title,
          relation.toAct.shortCode,
          relation.toAct.slug,
        ]),
        ...act.incomingRelations.flatMap((relation) => [
          relation.relationType,
          relation.summary ?? '',
          relation.fromAct.title,
          relation.fromAct.shortCode,
          relation.fromAct.slug,
        ]),
      ];
      const actTimelineTerms = act.timelineEvents.flatMap((event) => [
        event.title,
        event.summary ?? '',
        event.eventType,
      ]);

      return [
        {
          documentType: 'LAW_ACT',
          entitySlug: act.slug,
          locale: 'en',
          href: `/laws/${act.slug}`,
          title: act.title,
          description: act.description,
          searchText: [
            act.title,
            act.shortCode,
            act.description,
            currentVersion?.versionLabel ?? '',
            currentVersion?.updateSummary ?? '',
            ...actRelationTerms,
            ...actTimelineTerms,
            ...actIssueTerms,
          ].join(' '),
          rankBoost: 1.05,
          isPublished: true,
        },
        ...act.sections.map((section) => {
          const sectionIssueTerms = section.issueTopics.flatMap((topic) => [
            topic.title,
            topic.description ?? '',
            topic.searchKeywords ?? '',
          ]);
          const sectionCrosswalkTerms = [
            ...section.outgoingCrosswalks.flatMap((crosswalk) => [
              crosswalk.relationType,
              crosswalk.summary ?? '',
              crosswalk.toSection.sectionKey,
              crosswalk.toSection.title,
              crosswalk.toSection.act.title,
              crosswalk.toSection.act.shortCode,
              crosswalk.toSection.act.slug,
            ]),
            ...section.incomingCrosswalks.flatMap((crosswalk) => [
              crosswalk.relationType,
              crosswalk.summary ?? '',
              crosswalk.fromSection.sectionKey,
              crosswalk.fromSection.title,
              crosswalk.fromSection.act.title,
              crosswalk.fromSection.act.shortCode,
              crosswalk.fromSection.act.slug,
            ]),
          ];
          const sectionHistoryTerms = section.historyEntries.flatMap((entry) => [
            entry.title,
            entry.summary ?? '',
            entry.entryType,
          ]);

          return {
            documentType: 'LAW_SECTION',
            entitySlug: `${act.slug}::${section.sectionKey}`,
            locale: 'en',
            href: `/laws/${act.slug}/${encodeURIComponent(section.sectionKey)}`,
            title: `${section.sectionKey}: ${section.title}`,
            description: `${act.title} - ${section.plainEnglish}`,
            searchText: [
              act.title,
              act.shortCode,
              section.sectionKey,
              section.title,
              section.plainEnglish,
              section.sectionText,
              currentVersion?.versionLabel ?? '',
              ...section.aliases.map((alias) => alias.alias),
              ...sectionCrosswalkTerms,
              ...sectionHistoryTerms,
              ...sectionIssueTerms,
            ].join(' '),
            rankBoost: 1.2,
            isPublished: true,
          };
        }),
      ];
    }),
  ];

  await prisma.searchDocument.deleteMany();
  await prisma.searchDocument.createMany({
    data: documents,
  });
}

async function ensureLawMetadataAndSearchSeeded() {
  const getCounts = async () => ({
    legalActVersions: await prisma.legalActVersion.count(),
    legalActTimelineEvents: await prisma.legalActTimelineEvent.count(),
    legalActRelations: await prisma.legalActRelation.count(),
    lawSectionAliases: await prisma.lawSectionAlias.count(),
    lawSectionCrosswalks: await prisma.lawSectionCrosswalk.count(),
    lawSectionHistoryEntries: await prisma.lawSectionHistoryEntry.count(),
    searchDocuments: await prisma.searchDocument.count(),
  });

  let counts = await getCounts();

  if (
    counts.legalActVersions === 0 ||
    counts.legalActTimelineEvents === 0 ||
    counts.legalActRelations === 0 ||
    counts.lawSectionAliases === 0 ||
    counts.lawSectionCrosswalks === 0 ||
    counts.lawSectionHistoryEntries === 0 ||
    counts.searchDocuments === 0
  ) {
    console.warn('Law metadata/search seed was incomplete on first pass. Rebuilding once.');
    await seedLawMetadata();
    await rebuildSearchDocuments();
    counts = await getCounts();
  }

  if (
    counts.legalActVersions === 0 ||
    counts.legalActTimelineEvents === 0 ||
    counts.legalActRelations === 0 ||
    counts.lawSectionAliases === 0 ||
    counts.lawSectionCrosswalks === 0 ||
    counts.lawSectionHistoryEntries === 0 ||
    counts.searchDocuments === 0
  ) {
    throw new Error(
      `Law metadata/search seed verification failed: ${JSON.stringify(counts)}`
    );
  }

  console.log(
    `Law metadata ready: ${counts.legalActVersions} versions, ${counts.legalActTimelineEvents} act timeline events, ${counts.legalActRelations} act relations, ${counts.lawSectionAliases} aliases, ${counts.lawSectionCrosswalks} section crosswalks, ${counts.lawSectionHistoryEntries} section history entries, ${counts.searchDocuments} search docs.`
  );
}

async function seedTemplates() {
  for (const template of SEEDED_TEMPLATES) {
    const editorialStatus =
      template.content.includes('[Insert content here]') || /sample/i.test(template.content)
        ? 'REVIEW'
        : 'APPROVED';
    const existingTemplate = await prisma.documentTemplate.findFirst({
      where: { title: template.title },
    });

    const templateRecord = existingTemplate
      ? await prisma.documentTemplate.update({
          where: { id: existingTemplate.id },
          data: {
            description: template.description,
            category: template.category,
            downloads: template.downloads,
            content: template.content,
            editorialStatus,
            reviewerNotes:
              editorialStatus === 'APPROVED'
                ? 'Seeded as an approved template.'
                : 'Seeded as a preview-only template pending editorial review.',
          },
        })
      : await prisma.documentTemplate.create({
          data: {
            title: template.title,
            description: template.description,
            category: template.category,
            downloads: template.downloads,
            content: template.content,
            editorialStatus,
            reviewerNotes:
              editorialStatus === 'APPROVED'
                ? 'Seeded as an approved template.'
                : 'Seeded as a preview-only template pending editorial review.',
          },
        });

    const existingReviewLog = await prisma.templateReviewLog.findFirst({
      where: {
        templateId: templateRecord.id,
        status: editorialStatus,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!existingReviewLog) {
      await prisma.templateReviewLog.create({
        data: {
          templateId: templateRecord.id,
          status: editorialStatus,
          notes:
            editorialStatus === 'APPROVED'
              ? 'Seeded as approved.'
              : 'Seeded in review because placeholder text remains.',
        },
      });
    }

    await Promise.all(
      SUPPORTED_LOCALES.map((locale) =>
        prisma.documentTemplateTranslation.upsert({
          where: {
            templateId_locale: {
              templateId: templateRecord.id,
              locale,
            },
          },
          update: {
            title: template.translations.title[locale],
            description: template.translations.description[locale],
            category: template.translations.category[locale],
            content: template.translations.content[locale],
          },
          create: {
            templateId: templateRecord.id,
            locale,
            title: template.translations.title[locale],
            description: template.translations.description[locale],
            category: template.translations.category[locale],
            content: template.translations.content[locale],
          },
        })
      )
    );
  }
}

async function main() {
  console.log('Start seeding...');

  try {
    await seedLanguages();
    await seedSpecializations();
    await seedLawyers();
    await seedKnowledgeBase();
    await seedGuideRegistry();
    await seedRightsRegistry();
    await seedLawRegistry();
    await seedLawMetadata();
    await seedTemplates();
    await rebuildSearchDocuments();
    await ensureLawMetadataAndSearchSeeded();
    console.log('Seeding finished.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
