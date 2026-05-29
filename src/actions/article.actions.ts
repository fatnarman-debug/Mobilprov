'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getArticles(publishedOnly = false) {
  try {
    const articles = await prisma.article.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: { publishedAt: 'desc' },
      include: {
        faqs: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return { articles };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { error: 'Failed to fetch articles' };
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        faqs: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return { article };
  } catch (error) {
    console.error('Error fetching article:', error);
    return { error: 'Failed to fetch article' };
  }
}

export async function getArticleById(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        faqs: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return { article };
  } catch (error) {
    console.error('Error fetching article:', error);
    return { error: 'Failed to fetch article' };
  }
}

export async function createArticle(data: any) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    const { faqs, keywords, ...articleData } = data;

    const article = await prisma.article.create({
      data: {
        ...articleData,
        keywords: keywords || '',
        faqs: {
          create: faqs || [],
        },
      },
    });

    revalidatePath('/artiklar');
    revalidatePath('/admin/articles');
    return { article };
  } catch (error: any) {
    console.error('Error creating article:', error);
    // Unique constraint on slug
    if (error.code === 'P2002') {
      return { error: 'Bu URL (slug) zaten kullanılıyor. Lütfen benzersiz bir tane girin.' };
    }
    return { error: 'Makale oluşturulurken bir hata oluştu' };
  }
}

export async function updateArticle(id: string, data: any) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    const { faqs, keywords, ...articleData } = data;

    // To update FAQs, it's easier to delete existing ones and recreate them
    await prisma.articleFaq.deleteMany({
      where: { articleId: id },
    });

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...articleData,
        keywords: keywords || '',
        faqs: {
          create: faqs || [],
        },
      },
    });

    revalidatePath('/artiklar');
    revalidatePath(`/artiklar/${article.slug}`);
    revalidatePath('/admin/articles');
    return { article };
  } catch (error: any) {
    console.error('Error updating article:', error);
    if (error.code === 'P2002') {
      return { error: 'Bu URL (slug) zaten kullanılıyor. Lütfen benzersiz bir tane girin.' };
    }
    return { error: 'Makale güncellenirken bir hata oluştu' };
  }
}

export async function deleteArticle(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    await prisma.article.delete({
      where: { id },
    });

    revalidatePath('/artiklar');
    revalidatePath('/admin/articles');
    return { success: true };
  } catch (error) {
    console.error('Error deleting article:', error);
    return { error: 'Makale silinirken bir hata oluştu' };
  }
}
