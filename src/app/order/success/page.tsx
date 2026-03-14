"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('t');
  const invoiceNo = searchParams.get('inv');
  const [success, setSuccess] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✅</div>
        <h1 className={styles.title}>Payment Successful!</h1>
        <p className={styles.msg}>
          Your order has been confirmed. Your invoice number is <strong>RAJ#{invoiceNo || transactionId}</strong>.
        </p>
        <div className={styles.nextSteps}>
          <h3>What happens next?</h3>
          <ul>
            <li>You will receive an order confirmation SMS/WhatsApp shortly.</li>
            <li>Our team will call you to confirm the delivery schedule.</li>
            <li>You can track your order in the "My Orders" section.</li>
          </ul>
        </div>
        <div className={styles.actions}>
          <Link href="/orders" className={styles.btnPrimary}>View My Orders</Link>
          <Link href="/" className={styles.btnOutline}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Loading success details...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
