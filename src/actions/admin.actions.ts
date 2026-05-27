'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { auth } from '@/auth';

// Helper to save uploaded files locally
async function saveUploadedFile(file: unknown, subFolder = ''): Promise<string | null> {
  if (!file || !(file instanceof File) || file.size === 0 || file.name === 'undefined') {
    return null;
  }
  
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Define the upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subFolder);
    
    // Ensure directories exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Create a safe, unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filename = `${uniqueSuffix}-${safeName}`;
    const filePath = path.join(uploadDir, filename);
    
    const ext = path.extname(file.name).toLowerCase();
    const allowedExtensions = ['.pdf', '.mp3', '.mp4', '.mov', '.png', '.jpg', '.jpeg', '.gif', '.csv'];
    if (!allowedExtensions.includes(ext)) {
      console.warn(`File upload rejected: invalid extension ${ext}`);
      return null;
    }
    
    // Write file to filesystem
    await fs.promises.writeFile(filePath, buffer);
    
    // Return relative URL for Next.js public access
    return `/uploads/${subFolder ? subFolder + '/' : ''}${filename}`;
  } catch (error) {
    console.error('Error saving file:', error);
    return null;
  }
}

export async function getTopics() {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return [];
  }
  try {
    const topics = await prisma.topic.findMany({
      include: {
        materials: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return JSON.parse(JSON.stringify(topics));
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
}

// CSV string'ini JSON nesnesine çeviren yardımcı fonksiyon
function parseCSV(csvText: string) {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  // Çift tırnak içindeki virgülleri ayırmamak için Regex kullanımı
  const splitRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

  const headers = lines[0].split(splitRegex).map(header => header.replace(/^"|"$/g, '').trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(splitRegex); 
    const obj: any = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] ? values[i].replace(/^"|"$/g, '').trim() : '';
    });
    return obj;
  });
}

export async function uploadQuestionsCSV(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  try {
    const file = formData.get('file') as File;
    const topicId = formData.get('topicId') as string;
    const isTest = formData.get('isTest') === 'true';

    if (!file || !topicId) {
      return { error: 'Dosya ve Konu ID eksik.' };
    }

    const fileContent = await file.text();
    const parsedData = parseCSV(fileContent);

    // Veritabanına kaydetme (Toplu ekleme - bulk insert)
    // Beklenen CSV Başlıkları: text, optionA, optionB, optionC, optionD, correctAnswer, explanation
    const questionsToCreate = parsedData.map((row: any) => ({
      topicId,
      text: row.text,
      optionA: row.optionA,
      optionB: row.optionB,
      optionC: row.optionC,
      optionD: row.optionD,
      correctAnswer: row.correctAnswer,
      explanation: row.explanation || '',
      isTest: isTest // Dinamik olarak formdan gelen değere göre ayarlanır
    }));

    await prisma.question.createMany({
      data: questionsToCreate
    });

    revalidatePath('/admin');
    return { success: `${questionsToCreate.length} adet soru başarıyla yüklendi.` };

  } catch (error) {
    console.error('CSV Yükleme Hatası:', error);
    return { error: 'Sorular yüklenirken bir hata oluştu. CSV formatını kontrol edin.' };
  }
}

export async function uploadFlashcardsCSV(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  try {
    const file = formData.get('file') as File;
    const topicId = formData.get('topicId') as string;

    if (!file || !topicId) {
      return { error: 'Dosya ve Konu ID eksik.' };
    }

    const fileContent = await file.text();
    const parsedData = parseCSV(fileContent);

    // Veritabanına kaydetme
    // Beklenen CSV Başlıkları: frontText, backText
    const flashcardsToCreate = parsedData.map((row: any) => ({
      topicId,
      frontText: row.frontText,
      backText: row.backText
    }));

    await prisma.flashcard.createMany({
      data: flashcardsToCreate
    });

    revalidatePath('/admin');
    return { success: `${flashcardsToCreate.length} adet flashcard başarıyla yüklendi.` };

  } catch (error) {
    console.error('Flashcard CSV Yükleme Hatası:', error);
    return { error: 'Flashcardlar yüklenirken bir hata oluştu. CSV formatını kontrol edin.' };
  }
}

export async function addTopic(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;

  const pdfFile = formData.get('pdfFile');
  const audioFile = formData.get('audioFile');
  const videoFile = formData.get('videoFile');

  let pdfUrl = (formData.get('pdfUrl') as string) || '';
  let audioUrl = (formData.get('audioUrl') as string) || '';
  let videoUrl = (formData.get('videoUrl') as string) || '';

  try {
    const savedPdfPath = await saveUploadedFile(pdfFile, 'documents');
    if (savedPdfPath) pdfUrl = savedPdfPath;

    const savedAudioPath = await saveUploadedFile(audioFile, 'audio');
    if (savedAudioPath) audioUrl = savedAudioPath;

    const savedVideoPath = await saveUploadedFile(videoFile, 'video');
    if (savedVideoPath) videoUrl = savedVideoPath;

    const newTopic = await prisma.topic.create({
      data: {
        title,
        category,
        description,
        isPublished: true,
      }
    });

    if (pdfUrl) {
      await prisma.material.create({
        data: {
          topicId: newTopic.id,
          type: 'READ',
          title: `${title} - Konu Çalışma Dökümanı (PDF)`,
          url: pdfUrl
        }
      });
    }

    if (audioUrl) {
      await prisma.material.create({
        data: {
          topicId: newTopic.id,
          type: 'LISTEN',
          title: `${title} - Sesli Özet (MP3)`,
          url: audioUrl
        }
      });
    }

    if (videoUrl) {
      await prisma.material.create({
        data: {
          topicId: newTopic.id,
          type: 'WATCH',
          title: `${title} - Videolu Konu Özeti`,
          url: videoUrl
        }
      });
    }
    revalidatePath('/admin');
    return { success: 'Konu ve çalışma materyalleri başarıyla eklendi.', topic: JSON.parse(JSON.stringify(newTopic)) };
  } catch (error) {
    console.error(error);
    return { error: 'Konu eklenirken hata oluştu.' };
  }
}

export async function updateTopicMaterials(topicId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  let pdfUrl = (formData.get('pdfUrl') as string) || '';
  let audioUrl = (formData.get('audioUrl') as string) || '';
  let videoUrl = (formData.get('videoUrl') as string) || '';

  const pdfFile = formData.get('pdfFile');
  const audioFile = formData.get('audioFile');
  const videoFile = formData.get('videoFile');

  try {
    const savedPdfPath = await saveUploadedFile(pdfFile, 'documents');
    if (savedPdfPath) pdfUrl = savedPdfPath;

    const savedAudioPath = await saveUploadedFile(audioFile, 'audio');
    if (savedAudioPath) audioUrl = savedAudioPath;

    const savedVideoPath = await saveUploadedFile(videoFile, 'video');
    if (savedVideoPath) videoUrl = savedVideoPath;

    // 1. Delete old materials
    await prisma.material.deleteMany({
      where: { topicId }
    });

    const topic = await prisma.topic.findUnique({
      where: { id: topicId }
    });

    if (!topic) {
      return { error: 'Konu bulunamadı.' };
    }

    // 2. Re-create new materials if provided
    if (pdfUrl) {
      await prisma.material.create({
        data: {
          topicId,
          type: 'READ',
          title: `${topic.title} - Konu Çalışma Dökümanı (PDF)`,
          url: pdfUrl
        }
      });
    }

    if (audioUrl) {
      await prisma.material.create({
        data: {
          topicId,
          type: 'LISTEN',
          title: `${topic.title} - Sesli Özet (MP3)`,
          url: audioUrl
        }
      });
    }

    if (videoUrl) {
      await prisma.material.create({
        data: {
          topicId,
          type: 'WATCH',
          title: `${topic.title} - Videolu Konu Özeti`,
          url: videoUrl
        }
      });
    }

    revalidatePath('/admin');
    revalidatePath(`/topic/${topicId}`);
    return { success: 'Çalışma materyalleri başarıyla güncellendi!' };
  } catch (error) {
    console.error(error);
    return { error: 'Materyaller güncellenirken bir hata oluştu.' };
  }
}

export async function addQuestion(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  const topicId = formData.get('topicId') as string;
  const text = formData.get('text') as string;
  const optionA = formData.get('optionA') as string;
  const optionB = formData.get('optionB') as string;
  const optionC = formData.get('optionC') as string;
  const optionD = formData.get('optionD') as string;
  const correctAnswer = formData.get('correctAnswer') as string;
  const explanation = formData.get('explanation') as string;
  const isTest = formData.get('isTest') === 'true';

  if (!topicId || !text || !correctAnswer || correctAnswer === 'Seçiniz') {
    return { error: 'Konu ID, Soru Kökü ve Doğru Cevap zorunludur.' };
  }

  try {
    await prisma.question.create({
      data: {
        topicId,
        text,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation,
        isTest,
      }
    });
    
    revalidatePath('/admin');
    return { success: 'Soru başarıyla eklendi.' };
  } catch (error) {
    return { error: 'Soru eklenirken hata oluştu. Konu ID sinin doğru olduğundan emin olun.' };
  }
}

export async function addFlashcard(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  const topicId = formData.get('topicId') as string;
  const frontText = formData.get('frontText') as string;
  const backText = formData.get('backText') as string;

  if (!topicId || !frontText || !backText) {
    return { error: 'Konu ID, Ön Yüz ve Arka Yüz zorunludur.' };
  }

  try {
    await prisma.flashcard.create({
      data: {
        topicId,
        frontText,
        backText,
      }
    });
    
    revalidatePath('/admin');
    return { success: 'Flashcard başarıyla eklendi.' };
  } catch (error) {
    return { error: 'Flashcard eklenirken hata oluştu.' };
  }
}

export async function deleteQuestion(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  try {
    await prisma.question.delete({
      where: { id }
    });
    revalidatePath('/admin/questions');
    return { success: 'Soru başarıyla silindi.' };
  } catch (error) {
    return { error: 'Soru silinirken hata oluştu.' };
  }
}

export async function updateQuestion(id: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  const text = formData.get('text') as string;
  const optionA = formData.get('optionA') as string;
  const optionB = formData.get('optionB') as string;
  const optionC = formData.get('optionC') as string;
  const optionD = formData.get('optionD') as string;
  const correctAnswer = formData.get('correctAnswer') as string;
  const explanation = formData.get('explanation') as string;
  const isTest = formData.get('isTest') === 'true';

  if (!text || !correctAnswer || correctAnswer === 'Seçiniz') {
    return { error: 'Soru Kökü ve Doğru Cevap zorunludur.' };
  }

  try {
    await prisma.question.update({
      where: { id },
      data: {
        text,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation,
        isTest,
      }
    });
    
    revalidatePath('/admin/questions');
    return { success: 'Soru başarıyla güncellendi.' };
  } catch (error) {
    return { error: 'Soru güncellenirken hata oluştu.' };
  }
}

export async function deleteFlashcard(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  try {
    await prisma.flashcard.delete({
      where: { id }
    });
    revalidatePath('/admin/flashcards');
    return { success: 'Flashcard başarıyla silindi.' };
  } catch (error) {
    return { error: 'Flashcard silinirken hata oluştu.' };
  }
}

export async function updateFlashcard(id: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  const frontText = formData.get('frontText') as string;
  const backText = formData.get('backText') as string;

  if (!frontText || !backText) {
    return { error: 'Ön Yüz ve Arka Yüz alanları zorunludur.' };
  }

  try {
    await prisma.flashcard.update({
      where: { id },
      data: {
        frontText,
        backText,
      }
    });
    
    revalidatePath('/admin/flashcards');
    return { success: 'Flashcard başarıyla güncellendi.' };
  } catch (error) {
    return { error: 'Flashcard güncellenirken hata oluştu.' };
  }
}
