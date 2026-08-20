import { getCart } from "@/lib/shopify";
import { getShopifyAdminToken } from "@/lib/shopify/adminAuth";
import { getComboPrice } from "@/lib/pricing";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

/**
 * Processes a successful order by saving it to Shopify and MongoDB.
 * Includes an idempotency check to prevent duplicate orders.
 */
export async function processOrder({ razorpay_payment_id, razorpay_order_id, razorpay_signature, cartId, customerData }) {
  await dbConnect();

  // 1. Quick check before heavy lifting
  let existingOrder = await Order.findOne({ "razorpayDetails.orderId": razorpay_order_id });
  if (existingOrder && existingOrder.status === "Success") {
    console.log("Order already processed:", razorpay_order_id);
    const orderDoc = existingOrder.toObject();
    return {
      success: true,
      alreadyProcessed: true,
      orderData: {
        orderNumber: orderDoc.orderDetails.shopifyOrderNumber,
        orderId: orderDoc.orderDetails.shopifyOrderId,
        date: orderDoc.createdAt,
        razorpayPaymentId: orderDoc.razorpayDetails.paymentId,
        customer: {
          name: `${orderDoc.customerData.firstName} ${orderDoc.customerData.lastName}`,
          email: orderDoc.customerData.email,
          phone: orderDoc.customerData.phone,
          address: `${orderDoc.shippingDetails.address}, ${orderDoc.shippingDetails.city}, ${orderDoc.shippingDetails.state} - ${orderDoc.shippingDetails.pincode}`,
        },
        items: orderDoc.orderDetails.items,
        subtotal: orderDoc.orderDetails.subtotal,
        discountAmount: orderDoc.orderDetails.discountAmount,
        discountCodes: orderDoc.couponsUsed,
        shipping: orderDoc.orderDetails.shipping,
        total: orderDoc.orderDetails.total,
      }
    };
  }

  // 2. Fetch the cart to construct the Shopify Order
  const cart = await getCart(cartId);
  if (!cart) {
    throw new Error("Cart not found");
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

  calculatedSubtotal = Math.round(calculatedSubtotal);
  
  let effectiveDiscount = 0;
  let discountPercentage = 0;
  const applicableCodes = (cart?.discountCodes || []).filter(dc => dc.applicable);
  const numCodes = applicableCodes.length;

  if (shopifySubtotal > 0 && shopifyDiscount > 0 && numCodes > 0) {
    const additiveTotalPercentage = shopifyDiscount / shopifySubtotal; 
    const perCouponPercentage = additiveTotalPercentage / numCodes;
    const sequentialMultiplier = Math.pow(1 - perCouponPercentage, numCodes);
    const sequentialTotalPercentage = 1 - sequentialMultiplier;
    
    effectiveDiscount = Math.round(calculatedSubtotal * sequentialTotalPercentage);
    discountPercentage = Math.round(sequentialTotalPercentage * 100);
  }

  const discountedSubtotal = calculatedSubtotal - effectiveDiscount;
  const shipping = calculatedSubtotal > 0 && calculatedSubtotal < 499 ? 49 : 0;
  const total = discountedSubtotal + shipping;

  const appliedDiscountCodes = [];
  if (cart.discountCodes && cart.discountCodes.length > 0 && effectiveDiscount > 0) {
    const applicableCodes = cart.discountCodes.filter(dc => dc.applicable);
    if (applicableCodes.length > 0) {
      applicableCodes.forEach(dc => appliedDiscountCodes.push(dc.code));
    }
  }

  // 3. ATOMIC LOCK ACQUISITION
  // Try to insert a "Processing" order. If it already exists, `lock` will be the existing document.
  const isTestEnv = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_test");
  const lock = await Order.findOneAndUpdate(
    { "razorpayDetails.orderId": razorpay_order_id },
    {
      $setOnInsert: {
        customerData: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
        },
        shippingDetails: {
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          pincode: customerData.pincode,
        },
        orderDetails: {
          items: invoiceItems,
          subtotal: calculatedSubtotal,
          discountAmount: effectiveDiscount,
          shipping: shipping,
          total: total,
        },
        razorpayDetails: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        },
        status: "Processing",
        couponsUsed: appliedDiscountCodes,
        isTestOrder: isTestEnv || false,
      }
    },
    { upsert: true } // Mongoose returns the original document before update by default
  );

  if (lock) {
    // Another thread beat us to the lock!
    console.log("Another thread is currently processing order:", razorpay_order_id);
    
    // Poll for up to 10 seconds for the other thread to finish processing
    let polledOrder = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      polledOrder = await Order.findOne({ "razorpayDetails.orderId": razorpay_order_id });
      if (polledOrder && polledOrder.status === "Success") {
        break;
      }
    }

    if (polledOrder && polledOrder.status === "Success") {
      const orderDoc = polledOrder.toObject();
      return {
        success: true,
        alreadyProcessed: true,
        orderData: {
          orderNumber: orderDoc.orderDetails.shopifyOrderNumber,
          orderId: orderDoc.orderDetails.shopifyOrderId,
          date: orderDoc.createdAt,
          razorpayPaymentId: orderDoc.razorpayDetails.paymentId,
          customer: {
            name: `${orderDoc.customerData.firstName} ${orderDoc.customerData.lastName}`,
            email: orderDoc.customerData.email,
            phone: orderDoc.customerData.phone,
            address: `${orderDoc.shippingDetails.address}, ${orderDoc.shippingDetails.city}, ${orderDoc.shippingDetails.state} - ${orderDoc.shippingDetails.pincode}`,
          },
          items: orderDoc.orderDetails.items,
          subtotal: orderDoc.orderDetails.subtotal,
          discountAmount: orderDoc.orderDetails.discountAmount,
          discountCodes: orderDoc.couponsUsed,
          shipping: orderDoc.orderDetails.shipping,
          total: orderDoc.orderDetails.total,
        }
      };
    } else {
      // It didn't finish in time, but it's processing. Return generic success.
      return {
        success: true,
        alreadyProcessed: true,
        orderData: {
          orderNumber: null,
          date: new Date().toISOString(),
          customer: {
            name: `${customerData.firstName} ${customerData.lastName}`,
            email: customerData.email,
          },
          items: invoiceItems,
          total: total,
        }
      };
    }
  }

  // 4. WE GOT THE LOCK! Create the Shopify Order
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

  if (cart.discountCodes && cart.discountCodes.length > 0 && effectiveDiscount > 0) {
    const applicableCodes = cart.discountCodes.filter(dc => dc.applicable);
    if (applicableCodes.length > 0) {
      const combinedCodeNames = applicableCodes.map(dc => dc.code).join(" + ");
      shopifyOrderPayload.order.discount_codes = [
        {
          code: combinedCodeNames,
          amount: effectiveDiscount.toFixed(2),
          type: "fixed_amount"
        }
      ];
      shopifyOrderPayload.order.total_discounts = effectiveDiscount.toFixed(2);
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
    console.warn("SHOPIFY_ADMIN_ACCESS_TOKEN flow failed. Order not logged to Shopify.");
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
      // Even if Shopify fails, we should mark the order as failed in MongoDB?
      // Or we throw to let the webhook retry?
      // Let's mark it as failed in Mongo and throw so webhook can retry
      await Order.findOneAndUpdate(
        { "razorpayDetails.orderId": razorpay_order_id },
        { $set: { status: "Failed", errorReason: "Shopify API Error" } }
      );
      throw new Error(`Shopify Order Creation Failed: ${JSON.stringify(errorData)}`);
    } else {
      const orderData = await shopifyRes.json();
      shopifyOrderNumber = orderData.order.order_number;
      shopifyOrderId = orderData.order.id;
      console.log("Shopify order created successfully! ID:", orderData.order.id);
    }
  }

  // 5. Update MongoDB document to Success with Shopify IDs
  try {
    await Order.findOneAndUpdate(
      { "razorpayDetails.orderId": razorpay_order_id },
      {
        $set: {
          status: "Success",
          "orderDetails.shopifyOrderNumber": shopifyOrderNumber,
          "orderDetails.shopifyOrderId": shopifyOrderId,
        }
      }
    );
    console.log("Successfully saved successful order to MongoDB.");
  } catch (dbErr) {
    console.error("Failed to update order to Success in MongoDB:", dbErr);
  }

  return {
    success: true,
    alreadyProcessed: false,
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
  };
}
