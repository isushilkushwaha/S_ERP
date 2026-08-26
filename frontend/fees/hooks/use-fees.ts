'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

/* =========================================================
   FEE DASHBOARD
========================================================= */

export function useFeeDashboard(params: {
  academicYearId?: string;
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  sectionId?: string;
  feeStatus?: string;
}) {
  return useQuery({
    queryKey: ['fee-dashboard', params],

    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.academicYearId) {
        searchParams.set(
          'academicYearId',
          params.academicYearId
        );
      }

      if (params.page) {
        searchParams.set(
          'page',
          String(params.page)
        );
      }

      if (params.limit) {
        searchParams.set(
          'limit',
          String(params.limit)
        );
      }

      if (params.search) {
        searchParams.set(
          'search',
          params.search
        );
      }

      if (params.classId) {
        searchParams.set(
          'classId',
          params.classId
        );
      }

      if (params.sectionId) {
        searchParams.set(
          'sectionId',
          params.sectionId
        );
      }

      if (params.feeStatus) {
        searchParams.set(
          'feeStatus',
          params.feeStatus
        );
      }

      const res = await fetch(
        `/api/fees/dashboard?${searchParams.toString()}`
      );

      const json = await res.json();

      if (!json.success) {
        throw new Error(
          json.error ||
            'Failed to load fee dashboard'
        );
      }

      return json.data;
    },
  });
}

/* =========================================================
   ACADEMIC YEARS
========================================================= */

export function useAcademicYears() {
  return useQuery({
    queryKey: ['academic-years'],

    queryFn: async () => {
      const res = await fetch(
        '/api/fees/academic-years'
      );

      const json = await res.json();

      if (!json.success) {
        throw new Error(
          json.error ||
            'Failed to load academic years'
        );
      }

      return json.data;
    },
  });
}

/* =========================================================
   PAYMENT METHOD
========================================================= */

export type PaymentMethodType =
  | 'CASH'
  | 'UPI'
  | 'CHEQUE'
  | 'CARD'
  | 'BANK_TRANSFER'
  | 'RAZORPAY';

/* =========================================================
   FEE STATUS
========================================================= */

export type FeeStatus =
  | 'DUE'
  | 'PARTIAL'
  | 'PAID'
  | 'OVERDUE';

/* =========================================================
   INSTALLMENT STATUS
========================================================= */

export type InstallmentStatus =
  | 'UPCOMING'
  | 'DUE'
  | 'PARTIAL'
  | 'PAID'
  | 'OVERDUE';

/* =========================================================
   STUDENT LEDGER
=========================================================

   IMPORTANT:

   Ledger represents the student's FEE COMPONENTS.

   Example:

   Tuition Fee
   Admission Fee
   Examination Fee
   Transport Fee

   Installments are NOT stored inside this object anymore.
========================================================= */

export interface StudentLedgerItem {
  ledgerId: string;

  componentName: string;
  componentCode: string;

  assignedAmount: number;
  paidAmount: number;
  discountAmount: number;
  fineAmount: number;
  balanceAmount: number;

  status: FeeStatus;

  dueDate?: string | null;

  lastPaymentDate?: string | null;
}

/* =========================================================
   INSTALLMENT COMPONENT
=========================================================

   One milestone can contain multiple fee components.

   Example:

   Milestone 1
   ├── Tuition Fee       ₹2,000
   ├── Admission Fee     ₹1,000
   └── Exam Fee          ₹2,000

   Total = ₹5,000
========================================================= */

export interface StudentFeeInstallmentComponent {
  installmentComponentId: string;

  ledgerId: string;

  componentName: string;
  componentCode: string;

  assignedAmount: number;
  paidAmount: number;
  balanceAmount: number;

  status:
    | 'DUE'
    | 'PARTIAL'
    | 'PAID';
}

/* =========================================================
   STUDENT FEE INSTALLMENT / MILESTONE
========================================================= */

export interface StudentFeeInstallment {
  installmentId: string;

  sequence: number;

  name: string;

  dueDate: string | null;

  assignedAmount: number;

  paidAmount: number;

  balanceAmount: number;

  status: InstallmentStatus;

  /*
   * All fee components belonging
   * to this milestone.
   */
  components: StudentFeeInstallmentComponent[];
}

/* =========================================================
   ADMISSION DISCOUNT
========================================================= */

export interface StudentFeeProfileDiscount {
  id: string;

  name: string;
  code: string;

  originalAmount: number;
  appliedAmount: number;
  finalAmount: number;

  appliedPercentage: number | null;

  remarks: string | null;

  approvedBy: string | null;
}

/* =========================================================
   PAYMENT HISTORY
========================================================= */

export interface StudentPaymentHistoryItem {
  paymentId: string;

  receiptNumber: string;

  paymentMethod: PaymentMethodType;

  paymentDate: string;

  amountPaid: number;

  discount?: number;

  fine?: number;

  transactionId?: string | null;

  status?: string;

  remarks?: string | null;

  receivedBy: string;

  allocatedHeads?: Array<{
    componentName: string;
    allocatedAmount: number;
  }>;
}

/* =========================================================
   STUDENT FEE PROFILE
========================================================= */

export interface StudentFeeProfileData {
  /* -------------------------------------------------------
     STUDENT
  ------------------------------------------------------- */

  student: {
    studentId: string;

    enrollmentId: string;

    studentCode: string;

    admissionNumber: string;

    rollNumber: number;

    studentName: string;

    fatherName: string;

    motherName?: string;

    mobile: string;

    photo?: string;

    className: string;

    sectionName: string;

    academicYearName: string;
  };

  /* -------------------------------------------------------
     SUMMARY
  ------------------------------------------------------- */

  summary: {
    totalAssigned: number;

    totalPaid: number;

    totalDiscount: number;

    totalFine: number;

    totalDue: number;

    status: string;
  };

  /* -------------------------------------------------------
     ADMISSION DISCOUNT
  -------------------------------------------------------

     null means no discount was assigned.
  ------------------------------------------------------- */

  discount: StudentFeeProfileDiscount | null;

  /* -------------------------------------------------------
     FEE LEDGER

     Component-level financial tracking.
  ------------------------------------------------------- */

  ledgers: StudentLedgerItem[];

  /* -------------------------------------------------------
     INSTALLMENTS

     Admission-time payment milestones.

     This is now SEPARATE from the fee ledger.
  ------------------------------------------------------- */

  installments: StudentFeeInstallment[];

  /* -------------------------------------------------------
     PAYMENT HISTORY
  ------------------------------------------------------- */

  paymentHistory: StudentPaymentHistoryItem[];
}

/* =========================================================
   STUDENT FEE PROFILE HOOK
========================================================= */

export function useStudentFeeProfile(
  enrollmentId: string | null
) {
  return useQuery<
    StudentFeeProfileData | null,
    Error
  >({
    queryKey: [
      'student-fee-profile',
      enrollmentId,
    ],

    queryFn: async () => {
      if (!enrollmentId) {
        return null;
      }

      const res = await fetch(
        `/api/fees/students/${enrollmentId}`
      );

      const json = await res.json();

      if (!json.success) {
        throw new Error(
          json.error ||
            'Failed to load student fee profile'
        );
      }

      return json.data as StudentFeeProfileData;
    },

    enabled: !!enrollmentId,
  });
}

/* =========================================================
   COLLECT FEE
========================================================= */

export function useCollectFee() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CollectFeeRequestPayload
    ) => {
      const res = await fetch(
        '/api/fees/collect',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (!json.success) {
        throw new Error(
          json.error ||
            'Payment failed'
        );
      }

      return json.data;
    },

    onSuccess: (_, variables) => {
      /* ---------------------------------------------------
         Refresh global fee dashboard
      --------------------------------------------------- */

      queryClient.invalidateQueries({
        queryKey: ['fee-dashboard'],
      });

      /* ---------------------------------------------------
         Refresh current student's profile

         This refreshes:

         - Fee ledger
         - Installments
         - Payment history
         - Summary
         - Discount
      --------------------------------------------------- */

      queryClient.invalidateQueries({
        queryKey: [
          'student-fee-profile',
          variables.enrollmentId,
        ],
      });
    },
  });
}

/* =========================================================
   VOID PAYMENT
========================================================= */

export function useVoidPayment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      reason,
    }: {
      paymentId: string;
      reason: string;
    }) => {
      const res = await fetch(
        `/api/fees/payments/${paymentId}/void`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            reason,
          }),
        }
      );

      const json = await res.json();

      if (!json.success) {
        throw new Error(
          json.error ||
            'Void failed'
        );
      }

      return json.data;
    },

    onSuccess: (_, variables) => {
      /* ---------------------------------------------------
         Refresh dashboard
      --------------------------------------------------- */

      queryClient.invalidateQueries({
        queryKey: ['fee-dashboard'],
      });

      /* ---------------------------------------------------
         Refresh student profile

         Void payment can change:

         - Paid amount
         - Balance
         - Installment status
         - Fee status
         - Payment history
      --------------------------------------------------- */

      queryClient.invalidateQueries({
        queryKey: ['student-fee-profile'],
      });
    },
  });
}

/* =========================================================
   PAYMENT ALLOCATION
========================================================= */

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
  enrollmentId: string;

  paymentMethod: PaymentMethodType;

  amountPaid: number;

  discount: number;

  fine: number;

  transactionId?: string;

  chequeNumber?: string;

  bankName?: string;

  chequeDate?: string;

  cardType?: string;

  remarks?: string;

  /*
   * Current payment allocation remains
   * component/ledger based.
   *
   * The backend should determine the
   * active installment and prevent
   * payment from moving to the next
   * milestone until the current one
   * is completed.
   */
  allocations: Array<{
    ledgerId: string;

    allocatedAmount: number;
  }>;
}