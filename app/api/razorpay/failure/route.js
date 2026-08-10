import { NextResponse } from "next/server";
import { getCart } from "@/lib/shopify";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    const { razorpay_error, cartId, customerData } = await req.json();

    if (!cartId || !customerData) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const cart = await getCart(cartId);
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Build simple invoice items (for MongoDB tracking, we can keep it simpler than verify route if needed)
    let calculatedSubtotal = 0;
    const invoiceItems = [];

    cart.lines.edges.forEach((edge) => {
      const item = edge.node;
      const unitPrice = parseFloat(item.cost.totalAmount.amount) / item.quantity;
      calculatedSubtotal += parseFloat(item.cost.totalAmount.amount);

      invoiceItems.push({
        title: item.merchandise.product.title,
        variant: item.merchandise.title,
        quantity: item.quantity,
        unitPrice: unitPrice,
        lineTotal: unitPrice * item.quantity,
        imageUrl: item.merchandise.product.images?.edges[0]?.node?.url || null,
      });
    });

    const shopifySubtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || 0);
    const shopifyTotal = parseFloat(cart?.cost?.totalAmount?.amount || 0);
    const shopifyDiscount = Math.round(Math.max(0, shopifySubtotal - shopifyTotal));

    let effectiveDiscount = 0;
    const applicableCodes = (cart?.discountCodes || []).filter(dc => dc.applicable);
    const appliedDiscountCodes = applicableCodes.map(dc => dc.code);

    if (shopifySubtotal > 0 && shopifyDiscount > 0 && applicableCodes.length > 0) {
      const numCodes = applicableCodes.length;
      const additiveTotalPercentage = shopifyDiscount / shopifySubtotal;
      const perCouponPercentage = additiveTotalPercentage / numCodes;
      const sequentialMultiplier = Math.pow(1 - perCouponPercentage, numCodes);
      const sequentialTotalPercentage = 1 - sequentialMultiplier;
      effectiveDiscount = Math.round(calculatedSubtotal * sequentialTotalPercentage);
    }

    const discountedSubtotal = calculatedSubtotal - effectiveDiscount;
    const shipping = calculatedSubtotal > 0 && calculatedSubtotal < 499 ? 49 : 0;
    const total = discountedSubtotal + shipping;

    try {
      await dbConnect();
      await Order.create({
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
          orderId: razorpay_error?.metadata?.order_id || null,
          paymentId: razorpay_error?.metadata?.payment_id || null,
        },
        status: "Failed",
        couponsUsed: appliedDiscountCodes,
        errorReason: razorpay_error?.description || razorpay_error?.reason || "Unknown Payment Failure",
      });
      console.log("Successfully saved failed order to MongoDB.");
    } catch (dbErr) {
      console.error("Failed to save failed order to MongoDB:", dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in failure logging:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
