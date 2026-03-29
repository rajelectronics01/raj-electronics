import { Metadata } from 'next';
import BulkOrderForm from './_components/BulkOrderForm';

export const metadata: Metadata = {
  title: "Bulk Orders & Corporate Gifting - Electronics | Raj Electronics",
  description: "Special pricing on bulk orders for ACs, TVs, and electronics. Ideal for offices, hotels, hospitals...",
};

export default function BulkOrdersPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
          Bulk & Institutional Orders
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#475569', maxWidth: '800px', margin: '0 auto' }}>
          Raj Electronics is the preferred partner for schools, hospitals, corporate offices, hotels, and housing societies across Hyderabad and Secunderabad. We offer dedicated B2B pricing and GST billing.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '20px' }}>
        <div style={{ padding: '30px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '15px' }}>Why Choose Us for Bulk Supply?</h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li>✅ <strong>Direct Wholesale Rates:</strong> Maximize your procurement budget.</li>
            <li>✅ <strong>100% Genuine Guarantee:</strong> Full manufacturer warranty on all items.</li>
            <li>✅ <strong>Complete Tax Compliance:</strong> Receive proper GST invoices instantly.</li>
            <li>✅ <strong>Reliable Fulfillment:</strong> Over 30 years of large-scale delivery experience.</li>
          </ul>
        </div>
        
        <div style={{ padding: '30px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Request a Wholesale Quote</h2>
          <BulkOrderForm />
        </div>
      </div>
    </div>
  );
}
