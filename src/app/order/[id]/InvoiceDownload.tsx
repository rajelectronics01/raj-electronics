"use client";

import React from 'react';
import styles from './page.module.css';

export default function InvoiceDownload({ orderId, invoiceNo }: { orderId: string, invoiceNo: string }) {
  const download = async () => {
    try {
      const el = document.getElementById('invoiceArea');
      if (el) {
        // Dynamic imports to save bundle size on main pages
        const html2canvasLib = (await import('html2canvas')).default;
        const jsPDFLib = (await import('jspdf')).jsPDF || (await import('jspdf')).default;
        
        const canvas = await html2canvasLib(el, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDFLib('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Invoice_${invoiceNo}.pdf`);
      }
    } catch (e) {
      console.error('Invoice download failed:', e);
      window.print();
    }
  };

  return (
    <button onClick={download} className={styles.printButton}>
      🖨️ Download Invoice (PDF)
    </button>
  );
}
