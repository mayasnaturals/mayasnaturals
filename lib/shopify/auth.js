import crypto from 'crypto';

export function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

export function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

export function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

export const SHOPIFY_AUTH_URL = `https://shopify.com/authentication/${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID}/oauth/authorize`;
export const SHOPIFY_TOKEN_URL = `https://shopify.com/authentication/${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID}/oauth/token`;
export const SHOPIFY_LOGOUT_URL = `https://shopify.com/authentication/${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID}/logout`;
export const CLIENT_ID = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;

export function getAppUrl(req) {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  
  if (host) {
    const isLocal = host.includes('localhost') || host.startsWith('192.168.') || host.startsWith('10.');
    const protocol = (isLocal && !host.includes('ngrok')) ? 'http' : 'https';
    return `${protocol}://${host}`;
  }

  // Fallback to environment variable
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}
