import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Raj Electronics',
  description: 'Shipping Policy for Raj Electronics',
};

export default function ShippingPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 border-b pb-4">Shipping Policy</h1>
      
      <div className="prose prose-slate max-w-none text-slate-700 space-y-6">
        <p>
          The orders for the user are shipped through registered domestic courier companies and/or speed post
          only. Orders are shipped within <strong>2 days</strong> from the date of the order and/or payment or as per the delivery
          date agreed at the time of order confirmation and delivering of the shipment, subject to courier company /
          post office norms.
        </p>

        <p>
          <strong>Raj Electronics</strong> (Platform Owner) shall not be liable for any delay in delivery by the courier company /
          postal authority. Delivery of all orders will be made to the address provided by the buyer at the time of
          purchase.
        </p>

        <p>
          Delivery of our services will be confirmed on your email ID as specified at the time of
          registration. If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case may be),
          the same is not refundable.
        </p>
      </div>
    </div>
  );
}
