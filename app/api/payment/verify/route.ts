import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Missing payment signature details') },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is missing from environment variables');
      return NextResponse.json({ error: getApiLocalizedText(req, 'Internal server error') }, { status: 500 });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Invalid payment signature') }, { status: 400 });
    }

    // 1. Differentiate by fetching the actual Order from Razorpay to read notes securely
    const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
    
    // 2. Handle Subscription Upgrades
    if (rzpOrder.receipt?.startsWith('sub_rcpt_')) {
      const { userId, tier } = rzpOrder.notes as Record<string, string>;
      
      if (!userId || !tier) {
         return NextResponse.json(
           { error: getApiLocalizedText(req, 'Invalid subscription order metadata') },
           { status: 400 }
         );
      }
      
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30); // 30 days of premium
      
      await prisma.lawyerProfile.update({
        where: { userId },
        data: {
          subscriptionTier: tier,
          subscriptionExpiry: expiry,
        }
      });
      
      return NextResponse.json({ success: true, type: 'SUBSCRIPTION', tier }, { status: 200 });
    }

    // 3. Fallback to normal Appointment payments
    const appointment = await prisma.appointment.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Order ID not found in records') },
        { status: 404 }
      );
    }

    // Update appointment status to PAID and CONFIRMED
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    return NextResponse.json({ success: true, type: 'APPOINTMENT' }, { status: 200 });
  } catch (error) {
    console.error('[Payment Verify API] Error:', error);
    return NextResponse.json({ error: getApiLocalizedText(req, 'Failed to verify payment') }, { status: 500 });
  }
}
