'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { 
  ShieldCheck, Loader2, CreditCard, 
  MapPin, ShoppingBag, ArrowRight, 
  CheckCircle2, Mail, Phone, AlertCircle 
} from 'lucide-react';

export default function CheckoutPage({ product }: { product: any }) {
  const router = useRouter();
  const { user, refreshUser, loading: userLoading } = useUser();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Auth, 2: Address, 3: Payment
  
  // FORM STATES
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState({ street: '', area: '', pin: '' });
  
  // LOGIC STATES
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const totalPrice = product.price;

  // Initialize data but NEVER auto-skip the auth for this flow
  useEffect(() => {
    if (!userLoading && user) {
      setPhone(user.phone || '');
      setFullName(user.name || '');
    }
  }, [user, userLoading]);

  // --- FIREBASE AUTH ---
  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) return setError('Please enter a valid 10-digit number');
    setIsVerifying(true);
    setError('');
    try {
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'captcha-box', { size: 'invisible' });
      }
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, (window as any).recaptchaVerifier);
      setConfirmationResult(result);
    } catch (err: any) {
      setError('OTP limit exceeded or connection error. Try again.');
      console.error(err);
      // Critical Fix: Clear poisoned reCAPTCHA widget
      if ((window as any).recaptchaVerifier) {
        try { (window as any).recaptchaVerifier.clear(); } catch(e){}
        (window as any).recaptchaVerifier = null;
        const box = document.getElementById('captcha-box');
        if (box) box.innerHTML = '';
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) return setError('Enter 6-digit code');
    setIsVerifying(true);
    try {
      const result = await confirmationResult.confirm(otpCode);
      const idToken = await result.user.getIdToken();
      
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      if (res.ok) {
        await refreshUser();
        setStep(2); // Proceed to Address
      }
    } catch (err) {
      setError('Invalid OTP code. Try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // --- ORDER FINALIZATION ---
  const handleOrder = async (payMethod: 'ONLINE' | 'COD') => {
    if (!email || !fullName || !address.pin) return setError('Missing required fields (Email/Name/Pin)');
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          phone,
          address: { ...address, name: fullName, email, phone },
          qty: 1,
          payMethod
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.paymentUrl) window.location.href = data.paymentUrl;
        else router.push(`/order/${data.orderId}`);
      } else throw new Error(data.error);
    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="pre-wrap">
      <div id="captcha-box"></div>
      
      {/* Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <div className="pre-container">
        {/* HEADER */}
        <header className="pre-header">
          <div className="brand">
            <div className="brand-logo">R</div>
            <h2>Raj Electronics <span>Checkout</span></h2>
          </div>
          <div className="steps-ind">
            <div className={`ind-dot ${step >= 1 ? 'active' : ''}`}></div>
            <div className={`ind-dot ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`ind-dot ${step >= 3 ? 'active' : ''}`}></div>
          </div>
        </header>

        <div className="pre-grid">
          <div className="col-main">
            {/* STEP 1: AUTH */}
            {step === 1 && (
              <div className="glass-card zoom-in">
                <div className="card-head">
                  <ShieldCheck size={32} color="#3b82f6" />
                  <h1>Secure Verification</h1>
                  <p>Enter your number to process this transaction.</p>
                </div>

                {!confirmationResult ? (
                  <div className="auth-form">
                    <label>Mobile Number</label>
                    <div className="inp-group">
                      <span>+91</span>
                      <input 
                        type="tel" maxLength={10} value={phone} 
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} 
                        placeholder="98765 43210" autoFocus 
                      />
                      <Phone size={20} color="#64748b" />
                    </div>
                    {error && <div className="err-msg"><AlertCircle size={16}/> {error}</div>}
                    <button onClick={handleSendOtp} disabled={isVerifying} className="btn-primary">
                      {isVerifying ? <Loader2 className="spin" size={24}/> : <>Send Secure OTP <ArrowRight size={20}/></>}
                    </button>
                  </div>
                ) : (
                  <div className="auth-form">
                    <div className="verify-tag">
                      <span>Verifying <strong>+91 {phone}</strong></span>
                      <button onClick={() => setConfirmationResult(null)}>Edit</button>
                    </div>
                    <div className="otp-boxes">
                      {otp.map((d, i) => (
                        <input 
                          key={i} ref={el => { otpInputs.current[i] = el; }} 
                          type="tel" maxLength={1} value={d} 
                          onKeyDown={e => e.key === 'Backspace' && !otp[i] && otpInputs.current[i-1]?.focus()} 
                          onChange={e => {
                            const n = [...otp]; n[i] = e.target.value.slice(-1); setOtp(n);
                            if (e.target.value && i < 5) otpInputs.current[i+1]?.focus();
                          }} 
                          className="otp-box-ui" 
                        />
                      ))}
                    </div>
                    {error && <div className="err-msg"><AlertCircle size={16}/> {error}</div>}
                    <button onClick={handleVerifyOtp} disabled={isVerifying} className="btn-primary">
                      {isVerifying ? <Loader2 className="spin" size={24}/> : 'Confirm Identity'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: ADDRESS & EMAIL */}
            {step === 2 && (
              <div className="glass-card zoom-in">
                <div className="card-head">
                  <MapPin size={32} color="#3b82f6" />
                  <h1>Delivery Details</h1>
                  <p>Where should we deliver your {product.brand}?</p>
                </div>

                <div className="form-grid">
                  <div className="fg fg-full">
                    <label>Full Name</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ex: Rahul Sharma" />
                  </div>
                  <div className="fg fg-full">
                    <label>Email Address (For Invoice)</label>
                    <div className="inp-icon">
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="rahul@example.com" />
                      <Mail size={20} color="#64748b" />
                    </div>
                  </div>
                  <div className="fg fg-full">
                    <label>Street & House No.</label>
                    <input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="Flat 4B, MG Road" />
                  </div>
                  <div className="fg">
                    <label>Area / City</label>
                    <input type="text" value={address.area} onChange={e => setAddress({...address, area: e.target.value})} placeholder="Secunderabad" />
                  </div>
                  <div className="fg">
                    <label>Pincode</label>
                    <input type="text" maxLength={6} value={address.pin} onChange={e => setAddress({...address, pin: e.target.value})} placeholder="500003" />
                  </div>
                </div>
                {error && <div className="err-msg" style={{marginTop:'15px'}}><AlertCircle size={16}/> {error}</div>}
                <button onClick={() => setStep(3)} className="btn-primary" style={{marginTop:'25px'}}>
                  Continue to Payment <ArrowRight size={20}/>
                </button>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <div className="glass-card zoom-in">
                <div className="card-head">
                  <CreditCard size={32} color="#3b82f6" />
                  <h1>Secure Settlement</h1>
                  <p>Choose your preferred way to pay.</p>
                </div>
                {error && <div className="err-msg" style={{marginBottom:'15px'}}><AlertCircle size={16}/> {error}</div>}

                <div className="pay-methods">
                  <div className="pay-opt" onClick={() => handleOrder('ONLINE')}>
                    <div className="pay-icon"><CreditCard size={24} color="#3b82f6"/></div>
                    <div className="pay-info">
                      <h4>PhonePe / UPI / Cards</h4>
                      <p>Secure 256-bit encrypted processing</p>
                    </div>
                    <ArrowRight size={20} color="#475569" className="arro" />
                  </div>

                  <div className="pay-opt cod" onClick={() => handleOrder('COD')}>
                    <div className="pay-icon cod-icon"><ShoppingBag size={24} color="#10b981"/></div>
                    <div className="pay-info">
                      <h4>Cash on Delivery (COD)</h4>
                      <p>Subject to telephone verification</p>
                    </div>
                    <ArrowRight size={20} color="#475569" className="arro" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="col-side">
            <div className="summary-glass">
              <div className="sum-prod">
                <img src={product.images[0]} alt={product.name} />
                <div>
                  <span className="brand-tag">{product.brand}</span>
                  <h3>{product.name}</h3>
                </div>
              </div>
              <div className="sum-lines">
                <div className="sum-line"><span>Item Price</span><span>₹{product.price.toLocaleString('en-IN')}</span></div>
                <div className="sum-line"><span>Shipping</span><span style={{color: '#10b981'}}>FREE</span></div>
                <div className="sum-total"><span>Payable</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
              </div>
              <div className="trust-badges">
                <div className="bdg"><CheckCircle2 size={16} color="#10b981"/> Authorized Dealer</div>
                <div className="bdg"><ShieldCheck size={16} color="#3b82f6"/> 100% Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="overlay-load">
          <Loader2 className="spin" size={48} color="#3b82f6" />
          <h2>Securing your Order...</h2>
          <p>Redirecting to Gateway</p>
        </div>
      )}

      {/* VANILLA STYLES */}
      <style jsx>{`
        * { box-sizing: border-box; }
        .pre-wrap {
          background-color: #020617;
          min-height: 100vh;
          font-family: 'DM Sans', system-ui, sans-serif;
          color: #ffffff !important;
          position: relative;
          overflow: hidden;
        }
        .pre-wrap h1, .pre-wrap h2, .pre-wrap h3, .pre-wrap h4, .pre-wrap p, .pre-wrap span, .pre-wrap div, .pre-wrap label {
          color: inherit;
        }
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.4;
          z-index: 0;
        }
        .orb-1 { width: 40vw; height: 40vw; background: #2563eb; top: -10%; left: -10%; }
        .orb-2 { width: 50vw; height: 50vw; background: #4f46e5; bottom: -20%; right: -10%; }
        
        .pre-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px;
          position: relative;
          z-index: 10;
        }
        .pre-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 50px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-logo {
          width: 42px; height: 42px;
          background: #2563eb;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 20px;
        }
        .brand h2 {
          font-size: 22px; font-weight: 800; margin: 0;
        }
        .brand span { color: #60a5fa; font-weight: 600; }
        
        .steps-ind { display: flex; gap: 8px; }
        .ind-dot { width: 40px; height: 6px; border-radius: 10px; background: rgba(255,255,255,0.1); transition: 0.4s; }
        .ind-dot.active { background: #3b82f6; }

        .pre-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
          align-items: flex-start;
        }
        @media (max-width: 900px) {
          .pre-grid { grid-template-columns: 1fr; }
        }

        .glass-card {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 32px;
          padding: 40px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }
        .zoom-in { animation: zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes zoomIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .card-head { margin-bottom: 30px; }
        .card-head h1 { font-size: 32px; font-weight: 800; margin: 15px 0 5px; line-height: 1.2; color: #ffffff !important; }
        .card-head p { color: #94a3b8 !important; font-size: 15px; margin: 0; }

        .auth-form label, .fg label {
          display: block; font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: #94a3b8 !important; margin-bottom: 8px;
        }
        .inp-group, .inp-icon, .fg input {
          width: 100%;
          background: rgba(30, 41, 59, 0.5);
          border: 2px solid rgba(51, 65, 85, 0.8);
          border-radius: 16px;
          padding: 18px 20px;
          font-size: 18px; color: #ffffff !important;
          outline: none; transition: 0.2s;
        }
        .inp-group { display: flex; align-items: center; padding: 0; overflow: hidden; }
        .inp-group span { padding-left: 20px; color: #cbd5e1 !important; font-weight: 700; }
        .inp-group input { 
          background: transparent; border: none; padding: 18px 15px; width: 100%; 
          font-size: 18px; font-weight: 600; outline: none; color: #ffffff !important;
        }
        .inp-group:focus-within, .inp-icon:focus-within, .fg input:focus {
          border-color: #3b82f6; background: rgba(30, 41, 59, 0.9);
        }
        
        .inp-icon { display: flex; align-items: center; padding: 0; }
        .inp-icon input { background: transparent; border: none; padding: 18px 20px; width: 100%; outline: none; color: #ffffff !important; font-size:16px;}
        .inp-icon svg { margin-right: 15px; }

        .btn-primary {
          width: 100%; margin-top: 25px;
          background: #2563eb; color: #ffffff !important;
          border: none; border-radius: 16px;
          padding: 20px; font-size: 18px; font-weight: 800;
          cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px;
          transition: 0.3s;
        }
        .btn-primary:hover:not(:disabled) {
          background: #3b82f6; transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .verify-tag { display: flex; justify-content: space-between; background: rgba(30,41,59,0.8); padding: 15px 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.05); }
        .verify-tag span { color: #cbd5e1 !important; font-size: 14px; }
        .verify-tag strong { color: #ffffff !important; }
        .verify-tag button { background: none; border: none; color: #60a5fa !important; font-weight: 700; cursor: pointer; }
        
        .otp-boxes { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 25px; }
        .otp-box-ui {
          aspect-ratio: 1; width: 100%;
          background: rgba(30,41,59,0.8); border: 2px solid rgba(51,65,85,0.8);
          border-radius: 16px; text-align: center; font-size: 28px; font-weight: 800; color: #ffffff !important;
          outline: none; transition: 0.2s;
        }
        .otp-box-ui:focus { border-color: #3b82f6; background: #0f172a; transform: translateY(-3px); }

        .err-msg { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171 !important; padding: 15px; border-radius: 12px; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; margin-top: 20px; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .fg-full { grid-column: 1 / -1; }
        .fg input { padding: 18px 20px; font-size: 15px; font-weight: 500; }

        .pay-methods { display: flex; flex-direction: column; gap: 15px; }
        .pay-opt {
          display: flex; align-items: center; gap: 20px;
          background: rgba(30,41,59,0.5); border: 2px solid rgba(51,65,85,0.8);
          border-radius: 20px; padding: 25px; cursor: pointer; transition: 0.3s;
        }
        .pay-opt:hover { border-color: #3b82f6; background: rgba(37,99,235,0.1); }
        .pay-opt.cod:hover { border-color: #10b981; background: rgba(16,185,129,0.1); }
        .pay-icon { width: 50px; height: 50px; background: rgba(59,130,246,0.2); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .cod-icon { background: rgba(16,185,129,0.2); }
        .pay-info h4 { margin: 0 0 5px; font-size: 18px; font-weight: 700; color: #ffffff !important; }
        .pay-info p { margin: 0; font-size: 13px; color: #94a3b8 !important; }
        .arro { margin-left: auto; transition: 0.3s; color: #94a3b8 !important; }
        .pay-opt:hover .arro { transform: translateX(5px); color: #60a5fa !important; }
        .pay-opt.cod:hover .arro { color: #34d399 !important; }

        /* SUMMARY */
        .summary-glass {
          background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 32px; padding: 35px;
          position: sticky; top: 40px;
        }
        .sum-prod { display: flex; gap: 20px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 30px; margin-bottom: 30px; }
        .sum-prod img { width: 90px; height: 90px; object-fit: cover; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
        .brand-tag { font-size: 11px; font-weight: 800; color: #60a5fa !important; letter-spacing: 0.1em; text-transform: uppercase; }
        .sum-prod h3 { font-size: 18px; font-weight: 700; margin: 5px 0 0; line-height: 1.3; color: #ffffff !important; }
        
        .sum-lines { display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; }
        .sum-line { display: flex; justify-content: space-between; color: #cbd5e1 !important; font-size: 15px; font-weight: 500; }
        .sum-line span:first-child { color: #94a3b8 !important; }
        .sum-total { display: flex; justify-content: space-between; font-size: 24px; font-weight: 800; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #ffffff !important; }
        .sum-total span:last-child { color: #60a5fa !important; }

        .trust-badges { background: rgba(30,41,59,0.5); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 15px; }
        .bdg { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #cbd5e1 !important; font-weight: 600; }


        .overlay-load {
          position: fixed; inset: 0; background: rgba(2,6,23,0.9);
          backdrop-filter: blur(10px); z-index: 1000;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .overlay-load h2 { font-size: 28px; font-weight: 800; margin: 20px 0 5px; }
        .overlay-load p { color: #94a3b8; font-size: 16px; }
        
        .spin { animation: spinner 1s linear infinite; }
        @keyframes spinner { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
