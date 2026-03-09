// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MOCK_LAWYERS = [
  {
    id: '1',
    name: 'Adv. Rajesh Kumar',
    image: 'https://picsum.photos/seed/lawyer1/200/200',
    city: 'New Delhi',
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
    experience: 5,
    rating: 4.6,
    reviews: 45,
    fee: 800,
    languages: ['English', 'Telugu'],
    specializations: ['Cyber Law', 'Family Law'],
    modes: ['VIDEO', 'CALL', 'CHAT'],
    verified: false,
  }
];

const FAQ_DATA = [
  {
    category: 'Arrest Rights',
    questions: [
      {
        q: 'What are my rights if the police arrest me?',
        a: 'Under Indian law (Article 22 of the Constitution and CrPC), you have the right to: 1) Be informed of the grounds of arrest. 2) Consult a legal practitioner of your choice. 3) Be produced before a magistrate within 24 hours of arrest. 4) Have a relative or friend informed about your arrest.'
      },
      {
        q: 'Can the police arrest a woman at night?',
        a: 'Generally, no. Under Section 46(4) of the CrPC, no woman can be arrested after sunset and before sunrise. In exceptional circumstances, a woman police officer must obtain prior permission from the Judicial Magistrate First Class to make a night arrest.'
      }
    ]
  },
  {
    category: 'Domestic Violence',
    questions: [
      {
        q: 'How do I file a domestic violence complaint?',
        a: 'You can file a complaint under the Protection of Women from Domestic Violence Act (PWDVA), 2005. You can approach the local police station, a Protection Officer, or a Service Provider. You can also directly file a complaint before the Magistrate.'
      },
      {
        q: 'Can I get free legal aid for a domestic violence case?',
        a: 'Yes. Under the Legal Services Authorities Act, 1987, women are entitled to free legal aid irrespective of their income. You can approach the District Legal Services Authority (DLSA) or the State Legal Services Authority (SLSA).'
      }
    ]
  },
  {
    category: 'Consumer Rights',
    questions: [
      {
        q: 'How do I file a consumer complaint against a company?',
        a: 'You can file a complaint online through the e-Daakhil portal or approach the District Consumer Disputes Redressal Commission if the claim is up to ₹50 Lakhs. You do not strictly need a lawyer to file a consumer complaint.'
      }
    ]
  }
];

const TEMPLATES = [
  {
    id: 'fir',
    title: 'Police Complaint / FIR Format',
    description: 'Standard format for drafting a written complaint to the Police Station In-charge.',
    category: 'Criminal',
    downloads: 12000
  },
  {
    id: 'rti',
    title: 'RTI Application Form',
    description: 'Format to file a Right to Information (RTI) request to any government department.',
    category: 'Civil Rights',
    downloads: 45000
  },
  {
    id: 'legal-notice',
    title: 'Legal Notice for Unpaid Dues',
    description: 'Draft legal notice to be sent to a defaulter for recovery of money.',
    category: 'Civil / Corporate',
    downloads: 8000
  },
  {
    id: 'rent-agreement',
    title: 'Standard Rent Agreement',
    description: '11-month residential rental agreement format protecting both landlord and tenant.',
    category: 'Property',
    downloads: 30000
  },
  {
    id: 'affidavit',
    title: 'General Name Change Affidavit',
    description: 'Standard affidavit format required for publishing a name change in the gazette.',
    category: 'General',
    downloads: 15000
  }
];

async function main() {
  console.log('Start seeding...');

  try {
    // 1. Seed Languages
    const allLanguages = [...new Set(MOCK_LAWYERS.flatMap(l => l.languages))];
    for (const lang of allLanguages) {
      await prisma.language.upsert({
        where: { name: lang },
        update: {},
        create: { name: lang }
      });
    }

    // 2. Seed Specializations
    const allSpecs = [...new Set(MOCK_LAWYERS.flatMap(l => l.specializations))];
    for (const spec of allSpecs) {
      await prisma.specialization.upsert({
        where: { name: spec },
        update: {},
        create: { name: spec }
      });
    }

    // 3. Seed Lawyers
    for (const l of MOCK_LAWYERS) {
      const email = `lawyer${l.id}@lexindia.com`;
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name: l.name,
          email: email,
          role: "LAWYER",
          image: l.image,
        }
      });

      const lawyerProfile = await prisma.lawyerProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          city: l.city,
          experienceYears: l.experience,
          rating: l.rating,
          reviewCount: l.reviews,
          consultationFee: l.fee,
          isVerified: l.verified,
          languages: {
            connect: l.languages.map(lang => ({ name: lang }))
          },
          specializations: {
            connect: l.specializations.map(spec => ({ name: spec }))
          }
        }
      });

      // Add consultation modes
      for (const modeStr of l.modes) {
        await prisma.lawyerConsultationMode.upsert({
          where: {
            mode_lawyerProfileId: {
              mode: modeStr,
              lawyerProfileId: lawyerProfile.id
            }
          },
          update: {},
          create: {
            mode: modeStr,
            lawyerProfileId: lawyerProfile.id
          }
        });
      }
    }

    // 4. Seed FAQs
    for (const cat of FAQ_DATA) {
      const dbCat = await prisma.fAQCategory.upsert({
        where: { name: cat.category },
        update: {},
        create: { name: cat.category }
      });

      for (const q of cat.questions) {
        await prisma.fAQ.create({
          data: {
            question: q.q,
            answer: q.a,
            categoryId: dbCat.id
          }
        });
      }
    }

    // 5. Seed Templates
    for (const t of TEMPLATES) {
      await prisma.documentTemplate.create({
        data: {
          title: t.title,
          description: t.description,
          category: t.category,
          downloads: t.downloads,
          content: `Sample ${t.title}\n\nThis is a sample template for ${t.title}. Please consult a lawyer before using this in any official capacity.\n\n[Insert Content Here]`
        }
      });
    }

    console.log('Seeding finished.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
