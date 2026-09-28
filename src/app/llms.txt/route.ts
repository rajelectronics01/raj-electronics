import { getProducts } from '@/lib/products';
import { SITE_URL, STORE, CATEGORY_SEO, categorySlugFor, formatINR, plainText } from '@/lib/seo';
import type { Product } from '@/types';

// /llms.txt — a plain-text profile of the store for AI assistants (GEO).
// See https://llmstxt.org. Built from the same data as the site so it stays current.
export const revalidate = 3600;

export async function GET() {
    let products: Product[] = [];
    try {
        products = await getProducts();
    } catch (err) {
        console.error('llms.txt: could not load products:', err);
    }

    const byCategory = new Map<string, Product[]>();
    for (const p of products) {
        const slug = categorySlugFor(p.category);
        byCategory.set(slug, [...(byCategory.get(slug) ?? []), p]);
    }

    const categorySections = Object.entries(CATEGORY_SEO)
        .filter(([slug]) => slug !== 'all')
        .map(([slug, seo]) => {
            const items = byCategory.get(slug) ?? [];
            const lines = items.slice(0, 40).map((p) =>
                `- [${plainText(p.name, 200)}](${SITE_URL}/product/${p.slug}): ${p.brand}, ${formatINR(p.price)}${p.inStock === false ? ' (currently out of stock)' : ''}`
            );
            return [
                `## ${seo.h1}`,
                '',
                `${seo.intro}`,
                '',
                `Category page: ${SITE_URL}/category/${slug}`,
                ...(lines.length ? ['', ...lines] : []),
            ].join('\n');
        });

    const body = `# ${STORE.name}

> ${STORE.name} is an authorized electronics and home appliance dealer on Rashtrapati Road (RP Road), Secunderabad, Hyderabad, India, in business since ${STORE.foundingYear}. It sells air conditioners, smart TVs, refrigerators, washing machines, air coolers, chest freezers and water dispensers to homes, and supplies businesses, schools and hospitals in bulk with GST billing.

## Store facts

- Address: ${STORE.streetAddress}, ${STORE.locality}, ${STORE.region} ${STORE.postalCode}, India
- Phone / WhatsApp: ${STORE.phoneDisplay}
- Hours: open every day, ${STORE.opens}–${STORE.closes} IST
- Website: ${SITE_URL}
- Brands: ${STORE.brands.join(', ')}
- Services: delivery across Hyderabad and Secunderabad, AC installation, GST invoices, bulk and institutional orders
- Areas served: ${STORE.areasServed.join(', ')}
- Prices below are live website prices in Indian Rupees and may change; call the store for the current best price.

## Key pages

- [Home](${SITE_URL}/)
- [Bulk & institutional orders](${SITE_URL}/bulk-orders): wholesale AC, TV and appliance supply for offices, schools, hospitals and housing societies
- [About Raj Electronics](${SITE_URL}/about)
- [Best AC for Hyderabad summer](${SITE_URL}/blog/best-ac-for-hyderabad-summer)
- [Bulk electronics procurement guide, Hyderabad](${SITE_URL}/blog/bulk-electronics-procurement-guide-hyderabad)
- [Why buy from an authorized dealer](${SITE_URL}/blog/authorized-electronics-dealer-secunderabad)
- [AC price list in Hyderabad (live prices)](${SITE_URL}/blog/ac-price-list-hyderabad)
- [Which ton AC for my room? Size chart](${SITE_URL}/blog/which-ton-ac-for-my-room)

${categorySections.join('\n\n')}

## Policies

- [Shipping policy](${SITE_URL}/shipping-policy)
- [Refund & cancellation policy](${SITE_URL}/refund-policy)
- [Terms & conditions](${SITE_URL}/terms-and-conditions)
- [Privacy policy](${SITE_URL}/privacy-policy)
`;

    return new Response(body, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
