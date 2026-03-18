'use client';

import React, { useState, useEffect } from 'react';
import '../checkout.css'; // Global-ish CSS for checkout flow
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function CheckoutFlow({ product }: { product: any }) {
  const router = useRouter();
  const { user, refreshUser, loading: userLoading } = useUser();
  const [step, setStep] = useState<'login' | 'order' | 'payment'>('login');
  
  // Set initial step based on auth
  useEffect(() => {
    if (!userLoading && user) {
      setStep('order');
      setPhone(user.phone);
      setAddress(a => ({ ...a, phone: user.phone, name: user.name || '' }));
    }
  }, [user, userLoading]);

  // Login State
  const [phone, setPhone] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  
  // Order State
  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState({ name: '', phone: '', street: '', area: '', pin: '' });
  const [addrErr, setAddrErr] = useState('');

  // Payment State
  const [payMethod, setPayMethod] = useState('UPI');
  const [upiApp, setUpiApp] = useState('Google Pay');
  const [processing, setProcessing] = useState(false);
  const [procMsg, setProcMsg] = useState('Connecting to payment gateway...');
  const [payErr, setPayErr] = useState('');
  
  const BASE_PRICE = product.price;
  const t = BASE_PRICE * qty;
  
  const handleQuickLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setPhoneErr('Enter a valid 10-digit number');
      return;
    }
    setPhoneErr('');
    setProcessing(true);
    setProcMsg('Verifying...');
    
    try {
      const res = await fetch('/api/user/quick-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();

      if (data.success) {
        await refreshUser();
        setStep('order');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setPhoneErr(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error("Quick Login Error:", error);
      setPhoneErr("Failed to verify. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const proceedToPay = () => {
    if (!address.name || !address.phone || !address.street || !address.area || !address.pin) {
      setAddrErr('Please fill all address fields');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setAddrErr('');
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePay = async () => {
    setPayErr('');
    setProcessing(true);
    setProcMsg('Initiating secure payment...');
    
    try {
      if (payMethod === 'COD') {
        const res = await fetch('/api/checkout/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            phone,
            address,
            qty,
            payMethod: 'COD',
          })
        });
        const data = await res.json();
        if (data.success) {
          router.push(`/order/${data.orderId}`);
        } else throw new Error(data.error);
        return;
      }

      // Digital Payment flow (PhonePe)
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          phone,
          address,
          qty,
          totalAmount: t,
        })
      });
      const data = await res.json();
      
      if (data.success && data.url) {
        setProcMsg('Redirecting to PhonePe...');
        window.location.href = data.url; 
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }
    } catch (e: any) {
      setProcessing(false);
      setPayErr(e.message || 'Something went wrong. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="wz-flow" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      
      {/* PROCESSING MODAL */}
      <div className={`proc ${processing ? 'show' : ''}`}>
        <div className="spin"></div>
        <p>{procMsg}</p>
      </div>

      {step === 'login' && (
        <div id="step-one-login" className="wz-panel" style={{ animation: 'fadeIn 0.22s ease' }}>
          <div className="top-banner">🔒 Secure Login · Raj Electronics</div>
          <nav><div className="nav-inner">
            <div className="nav-brand" onClick={() => router.push(`/product/${product.slug}`)}><div className="nav-logo">R</div><div className="nav-name">Raj Electronics<small>Legacy Since 1995</small></div></div>
            <div className="nav-right"><button className="nbtn" onClick={() => router.push(`/product/${product.slug}`)}>← Back to Product</button></div>
          </div></nav>
          <div className="login-wrap"><div className="login-box">
            <div className="login-logo"><div className="logo-icon">R</div><h1>Sign in to Order</h1><p>We'll verify your number via OTP</p></div>
            <div className="card">
              <p style={{fontSize:'13.5px', color:'var(--g700)', marginBottom:'14px', textAlign:'center'}}>Enter phone to proceed. We will call to confirm.</p>
              <div className="fg">
                <label>Mobile Number</label>
                <div className="phone-input-wrap">
                  <span className="prefix">+91</span>
                  <input type="tel" maxLength={10} value={phone} 
                    onChange={e => setPhone(e.target.value.replace(/\D/g,''))} 
                    placeholder="98765 43210" autoFocus />
                </div>
              </div>
              {phoneErr && <div className="err" style={{marginTop:'8px', fontSize: '12px'}}>{phoneErr}</div>}
              <button className="btn btn-primary" style={{marginTop:'14px', width: '100%'}} onClick={() => handleQuickLogin()}>Continue to Order Details →</button>
              <div className="sec-note" style={{marginTop:'16px', opacity: 0.6}}><span className="sec-bdg" style={{background:'#072654',color:'#fff',padding:'2px 6px',borderRadius:'4px',fontSize:'9px',fontWeight:700}}>TRUSTED</span> Identity verified by call</div>
            </div>
          </div></div>
        </div>
      )}

      {step === 'order' && (
        <div id="step-two-order" className="wz-panel" style={{ animation: 'fadeIn 0.22s ease' }}>
          <div className="top-banner">🏆 Best Prices in Secunderabad. Authorized Dealer.</div>
          <nav><div className="nav-inner">
            <div className="nav-brand" onClick={() => router.push(`/product/${product.slug}`)}><div className="nav-logo">R</div><div className="nav-name">Raj Electronics<small>Legacy Since 1995</small></div></div>
            <div className="nav-right"><div className="nav-user"><div className="avatar">{(phone||'XX').slice(-2)}</div><span>+91 {phone}</span></div></div>
          </div></nav>
          <div className="olayout">
            <div style={{fontSize:'12.5px', color:'var(--g400)', marginBottom:'18px', display:'flex', gap:'6px', flexWrap:'wrap'}}>
              <span onClick={() => router.push(`/product/${product.slug}`)} style={{cursor:'pointer', color:'var(--g500)'}}>Product</span><span>›</span><span style={{color:'var(--blue)', fontWeight:600}}>Order Details</span><span>›</span><span>Payment</span><span>›</span><span>Confirm</span>
            </div>
            <div className="ogrid">
              <div>
                <div className="card" style={{marginBottom:'18px'}}>
                  <div className="pthumb"><img src={product.images[0]} alt={product.name} /></div>
                  <div style={{fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'var(--blue)'}}>{product.brand}</div>
                  <h2 style={{fontSize:'18px', fontWeight:700, color:'var(--g900)', margin:'5px 0 4px'}}>{product.name}</h2>
                  <div style={{display:'flex', alignItems:'baseline', gap:'10px', margin:'12px 0'}}>
                    <div style={{fontSize:'26px', fontWeight:700, color:'var(--g900)'}}>₹{product.price.toLocaleString('en-IN')}</div>
                    {product.originalPrice && <div style={{fontSize:'14px', color:'var(--g400)', textDecoration:'line-through'}}>₹{product.originalPrice.toLocaleString('en-IN')}</div>}
                  </div>
                  <div className="qty-row"><span style={{fontSize:'13px', fontWeight:600, color:'var(--g700)'}}>Quantity:</span><div className="qty-ctrl"><button className="qty-btn" onClick={() => setQty(Math.max(1, qty-1))}>−</button><div className="qty-val">{qty}</div><button className="qty-btn" onClick={() => setQty(Math.min(5, qty+1))}>+</button></div></div>
                </div>
                <div className="card">
                  <h3 style={{fontSize:'15px', fontWeight:700, color:'var(--g900)', marginBottom:'14px'}}>📍 Delivery Address</h3>
                  <div className="fgrid">
                    <div className="fg"><label>Full Name</label><input type="text" value={address.name} onChange={e=>setAddress({...address, name:e.target.value})} placeholder="Your full name" /></div>
                    <div className="fg"><label>Phone</label><input type="tel" value={address.phone} onChange={e=>setAddress({...address, phone:e.target.value})} placeholder="10-digit number" /></div>
                    <div className="fg fspan"><label>Flat / House No &amp; Street</label><input type="text" value={address.street} onChange={e=>setAddress({...address, street:e.target.value})} placeholder="Flat 4B, Rose Apartments, MG Road" /></div>
                    <div className="fg"><label>Area / Locality</label><input type="text" value={address.area} onChange={e=>setAddress({...address, area:e.target.value})} placeholder="Secunderabad" /></div>
                    <div className="fg"><label>Pincode</label><input type="text" value={address.pin} onChange={e=>setAddress({...address, pin:e.target.value})} placeholder="500003" maxLength={6} /></div>
                  </div>
                  {addrErr && <div className="err" style={{fontSize: '14px', marginTop: '10px'}}>{addrErr}</div>}
                </div>
              </div>
              <div className="sticky-sum">
                <div className="card">
                  <div className="sum-title">Order Summary</div>
                  <div className="sum-prod"><div className="simg"><img src={product.images[0]} /></div><div><div style={{fontSize:'13px', fontWeight:600, color:'var(--g900)'}}>{product.name}</div><div style={{fontSize:'12px', color:'var(--g400)'}}>Qty: {qty}</div></div></div>
                  <div className="litems"><div className="litem"><span>Price</span><span>₹{(product.price*qty).toLocaleString('en-IN')}</span></div><div className="litem total"><span>Total</span><span>₹{(product.price*qty).toLocaleString('en-IN')}</span></div></div>
                  <button className="btn btn-primary" style={{width:'100%'}} onClick={proceedToPay}>Proceed to Checkout →</button>
                  <div className="snote">🔒 Secured</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <div id="step-three-secure" className="wz-panel">
          <div className="top-banner" style={{background: '#1a1a1a', color: '#fff', textAlign: 'center', fontSize: '12.5px', padding: '8px 16px'}}>🔒 Secure Processing Portal</div>
          <nav><div className="nav-inner">
            <div className="nav-brand" onClick={() => router.push(`/product/${product.slug}`)}>
              <div className="nav-logo">R</div><div className="nav-name">Raj Electronics<small>Final Step</small></div>
            </div>
            <div className="nav-right"><button className="nbtn" onClick={() => setStep('order')}>← Back</button></div>
          </div></nav>
          
          <div className="mod3-layout">
            <div style={{fontSize:'12.5px', color:'var(--g400)', marginBottom:'18px', display:'flex', gap:'6px', flexWrap:'wrap'}}>
              <span onClick={() => router.push(`/product/${product.slug}`)} style={{cursor:'pointer', color:'var(--g500)'}}>Product</span><span>›</span>
              <span onClick={() => setStep('order')} style={{cursor:'pointer', color:'var(--g500)'}}>Order Details</span><span>›</span>
              <span style={{color:'var(--blue)', fontWeight:600}}>Settlement</span><span>›</span><span>Confirm</span>
            </div>
            
            <div className="mod3-grid2">
              <div className="card">
                {payErr && <div className="err" style={{background:'#fff5f5', color:'#e53e3e', padding:'12px', borderRadius:'8px', marginBottom:'16px', border:'1px solid #fed7d7', fontSize:'14px', fontWeight:500}}>⚠️ {payErr}</div>}
                <div style={{fontSize:'15px', fontWeight:700, color:'var(--g900)', marginBottom:'14px'}}>Choose Method</div>
                <div className="mod3-tabs">
                  {['UPI', 'COD'].map(m => (
                    <button key={m} className={`mod3-tab ${payMethod===m?'active':''}`} onClick={() => setPayMethod(m)}>
                      {m==='UPI'?'📱 ':'💵 '}<span>{m}</span>
                    </button>
                  ))}
                </div>
                
                {payMethod === 'UPI' && (
                  <div className="u-apps" style={{marginTop: '15px'}}>
                    <div className="u-app sel">
                      <div className="icon">💜</div><div className="label">PhonePe / GPay / Any UPI</div>
                    </div>
                  </div>
                )}
                {payMethod === 'COD' && <div className="c-box" style={{marginTop: '15px'}}><p>Cash on delivery. Our team will verify your address via call.</p></div>}
                
                <div className="sec-note" style={{marginTop:'14px'}}><span className="sec-bdg" style={{background:'#072654',color:'#fff',padding:'3px 8px',borderRadius:'4px',fontSize:'10px',fontWeight:700}}>SECURE</span> 256-bit encrypted</div>
              </div>
              
              <div className="card sticky-sum">
                <div className="sum-title">Summary</div>
                <div className="sum-prod">
                  <div className="simg"><img src={product.images[0]}/></div>
                  <div><div style={{fontSize:'13px', fontWeight:600}}>{product.name}</div><div style={{fontSize:'12px', color:'var(--g400)'}}>Qty: {qty}</div></div>
                </div>
                <div className="litems">
                  <div className="litem"><span>Item Total</span><span>₹{t.toLocaleString('en-IN')}</span></div>
                  <div className="litem total"><span>Amount Due</span><span style={{color:'var(--blue)'}}>₹{t.toLocaleString('en-IN')}</span></div>
                </div>
                <button className="btn btn-green" style={{width:'100%', marginTop: '10px'}} onClick={handlePay}>🔒 Complete Order ₹{t.toLocaleString('en-IN')}</button>
                <div className="snote" style={{marginTop:'8px', textAlign: 'center', fontSize: '11px', color: 'var(--g400)'}}>🔒 100% secure processing</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
