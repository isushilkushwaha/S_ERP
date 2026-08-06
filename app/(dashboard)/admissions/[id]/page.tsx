import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdmissionDetailView } from "@/frontend/admissions/components/admission-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdmissionDetailPage({ params }: PageProps) {
  const { id } = await params;

  const enrollment = await prisma.studentEnrollment.findUnique({
    where: { id },
    include: {
      student: {
        include: {
          documents: true,
        },
      },
      academicYear: true,
      class: true,
      section: true,
      feeLedgers: {
        include: {
          feeComponent: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!enrollment) {
    notFound();
  }

  // Safely serialize Prisma Decimals and Dates for the Client Component boundary
  const serializedEnrollment = JSON.parse(JSON.stringify(enrollment));

  return <AdmissionDetailView enrollment={serializedEnrollment} />;
}