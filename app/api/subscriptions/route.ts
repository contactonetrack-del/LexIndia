import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getApiLocalizedText } from "@/lib/i18n/api";
import { LAWYER_SUBSCRIPTION_PRICES, isPaidLawyerSubscriptionTier } from "@/lib/subscriptions";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "LAWYER") {
      return NextResponse.json({ error: getApiLocalizedText(req, "Unauthorized") }, { status: 401 });
    }

    const { tier } = await req.json();

    if (typeof tier !== 'string' || !isPaidLawyerSubscriptionTier(tier)) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, "Invalid tier specified") },
        { status: 400 }
      );
    }

    const amount = LAWYER_SUBSCRIPTION_PRICES[tier];

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `sub_rcpt_${Date.now()}_${session.user.id}`,
      notes: {
        userId: session.user.id,
        tier: tier,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      tier: tier,
    });
  } catch (error) {
    console.error("Subscription Order creation failed:", error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, "Failed to initialize subscription") },
      { status: 500 }
    );
  }
}
