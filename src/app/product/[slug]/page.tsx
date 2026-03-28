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
        title: `${product.brand} ${product.name} Price in Secunderabad ${discountText} | Raj Electronics`,
        description: `Buy ${product.brand} ${product.name} at ${priceText} from Raj Electronics, authorized dealer on RP Road, Secunderabad. ${discount > 0 ? `Save ${discount}% — was ₹${product.originalPrice?.toLocaleString('en-IN')}.` : ''} Best price in Hyderabad with easy EMI, fast delivery & installation. Call +91 9290748866.`,
        keywords: `${product.brand} ${product.name}, ${product.brand} ${product.category} price Secunderabad, buy ${product.brand} ${product.category} Hyderabad, ${product.name} best price, ${product.brand} dealer RP Road, ${product.category} price Secunderabad, authorized ${product.brand} dealer Hyderabad`,
        openGraph: {
            title: `${product.brand} ${product.name} — Best Price at Raj Electronics Secunderabad`,
            description: `${product.brand} ${product.name} at ${priceText}. Authorized dealer in Secunderabad. EMI available. Call for best deal!`,
            images: product.images[0] ? [{ url: product.images[0], alt: `${product.brand} ${product.name}` }] : [],
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
