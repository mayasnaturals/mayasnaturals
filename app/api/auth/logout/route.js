import { NextResponse } from 'next/server';
import { SHOPIFY_LOGOUT_URL, getAppUrl } from '@/lib/shopify/auth';

export async function GET(req) {
  // Try to get the ID token hint, which Shopify requires for logout
  const idToken = req.cookies.get('shopify_id_token')?.value;

  // Form the Shopify logout URL
  let redirectUrl = SHOPIFY_LOGOUT_URL;
  if (idToken) {
    redirectUrl = `${SHOPIFY_LOGOUT_URL}?id_token_hint=${idToken}&post_logout_redirect_uri=${getAppUrl(req)}`;
  }

  // Create a response that redirects to Shopify (or home if no token)
  const response = NextResponse.redirect(redirectUrl);

  // Clear all session cookies
  response.cookies.delete('shopify_customer_token');
  response.cookies.delete('shopify_refresh_token');
  response.cookies.delete('shopify_id_token');

  return response;
}

