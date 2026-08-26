import { NextRequest, NextResponse } from 'next/server';
import { ReceiptService } from '@/features/fees/services/receipt.service';

const receiptService = new ReceiptService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await params;
    if (!paymentId) {
      return NextResponse.json({ success: false, error: 'Payment ID is required' }, { status: 400 });
    }

    const data = await receiptService.getReceiptByPaymentId(paymentId);
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching fee receipt:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 404 }
    );
  }
}