const { PrismaClient } = require('@prisma/client');

async function main() {
    const prisma = new PrismaClient();
    try {
        await prisma.$queryRawUnsafe(`ALTER TABLE "Product" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;`);
        console.log("Successfully added isFeatured column to Product table.");
    } catch (e) {
        if (e.message.includes("already exists")) {
            console.log("Column already exists. Skipping.");
        } else {
            console.error("Migration failed:", e);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
