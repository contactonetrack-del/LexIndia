// @ts-nocheck
import { PrismaClient } from '@prisma/client';

import {
  SEEDED_FAQ_CATEGORIES,
  SEEDED_LANGUAGES,
  SEEDED_SPECIALIZATIONS,
  SEEDED_TEMPLATES,
} from '@/lib/content/seed-data';
import { SUPPORTED_LOCALES } from '@/lib/i18n/config';
import { getDisplayLocale } from '@/lib/i18n/display-locale';

const prisma = new PrismaClient();

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
    verified: false,
  },
];

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
        bio: lawyer.bio,
      },
      create: {
        userId: user.id,
        city: lawyer.city,
        experienceYears: lawyer.experience,
        rating: lawyer.rating,
        reviewCount: lawyer.reviews,
        consultationFee: lawyer.fee,
        consultationModes: lawyer.modes,
        isVerified: lawyer.verified,
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
            data: { answer: faq.answer },
          })
        : await prisma.fAQ.create({
            data: {
              categoryId: categoryRecord.id,
              question: faq.question,
              answer: faq.answer,
            },
          });

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

async function seedTemplates() {
  for (const template of SEEDED_TEMPLATES) {
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
          },
        })
      : await prisma.documentTemplate.create({
          data: {
            title: template.title,
            description: template.description,
            category: template.category,
            downloads: template.downloads,
            content: template.content,
          },
        });

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
    await seedTemplates();
    console.log('Seeding finished.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
