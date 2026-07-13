import { NextResponse } from 'next/server';
import { SHOPIFY_TOKEN_URL, CLIENT_ID, getAppUrl } from '@/lib/shopify/auth';

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const storedState = req.cookies.get('shopify_auth_state')?.value;
  const storedVerifier = req.cookies.get('shopify_auth_verifier')?.value;

  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
  }

  if (state !== storedState) {
    return NextResponse.json({ error: 'State mismatch' }, { status: 403 });
  }

  const redirectUri = `${getAppUrl(req)}/api/auth/callback`;

  // Exchange code for token
  const body = new URLSearchParams();
  body.append('grant_type', 'authorization_code');
  body.append('client_id', CLIENT_ID);
  body.append('redirect_uri', redirectUri);
  body.append('code', code);
  body.append('code_verifier', storedVerifier);

  const tokenResponse = await fetch(SHOPIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const data = await tokenResponse.json();

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: 'Failed to exchange token', details: data }, { status: tokenResponse.status });
  }

  if (!data.access_token) {
    return NextResponse.json({ error: 'No access token received', details: data }, { status: 400 });
  }

  const response = NextResponse.redirect(`${getAppUrl(req)}/account`);

  // Store tokens in cookies
  response.cookies.set('shopify_customer_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: data.expires_in,
  });

  if (data.refresh_token) {
    response.cookies.set('shopify_refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      // typically long lived
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  if (data.id_token) {
    response.cookies.set('shopify_id_token', data.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.expires_in,
    });
  }

  // Clear auth state
  response.cookies.delete('shopify_auth_state');
  response.cookies.delete('shopify_auth_verifier');

  return response;
}
