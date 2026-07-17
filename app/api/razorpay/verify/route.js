import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCart } from "@/lib/shopify";
import { getShopifyAdminToken } from "@/lib/shopify/adminAuth";

export async function POST(req) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      cartId,
      customerData,
    } = await req.json();

    // 1. Verify Razorpay Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error("Razorpay secret not configured");
    }

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // 2. Fetch the cart to construct the Shopify Order
    const cart = await getCart(cartId);
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Calculate shipping logic again (to be safe)
    const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
    const shipping = subtotal > 0 && subtotal < 500 ? 49 : 0;
    const total = subtotal + shipping;

    // 3. Construct Shopify Order Payload
    const line_items = cart.lines.edges.map((edge) => {
      const item = edge.node;
      // Extract numeric ID from Global ID (e.g. gid://shopify/ProductVariant/12345?v=1)
      const rawId = item.merchandise.id.split("/").pop();
      const variantId = parseInt(rawId.split("?")[0], 10);
      
      return {
        variant_id: variantId,
        quantity: item.quantity,
        price: item.cost.totalAmount.amount,
      };
    });

    const address = {
      first_name: customerData.firstName,
      last_name: customerData.lastName,
      address1: customerData.address,
      city: customerData.city,
      province: customerData.state,
      zip: customerData.pincode,
      country: "IN",
      phone: customerData.phone,
    };

    const shopifyOrderPayload = {
      order: {
        email: customerData.email,
        billing_address: address,
        shipping_address: address,
        line_items: line_items,
        financial_status: "paid",
        transactions: [
          {
            kind: "sale",
            status: "success",
            amount: total.toString(),
            gateway: "razorpay",
            authorization: razorpay_payment_id,
          },
        ],
      },
    };

    if (shipping > 0) {
      shopifyOrderPayload.order.shipping_lines = [
        {
          title: "Standard Shipping",
          price: shipping.toString(),
          code: "Standard",
        },
      ];
    }

    // 4. Create Order in Shopify via Admin API
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    let adminToken;
    try {
      adminToken = await getShopifyAdminToken();
    } catch (err) {
      console.warn("Could not get Shopify Admin Token. Cannot create order in Shopify.", err);
    }

    if (!adminToken) {
      console.warn("SHOPIFY_ADMIN_ACCESS_TOKEN flow failed. Order not logged.");
    } else {
      const shopifyRes = await fetch(`https://${domain}/admin/api/2024-01/orders.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify(shopifyOrderPayload),
      });

      if (!shopifyRes.ok) {
        const errorData = await shopifyRes.json();
        console.error("Failed to create Shopify order:", JSON.stringify(errorData, null, 2));
        return NextResponse.json({ 
          error: "Shopify Order Creation Failed", 
          details: errorData 
        }, { status: 400 });
      } else {
        const orderData = await shopifyRes.json();
        console.log("Shopify order created successfully! ID:", orderData.order.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in verification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
