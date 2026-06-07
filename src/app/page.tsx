import HomeClient from './HomeClient';
import { publicSeo } from '@/lib/seo';
import prisma from '@/lib/db';

export const metadata = publicSeo.home;

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: {
      title: true,
      slug: true,
      metaDescription: true,
      publishedAt: true,
      readingTime: true,
    }
  });

  const serializedArticles = articles.map(a => ({
    ...a,
    publishedAt: a.publishedAt.toISOString(),
  }));

  return (
    <>
      <HomeClient articles={serializedArticles} />
    </>
  );
}

