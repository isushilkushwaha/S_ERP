// app/api/fees/collect/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/auth";

import {
  collectFeeSchema,
} from "@/features/fees/schemas/payment.schema";

import {
  CollectFeeTransaction,
} from "@/features/fees/transactions/collect-fee.transaction";

import {
  PaymentNotificationService,
} from "@/features/notifications/services/payment-notification.service";

import { prisma } from "@/lib/prisma";

const collectFeeTx =
  new CollectFeeTransaction();

export async function POST(
  req: NextRequest,
) {
  try {
    // ============================================================
    // 1. AUTHENTICATION
    // ============================================================

    const session =
      await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized. Please login again.",
        },
        {
          status: 401,
        },
      );
    }

    const userId =
      session.user.id;

    // ============================================================
    // 2. VERIFY APPLICATION USER
    //
    // session.user.id MUST be users.id
    // ============================================================

    const user =
      await prisma.user.findFirst({
        where: {
          id: userId,
          deletedAt: null,
        },

        select: {
          id: true,
          fullName: true,
        },
      });

    if (!user) {
      console.error(
        "[FEE_COLLECTION_USER_NOT_FOUND]",
        {
          sessionUserId:
            userId,

          email:
            session.user.email,
        },
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Authenticated user does not exist as an active school system user.",
        },
        {
          status: 403,
        },
      );
    }

    // ============================================================
    // 3. PARSE REQUEST
    // ============================================================

    const body =
      await req.json();

    console.log(
      "[FEE_COLLECTION_REQUEST]",
      JSON.stringify(
        body,
        null,
        2,
      ),
    );

    // ============================================================
    // 4. VALIDATE REQUEST
    // ============================================================

    const validationResult =
      collectFeeSchema.safeParse(
        body,
      );

    if (
      !validationResult.success
    ) {
      const issues =
        validationResult.error
          .issues;

      console.error(
        "[FEE_COLLECTION_VALIDATION_ERROR]",
        {
          issues,
          body,
        },
      );

      return NextResponse.json(
        {
          success: false,

          error:
            "Invalid fee payment data.",

          details:
            issues.map(
              (issue) => ({
                path:
                  issue.path,

                message:
                  issue.message,

                code:
                  issue.code,
              }),
            ),
        },
        {
          status: 400,
        },
      );
    }

    const data =
      validationResult.data;

    // ============================================================
    // 5. IP ADDRESS
    // ============================================================

    const forwardedFor =
      req.headers.get(
        "x-forwarded-for",
      );

    const ipAddress =
      forwardedFor
        ?.split(",")[0]
        ?.trim() ||
      req.headers.get(
        "x-real-ip",
      ) ||
      "127.0.0.1";

    // ============================================================
    // 6. EXECUTE ATOMIC PAYMENT TRANSACTION
    // ============================================================

    const result =
      await collectFeeTx.execute({
        data,

        userId:
          user.id,

        ipAddress,
      });

    if (!result) {
      throw new Error(
        "Payment transaction failed to return a result.",
      );
    }

    // ============================================================
    // 7. SEND PAYMENT SMS
    //
    // Fire-and-forget.
    // Payment is already committed.
    // ============================================================

    PaymentNotificationService
      .sendPaymentReceipt(
        result.payment.id,

        data.enrollmentId,

        result.receipt
          .receiptNumber,

        data.amountPaid,

        user.id,
      )
      .catch(
        (error) => {
          console.error(
            "[PAYMENT_SMS_ERROR]",
            error,
          );
        },
      );

    // ============================================================
    // 8. RESPONSE
    // ============================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Payment collected successfully and receipt generated.",

        data: result,
      },
      {
        status: 201,
      },
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "[API_FEES_COLLECT_ERROR]",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}