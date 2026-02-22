const { PrismaClient } = require('@prisma/client');

const ref = 'diciaehjyujtntfbijxn';
const pass = 'Samderiya%4001';
const host = 'aws-0-ap-south-1.pooler.supabase.com';

const urls = [
    `postgresql://postgres.${ref}:${pass}@${host}:6543/postgres?pgbouncer=true`,
    `postgresql://postgres:${pass}@${host}:6543/postgres?pgbouncer=true`,
    `postgresql://postgres.${ref}:${pass}@${host}:5432/postgres`,
    `postgresql://postgres:${pass}@${host}:5432/postgres`,
];

async function testConnection(url) {
    process.env.DATABASE_URL = url;
    const prisma = new PrismaClient({
        datasourceUrl: url
    });

    try {
        await prisma.$connect();
        // try a simple query
        await prisma.product.count();
        console.log(`✅ SUCCESS: ${url.replace(pass, 'HIDDEN')}`);
        await prisma.$disconnect();
        return true;
    } catch (err) {
        console.log(`❌ FAILED: ${url.replace(pass, 'HIDDEN')} - ${err.message}`);
        await prisma.$disconnect();
        return false;
    }
}

async function main() {
    for (const url of urls) {
        console.log(`Testing ${url.replace(pass, 'HIDDEN')}...`);
        const success = await testConnection(url);
        if (success) {
            console.log('Use this connection string!');
            break;
        }
    }
}

main();
