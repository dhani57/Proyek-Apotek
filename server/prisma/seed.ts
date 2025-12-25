import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

const prisma: PrismaClient = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@apotek.com' },
    update: {},
    create: {
      email: 'admin@apotek.com',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', { email: admin.email, role: admin.role });

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Obat Bebas' },
      update: {},
      create: {
        name: 'Obat Bebas',
        description: 'Obat yang dapat dibeli tanpa resep dokter',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Obat Keras' },
      update: {},
      create: {
        name: 'Obat Keras',
        description: 'Obat yang memerlukan resep dokter',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Suplemen' },
      update: {},
      create: {
        name: 'Suplemen',
        description: 'Suplemen dan vitamin',
      },
    }),
  ]);

  console.log('Categories created:', categories.length);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
