import { getOrderWithDetails } from '@/lib/orders';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import InvoiceDownload from './InvoiceDownload'; // Client Component for downloading

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderWithDetails(id);

  if (!order) {
    notFound();
  }

  const invoiceNo = `RAJ#${order.invoiceNo}`;
  const total = order.totalAmount;
  const isPaid = order.paymentStatus === 'PAID';
  const isCOD = order.paymentMethod === 'COD';

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        
        {/* SUCCESS MESSAGE */}
        <div className={styles.heroSection}>
          <div className={styles.heroIcon}>✅</div>
          <h1 className={styles.heroTitle}>
            {order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PENDING' 
              ? 'Order Successfully Placed!' 
              : `Order ${order.orderStatus}`}
          </h1>
          <p className={styles.heroSubtitle}>
            Your invoice number is <strong>{invoiceNo}</strong>.
          </p>
          <div className={styles.statusBar}>
            <div className={`${styles.statusPill} ${styles.payment} ${isPaid ? styles.active : ''}`}>
              {isPaid ? 'Payment Paid' : isCOD ? 'Cash on Delivery' : 'Payment Pending'}
            </div>
            <div className={`${styles.statusPill} ${styles.order} ${styles.active}`}>
              Order Status: {order.orderStatus}
            </div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* INVOICE SECTION */}
          <div className={styles.invoiceColumn}>
            <div id="invoiceArea" className={styles.invoiceCard}>
              <div className={styles.invHeader}>
                <div className={styles.brandInfo}>
                  <img src="/logo.png" alt="Raj Electronics" className={styles.invLogo} />
                  <div>
                    <h2>Raj Electronics</h2>
                    <p>Rashtrapati Road, Secunderabad - 500003</p>
                    <p><strong>GSTIN: 36AGHPK5794N1ZL</strong></p>
                  </div>
                </div>
                <div className={styles.invMeta}>
                  <h3>TAX INVOICE</h3>
                  <p>No: {invoiceNo}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              <div className={styles.invBody}>
                <div className={styles.addressGrid}>
                  <div>
                    <span className={styles.label}>BILL TO</span>
                    <p><strong>{order.address.name}</strong></p>
                    <p>{order.address.phone}</p>
                    <p>{order.address.street}, {order.address.area}, {order.address.pin}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={styles.label}>ORDER DETAILS</span>
                    <p>Payment: {order.paymentMethod}</p>
                    <p>Status: {isPaid ? 'Paid' : 'Unpaid'}</p>
                  </div>
                </div>

                <table className={styles.invTable}>
                  <thead>
                    <tr>
                      <th align="left">Description</th>
                      <th align="center">Qty</th>
                      <th align="right">Rate</th>
                      <th align="right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: any) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.product.name}</strong>
                          <small>SKU: {item.product.slug.toUpperCase()}</small>
                        </td>
                        <td align="center">{item.quantity}</td>
                        <td align="right">₹{item.price.toLocaleString('en-IN')}</td>
                        <td align="right">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.invTotals}>
                  <div className={styles.totalRow}>
                    <span>Total Taxable Amount</span>
                    <span>₹{Math.round(total / 1.18).toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>GST (18%)</span>
                    <span>₹{Math.round(total * 0.18 / 1.18).toLocaleString('en-IN')}</span>
                  </div>
                  <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <InvoiceDownload 
                orderId={order.id} 
                invoiceNo={invoiceNo} 
              />
              <a 
                href={`https://wa.me/919290748866?text=Hi, I have a query about my order ${invoiceNo}.`} 
                target="_blank" 
                className={styles.waButton}
              >
                💬 WhatsApp for Support
              </a>
            </div>
          </div>

          {/* NEXT STEPS COLUMN */}
          <div className={styles.stepsColumn}>
            <div className={styles.nextStepsCard}>
              <h3>Next Steps</h3>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>1</div>
                <div>
                  <p><strong>WhatsApp Confirmation</strong></p>
                  <p>You will receive a confirmation message shortly on +91 {order.address.phone}.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>2</div>
                <div>
                  <p><strong>Verification Call</strong></p>
                  <p>Our team will call you within 2-4 hours to verify the shipping address and schedule delivery.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>3</div>
                <div>
                  <p><strong>Installation</strong></p>
                  <p>Standard installation (if applicable) will be coordinated by our technicians separately.</p>
                </div>
              </div>
            </div>

            <div className={styles.helpBox}>
              <p>Need help? Call us at</p>
              <a href="tel:+919290748866">+91 9290748866</a>
            </div>
            
            <Link href="/" className={styles.continueButton}>
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
