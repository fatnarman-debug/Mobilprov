import { PrismaClient } from '@prisma/client';
import { articles } from '../lib/articles';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration of static articles to database...');
  
  let successCount = 0;
  let errorCount = 0;

  for (const article of articles) {
    try {
      // Check if it already exists
      const existing = await prisma.article.findUnique({
        where: { slug: article.slug },
      });

      if (existing) {
        console.log(`[SKIP] Article already exists: ${article.slug}`);
        continue;
      }

      // Convert keywords array to comma separated string since SQLite doesn't support String[]
      const keywordsString = article.keywords.join(', ');

      const faqsToCreate = article.faqItems ? article.faqItems.map((faq, idx) => ({
        question: faq.question,
        answer: faq.answer,
        order: idx,
      })) : [];

      await prisma.article.create({
        data: {
          slug: article.slug,
          title: article.title,
          metaDescription: article.metaDescription,
          content: article.content,
          readingTime: article.readingTime,
          keywords: keywordsString,
          isPublished: true, // Auto publish existing articles
          publishedAt: new Date(article.publishedAt),
          updatedAt: new Date(article.updatedAt),
          faqs: {
            create: faqsToCreate,
          },
        },
      });

      console.log(`[SUCCESS] Migrated article: ${article.slug}`);
      successCount++;
    } catch (error) {
      console.error(`[ERROR] Failed to migrate article: ${article.slug}`, error);
      errorCount++;
    }
  }

  console.log(`\nMigration completed!`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
