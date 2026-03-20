'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { auth } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { ShieldCheck, Loader2, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import styles from './login.module.css';

// Separate component for the login logic using searchParams
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { refreshUser } = useUser();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // FIREBASE LOGIC
  const setupRecaptcha = () => {
    if ((window as any).recaptchaVerifier) return;
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'login-captcha-box', {
      size: 'invisible',
    });
  };

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phoneNumber)) return setError('Enter valid 10-digit number');
    setIsLoading(true);
    setError('');
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, (window as any).recaptchaVerifier);
      setConfirmationResult(result);
      setShowOtp(true);
    } catch (err: any) {
      setError('SMS limit reached or connection failed. Try again.');
      console.error(err);
      if ((window as any).recaptchaVerifier) {
        try { (window as any).recaptchaVerifier.clear(); } catch(e){}
        (window as any).recaptchaVerifier = null;
        const box = document.getElementById('login-captcha-box');
        if (box) box.innerHTML = '';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.join('').length < 6) return setError('Enter 6-digit code');
    if (!confirmationResult) return setError('Session expired. Send OTP again.');
    
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp.join(''));
      const idToken = await result.user.getIdToken();
      
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      if (res.ok) {
        await refreshUser();
        router.push(redirect);
      }
    } catch (err) {
      setError('Invalid code.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div id="login-captcha-box"></div>
      
      {/* Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <div className="login-box glass-card zoom-in">
        
        <div className="login-head">
          <Link href="/" className="logo-btn">R</Link>
          <h1>Welcome Back</h1>
          <p>Secure access to <span>Raj Electronics</span></p>
        </div>

        {!showOtp ? (
          <div className="auth-form">
            <label>Phone Number</label>
            <div className="inp-group">
              <span>+91</span>
              <input 
                autoFocus type="tel" maxLength={10} value={phoneNumber} 
                onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))} 
                placeholder="98765 43210" 
              />
              <Phone size={20} color="#64748b" />
            </div>
            {error && <div className="err-msg"><AlertCircle size={16}/> {error}</div>}
            <button disabled={isLoading} onClick={handleSendOtp} className="btn-primary">
              {isLoading ? <Loader2 className="spin" size={24}/> : <>Access Securely <ArrowRight size={20}/></>}
            </button>
          </div>
        ) : (
          <div className="auth-form">
            <div className="verify-tag">
              <span>Code sent to <strong>+91 {phoneNumber}</strong></span>
              <button onClick={() => setShowOtp(false)}>Edit</button>
            </div>
            <div className="otp-boxes">
              {otp.map((d, i) => (
                <input 
                  key={i} ref={el => { otpInputs.current[i] = el; }} 
                  type="tel" maxLength={1} value={d} 
                  onChange={e => {
                    const n = [...otp]; n[i] = e.target.value.slice(-1); setOtp(n);
                    if (e.target.value && i < 5) otpInputs.current[i+1]?.focus();
                  }} 
                  onKeyDown={e => e.key === 'Backspace' && !otp[i] && otpInputs.current[i-1]?.focus()} 
                  className="otp-box-ui" 
                />
              ))}
            </div>
            {error && <div className="err-msg"><AlertCircle size={16}/> {error}</div>}
            <button disabled={isLoading} onClick={handleVerifyOtp} className="btn-primary">
              {isLoading ? <Loader2 className="spin" size={24}/> : 'Confirm Identity'}
            </button>
          </div>
        )}

        <div className="login-foot">
           <div className="shield-tag">
             <ShieldCheck size={16} color="#3b82f6" /> 
             End-to-End Encrypted
           </div>
           <p>By continuing, you verify your agreement with our Terms of Sale and Privacy Guidelines.</p>
        </div>
      </div>

      <div className="copyright">Raj Electronics • Secure Portal 2026</div>

      <style jsx>{`
        * { box-sizing: border-box; }
        .login-wrap {
          background-color: #020617;
          min-height: 100vh;
          font-family: 'DM Sans', system-ui, sans-serif;
          color: #fff;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        
        /* BACKGROUND GLOWS */
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.3;
          z-index: 0;
        }
        .orb-1 { width: 600px; height: 600px; background: #2563eb; top: 10%; left: -10%; }
        .orb-2 { width: 500px; height: 500px; background: #6366f1; bottom: -10%; right: -5%; }

        .login-box {
          width: 100%; max-width: 480px;
          position: relative; z-index: 10;
        }
        
        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 36px;
          padding: 50px 45px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
        }
        .zoom-in { animation: zoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        .login-head { text-align: center; margin-bottom: 40px; }
        .logo-btn {
          width: 65px; height: 65px; background: #2563eb;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 20px; font-weight: 900; font-size: 28px;
          text-decoration: none; color: #fff;
          box-shadow: 0 10px 30px rgba(37,99,235,0.4);
          margin-bottom: 25px; transition: 0.3s;
        }
        .logo-btn:hover { background: #3b82f6; transform: translateY(-3px); }
        
        .login-head h1 { font-size: 32px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.5px; color: #ffffff !important; }
        .login-head p { color: #94a3b8 !important; font-size: 15px; margin: 0; }
        .login-head p span { color: #ffffff !important; font-weight: 600; }

        .auth-form { display: flex; flex-direction: column; gap: 8px; }
        .auth-form label {
          font-size: 11px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.15em; color: #94a3b8 !important; margin-bottom: 5px; margin-left: 5px;
        }
        
        .inp-group {
          width: 100%; display: flex; align-items: center; overflow: hidden;
          background: rgba(30, 41, 59, 0.4); border: 2px solid rgba(51, 65, 85, 0.6);
          border-radius: 20px; padding: 20px 24px; transition: 0.3s;
        }
        .inp-group span { color: #cbd5e1 !important; font-weight: 700; font-size: 18px; margin-right: 15px; }
        .inp-group input { 
          background: transparent; border: none; width: 100%; 
          font-size: 20px; font-weight: 600; outline: none; color: #ffffff !important; letter-spacing: 1px;
        }
        .inp-group:focus-within {
          border-color: #3b82f6; background: rgba(30, 41, 59, 0.8); box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
        }

        .btn-primary {
          width: 100%; margin-top: 20px;
          background: #2563eb; color: #ffffff !important;
          border: none; border-radius: 20px;
          padding: 22px; font-size: 18px; font-weight: 800;
          cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px;
          transition: 0.3s; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
        }
        .btn-primary:hover:not(:disabled) {
          background: #3b82f6; transform: translateY(-2px); box-shadow: 0 15px 35px rgba(37, 99, 235, 0.5);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .verify-tag { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 25px; padding: 0 5px; }
        .verify-tag span { color: #cbd5e1 !important; }
        .verify-tag strong { color: #ffffff !important; }
        .verify-tag button { background: none; border: none; color: #60a5fa !important; font-weight: 700; cursor: pointer; text-decoration: none; }
        .verify-tag button:hover { text-decoration: underline; }

        .otp-boxes { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 20px; }
        .otp-box-ui {
          aspect-ratio: 1; width: 100%;
          background: rgba(30,41,59,0.5); border: 2px solid rgba(51,65,85,0.6);
          border-radius: 16px; text-align: center; font-size: 26px; font-weight: 800; color: #ffffff !important;
          outline: none; transition: 0.2s;
        }
        .otp-box-ui:focus { border-color: #3b82f6; background: rgba(15,23,42,0.9); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

        .err-msg { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171 !important; padding: 15px 20px; border-radius: 16px; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; margin-top: 15px; }
        
        .login-foot { margin-top: 45px; display: flex; flex-direction: column; align-items: center; gap: 15px; text-align: center; opacity: 0.8; }
        .shield-tag { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8 !important; }
        .login-foot p { font-size: 11px; color: #cbd5e1 !important; line-height: 1.6; max-width: 300px; margin: 0; }

        .copyright { margin-top: 40px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: #64748b !important; position: relative; z-index: 10; }

        .spin { animation: spinner 1s linear infinite; }
        @keyframes spinner { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// THE WRAPPER (This fixes the Vercel Build Error)
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#020617', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="spin" size={40} color="#2563eb" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
