import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import CheckoutClient from './CheckoutClient';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pId = (await params).productId;
  const product = await prisma.product.findUnique({ where: { id: pId } });
  
  if (!product) return { title: 'Not Found' };
  return { title: `Checkout - ${product.name} | Raj Electronics` };
}

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default async function CheckoutPage(props: Props) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
  });

  if (!product) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <ErrorBoundary>
        <CheckoutClient product={product} />
      </ErrorBoundary>
    </div>
  );
}
