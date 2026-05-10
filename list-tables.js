const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const tables = await prisma.$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`;
    console.log('Tables in database:', tables);
  } catch (error) {
    console.error('Failed to list tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
