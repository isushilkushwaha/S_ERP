import { z } from "zod";

export const collectFeeSchema = z
  .object({
    enrollmentId: z
      .string()
      .uuid("Invalid enrollment ID format"),

    paymentMethod: z.enum([
      "CASH",
      "UPI",
      "CHEQUE",
      "CARD",
      "BANK_TRANSFER",
      "RAZORPAY",
    ]),

    gateway: z
      .enum([
        "MANUAL",
        "RAZORPAY",
      ])
      .default("MANUAL"),

    amountPaid: z
      .number()
      .positive(
        "Payment amount must be greater than zero",
      ),

    discount: z
      .number()
      .nonnegative()
      .default(0),

    fine: z
      .number()
      .nonnegative()
      .default(0),

    transactionId:
      z.string().optional(),

    gatewayOrderId:
      z.string().optional(),

    gatewayPaymentId:
      z.string().optional(),

    gatewaySignature:
      z.string().optional(),

    chequeNumber:
      z.string().optional(),

    bankName:
      z.string().optional(),

    chequeDate:
      z.string().optional(),

    cardType:
      z.string().optional(),

    remarks:
      z
        .string()
        .max(255)
        .optional(),

    /*
     * One payment can contain allocations
     * across multiple installments.
     *
     * Example:
     *
     * M1 = ₹540
     * M2 = ₹460
     *
     * Total = ₹1000
     */
    allocations: z
      .array(
        z.object({
          installmentComponentId:
            z
              .string()
              .uuid(),

          installmentId:
            z
              .string()
              .uuid(),

          ledgerId:
            z
              .string()
              .uuid(),

          allocatedAmount:
            z
              .number()
              .positive(),

          discountApplied:
            z
              .number()
              .nonnegative()
              .default(0),

          fineApplied:
            z
              .number()
              .nonnegative()
              .default(0),
        }),
      )
      .min(
        1,
        "At least one fee component allocation is required",
      ),
  })
  .superRefine(
    (data, ctx) => {
      /* ========================================================
         1. PAYMENT METHOD VALIDATION
      ======================================================== */

      if (
        data.paymentMethod === "UPI" ||
        data.paymentMethod ===
          "BANK_TRANSFER"
      ) {
        if (
          !data.transactionId?.trim()
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            message:
              "Transaction ID / UTR is required",

            path: [
              "transactionId",
            ],
          });
        }
      }

      /* ========================================================
         2. BANK TRANSFER
      ======================================================== */

      if (
        data.paymentMethod ===
        "BANK_TRANSFER"
      ) {
        if (
          !data.bankName?.trim()
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            message:
              "Bank Name is required for Bank Transfer",

            path: [
              "bankName",
            ],
          });
        }
      }

      /* ========================================================
         3. CHEQUE
      ======================================================== */

      if (
        data.paymentMethod ===
        "CHEQUE"
      ) {
        if (
          !data.chequeNumber?.trim()
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            message:
              "Cheque Number is required",

            path: [
              "chequeNumber",
            ],
          });
        }

        if (
          !data.bankName?.trim()
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            message:
              "Bank Name is required",

            path: [
              "bankName",
            ],
          });
        }

        if (
          !data.chequeDate?.trim()
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            message:
              "Cheque Date is required",

            path: [
              "chequeDate",
            ],
          });
        }
      }

      /* ========================================================
         4. CARD
      ======================================================== */

      if (
        data.paymentMethod ===
        "CARD"
      ) {
        if (
          !data.transactionId?.trim()
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            message:
              "Authorization Code is required",

            path: [
              "transactionId",
            ],
          });
        }

        if (
          !data.cardType?.trim()
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            message:
              "Card Type is required",

            path: [
              "cardType",
            ],
          });
        }
      }

      /* ========================================================
         5. ALLOCATION TOTAL
         
         The complete payment must be distributed.
         
         Example:
         
         Amount Received = ₹1000
         
         M1 = ₹540
         M2 = ₹460
         
         Allocation Total = ₹1000
      ======================================================== */

      const allocatedTotal =
        data.allocations.reduce(
          (
            total,
            allocation,
          ) =>
            total +
            allocation.allocatedAmount,
          0,
        );

      if (
        Math.abs(
          allocatedTotal -
            data.amountPaid,
        ) > 0.01
      ) {
        ctx.addIssue({
          code:
            z.ZodIssueCode.custom,

          message:
            "Total allocation must equal the amount received.",

          path: [
            "allocations",
          ],
        });
      }

      /* ========================================================
         6. DUPLICATE COMPONENT
      ======================================================== */

      const componentIds =
        new Set<string>();

      for (const allocation of
        data.allocations) {
        if (
          componentIds.has(
            allocation.installmentComponentId,
          )
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            message:
              "Duplicate fee component allocation is not allowed.",

            path: [
              "allocations",
            ],
          });

          break;
        }

        componentIds.add(
          allocation.installmentComponentId,
        );
      }
    },
  );

export type CollectFeeInput =
  z.infer<
    typeof collectFeeSchema
  >;