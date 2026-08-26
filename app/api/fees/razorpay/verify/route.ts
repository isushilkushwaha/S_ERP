import { NextRequest, NextResponse } from 'next/server';
import { RazorpayService } from '@/features/fees/services/razorpay.service';
import { CollectFeeTransaction } from '@/features/fees/transactions/collect-fee.transaction';
import { collectFeeSchema } from '@/features/fees/schemas/payment.schema';
import { PaymentNotificationService } from '@/features/notifications/services/payment-notification.service';
import { prisma } from '@/lib/prisma';

const razorpayService = new RazorpayService();
const collectFeeTx = new CollectFeeTransaction();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Verify Razorpay Signature FIRST
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentPayload } = body;
    
    const isValid = razorpayService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid Payment Signature' }, { status: 400 });
    }

    // 2. Validate the business payload
    const validationResult = collectFeeSchema.safeParse(paymentPayload);
    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.format() }, { status: 400 });
    }

    const finalData = validationResult.data;
    finalData.paymentMethod = 'RAZORPAY';
    finalData.gateway = 'RAZORPAY';
    finalData.transactionId = razorpay_payment_id;
    finalData.gatewayOrderId = razorpay_order_id;
    finalData.gatewayPaymentId = razorpay_payment_id;
    finalData.gatewaySignature = razorpay_signature;

    const validUser = await prisma.user.findFirst({ where: { deletedAt: null } });
    const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 3. Execute the standard Atomic DB Transaction
    try {
      const result = await collectFeeTx.execute({
        data: finalData,
        userId: validUser!.id,
        ipAddress,
      });

      if (!result) throw new Error("Transaction failed to return data");

      // 4. Background SMS Dispatch (Fire and forget) for Online Payments
      PaymentNotificationService.sendPaymentReceipt(
        result.payment.id,
        finalData.enrollmentId,
        result.receipt.receiptNumber,
        finalData.amountPaid,
        validUser!.id
      ).catch(() => {});

      return NextResponse.json({ success: true, message: 'Online Payment Verified & Logged', data: result }, { status: 201 });
    } catch (dbError: any) {
      if (dbError.code === 'P2002' && dbError.meta?.target?.includes('transaction_id')) {
        return NextResponse.json({ success: false, error: 'This payment has already been processed.' }, { status: 409 });
      }
      throw dbError; 
    }
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}