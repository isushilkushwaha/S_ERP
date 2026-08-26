import { z } from "zod";

export const collectFeeSchema = z.object({
  paymentMethod: z.enum([
    "CASH",
    "UPI",
    "CHEQUE",
    "CARD",
    "BANK_TRANSFER",
    "RAZORPAY",
  ]),

  amountPaid: z
    .number()
    .positive(
      "Enter a valid payment amount.",
    ),

  transactionId:
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
      .max(
        255,
        "Remarks cannot exceed 255 characters.",
      )
      .optional(),
});

export type CollectFeeFormValues =
  z.infer<
    typeof collectFeeSchema
  >;