import { getProductsByCategory } from '@/lib/products';
import CategoryPageClient from './CategoryPageClient';
import { Metadata } from 'next';
import {
    CATEGORY_SEO, SITE_URL, STORE, Faq, formatINR,
    faqJsonLd, breadcrumbJsonLd, jsonLdString,
} from '@/lib/seo';

export const revalidate = 3600;

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const seo = CATEGORY_SEO[slug];

    if (seo) {
        return {
            title: seo.title,
            description: seo.description,
            keywords: seo.keywords,
            alternates: { canonical: `https://rajelectronics.co/category/${slug}` },
            openGraph: {
                title: seo.title,
                description: seo.description,
                url: `https://rajelectronics.co/category/${slug}`,
                siteName: 'Raj Electronics',
                type: 'website',
                locale: 'en_IN',
            },
        };
    }

    // Fallback for unknown slugs
    const categoryName = slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
        title: `${categoryName} in Secunderabad | Best Price | Raj Electronics`,
        description: `Buy ${categoryName} at best price in Secunderabad & Hyderabad. Authorized dealer. Call +91 92907 48866.`,
        alternates: { canonical: `https://rajelectronics.co/category/${slug}` },
    };
}

export default async function CategoryPage(props: Props) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const categorySlug = params.slug;
    const brandFilter = searchParams.brand;
    const minPrice = searchParams.min ? parseInt(searchParams.min as string) : 0;
    const maxPrice = searchParams.max ? parseInt(searchParams.max as string) : Infinity;

    // 1. Fetch by category
    let products = await getProductsByCategory(categorySlug);

    // Get all unique brands
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean).sort();

    // SEO/AEO content is built from the full, unfiltered category.
    const seo = CATEGORY_SEO[categorySlug];
    const faqs: Faq[] = [...(seo?.faqs ?? [])];
    const prices = products.map(p => p.price).filter(p => Number.isFinite(p) && p > 0);
    if (seo && prices.length > 0) {
        // A price answer drawn from live stock — the question answer engines get asked most.
        const brandList = uniqueBrands.slice(0, 6).join(', ');
        faqs.unshift({
            q: `What is the price of ${seo.name} at Raj Electronics, Secunderabad?`,
            a: `We currently have ${products.length} ${seo.name} in stock, priced from ${formatINR(Math.min(...prices))} to ${formatINR(Math.max(...prices))}${brandList ? `, from brands including ${brandList}` : ''}. Visit us at ${STORE.streetAddress}, ${STORE.locality} or call ${STORE.phoneDisplay} for today's best price.`,
        });
    }
    const pageUrl = `${SITE_URL}/category/${categorySlug}`;
    const jsonLd = [
        breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: seo?.h1 ?? categorySlug, path: `/category/${categorySlug}` },
        ]),
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: seo?.h1 ?? categorySlug,
            url: pageUrl,
            description: seo?.description,
            mainEntity: {
                '@type': 'ItemList',
                numberOfItems: products.length,
                itemListElement: products.slice(0, 50).map((p, i) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    url: `${SITE_URL}/product/${p.slug}`,
                    name: p.name,
                })),
            },
        },
        ...(faqs.length > 0 ? [faqJsonLd(faqs)] : []),
    ];

    // 2. Filter by Brand
    if (brandFilter) {
        const brands = Array.isArray(brandFilter) ? brandFilter : [brandFilter];
        products = products.filter(p => brands.includes(p.brand));
    }

    // 3. Filter by Price
    products = products.filter(p => !isNaN(p.price) && p.price >= minPrice && p.price <= maxPrice);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
            />
            <CategoryPageClient
                params={params}
                searchParams={searchParams}
                initialProducts={products}
                uniqueBrands={uniqueBrands}
                heading={seo?.h1}
                intro={seo?.intro}
                faqs={faqs}
            />
        </>
    );
}
