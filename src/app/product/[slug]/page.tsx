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
        return { title: 'Product Not Found' };
    }

    return {
        title: `${product.name} - Raj Electronics`,
        description: `Buy ${product.name} at best price in Secunderabad. Authorized dealer with EMI options.`,
        openGraph: {
            images: product.images[0] ? [{ url: product.images[0] }] : [],
        }
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

    return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}
