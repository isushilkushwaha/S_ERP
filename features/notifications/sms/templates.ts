export interface SmsTemplateDefinition {
  templateId: string;
  description: string;
  variables: string[];
}

export const SMS_TEMPLATES = {
  FEE_PAYMENT_CONFIRMATION: {
    templateId: process.env.MSG91_FEE_RECEIPT_TEMPLATE_ID || 'default_fee_receipt_template_id',
    description: 'Sent to parents/students immediately after a successful fee collection.',
    variables: ['student_name', 'receipt_no', 'amount_paid', 'balance_due'],
  },
  // You can easily add more templates here as your school ERP grows:
  // ADMISSION_WELCOME: { ... },
  // EXAM_RESULT_ANNOUNCEMENT: { ... },
} as const;

/**
 * Fallback plaintext generator for logging or manual SMS gateways if needed.
 */
export function formatFeePaymentSmsBody(params: {
  studentName: string;
  receiptNumber: string;
  amountPaid: number;
  balanceDue: number;
}): string {
  return `Dear Parent, we have received Rs. ${params.amountPaid.toLocaleString('en-IN')} for ${params.studentName} (Receipt No: ${params.receiptNumber}). Remaining Due Balance: Rs. ${params.balanceDue.toLocaleString('en-IN')}. Thank you!`;
}