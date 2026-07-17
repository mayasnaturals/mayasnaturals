const fs = require('fs');

async function testShopifyOrder() {
  // Parse env
  const env = fs.readFileSync('.env', 'utf-8').split(/\r?\n/).reduce((acc, line) => {
    const match = line.match(/^([^#\s=]+)=(.*)$/);
    if (match) acc[match[1]] = match[2].trim();
    return acc;
  }, {});
  Object.assign(process.env, env);

  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  try {
    // 1. Get Token
    const tokenRes = await fetch(`https://${domain}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      })
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;
    console.log("Got Token:", token ? "Yes" : "No");

    // 2. Fetch a valid product variant
    const prodRes = await fetch(`https://${domain}/admin/api/2024-01/products.json?limit=1`, {
      headers: { "X-Shopify-Access-Token": token }
    });
    const prodData = await prodRes.json();
    const variantId = prodData.products[0].variants[0].id;
    console.log("Testing with variantId:", variantId, "type:", typeof variantId);

    // 3. Create Order
    const shopifyOrderPayload = {
      order: {
        email: "test_order_creation@example.com",
        billing_address: {
          first_name: "Test",
          last_name: "User",
          address1: "123 Test St",
          city: "Test City",
          province: "Test State",
          zip: "123456",
          country: "IN",
          phone: "9999999999"
        },
        shipping_address: {
          first_name: "Test",
          last_name: "User",
          address1: "123 Test St",
          city: "Test City",
          province: "Test State",
          zip: "123456",
          country: "IN",
          phone: "9999999999"
        },
        line_items: [
          {
            variant_id: parseInt(variantId), // Try parsing to int
            quantity: 1,
            price: "10.00"
          }
        ],
        financial_status: "paid",
        transactions: [
          {
            kind: "sale",
            status: "success",
            amount: "10.00",
            gateway: "razorpay"
          }
        ]
      }
    };

    console.log("Sending order payload...");
    const orderRes = await fetch(`https://${domain}/admin/api/2024-01/orders.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token
      },
      body: JSON.stringify(shopifyOrderPayload)
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      console.error("Shopify Order Creation Failed:", JSON.stringify(orderData, null, 2));
    } else {
      console.log("Success! Order ID:", orderData.order.id);
    }
  } catch (error) {
    console.error("Script error:", error);
  }
}

testShopifyOrder();
