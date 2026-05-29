import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { articles } from '@/lib/articles';

export async function GET(request: Request) {
  // Simple protection: requires a secret key to run
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Change this secret to whatever you want, or remove the check if you run it immediately
  if (secret !== 'run-migration-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let successCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      // Check if exists
      const existing = await prisma.article.findUnique({
        where: { slug: article.slug },
      });

      if (existing) {
        continue;
      }

      const keywordsString = Array.isArray(article.keywords) 
        ? article.keywords.join(', ') 
        : article.keywords;

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
          isPublished: true,
          publishedAt: new Date(article.publishedAt),
          updatedAt: new Date(article.updatedAt),
          faqs: {
            create: faqsToCreate,
          },
        },
      });

      successCount++;
    }

    return NextResponse.json({ 
      success: true, 
      migrated: successCount,
      errors: errorCount,
      message: 'Migration completed successfully!' 
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
