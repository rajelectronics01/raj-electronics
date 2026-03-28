"use client";

import { useState } from 'react';

export default function BulkOrderForm() {
  const [status, setStatus] = useState<'' | 'loading' | 'success' | 'error'>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    organizationType: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/bulk-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', phone: '', organizationType: '', description: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', borderRadius: '16px', background: '#ecfdf5', border: '2px solid #10b981', color: '#065f46', fontWeight: 600 }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚀</div>
        Thank you for your bulk inquiry!<br /> Our B2B team has received your request and will contact you on your number shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input 
        type="text" 
        placeholder="Contact Name *" 
        required 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%' }}
      />
      <input 
        type="tel" 
        placeholder="Phone Number *" 
        required 
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%' }}
      />
      
      <select 
        required 
        value={formData.organizationType}
        onChange={(e) => setFormData({...formData, organizationType: e.target.value})}
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%', background: 'white' }}
      >
        <option value="" disabled>Organization Type *</option>
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
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
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
