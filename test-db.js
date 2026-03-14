const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany();
    console.log('Products count:', products.length);
    
    // Check if user table exists
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
    
    console.log('DB Check Success!');
  } catch (e) {
    console.error('Test Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
