"use client";

import { useState } from 'react';

export default function BulkOrderForm() {
  const [status, setStatus] = useState<'' | 'loading' | 'success' | 'error'>('');
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    category: '',
    quantity: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        organizationType: formData.companyName,
        description: `Email: ${formData.email}\nCategory: ${formData.category}\nQuantity: ${formData.quantity}\nMessage: ${formData.message}`
      };

      const response = await fetch('/api/bulk-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', companyName: '', email: '', phone: '', category: '', quantity: '', message: '' });
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
        placeholder="Name *" 
        required 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%' }}
      />
      
      <input 
        type="text" 
        placeholder="Company Name *" 
        required 
        value={formData.companyName}
        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%' }}
      />

      <input 
        type="email" 
        placeholder="Email Address *" 
        required 
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
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
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%', background: 'white' }}
      >
        <option value="" disabled>Product Category (Select One) *</option>
        <option value="Air Conditioners">Air Conditioners</option>
        <option value="Televisions">Televisions</option>
        <option value="Air Coolers">Air Coolers</option>
        <option value="Refrigerators">Refrigerators</option>
        <option value="Multiple/Other">Multiple/Other</option>
      </select>

      <input 
        type="number" 
        placeholder="Quantity Needed *" 
        required 
        min="1"
        value={formData.quantity}
        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%' }}
      />

      <textarea 
        placeholder="Additional requirements or details (Message)" 
        rows={4} 
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%', resize: 'vertical' }}
      ></textarea>


      <button 
        type="submit" 
        disabled={status === 'loading'}
        style={{ 
          background: '#87becaff', 
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
