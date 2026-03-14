const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function cleanOrders() {
  console.log('🧹 Cleaning up demo orders from database...');
  try {
    const deleted = await prisma.order.deleteMany({});
    console.log(`✅ Successfully deleted ${deleted.count} demo orders.`);
    
    // Also reset the invoice sequence if possible through raw SQL
    // Since we're on Supabase/PostgreSQL
    try {
      await prisma.$executeRaw`ALTER SEQUENCE IF EXISTS "Order_invoiceNo_seq" RESTART WITH 1011;`;
      console.log('✅ Invoice sequence reset to 1011.');
    } catch (seqError) {
      console.log('⚠️ Could not reset sequence (might be manual field):', seqError.message);
    }

  } catch (err) {
    console.error('❌ Error cleaning orders:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanOrders();
