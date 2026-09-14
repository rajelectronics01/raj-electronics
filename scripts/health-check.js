/**
 * RAJ ELECTRONICS: POST-RESTORE HEALTH CHECK
 * Run after un-pausing Supabase:  node scripts/health-check.js
 * Verifies pooler + direct connections and that core tables have data.
 */
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const ref = (process.env.DATABASE_URL || '').match(/postgres\.([a-z0-9]+):/)?.[1] || 'unknown';

async function probe(label, url) {
  if (!url) return console.log(`⚠️  ${label}: env var not set`);
  const client = new PrismaClient({ datasources: { db: { url } } });
  try {
    await client.$queryRaw`SELECT 1`;
    console.log(`✅ ${label}: connected`);
    return client;
  } catch (err) {
    console.log(`❌ ${label}: ${err.message.split('\n').find(l => l.trim()) || err.message}`);
    await client.$disconnect();
    return null;
  }
}

(async () => {
  console.log(`Supabase project ref: ${ref}\n`);

  const pooled = await probe('DATABASE_URL (pooler)', process.env.DATABASE_URL);
  const direct = await probe('DIRECT_URL', process.env.DIRECT_URL);

  const client = pooled || direct;
  if (client) {
    console.log('\n--- Table counts ---');
    for (const model of ['product', 'user', 'order', 'storeSetting']) {
      try {
        console.log(`${model.padEnd(13)} ${await client[model].count()}`);
      } catch (err) {
        console.log(`${model.padEnd(13)} ❌ ${err.message.split('\n')[0]}`);
      }
    }
  }

  if (pooled) await pooled.$disconnect();
  if (direct) await direct.$disconnect();
})();
