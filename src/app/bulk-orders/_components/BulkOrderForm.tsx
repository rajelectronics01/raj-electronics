"use client";

import { useState } from 'react';

export default function BulkOrderForm() {
  const [status, setStatus] = useState<'' | 'loading' | 'success' | 'error'>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate form submission
    setTimeout(() => {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#10b981', fontWeight: 600 }}>
        Thank you for your bulk inquiry!<br /> Our B2B team will contact you shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input 
        type="text" 
        placeholder="Contact Name *" 
        required 
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%' }}
      />
      <input 
        type="tel" 
        placeholder="Phone Number *" 
        required 
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%' }}
      />
      
      <select 
        required 
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%', background: 'white' }}
      >
        <option value="" disabled selected>Organization Type *</option>
        <option value="School">School/College</option>
        <option value="Hospital">Hospital/Clinic</option>
        <option value="Hotel">Hotel/Restaurant</option>
        <option value="Corporate">Corporate Office</option>
        <option value="Government">Government Institution</option>
        <option value="Housing Society">Housing Society/Builders</option>
        <option value="Other">Other</option>
      </select>

      <textarea 
        placeholder="Products Required & Estimated Quantity *" 
        rows={4} 
        required
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%', resize: 'vertical' }}
      ></textarea>

      <button 
        type="submit" 
        disabled={status === 'loading'}
        style={{ 
          background: '#ef4444', 
          color: 'white', 
          padding: '12px', 
          border: 'none', 
          borderRadius: '8px', 
          fontWeight: 800, 
          fontSize: '1.1rem', 
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          opacity: status === 'loading' ? 0.7 : 1
        }}
      >
        {status === 'loading' ? 'Submitting Request...' : 'Submit Inquiry'}
      </button>

      <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>We guarantee confidentiality and won't spam your number.</p>
    </form>
  );
}
