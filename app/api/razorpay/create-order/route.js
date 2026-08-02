import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getCart } from "@/lib/shopify";
import { getComboPrice } from "@/lib/pricing";

export async function POST(req) {
  try {
    const { cartId } = await req.json();

    if (!cartId) {
      return NextResponse.json({ error: "Cart ID is required" }, { status: 400 });
    }

    const cart = await getCart(cartId);

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    let calculatedSubtotal = 0;
    const combos = {};

    const shopifySubtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || 0);
    const shopifyTotal = parseFloat(cart?.cost?.totalAmount?.amount || 0);
    const shopifyDiscount = Math.max(0, shopifySubtotal - shopifyTotal);
    let discountProportion = 0;
    if (shopifySubtotal > 0 && shopifyDiscount > 0) {
      discountProportion = shopifyDiscount / shopifySubtotal;
    }

    cart.lines.edges.forEach((edge) => {
      const item = edge.node;
      const comboAttr = item.attributes?.find(a => a.key === '_comboId');
      if (comboAttr) {
        const comboId = comboAttr.value;
        if (!combos[comboId]) combos[comboId] = { items: [] };
        combos[comboId].items.push(item);
      } else {
        const itemAmount = parseFloat(item.cost.totalAmount.amount);
        let discountedPrice = itemAmount;
        if (discountProportion > 0) {
          discountedPrice -= (discountedPrice * discountProportion);
        }
        calculatedSubtotal += discountedPrice;
      }
    });

    Object.values(combos).forEach(combo => {
      if (combo.items.length > 0) {
        const sampleVariant = combo.items[0].merchandise.title;
        const size = combo.items.length;
        const hardcoded = getComboPrice(sampleVariant, size);
        if (hardcoded) {
          calculatedSubtotal += hardcoded;
        } else {
          combo.items.forEach(i => calculatedSubtotal += parseFloat(i.cost.totalAmount.amount));
        }
      }
    });
    
    if (calculatedSubtotal === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Shipping logic
    const shipping = calculatedSubtotal > 0 && calculatedSubtotal < 499 ? 49 : 0;
    const total = calculatedSubtotal + shipping;

    // Amount in paise (multiply by 100)
    const amountInPaise = Math.round(total * 100);

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        cartId: cartId,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error?.error?.description || error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
