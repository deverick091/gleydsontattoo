const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const adminEmail = process.env.ADMIN_EMAIL;
  const rawPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !rawPassword) {
    throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no arquivo .env antes de executar o seed.');
  }
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: 'Gleydson Admin',
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Gleydson Admin',
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user upserted: ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
