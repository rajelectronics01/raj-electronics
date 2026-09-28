import { notFound } from 'next/navigation';
import { getProductBySlug, getProductsByCategory } from '@/lib/products';
import { Metadata } from 'next';
import ProductPageClient from '../_components/ProductPageClient';
import {
    SITE_URL, STORE, STORE_ID, CATEGORY_SEO, formatINR, absoluteUrl, plainText,
    categorySlugFor, breadcrumbJsonLd, jsonLdString,
} from '@/lib/seo';

export const revalidate = 3600;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return { title: 'Product Not Found | Raj Electronics Secunderabad' };
    }

    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const name = plainText(product.name, 200);
    const fullName = name.toLowerCase().includes(product.brand.toLowerCase())
        ? name
        : `${product.brand} ${name}`;
    const priceText = formatINR(product.price);
    const offerText = discount > 0 ? ` (${discount}% off MRP ${formatINR(product.originalPrice!)})` : '';
    const title = `${fullName} Price in Hyderabad – ${priceText} | Raj Electronics`;
    const description = `Buy ${fullName} for ${priceText}${offerText} at Raj Electronics, RP Road, Secunderabad — authorized ${product.brand} dealer since ${STORE.foundingYear}. ${product.inStock === false ? 'Call for availability.' : 'In stock.'} GST invoice, delivery across Hyderabad. Call ${STORE.phoneDisplay}.`;
    const url = `${SITE_URL}/product/${slug}`;

    return {
        title,
        description,
        keywords: `${fullName}, ${fullName} price, ${fullName} price in Hyderabad, ${fullName} price in Secunderabad, ${product.brand} ${product.category} price Hyderabad, buy ${product.brand} ${product.category} Secunderabad, ${product.brand} dealer RP Road, authorized ${product.brand} dealer Hyderabad, ${product.category} shop Secunderabad`,
        openGraph: {
            title,
            description,
            url,
            siteName: STORE.name,
            images: product.images[0] ? [{ url: absoluteUrl(product.images[0]), alt: `${fullName} – Raj Electronics Secunderabad` }] : [],
            locale: 'en_IN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: product.images[0] ? [absoluteUrl(product.images[0])] : [],
        },
        alternates: { canonical: url },
    };
}

export default async function ProductPage(props: Props) {
    const params = await props.params;
    const product = await getProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = (await getProductsByCategory(product.category))
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    const url = `${SITE_URL}/product/${product.slug}`;
    const categorySlug = categorySlugFor(product.category);
    const categorySeo = CATEGORY_SEO[categorySlug];
    const description = plainText(product.description, 500)
        || `${product.brand} ${product.name} available at Raj Electronics, Secunderabad.`;

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": `${url}#product`,
            "name": plainText(product.name, 200),
            "url": url,
            "image": (product.images || []).map(absoluteUrl),
            "description": description,
            "sku": product.id,
            "category": product.category,
            "brand": { "@type": "Brand", "name": product.brand },
            ...(Array.isArray(product.features) && product.features.length > 0 && {
                "additionalProperty": product.features.slice(0, 15).map((f: string) => ({
                    "@type": "PropertyValue",
                    "name": "Feature",
                    "value": plainText(f, 150),
                })),
            }),
            "offers": {
                "@type": "Offer",
                "url": url,
                "priceCurrency": "INR",
                "price": product.price,
                "itemCondition": "https://schema.org/NewCondition",
                "availability": product.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                "seller": { "@type": "ElectronicsStore", "@id": STORE_ID, "name": STORE.name },
            }
        },
        breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: categorySeo?.h1 ?? product.category, path: `/category/${categorySlug}` },
            { name: product.name, path: `/product/${product.slug}` },
        ]),
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
            />
            <ProductPageClient product={product} relatedProducts={relatedProducts} />
        </>
    );
}
