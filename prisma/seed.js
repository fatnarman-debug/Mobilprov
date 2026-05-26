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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
