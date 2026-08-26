import Razorpay from 'razorpay';
import crypto from 'crypto';

export class RazorpayService {
  private instance: Razorpay;

  constructor() {
    this.instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }

  async createOrder(amountInRupees: number, receiptContext: string) {
    if (!process.env.RAZORPAY_KEY_ID) {
      throw new Error('Razorpay credentials not configured on server.');
    }

    const options = {
      amount: Math.round(amountInRupees * 100), // Convert to Paise
      currency: 'INR',
      receipt: receiptContext,
      payment_capture: 1, // Auto capture
    };

    return await this.instance.orders.create(options);
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  }
}