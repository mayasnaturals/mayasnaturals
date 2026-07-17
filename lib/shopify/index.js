import {
  getProductsQuery,
  getProductByHandleQuery,
  getCartQuery,
  getCustomerQuery,
} from './queries';
import {
  cartCreateMutation,
  cartLinesAddMutation,
  cartLinesUpdateMutation,
  cartLinesRemoveMutation,
} from './mutations';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'maya-demo.myshopify.com';
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || 'dummy-token';
const apiVersion = '2026-01';

export async function shopifyFetch({ query, variables = {}, cache = 'force-cache', tags = [] }) {
  try {
    const result = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags.length && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors;
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    console.error('Error fetching from Shopify:', JSON.stringify(error, null, 2));
    return {
      status: 500,
      body: { data: null },
      error,
    };
  }
}

export async function customerFetch({ query, variables = {}, accessToken }) {
  try {
    const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID;
    const result = await fetch(`https://shopify.com/${shopId}/account/customer/api/unstable/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache: 'no-store',
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    console.error('Error fetching from Shopify Customer Account API:', error);
    return {
      status: 500,
      body: { data: null },
      error,
    };
  }
}

// --- PRODUCT API ---

export async function getProducts(limit = 10, query = null) {
  const variables = { first: limit };
  if (query) {
    variables.query = query;
  }
  const res = await shopifyFetch({
    query: getProductsQuery,
    variables,
    tags: ['products'],
    cache: 'no-store'
  });
  return res.body?.data?.products?.edges.map((edge) => edge.node) || [];
}

export async function getProduct(handle) {
  const res = await shopifyFetch({
    query: getProductByHandleQuery,
    variables: { handle },
    tags: ['product'],
  });
  return res.body?.data?.product || null;
}

// --- CART API ---

export async function createCart() {
  const res = await shopifyFetch({
    query: cartCreateMutation,
    variables: { input: {} },
    cache: 'no-store',
  });
  return res.body?.data?.cartCreate?.cart;
}

export async function getCart(cartId) {
  if (!cartId) return null;
  const res = await shopifyFetch({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store',
  });
  return res.body?.data?.cart || null;
}

export async function addToCart(cartId, lines) {
  const res = await shopifyFetch({
    query: cartLinesAddMutation,
    variables: { cartId, lines },
    cache: 'no-store',
  });
  return res.body?.data?.cartLinesAdd?.cart;
}

export async function updateCart(cartId, lines) {
  const res = await shopifyFetch({
    query: cartLinesUpdateMutation,
    variables: { cartId, lines },
    cache: 'no-store',
  });
  return res.body?.data?.cartLinesUpdate?.cart;
}

export async function removeFromCart(cartId, lineIds) {
  const res = await shopifyFetch({
    query: cartLinesRemoveMutation,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });
  return res.body?.data?.cartLinesRemove?.cart;
}

// --- CUSTOMER API ---
// Customer data is now fetched securely through the Next.js API routes proxying to Customer Account API.
