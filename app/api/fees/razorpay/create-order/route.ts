import { NextRequest, NextResponse } from 'next/server';
import { RazorpayService } from '@/features/fees/services/razorpay.service';

const razorpayService = new RazorpayService();

export async function POST(req: NextRequest) {
  try {
    const { amount, enrollmentId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    const order = await razorpayService.createOrder(amount, `temp_rcpt_${enrollmentId.substring(0,8)}`);

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}