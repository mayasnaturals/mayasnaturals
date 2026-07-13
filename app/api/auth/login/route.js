import { NextResponse } from 'next/server';
import { generateState, generateCodeVerifier, generateCodeChallenge, SHOPIFY_AUTH_URL, CLIENT_ID, getAppUrl } from '@/lib/shopify/auth';

export async function GET(req) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const redirectUri = `${getAppUrl(req)}/api/auth/callback`;

  const url = new URL(SHOPIFY_AUTH_URL);
  url.searchParams.append('client_id', CLIENT_ID);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('scope', 'openid email customer-account-api:full');
  url.searchParams.append('state', state);
  url.searchParams.append('code_challenge', codeChallenge);
  url.searchParams.append('code_challenge_method', 'S256');

  const response = NextResponse.redirect(url.toString());

  // Store state and verifier in HttpOnly cookies
  response.cookies.set('shopify_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
  });

  response.cookies.set('shopify_auth_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
  });

  return response;
}
