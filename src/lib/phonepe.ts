import crypto from 'crypto';

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX;
const HOST = process.env.PHONEPE_HOST;

/**
 * Generates the X-VERIFY header for PhonePe API calls
 * Format: SHA256(base64Body + endpoint + saltKey) + "###" + saltIndex
 */
export function generateChecksum(payload: string, endpoint: string): string {
  const dataToHash = payload + endpoint + SALT_KEY;
  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  return `${hash}###${SALT_INDEX}`;
}

/**
 * Verifies the checksum received from PhonePe in the callback
 */
export function verifyChecksum(payload: string, xVerify: string): boolean {
  const dataToHash = payload + SALT_KEY;
  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  const expectedVerify = `${hash}###${SALT_INDEX}`;
  return expectedVerify === xVerify;
}

export const PHONEPE_CONFIG = {
  MERCHANT_ID,
  HOST,
  CALLBACK_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
  REDIRECT_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/status`,
};
