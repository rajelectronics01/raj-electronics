"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../success/page.module.css';

function FailedContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('t');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>❌</div>
        <h1 className={styles.title} style={{ color: '#e53e3e' }}>Payment Failed</h1>
        <p className={styles.msg}>
          We couldn't process your payment for transaction <strong>#{transactionId}</strong>. 
          No money was deducted from your account. If it was, it will be refunded automatically.
        </p>
        <div className={styles.nextSteps} style={{ background: '#fff5f5' }}>
          <h3 style={{ color: '#c53030' }}>Common reasons:</h3>
          <ul>
            <li>Incorrect PIN or insufficient funds.</li>
            <li>Bank server timeout or internet issue.</li>
            <li>Transaction cancelled by you.</li>
          </ul>
        </div>
        <div className={styles.actions}>
          <Link href="/checkout/cart" className={styles.btnPrimary} style={{ background: '#e53e3e' }}>Try Again</Link>
          <Link href="/" className={styles.btnOutline}>Cancel & Home</Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderFailedPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Loading error details...</div>}>
      <FailedContent />
    </Suspense>
  );
}
