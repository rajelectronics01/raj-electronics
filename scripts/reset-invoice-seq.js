const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Reset the sequence for Invoice Number to start from 1011
    await prisma.$executeRaw`ALTER SEQUENCE "Order_invoiceNo_seq" RESTART WITH 1011;`;
    console.log('Successfully reset invoice sequence to 1011');
  } catch (error) {
    console.error('Error resetting sequence:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
