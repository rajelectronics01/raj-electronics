/**
 * WhatsApp Notification Service for Raj Electronics
 * Handles customer and admin alerts for new orders.
 */

export async function sendWhatsAppNotification(to: string, message: string) {
  console.log(`[WhatsApp] Sending to ${to}: ${message}`);
  
  // REAL IMPLEMENTATION (Example using a generic provider)
  /*
  const API_KEY = process.env.WHATSAPP_API_KEY;
  const ENDPOINT = 'https://api.yourprovider.com/v1/messages';
  
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message }
      })
    });
    return await res.json();
  } catch (error) {
    console.error('WhatsApp notification failed:', error);
    return null;
  }
  */

  return { success: true, mock: true };
}

export async function notifyNewOrder(order: any) {
  const adminPhone = '+919290748866'; // Shop Owner
  const customerPhone = order.address.phone;
  const invoiceNo = `RAJ#${order.invoiceNo}`;
  const total = `₹${order.totalAmount.toLocaleString('en-IN')}`;
  
  // 1. Alert Admin
  const adminMsg = `📦 *New Order Received!*\n\nOrder ID: ${invoiceNo}\nCustomer: ${order.address.name}\nPhone: ${customerPhone}\nAmount: ${total}\nPayment: ${order.paymentMethod}\n\nView details: https://rajelectronics.co/admin/orders`;
  await sendWhatsAppNotification(adminPhone, adminMsg);

  // 2. Alert Customer
  const customerMsg = `✅ *Order Confirmed - Raj Electronics*\n\nThank you for shopping with us! Your order ${invoiceNo} for ${total} has been confirmed.\n\nOur team will call you shortly to schedule the delivery.\n\nSupport: +91 9290748866`;
  await sendWhatsAppNotification(customerPhone, customerMsg);
}
