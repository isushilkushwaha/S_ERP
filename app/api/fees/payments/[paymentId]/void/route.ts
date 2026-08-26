import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { VoidPaymentTransaction } from '@/features/fees/transactions/void-payment.transaction';
import { prisma } from '@/lib/prisma';

const voidSchema = z.object({
  reason: z.string().min(5, 'Reason must be at least 5 characters long').max(255),
});

const voidPaymentTx = new VoidPaymentTransaction();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await params;
    const body = await req.json();
    const validationResult = voidSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.format() }, { status: 400 });
    }

    // Identify current user (using first active user as placeholder logic)
    const validUser = await prisma.user.findFirst({ where: { deletedAt: null } });
    if (!validUser) throw new Error("No active user found to perform this action.");

    const result = await voidPaymentTx.execute({
      paymentId,
      userId: validUser.id,
      reason: validationResult.data.reason,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, message: 'Payment successfully voided.', data: result });
  } catch (error: any) {
    console.error('Void payment error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}