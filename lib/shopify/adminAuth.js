// lib/shopify/adminAuth.js
let cachedToken = null;
let tokenExpiresAt = 0;

export async function getShopifyAdminToken() {
  // If we have a valid cached token (adding a 5 min buffer), return it
  if (cachedToken && Date.now() < tokenExpiresAt - 5 * 60 * 1000) {
    return cachedToken;
  }

  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!domain || !clientId || !clientSecret) {
    throw new Error("Missing Shopify API credentials (domain, client ID, or client secret).");
  }

  try {
    const response = await fetch(`https://${domain}/admin/oauth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      cache: "no-store", // Do not cache via Next.js fetch cache, use memory
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to fetch Shopify admin access token:", data);
      throw new Error(data.error_description || data.error || "Failed to fetch access token");
    }

    cachedToken = data.access_token;
    // expires_in is in seconds
    tokenExpiresAt = Date.now() + data.expires_in * 1000;

    return cachedToken;
  } catch (error) {
    console.error("Error in getShopifyAdminToken:", error);
    throw error;
  }
}
