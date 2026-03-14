const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  console.log('Testing connection to Port 6543 (Pooler)...');
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Port 6543 connection successful!');
  } catch (err) {
    console.error('❌ Port 6543 connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }

  const prismaDirect = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DIRECT_URL
      }
    }
  });

  console.log('\nTesting connection to Port 5432 (Direct)...');
  try {
    await prismaDirect.$queryRaw`SELECT 1`;
    console.log('✅ Port 5432 connection successful!');
  } catch (err) {
    console.error('❌ Port 5432 connection failed:', err.message);
  } finally {
    await prismaDirect.$disconnect();
  }
}

testConnection();
