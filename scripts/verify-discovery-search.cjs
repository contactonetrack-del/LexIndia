/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    const [total, byType] = await Promise.all([
      prisma.searchDocument.count({
        where: {
          isPublished: true,
          locale: 'en',
        },
      }),
      prisma.searchDocument.groupBy({
        by: ['documentType'],
        where: {
          isPublished: true,
          locale: 'en',
        },
        _count: {
          _all: true,
        },
        orderBy: {
          documentType: 'asc',
        },
      }),
    ]);

    console.log(`Published discovery documents: ${total}`);

    for (const row of byType) {
      console.log(`${row.documentType}: ${row._count._all}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Discovery search verification failed.', error);
  process.exitCode = 1;
});
