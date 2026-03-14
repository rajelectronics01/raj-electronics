"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import styles from "./login.module.css";

type Step = "phone" | "otp" | "name";

// ─────────────────────────────────────────────────────────────────────────────
// Inner component (uses useSearchParams → must be inside Suspense)
// ─────────────────────────────────────────────────────────────────────────────
function LoginForm() {
  const { refreshUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // ── Step 1: Quick Login (Free, no OTP) ─────────────────────────────────────
  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/quick-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.isNewUser) {
          setStep("name");
        } else {
          await refreshUser();
          router.push(redirectTo);
        }
      } else {
        setError(data.message || "Failed to log in.");
      }
    } catch (err: any) {
      console.error("Quick Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Save optional name for new users ───────────────────────────────
  const handleSaveName = async (skipName = false) => {
    setLoading(true);
    try {
      if (!skipName && name.trim()) {
        await fetch("/api/user/update-name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        });
      }
      await refreshUser();
      router.push(redirectTo);
    } catch {
      await refreshUser();
      router.push(redirectTo);
    } finally {
      setLoading(false);
    }
  };


  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      <div className={styles.card}>
        {/* Logo header */}
        <div className={styles.logoWrap}>
          <Image
            src="/logo.png"
            alt="Raj Electronics"
            width={52}
            height={52}
            className={styles.logo}
          />
          <div>
            <div className={styles.logoTitle}>Raj Electronics</div>
            <div className={styles.logoSub}>Legacy Since 1995</div>
          </div>
        </div>

        <div className={styles.cardBody}>
          {/* ── Step 1: Phone ── */}
          {step === "phone" && (
            <form onSubmit={handleQuickLogin} className={styles.form}>
              <h2 className={styles.heading}>Fast Login</h2>
              <p className={styles.subheading}>
                Enter your mobile number to continue — no password required
              </p>

              <div className={styles.phoneField}>
                <span className={styles.phonePrefix}>+91</span>
                <input
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className={styles.phoneInput}
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError("");
                  }}
                  autoFocus
                  autoComplete="tel"
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={loading || phone.length !== 10}
              >
                {loading ? <span className={styles.spinner} /> : "Continue to Shop →"}
              </button>

              <div className={styles.firebaseBadge}>
                <span>🔒</span>
                <span>Verified by Call Confirmation</span>
              </div>

              <p className={styles.terms}>
                By continuing, you agree to our{" "}
                <Link href="/about" className={styles.link}>
                  Terms
                </Link>{" "}
                &amp;{" "}
                <Link href="/about" className={styles.link}>
                  Privacy Policy
                </Link>
              </p>
            </form>
          )}


          {/* ── Step 3: Name (new users only) ── */}
          {step === "name" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveName(false);
              }}
              className={styles.form}
            >
              <div className={styles.successIcon}>🎉</div>
              <h2 className={styles.heading}>Welcome!</h2>
              <p className={styles.subheading}>
                Account created. What should we call you?
              </p>

              <input
                type="text"
                className={styles.nameInput}
                placeholder="Your full name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                maxLength={50}
              />

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  "Start Shopping →"
                )}
              </button>

              <button
                type="button"
                className={styles.skipBtn}
                onClick={() => handleSaveName(true)}
                disabled={loading}
              >
                Skip for now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export — wraps LoginForm with Suspense (required for useSearchParams)
// ─────────────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "3px solid #bae6fd",
              borderTopColor: "#0284c7",
              animation: "spin 0.7s linear infinite",
            }}
          />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
