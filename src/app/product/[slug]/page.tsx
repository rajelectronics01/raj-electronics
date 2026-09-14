import { notFound } from 'next/navigation';
import { getProductBySlug, getProductsByCategory } from '@/lib/products';
import { Metadata } from 'next';
import ProductPageClient from '../_components/ProductPageClient';

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

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const discountText = discount > 0 ? ` | ${discount}% OFF` : '';
    const priceText = `₹${product.price.toLocaleString('en-IN')}`;

    return {
        title: `${product.name} — Buy in Secunderabad | Raj Electronics`,
        description: `Buy ${product.name} at best price from Raj Electronics, Secunderabad's authorized dealer since 1995. GST invoice. Bulk orders accepted. Call for price: +91 92907 48866.`,
        keywords: `${product.brand} ${product.name}, ${product.brand} ${product.category} price Secunderabad, buy ${product.brand} ${product.category} Hyderabad, ${product.name} best price, ${product.brand} dealer RP Road, ${product.category} price Secunderabad, authorized ${product.brand} dealer Hyderabad`,
        openGraph: {
            title: `${product.name} — Buy in Secunderabad | Raj Electronics`,
            description: `Buy ${product.name} at best price from Raj Electronics, Secunderabad's authorized dealer since 1995. GST invoice. Bulk orders accepted. Call for price: +91 92907 48866.`,
            images: product.images[0] ? [{ url: product.images[0], alt: `${product.brand} ${product.name} - Buy in Secunderabad Hyderabad | Raj Electronics` }] : [],
            locale: 'en_IN',
            type: 'website',
        },
        alternates: {
            canonical: `https://rajelectronics.co/product/${slug}`,
        },
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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.images || [],
        "description": `Buy ${product.brand} ${product.name} at Raj Electronics Secunderabad.`,
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": product.brand
        },
        "offers": {
            "@type": "Offer",
            "url": `https://rajelectronics.co/product/${product.slug}`,
            "priceCurrency": "INR",
            "price": product.price,
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "LocalBusiness",
                "name": "Raj Electronics"
            }
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductPageClient product={product} relatedProducts={relatedProducts} />
        </>
    );
}
