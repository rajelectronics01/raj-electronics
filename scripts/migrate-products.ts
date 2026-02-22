import { PrismaClient } from '@prisma/client';
import productsData from '../src/data/products.json' assert { type: "json" };

const prisma = new PrismaClient();

async function main() {
    console.log(`Starting migration of ${productsData.length} products...`);

    let successCount = 0;
    let failCount = 0;

    for (const product of productsData as any[]) {
        try {
            // Generate a safe slug
            const safeSlug = product.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            await prisma.product.upsert({
                where: { slug: safeSlug },
                update: {}, // Don't overwrite if it already exists
                create: {
                    name: product.name,
                    slug: safeSlug,
                    brand: product.brand || "Generic",
                    category: product.category || "Uncategorized",
                    price: Number(product.price),
                    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
                    description: product.description || "",
                    images: product.images || [],
                    features: product.features || [],
                    inStock: true,
                    // isFeatured is not in schema, so we skip it
                }
            });
            console.log(`✅ Migrated: ${product.name}`);
            successCount++;
        } catch (error) {
            console.error(`❌ Failed to migrate: ${product.name}`);
            console.error(error);
            failCount++;
        }
    }

    console.log(`--- Migration Complete ---`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

main()
    .catch((e) => {
        console.error("Migration Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
