const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'mayasnaturals.myshopify.com';
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '75bfa838468f1d4fa059609792a9c32f';
const apiVersion = '2026-01';

const query = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          badge: metafield(namespace: "custom", key: "badge") {
            value
          }
          newness: metafield(namespace: "custom", key: "newness") {
            value
          }
          colorDark: metafield(namespace: "custom", key: "color_dark") {
            value
          }
          colorMid: metafield(namespace: "custom", key: "color_mid") {
            value
          }
          colorLight: metafield(namespace: "custom", key: "color_light") {
            value
          }
          variants(first: 1) {
            edges {
              node {
                id
                weight
                weightUnit
              }
            }
          }
        }
      }
    }
  }
`;

async function test() {
  const result = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables: { first: 1 } }),
  });
  
  const body = await result.json();
  console.log(JSON.stringify(body, null, 2));
}

test();
