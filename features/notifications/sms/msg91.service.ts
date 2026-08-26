import axios from 'axios';

interface SendFeePaymentSmsParams {
  mobile: string;
  studentName: string;
  receiptNumber: string;
  amountPaid: number;
  balanceDue: number;
}

export class Msg91SmsService {
  private static apiKey = process.env.MSG91_API_KEY;
  private static senderId = process.env.MSG91_SENDER_ID;
  private static templateId = process.env.MSG91_FEE_RECEIPT_TEMPLATE_ID;

  static async sendFeePaymentConfirmation(params: SendFeePaymentSmsParams): Promise<boolean> {
    if (!this.apiKey || !this.senderId) {
      console.warn('MSG91 credentials not configured. Skipping SMS notification.');
      return false;
    }

    let formattedMobile = params.mobile.replace(/\D/g, '');
    if (formattedMobile.length === 10) {
      formattedMobile = `91${formattedMobile}`;
    }

    try {
      const response = await axios.post(
        'https://control.msg91.com/api/v5/flow/',
        {
          template_id: this.templateId,
          sender: this.senderId,
          short_url: '0',
          mobiles: formattedMobile,
          student_name: params.studentName,
          receipt_no: params.receiptNumber,
          amount_paid: params.amountPaid.toString(),
          balance_due: params.balanceDue.toString(),
        },
        {
          headers: {
            authkey: this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data?.type === 'success';
    } catch (error: any) {
      console.error('Error dispatching MSG91 SMS:', error?.response?.data || error.message);
      return false;
    }
  }
}