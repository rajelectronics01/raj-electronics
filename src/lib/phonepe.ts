import crypto from 'crypto';

/**
 * RAJ ELECTRONICS: PHONEPE SECURITY CORE
 * Handles HMAC-SHA256 signature generation for V1/V2 APIs.
 */

const SALT_KEY = process.env.PHONEPE_SALT_KEY!;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID!;
const PHONEPE_HOST = process.env.PHONEPE_HOST || 'https://api-preprod.phonepe.com/apis/pg-sandbox';

/**
 * Generate X-VERIFY header for PhonePe requests
 * (Base64 Body + Endpoint + Salt Key) -> SHA256 -> ### + Salt Index
 */
export function generateXVerify(base64Payload: string, endpoint: string): string {
  const stringToSign = base64Payload + endpoint + SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
  return `${sha256}###${SALT_INDEX}`;
}

/**
 * Verify incoming webhook signature from PhonePe
 */
export function verifyCallback(xVerify: string, base64Payload: string): boolean {
  const sha256 = crypto.createHash('sha256').update(base64Payload + SALT_KEY).digest('hex');
  const expected = `${sha256}###${SALT_INDEX}`;
  return xVerify === expected;
}

export const PHONEPE_CONFIG = {
  MERCHANT_ID,
  HOST: PHONEPE_HOST,
  CALLBACK_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/webhook`,
  REDIRECT_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/order/confirmation`,
};
