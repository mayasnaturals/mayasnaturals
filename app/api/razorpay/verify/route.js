import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCart } from "@/lib/shopify";
import { getShopifyAdminToken } from "@/lib/shopify/adminAuth";
import { getComboPrice } from "@/lib/pricing";

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

    let calculatedSubtotal = 0;
    const combos = {};

    // Get Shopify's exact discount amount
    const shopifySubtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || 0);
    const shopifyTotal = parseFloat(cart?.cost?.totalAmount?.amount || 0);
    const shopifyDiscount = Math.round(Math.max(0, shopifySubtotal - shopifyTotal));

    // First pass: group combo items
    cart.lines.edges.forEach((edge) => {
      const item = edge.node;
      const comboAttr = item.attributes?.find(a => a.key === '_comboId');
      if (comboAttr) {
        const comboId = comboAttr.value;
        if (!combos[comboId]) combos[comboId] = { items: [] };
        combos[comboId].items.push(item);
      }
    });

    const line_items = [];
    const invoiceItems = [];

    // Second pass: build line items with correct pricing
    cart.lines.edges.forEach((edge) => {
      const item = edge.node;
      const rawId = item.merchandise.id.split("/").pop();
      const variantId = parseInt(rawId.split("?")[0], 10);
      const comboAttr = item.attributes?.find(a => a.key === '_comboId');

      let unitPrice = 0;

      if (comboAttr) {
        const comboId = comboAttr.value;
        const combo = combos[comboId];
        const sampleVariant = combo.items[0].merchandise.title;
        const size = combo.items.reduce((sum, it) => sum + it.quantity, 0);
        const hardcoded = getComboPrice(sampleVariant, size);
        
        if (hardcoded) {
          unitPrice = hardcoded / size;
        } else {
          unitPrice = parseFloat(item.cost.totalAmount.amount) / item.quantity;
        }
      } else {
        unitPrice = parseFloat(item.cost.totalAmount.amount) / item.quantity;
      }

      calculatedSubtotal += (unitPrice * item.quantity);

      line_items.push({
        variant_id: variantId,
        quantity: item.quantity,
        price: unitPrice.toFixed(2),
      });

      if (!comboAttr) {
        invoiceItems.push({
          title: item.merchandise.product.title,
          variant: item.merchandise.title,
          quantity: item.quantity,
          unitPrice: unitPrice,
          lineTotal: unitPrice * item.quantity,
          imageUrl: item.merchandise.product.images?.edges[0]?.node?.url || null,
        });
      }
    });

    // Add combos to invoiceItems as single entries
    Object.values(combos).forEach(combo => {
      if (combo.items.length > 0) {
        const sampleVariant = combo.items[0].merchandise.title;
        const size = combo.items.reduce((sum, it) => sum + it.quantity, 0);
        const hardcoded = getComboPrice(sampleVariant, size);
        
        let comboTotal = 0;
        if (hardcoded) {
          comboTotal = hardcoded;
        } else {
          combo.items.forEach(i => comboTotal += parseFloat(i.cost.totalAmount.amount));
        }

        invoiceItems.push({
          title: "Makhana Custom Combo",
          variant: `${size} items (Qty: 1)`,
          quantity: 1,
          unitPrice: comboTotal,
          lineTotal: comboTotal,
          imageUrl: combo.items[0].merchandise.product.images?.edges[0]?.node?.url || null,
        });
      }
    });

    // Simple, clear math:
    // 2. Sequential discount math (e.g. 5% then 5% applied step-by-step)
    // 3. Shipping on the after-discount amount
    calculatedSubtotal = Math.round(calculatedSubtotal);
    
    let effectiveDiscount = 0;
    let discountPercentage = 0;
    const applicableCodes = (cart?.discountCodes || []).filter(dc => dc.applicable);
    const numCodes = applicableCodes.length;

    if (shopifySubtotal > 0 && shopifyDiscount > 0 && numCodes > 0) {
      // Shopify natively adds percentages (e.g. 5% + 5% = 10% total additive).
      const additiveTotalPercentage = shopifyDiscount / shopifySubtotal; 
      
      // Average per-coupon percentage
      const perCouponPercentage = additiveTotalPercentage / numCodes;
      
      // Calculate sequential discount mathematically: 1 - (1 - P)^n
      const sequentialMultiplier = Math.pow(1 - perCouponPercentage, numCodes);
      const sequentialTotalPercentage = 1 - sequentialMultiplier;
      
      effectiveDiscount = Math.round(calculatedSubtotal * sequentialTotalPercentage);
      discountPercentage = Math.round(sequentialTotalPercentage * 100);
    }

    const discountedSubtotal = calculatedSubtotal - effectiveDiscount;
    const shipping = calculatedSubtotal > 0 && calculatedSubtotal < 499 ? 49 : 0;
    const total = discountedSubtotal + shipping;

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

    // Attach discount codes if present
    const appliedDiscountCodes = [];
    if (cart.discountCodes && cart.discountCodes.length > 0 && effectiveDiscount > 0) {
      const applicableCodes = cart.discountCodes.filter(dc => dc.applicable);
      if (applicableCodes.length > 0) {
        
        // Shopify Admin API has a hard limitation: it only accepts ONE discount code per order.
        // If we send an array of multiple codes, Shopify silently drops all but the first one,
        // causing the Order Total to mismatch the Razorpay Paid Amount.
        // Workaround: We combine the code names into a single string and apply the total amount.
        const combinedCodeNames = applicableCodes.map(dc => dc.code).join(" + ");
        
        shopifyOrderPayload.order.discount_codes = [
          {
            code: combinedCodeNames,
            amount: effectiveDiscount.toFixed(2),
            type: "fixed_amount"
          }
        ];
        
        shopifyOrderPayload.order.total_discounts = effectiveDiscount.toFixed(2);
        applicableCodes.forEach(dc => appliedDiscountCodes.push(dc.code));
      }
    }

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

    let shopifyOrderNumber = null;
    let shopifyOrderId = null;

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
        shopifyOrderNumber = orderData.order.order_number;
        shopifyOrderId = orderData.order.id;
        console.log("Shopify order created successfully! ID:", orderData.order.id);
      }
    }

    return NextResponse.json({
      success: true,
      orderData: {
        orderNumber: shopifyOrderNumber,
        orderId: shopifyOrderId,
        date: new Date().toISOString(),
        razorpayPaymentId: razorpay_payment_id,
        customer: {
          name: `${customerData.firstName} ${customerData.lastName}`,
          email: customerData.email,
          phone: customerData.phone,
          address: `${customerData.address}, ${customerData.city}, ${customerData.state} - ${customerData.pincode}`,
        },
        items: invoiceItems,
        subtotal: calculatedSubtotal,
        discountAmount: effectiveDiscount,
        discountCodes: appliedDiscountCodes,
        discountPercentage: discountPercentage,
        shipping: shipping,
        total: total,
      }
    });
  } catch (error) {
    console.error("Error in verification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
