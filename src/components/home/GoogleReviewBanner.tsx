"use client";

import { useState } from 'react';

export default function GoogleReviewBanner() {
  const [productType, setProductType] = useState('Air Conditioner');
  const [brand, setBrand] = useState('LG');
  const [highlight, setHighlight] = useState('great pricing');
  const [generatedReview, setGeneratedReview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReview = () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const templates = [
        `I recently bought a ${brand} ${productType} from Raj Electronics. They offered ${highlight} and excellent service. Definitely the best authorized electronics dealer in Secunderabad!`,
        `Highly recommend Raj Electronics in Hyderabad! I purchased my ${brand} ${productType} here. The ${highlight} was exactly what I was looking for. Genuine products and great support.`,
        `Raj Electronics provided me with a fantastic ${brand} ${productType}. I am very impressed with their ${highlight}. Great wholesale and retail electronics dealer on RP Road.`
      ];
      
      const randomReview = templates[Math.floor(Math.random() * templates.length)];
      setGeneratedReview(randomReview);
      setIsGenerating(false);
      setCopied(false);
    }, 800);
  };

  const handleCopyAndRedirect = () => {
    if (generatedReview) {
      navigator.clipboard.writeText(generatedReview);
      setCopied(true);
      
      // Fallback safe Google link for Raj Electronics since PlaceID was invalid
      setTimeout(() => {
        window.open('https://g.page/r/CXP7uW3JjtO8ECY/review', '_blank');
        setCopied(false);
      }, 1500);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      marginBottom: '60px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
          alt="Google" 
          style={{ width: '40px', height: '40px' }} 
        />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            4.9 
            <span style={{ color: '#fbad04', letterSpacing: '2px' }}>★★★★★</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Raj Electronics Secunderabad</div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.4rem', color: '#1e293b', fontWeight: 800, marginBottom: '15px' }}>
        Help Local Buyers! Write a Review
      </h3>
      <p style={{ color: '#475569', maxWidth: '600px', marginBottom: '30px' }}>
        Not sure what to write? Tell our AI Assistant what you purchased, and we'll instantly generate a helpful review for you to post!
      </p>

      {/* Generator Form */}
      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <option value="LG">LG</option>
            <option value="Samsung">Samsung</option>
            <option value="Voltas">Voltas</option>
            <option value="Daikin">Daikin</option>
            <option value="General">O-General</option>
            <option value="Lloyd">Lloyd</option>
            <option value="Carrier">Carrier</option>
            <option value="Hitachi">Hitachi</option>
            <option value="Mitsubishi">Mitsubishi</option>
            <option value="Blue Star">Blue Star</option>
            <option value="Whirlpool">Whirlpool</option>
            <option value="Crompton">Crompton</option>
            <option value="Orient Electric">Orient Electric</option>
            <option value="TG Smart">TG Smart</option>
            <option value="Sansui">Sansui</option>
            <option value="Godrej">Godrej</option>
            <option value="Haier">Haier</option>
          </select>

          <select value={productType} onChange={(e) => setProductType(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <option value="Air Conditioner">AC</option>
            <option value="Smart TV">Smart TV</option>
            <option value="Refrigerator">Refrigerator</option>
            <option value="Washing Machine">Washing Machine</option>
            <option value="Air Cooler">Air Cooler</option>
          </select>
        </div>

        <select value={highlight} onChange={(e) => setHighlight(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}>
          <option value="great pricing">Great Pricing</option>
          <option value="fast same-day delivery">Fast Same-Day Delivery</option>
          <option value="excellent installation support">Excellent Installation Support</option>
          <option value="helpful staff">Helpful Staff & Service</option>
        </select>

        <button 
          onClick={generateReview}
          disabled={isGenerating}
          style={{ background: '#1e3a8a', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', border: 'none' }}
        >
          {isGenerating ? 'Generating...' : '✨ Generate Review with AI'}
        </button>
      </div>

      {generatedReview && (
        <div style={{ width: '100%', maxWidth: '600px', background: '#ecfdf5', border: '2px dashed #10b981', padding: '20px', borderRadius: '12px', position: 'relative' }}>
          <p style={{ color: '#064e3b', fontWeight: 600, fontSize: '1.05rem', marginBottom: '20px' }}>
            "{generatedReview}"
          </p>
          <button 
            onClick={handleCopyAndRedirect}
            style={{ background: copied ? '#059669' : '#10b981', color: 'white', padding: '10px 20px', borderRadius: '99px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}
          >
            {copied ? '✅ Text Copied! Redirecting to Google...' : '📋 Copy to Clipboard & Post on Google'}
          </button>
        </div>
      )}

    </div>
  );
}
