import nodemailer from 'nodemailer';

/**
 * RAJ ELECTRONICS: NOTIFICATION CENTER (GMAIL RELAY)
 * Bypassing Wix/Resend DNS issues by sending directly through Google Business Mail.
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/**
 * 📧 SEND ORDER RECEIPT (Email)
 */
export async function sendOrderEmail(order: any) {
  try {
    const customerEmail = order.address.email || 'offerrajelectronics@gmail.com'; 
    console.log(`[Email] Relay (Gmail) -> Customer: ${customerEmail}`);

    // Build Items List
    const itemRows = order.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name} (x${item.quantity})</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"Raj Electronics" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Confirmed: RAJ#${order.invoiceNo}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; border-top: 4px solid #0284c7;">
          <h2 style="color: #0284c7; margin-bottom: 5px;">Order Confirmation</h2>
          <p style="color: #666; margin-top: 0;">Order RAJ#${order.invoiceNo}</p>
          
          <p>Hi <strong>${order.address.name}</strong>,</p>
          <p>Thank you for shopping with us! Your order has been confirmed and is being processed.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f9fafb; border-radius: 8px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 15px 10px; font-weight: bold;">Grand Total</td>
                <td style="padding: 15px 10px; font-weight: bold; text-align: right; color: #0284c7; font-size: 1.2em;">₹${order.totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 10px;">
            <p style="margin: 0; color: #1e40af;"><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            <p style="margin: 5px 0 0 0; color: #1e40af;"><strong>Delivery to:</strong> ${order.address.street}, ${order.address.area} (${order.address.pin})</p>
          </div>

          <p style="margin-top: 25px;">We'll notify you once your items are dispatched!</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">Raj Electronics - Trusted Since 1995 | Support: +91 9290748866</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[Email Success - Customer Relay]:', info.messageId);
    return info;
  } catch (err) {
    console.error('[Email Exception - Customer Relay]:', err);
    return null;
  }
}

/**
 * 📧 SEND ADMIN ALERT (Email)
 */
export async function sendAdminOrderAlert(order: any) {
  try {
    const adminEmail = 'offerrajelectronics@gmail.com'; 
    console.log(`[Email] Relay (Gmail) -> Admin Alert: ${adminEmail}`);

    const itemSummary = order.items.map((item: any) => `${item.product.name} (x${item.quantity})`).join(', ');

    const mailOptions = {
      from: `"Raj Electronics Admin" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: `🚨 NEW ORDER: RAJ#${order.invoiceNo}`,
      html: `
        <div style="font-family: sans-serif; background: #fff1f2; padding: 30px; border-radius: 12px; border: 1px solid #fecaca;">
          <h2 style="color: #be123c; margin-top: 0;">📦 New Order Alert!</h2>
          <p>A new order has been received and confirmed.</p>
          <hr style="border: 0; border-top: 1px solid #fecaca; margin: 20px 0;" />
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <p><strong>Order ID:</strong> RAJ#${order.invoiceNo}</p>
            <p><strong>Merchant Trans ID:</strong> ${order.transactionId}</p>
            <p><strong>Customer:</strong> ${order.address.name} (${order.address.phone})</p>
            <p><strong>Items:</strong> ${itemSummary}</p>
            <p style="font-size: 1.1em; color: #be123c;"><strong>Total Amount:</strong> ₹${order.totalAmount.toLocaleString('en-IN')}</p>
          </div>

          <p style="margin-top: 20px; text-align: center;">
            <a href="https://rajelectronics.co/admin/orders" style="background: #be123c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Details in Dashboard</a>
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[Email Success - Admin Relay]:', info.messageId);
    return info;
  } catch (err) {
    console.error('[Email Exception - Admin Relay]:', err);
    return null;
  }
}

/**
 * 📦 MASTER NOTIFICATION TRIGGER
 */
export async function notifyNewOrder(order: any) {
  const invoiceNo = `RAJ#${order.invoiceNo}`;
  console.log(`[Notification] Triggering Google Relay for Order ${invoiceNo}`);

  // 1. Send Customer Receipt
  await sendOrderEmail(order);

  // 2. Send Admin Alert
  await sendAdminOrderAlert(order);
}
