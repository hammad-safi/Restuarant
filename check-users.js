const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, role: true, is_active: true }
    });
    console.log('Users in database:', users);
  } catch (error) {
    console.error('Failed to list users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
