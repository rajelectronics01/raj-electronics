'use client';

import React, { useState, useEffect } from 'react';
import '../checkout.css'; // Global-ish CSS for checkout flow
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function CheckoutFlow({ product }: { product: any }) {
  const router = useRouter();
  const { user, refreshUser, loading: userLoading } = useUser();
  const [step, setStep] = useState<'login' | 'order' | 'payment' | 'confirm'>('login');
  
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
  const [emiOpt, setEmiOpt] = useState('3 Months');
  const [processing, setProcessing] = useState(false);
  const [procMsg, setProcMsg] = useState('Connecting to Razorpay...');
  
  // Final Order Response
  const [orderFinal, setOrderFinal] = useState<any>(null);
  const [payErr, setPayErr] = useState('');
  
  const BASE_PRICE = product.price;
  const t = BASE_PRICE * qty;
  
  // Timer for OTP (Removed as OTP flow is removed)
  // useEffect(() => {
  //   let tId: any;
  //   if (showOtp && timer > 0) {
  //     tId = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
  //   }
  //   return () => clearInterval(tId);
  // }, [showOtp, timer]);

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
          setOrderFinal(data.order);
          setStep('confirm');
        } else throw new Error(data.error);
        setProcessing(false);
        return;
      }

      // PhonePe flow
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
        window.location.href = data.url; // Redirect to PhonePe
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }
    } catch (e: any) {
      setProcessing(false);
      setPayErr(e.message || 'Something went wrong. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const downloadPrint = async () => {
    try {
      const el = document.getElementById('invoiceArea');
      if (el) {
        const html2canvasLib = (await import('html2canvas')).default;
        const jsPDFLib = (await import('jspdf')).jsPDF || (await import('jspdf')).default;
        const canvas = await html2canvasLib(el, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDFLib('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Invoice_RAJ_${orderFinal?.invoiceNo || 'Order'}.pdf`);
      } else {
        window.print();
      }
    } catch(e) {
      console.error(e);
      window.print(); 
    }
  };

  return (
    <div className="wz-flow" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      
      {/* PROCESSING MODAL */}
      <div className={`proc ${processing ? 'show' : ''}`}>
        <div className="spin"></div>
        <p>{procMsg}</p>
      </div>

      <div style={{display: 'none'}} id="debug-step-info">
        CURRENT STEP IS: {step}
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
            {/* DIRECT PHONE LOGIN (NO OTP) */}
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
                  {['UPI', 'Card', 'Net Banking', 'EMI', 'COD'].map(m => (
                    <button key={m} className={`mod3-tab ${payMethod===m?'active':''}`} onClick={() => setPayMethod(m)}>
                      {m==='UPI'?'📱 ':m==='Card'?'💳 ':m==='Net Banking'?'🏦 ':m==='EMI'?'📅 ':'💵 '}<span>{m==='Net Banking'?'NetBank':m}</span>
                    </button>
                  ))}
                </div>
                
                {payMethod === 'UPI' && (
                  <div className="u-apps">
                    {[{icon:'📱',lbl:'Google Pay'},{icon:'💜',lbl:'PhonePe'},{icon:'🔵',lbl:'Paytm'}].map(u => (
                      <div key={u.lbl} className={`u-app ${upiApp===u.lbl?'sel':''}`} onClick={()=>setUpiApp(u.lbl)}>
                        <div className="icon">{u.icon}</div><div className="label">{u.lbl}</div>
                      </div>
                    ))}
                  </div>
                )}
                {payMethod === 'Card' && <div className="fg"><label>Card inputs ...</label><input type="text" placeholder="1234..." /></div>}
                {payMethod === 'COD' && <div className="c-box"><p>Cash on delivery. (Demo mode)</p></div>}
                
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
                <button className="btn btn-green" style={{width:'100%', marginTop: '10px'}} onClick={handlePay}>🔒 Complete ₹{t.toLocaleString('en-IN')}</button>
                <div className="snote" style={{marginTop:'8px', textAlign: 'center', fontSize: '11px', color: 'var(--g400)'}}>🔒 100% secure</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'confirm' && orderFinal && (
        <div id="step-four-confirm" className="wz-panel" style={{ animation: 'fadeIn 0.22s ease' }}>
          <nav><div className="nav-inner">
            <div className="nav-brand" onClick={() => router.push(`/product/${product.slug}`)}><div className="nav-logo">R</div><div className="nav-name">Raj Electronics<small>Order Confirmed</small></div></div>
            <div className="nav-right"><button className="nbtn" onClick={() => router.push(`/category/all`)}>Continue Shopping</button></div>
          </div></nav>
          <div className="clayout">
            <div className="card" style={{marginBottom:'18px'}}>
              <div className="chero">
                <div className="cicon">✅</div>
                <div className="ctitle">Order Placed Successfully!</div>
                <div className="oid">RAJ#{orderFinal.invoiceNo}</div>
              </div>
              <div className="notif-strip"><span>📲</span><div>Confirmation sent via SMS and WhatsApp. Our team will call shortly.</div></div>
            </div>
            
            <div className="invoice" id="invoiceArea" style={{ background: '#fff', color: '#1a1a1a', padding: '30px', borderRadius: '8px' }}>
              <div className="inv-hdr" style={{ borderBottom: '2px solid #002366', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <img src="/logo.png" alt="Raj Electronics" style={{ height: '50px', width: 'auto' }} />
                  <div>
                    <div className="inv-brand" style={{ fontSize: '20px', fontWeight: 800, color: '#002366' }}>Raj Electronics</div>
                    <div style={{ fontSize: '11px', opacity: 0.8, lineHeight: 1.4 }}>
                      7-1-949, Rashtrapati Rd, Secunderabad, Telangana – 500003<br />
                      <strong>GSTIN: 36AGHPK5794N1ZL</strong> | Ph: +91 9290748866
                    </div>
                  </div>
                </div>
                <div className="inv-meta" style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: '#002366' }}>Tax Invoice</div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>RAJ#{orderFinal.invoiceNo}</div>
                  <div style={{ fontSize: '11px', opacity: 0.6 }}>Date: {new Date().toLocaleDateString('en-IN')}</div>
                </div>
              </div>
              <div className="inv-body" style={{ marginTop: '20px' }}>
                <div className="inv-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '20px', textAlign: 'left' }}>
                  <div className="inv-sec">
                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '5px', margin: 0 }}>Bill To</h4>
                    <p style={{ margin: 0, fontSize: '14px' }}><strong>{orderFinal.address.name}</strong></p>
                    <p style={{ margin: 0, fontSize: '13px' }}>{orderFinal.address.phone}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#444' }}>{orderFinal.address.street}, {orderFinal.address.area}, {orderFinal.address.pin}</p>
                  </div>
                  <div className="inv-sec" style={{ textAlign: 'right' }}>
                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '5px', margin: 0 }}>Order Details</h4>
                    <p style={{ margin: 0, fontSize: '13px' }}>Payment Mode: <strong>{orderFinal.paymentMethod}</strong></p>
                  </div>
                </div>
                <table className="inv-tbl" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                      <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px' }}>Product Description</th>
                      <th style={{ textAlign: 'center', padding: '10px', fontSize: '12px' }}>Qty</th>
                      <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px' }}>Rate</th>
                      <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px' }}>Taxable Amt</th>
                      <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px' }}>GST (18%)</th>
                      <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px 10px', textAlign: 'left' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{product.name}</div>
                        <div style={{ fontSize: '11px', color: '#666' }}>SKU: {product.slug.toUpperCase()}</div>
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px 10px', fontSize: '13px' }}>{qty}</td>
                      <td style={{ textAlign: 'right', padding: '12px 10px', fontSize: '13px' }}>₹{product.price.toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right', padding: '12px 10px', fontSize: '13px' }}>₹{Math.round((product.price * qty) / 1.18).toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right', padding: '12px 10px', fontSize: '13px' }}>₹{Math.round((product.price * qty) * 0.18 / 1.18).toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right', padding: '12px 10px', fontSize: '14px', fontWeight: 700 }}>₹{(product.price * qty).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="inv-tots" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                  <div style={{ fontSize: '13px' }}>Sub-Total: ₹{Math.round((product.price * qty) / 1.18).toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '13px' }}>CGST (9%): ₹{Math.round((product.price * qty) * 0.09 / 1.18).toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '13px' }}>SGST (9%): ₹{Math.round((product.price * qty) * 0.09 / 1.18).toLocaleString('en-IN')}</div>
                  <div className="itr grand" style={{ padding: '10px 0', borderTop: '1px solid #002366', marginTop: '5px', width: '200px', textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Total Amount:</span>
                    <span style={{ color: '#002366', fontSize: '18px', fontWeight: 800, marginLeft: '10px' }}>₹{(product.price * qty).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '20px', fontStyle: 'italic', textAlign: 'center', width: '100%' }}>* This is a computer generated invoice and does not require a physical signature.</div>
                </div>
              </div>
            </div>
            <div className="arow">
              <button className="btn btn-outline" onClick={downloadPrint}>🖨️ Print / Download Invoice</button>
              <button 
                className="btn" 
                style={{ background: '#25D366', color: '#fff' }} 
                onClick={() => window.open(`https://wa.me/919290748866?text=Hi, I just placed an order RAJ%23${orderFinal.invoiceNo} for ${product.name}. Please confirm.`, '_blank')}
              >
                💬 WhatsApp for Support
              </button>
              <button className="btn btn-primary" onClick={() => router.push(`/product/${product.slug}`)}>🛒 Continue Shopping</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
