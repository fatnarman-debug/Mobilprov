const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'fatnarman@gmail.com';
  // Use environment variable if set, otherwise fallback to the requested default
  const password = process.env.ADMIN_PASSWORD || '12345678qw.,ASX';
  
  console.log('Seeding database...');
  
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  if (!existingUser) {
    await prisma.user.create({
      data: {
        email,
        name: 'Admin',
        passwordHash,
        role: 'ADMIN',
        isPaid: true,
        nativeLanguage: 'TR'
      }
    });
    console.log('Admin user created successfully.');
  } else {
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        role: 'ADMIN',
        isPaid: true
      }
    });
    console.log('Admin user updated successfully.');
  }

  console.log('Seeding/updating database SEO articles...');
  try {
    await prisma.article.update({
      where: { slug: 'medborgarskapsprovet-2026-ny-lag' },
      data: {
        keywords: 'nya kraven för svenskt medborgarskap 2026, medborgarskapsprovet 2026, nytt krav medborgarskap sverige 2026, samhällskunskapstestet 2026, språktest medborgarskap sverige, försörjningskrav medborgarskap, migrationsverket nya regler medborgarskap',
        metaDescription: 'Vad som förändras 2026: Samhällskunskapstest, Migrationsverket nya regler för medborgarskap, språkkrav, egen försörjning och skärpta villkor.'
      }
    });
    console.log('Updated: medborgarskapsprovet-2026-ny-lag');
  } catch (err) {
    console.log('Could not update medborgarskapsprovet-2026-ny-lag (it may not exist in database yet)');
  }

  try {
    await prisma.article.update({
      where: { slug: 'medborgarskapsprov-fragor-och-svar-faq' },
      data: {
        keywords: 'medborgarskapsprov frågor och svar, vanliga frågor medborgarskapsprov, medborgarskapsprov faq, migrationsverket medborgarskapsprov, uhr medborgarskapstest, medborgarskapsprov test, medborgarskapsprov frågor',
        metaDescription: 'Svar på alla vanliga frågor om det nya medborgarskapsprovet 2026. Läs om UHR medborgarskapstest, provsimuleringar, frågor och svar på svenska.'
      }
    });
    console.log('Updated: medborgarskapsprov-fragor-och-svar-faq');
  } catch (err) {
    console.log('Could not update medborgarskapsprov-fragor-och-svar-faq (it may not exist in database yet)');
  }

  try {
    await prisma.article.update({
      where: { slug: 'medborgarskapsprov-utbildningsmaterial-sverige-i-fokus' },
      data: {
        keywords: 'sverige i fokus pdf, sverige i fokus mp3, utbildningsmaterial medborgarskapsprov, medborgarskapsprov studiematerial, sverige i fokus, uhr medborgarskapsprov',
        metaDescription: 'Lär dig allt om det officiella studiematerialet Sverige i fokus för UHR medborgarskapsprov. Ladda ner PDF, lyssna på MP3 och plugga effektivt.'
      }
    });
    console.log('Updated: medborgarskapsprov-utbildningsmaterial-sverige-i-fokus');
  } catch (err) {
    console.log('Could not update medborgarskapsprov-utbildningsmaterial-sverige-i-fokus (it may not exist in database yet)');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
