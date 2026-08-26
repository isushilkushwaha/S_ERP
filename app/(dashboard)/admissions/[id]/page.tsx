// app/admissions/[id]/page.tsx

import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdmissionDetailView } from "@/frontend/admissions/components/admission-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdmissionDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const enrollment = await prisma.studentEnrollment.findUnique({
    where: {
      id,
    },

    include: {
      // ============================================================
      // STUDENT
      // ============================================================
      student: {
        include: {
          documents: true,
        },
      },

      // ============================================================
      // ACADEMIC INFORMATION
      // ============================================================
      academicYear: true,
      class: true,
      section: true,

      // ============================================================
      // ASSIGNED INSTALLMENT PLAN TEMPLATE
      // ============================================================
      installmentPlan: {
        include: {
          items: true,
        },
      },

      // ============================================================
      // FEE LEDGER
      //
      // Ledger contains the actual assigned fee components.
      // Do NOT use ledger.installments anymore.
      // ============================================================
      feeLedgers: {
        include: {
          feeComponent: true,

          // A ledger can belong to one or more
          // installment milestones through this relation.
          installmentComponents: {
            include: {
              installment: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },

      // ============================================================
      // INSTALLMENT / MILESTONE SNAPSHOT
      //
      // This is now the main source for the student's
      // admission-time installment assignment.
      //
      // Example:
      //
      // Milestone 1
      //   Tuition
      //   Admission
      //   Examination
      //
      // Milestone 2
      //   Tuition
      //
      // ============================================================
      feeInstallments: {
        orderBy: {
          sequence: "asc",
        },

        include: {
          components: {
            include: {
              ledger: {
                include: {
                  feeComponent: true,
                },
              },
            },
          },
        },
      },

      // ============================================================
      // DISCOUNTS / CONCESSIONS
      // ============================================================
      enrollmentDiscounts: {
        include: {
          discountType: true,
        },
      },
    },
  });

  // ================================================================
  // NOT FOUND
  // ================================================================

  if (!enrollment) {
    notFound();
  }

  // ================================================================
  // SERIALIZE PRISMA DECIMAL + DATE VALUES
  // ================================================================
  const serializedEnrollment = JSON.parse(
    JSON.stringify(enrollment)
  );

  // ================================================================
  // CLIENT COMPONENT
  // ================================================================

  return (
    <AdmissionDetailView
      enrollment={serializedEnrollment}
    />
  );
}