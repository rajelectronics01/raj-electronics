const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const start = Date.now();
        const p = await prisma.product.findFirst();
        console.log('Connected! Product:', p);
        console.log('Time:', Date.now() - start, 'ms');
    } catch (e) {
        console.error('Error connecting to Prisma:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
