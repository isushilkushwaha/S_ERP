// // frontend/fees/types/fee-payment.types.ts

// export type PaymentMethodType =
//   | "CASH"
//   | "UPI"
//   | "CHEQUE"
//   | "CARD"
//   | "BANK_TRANSFER"
//   | "RAZORPAY";

// export type InstallmentStatus =
//   | "UPCOMING"
//   | "DUE"
//   | "PARTIAL"
//   | "PAID"
//   | "OVERDUE";

// export interface PaymentInstallmentComponent {
//   installmentComponentId: string;

//   ledgerId: string;

//   componentName: string;

//   componentCode: string;

//   assignedAmount: number;

//   paidAmount: number;

//   balanceAmount: number;

//   status: InstallmentStatus;
// }

// export interface StudentFeeInstallment {
//   installmentId: string;

//   sequence: number;

//   name: string;

//   dueDate: string | null;

//   assignedAmount: number;

//   paidAmount: number;

//   balanceAmount: number;

//   status: InstallmentStatus;

//   /**
//    * When true, this installment should not
//    * become the active/current installment.
//    */
//   isLocked: boolean;

//   components: PaymentInstallmentComponent[];
// }

// export interface StudentLedgerItem {
//   ledgerId: string;

//   componentName: string;

//   componentCode: string;

//   assignedAmount: number;

//   paidAmount: number;

//   discountAmount: number;

//   fineAmount: number;

//   balanceAmount: number;

//   status:
//     | "DUE"
//     | "PARTIAL"
//     | "PAID"
//     | "OVERDUE";

//   dueDate?: string | null;

//   lastPaymentDate?: string | null;
// }

// export interface StudentFeeProfileData {
//   student: {
//     enrollmentId: string;

//     studentName: string;

//     admissionNumber: string;

//     className: string;

//     sectionName: string;

//     academicYearName: string;

//     fatherName?: string | null;

//     mobile?: string | null;
//   };

//   summary: {
//     totalAssigned: number;

//     totalPaid: number;

//     totalDiscount: number;

//     totalFine: number;

//     totalDue: number;

//     status: string;
//   };

//   ledgers: StudentLedgerItem[];

//   installments: StudentFeeInstallment[];

//   paymentHistory: Array<{
//     paymentId: string;

//     receiptNumber: string;

//     paymentMethod: PaymentMethodType;

//     paymentDate: string;

//     amountPaid: number;

//     receivedBy: string;
//   }>;

//   discount?: unknown;
// }

// export interface InstallmentPaymentAllocation {
//   installmentId: string;

//   ledgerId: string;

//   allocatedAmount: number;
// }

// export interface CollectFeeRequestPayload {
//   enrollmentId: string;

//   paymentMethod: PaymentMethodType;

//   gateway?: "MANUAL" | "RAZORPAY";

//   amountPaid: number;

//   /**
//    * Keep these in the payload for backend compatibility,
//    * but the collection UI intentionally keeps them zero
//    * for now.
//    */
//   discount: number;

//   fine: number;

//   transactionId?: string;

//   chequeNumber?: string;

//   bankName?: string;

//   chequeDate?: string;

//   cardType?: string;

//   remarks?: string;

//   allocations: InstallmentPaymentAllocation[];
// }

// export interface PaymentFormValues {
//   paymentMethod: PaymentMethodType;

//   amountPaid: number;

//   discount: number;

//   fine: number;

//   transactionId: string;

//   chequeNumber: string;

//   bankName: string;

//   chequeDate: string;

//   cardType: string;

//   remarks: string;
// }

// frontend/fees/types/fee-payment.types.ts

/* =========================================================
   PAYMENT METHOD
========================================================= */

export type PaymentMethodType =
  | "CASH"
  | "UPI"
  | "CHEQUE"
  | "CARD"
  | "BANK_TRANSFER"
  | "RAZORPAY";

/* =========================================================
   FEE PAYMENT STATUS
========================================================= */

export type FeePaymentStatus =
  | "DUE"
  | "PARTIAL"
  | "PAID"
  | "OVERDUE";

/* =========================================================
   INSTALLMENT STATUS
========================================================= */

export type InstallmentStatus =
  | "UPCOMING"
  | "DUE"
  | "PARTIAL"
  | "PAID"
  | "OVERDUE";

/* =========================================================
   INSTALLMENT COMPONENT
========================================================= */

/**
 * Represents one fee component inside a student's
 * admission-assigned installment.
 *
 * IMPORTANT:
 *
 * assignedAmount is the EXACT amount customized
 * and saved during admission.
 *
 * Example:
 *
 * Milestone #1
 *   Computer Fee  = ₹1000
 *   Admission Fee = ₹0
 *
 * The profile must display:
 *
 * Computer Fee  ₹1000
 * Admission Fee ₹0
 *
 * It must NOT redistribute ₹1000 between components.
 */
export interface InstallmentComponent {
  /**
   * FeeInstallmentComponent primary key.
   */
  installmentComponentId: string;

  /**
   * Student fee ledger primary key.
   */
  ledgerId: string;

  /**
   * Fee component name.
   */
  componentName: string;

  /**
   * Fee component code.
   */
  componentCode: string;

  /**
   * Exact amount assigned during admission.
   *
   * DO NOT calculate this from the milestone total.
   */
  assignedAmount: number;

  /**
   * Amount already collected against this component.
   */
  paidAmount: number;

  /**
   * Remaining component balance.
   *
   * Normally:
   *
   * assignedAmount - paidAmount
   */
  balanceAmount: number;

  /**
   * Current component status.
   */
  status: InstallmentStatus;
}

/* =========================================================
   BACKWARD COMPATIBILITY
========================================================= */

/**
 * Existing payment components use this name.
 *
 * Keep the alias so existing imports continue working:
 *
 * PaymentInstallmentComponent
 */
export type PaymentInstallmentComponent =
  InstallmentComponent;

/* =========================================================
   STUDENT FEE INSTALLMENT / MILESTONE
========================================================= */

export interface StudentFeeInstallment {
  /**
   * Fee installment primary key.
   */
  installmentId: string;

  /**
   * Milestone sequence.
   */
  sequence: number;

  /**
   * Milestone name.
   */
  name: string;

  /**
   * Milestone due date.
   */
  dueDate: string | null;

  /**
   * Exact milestone amount assigned during admission.
   *
   * This should represent the sum of the
   * customized component amounts.
   */
  assignedAmount: number;

  /**
   * Total amount already paid toward this milestone.
   */
  paidAmount: number;

  /**
   * Remaining milestone balance.
   */
  balanceAmount: number;

  /**
   * Current milestone status.
   */
  status: InstallmentStatus;

  /**
   * UI-only property.
   *
   * true means the milestone should not be
   * selected as the current payable milestone.
   */
  isLocked: boolean;

  /**
   * Exact component allocation saved during admission.
   */
  components: InstallmentComponent[];
}

/* =========================================================
   STUDENT FEE LEDGER
========================================================= */

export interface StudentLedgerItem {
  /**
   * Fee ledger primary key.
   */
  ledgerId: string;

  /**
   * Fee component name.
   */
  componentName: string;

  /**
   * Fee component code.
   */
  componentCode: string;

  /**
   * Total amount assigned to this ledger.
   */
  assignedAmount: number;

  /**
   * Total amount paid against this ledger.
   */
  paidAmount: number;

  /**
   * Discount applied to this ledger.
   */
  discountAmount: number;

  /**
   * Fine applied to this ledger.
   */
  fineAmount: number;

  /**
   * Current outstanding balance.
   */
  balanceAmount: number;

  /**
   * Current ledger status.
   */
  status: FeePaymentStatus;

  /**
   * Optional due date.
   */
  dueDate?: string | null;

  /**
   * Last payment date.
   */
  lastPaymentDate?: string | null;
}

/* =========================================================
   STUDENT FEE DISCOUNT
========================================================= */

export interface StudentFeeProfileDiscount {
  /**
   * Discount record ID.
   */
  id: string;

  /**
   * Discount name.
   */
  name: string;

  /**
   * Discount code.
   */
  code: string;

  /**
   * Original amount before discount.
   */
  originalAmount: number;

  /**
   * Actual discount amount applied.
   */
  appliedAmount: number;

  /**
   * Final amount after discount.
   */
  finalAmount: number;

  /**
   * Percentage used, if applicable.
   */
  appliedPercentage: number | null;

  /**
   * Discount remarks.
   */
  remarks: string | null;

  /**
   * Name of approving user.
   */
  approvedBy: string | null;
}

/* =========================================================
   PAYMENT HISTORY
========================================================= */

export interface StudentFeePaymentHistoryItem {
  /**
   * Payment primary key.
   */
  paymentId: string;

  /**
   * Generated receipt number.
   */
  receiptNumber: string;

  /**
   * Payment method.
   */
  paymentMethod: PaymentMethodType;

  /**
   * Payment gateway.
   */
  gateway?: string | null;

  /**
   * Payment date.
   */
  paymentDate: string;

  /**
   * Total amount received.
   */
  amountPaid: number;

  /**
   * Discount recorded with payment.
   */
  discount?: number;

  /**
   * Fine recorded with payment.
   */
  fine?: number;

  /**
   * Transaction / UTR / authorization ID.
   */
  transactionId?: string | null;

  /**
   * Payment status.
   */
  status?: string;

  /**
   * Payment remarks.
   */
  remarks?: string | null;

  /**
   * User who received the payment.
   */
  receivedBy: string;

  /**
   * Fee heads included in this payment.
   */
  allocatedHeads?: Array<{
    componentName: string;
    allocatedAmount: number;
  }>;
}

/* =========================================================
   STUDENT FEE PROFILE
========================================================= */

export interface StudentFeeProfileData {
  student: {
    /**
     * Student enrollment ID.
     */
    enrollmentId: string;

    /**
     * Student ID.
     *
     * Optional here because some existing API
     * responses may not include it.
     */
    studentId?: string;

    studentCode?: string;

    studentName: string;

    admissionNumber: string;

    rollNumber?: number;

    className: string;

    sectionName: string;

    academicYearName: string;

    fatherName?: string | null;

    motherName?: string | null;

    mobile?: string | null;

    photo?: string | null;
  };

  summary: {
    /**
     * Total fee assigned to the student.
     */
    totalAssigned: number;

    /**
     * Total amount paid.
     */
    totalPaid: number;

    /**
     * Total admission / fee discount.
     */
    totalDiscount: number;

    /**
     * Total fine.
     */
    totalFine: number;

    /**
     * Total outstanding balance.
     */
    totalDue: number;

    /**
     * Overall student fee status.
     */
    status: FeePaymentStatus;
  };

  /**
   * Admission-time discount.
   *
   * This is separate from payment collection.
   */
  discount: StudentFeeProfileDiscount | null;

  /**
   * Fee ledgers.
   */
  ledgers: StudentLedgerItem[];

  /**
   * Exact admission-assigned installment schedule.
   */
  installments: StudentFeeInstallment[];

  /**
   * Payment history.
   */
  paymentHistory: StudentFeePaymentHistoryItem[];
}

/* =========================================================
   PAYMENT ALLOCATION
========================================================= */

export interface InstallmentPaymentAllocation {
  /**
   * Milestone receiving the payment.
   */
  installmentId: string;

  /**
   * Fee ledger receiving the payment.
   */
  ledgerId: string;

  /**
   * Amount allocated to the component.
   */
  allocatedAmount: number;
}

/**
 * Generic payment allocation row for UI.
 */
export interface PaymentAllocationRow {
  ledgerId: string;

  componentName: string;

  maxDue: number;

  allocatedAmount: number;
}

/* =========================================================
   COLLECT FEE REQUEST
========================================================= */

export interface CollectFeeRequestPayload {
  /**
   * Student enrollment.
   */
  enrollmentId: string;

  /**
   * Payment method.
   */
  paymentMethod: PaymentMethodType;

  /**
   * Payment gateway.
   */
  gateway?: "MANUAL" | "RAZORPAY";

  /**
   * Amount actually received from parent.
   *
   * Example:
   *
   * Milestone balance = ₹5000
   * Parent pays = ₹3000
   *
   * amountPaid = 3000
   */
  amountPaid: number;

  /**
   * Keep this for backend compatibility.
   *
   * Admission discount is NOT recalculated here.
   */
  discount: number;

  /**
   * Fine collected with this payment.
   */
  fine: number;

  /**
   * UPI / bank / card transaction reference.
   */
  transactionId?: string;

  /**
   * Cheque number.
   */
  chequeNumber?: string;

  /**
   * Bank name.
   */
  bankName?: string;

  /**
   * Cheque date.
   */
  chequeDate?: string;

  /**
   * Card type.
   */
  cardType?: string;

  /**
   * Payment remarks.
   */
  remarks?: string;

  /**
   * Component-level payment allocation.
   */
  allocations: InstallmentPaymentAllocation[];
}

/* =========================================================
   PAYMENT FORM VALUES
========================================================= */

export interface PaymentFormValues {
  paymentMethod: PaymentMethodType;

  amountPaid: number;

  discount: number;

  fine: number;

  transactionId: string;

  chequeNumber: string;

  bankName: string;

  chequeDate: string;

  cardType: string;

  remarks: string;
}

/* =========================================================
   COLLECT FEE DIALOG PROPS
========================================================= */

export interface CollectFeeDialogProps {
  isOpen: boolean;

  onClose: () => void;

  studentProfile: StudentFeeProfileData;

  /**
   * The exact milestone currently being collected.
   */
  installment: StudentFeeInstallment;

  onSuccessCallback?: (data: unknown) => void;
}