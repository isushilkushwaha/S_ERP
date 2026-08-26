import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class DashboardRepository {
  async getAcademicYearById(id: string) {
    return prisma.academicYear.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async getActiveAcademicYear() {
    return prisma.academicYear.findFirst({
      where: { status: 'ACTIVE', deletedAt: null },
    });
  }

  async getAllAcademicYears() {
    return prisma.academicYear.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'desc' },
    });
  }

  async getClassesByTenant(tenantId?: string) {
    return prisma.class.findMany({
      where: { deletedAt: null, ...(tenantId ? { tenantId } : {}) },
      select: { id: true, name: true, code: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async getSectionsByClass(classId: string) {
    return prisma.section.findMany({
      where: { classId, deletedAt: null },
      select: { id: true, name: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async getEnrollmentsWithLedgers(params: {
    academicYearId: string;
    skip: number;
    take: number;
    search?: string;
    classId?: string;
    sectionId?: string;
  }) {
    const { academicYearId, skip, take, search, classId, sectionId } = params;

    const where: Prisma.StudentEnrollmentWhereInput = {
      academicYearId,
      status: 'ACTIVE',
      ...(classId ? { classId } : {}),
      ...(sectionId ? { sectionId } : {}),
      ...(search
        ? {
            OR: [
              { admissionNumber: { contains: search, mode: 'insensitive' } },
              { student: { firstName: { contains: search, mode: 'insensitive' } } },
              { student: { lastName: { contains: search, mode: 'insensitive' } } },
              { student: { fatherName: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [enrollments, total] = await Promise.all([
      prisma.studentEnrollment.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          admissionNumber: true,
          student: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
              fatherName: true,
              mobile: true,
            },
          },
          class: { select: { name: true } },
          section: { select: { name: true } },
          feeLedgers: {
            select: {
              assignedAmount: true,
              paidAmount: true,
              discountAmount: true,
              fineAmount: true,
            },
          },
        },
        orderBy: { admissionNumber: 'asc' },
      }),
      prisma.studentEnrollment.count({ where }),
    ]);

    return { enrollments, total };
  }

  async getGlobalSummaryStats(academicYearId: string) {
    // OPTIMIZATION: Use database aggregate instead of loading all rows into Node memory
    const [ledgersSummary, totalStudentsCount, todayPayments] = await Promise.all([
      prisma.studentFeeLedger.aggregate({
        where: {
          enrollment: {
            academicYearId,
            status: 'ACTIVE',
          },
        },
        _sum: {
          assignedAmount: true,
          paidAmount: true,
          discountAmount: true,
          fineAmount: true,
        },
      }),
      prisma.studentEnrollment.count({
        where: { academicYearId, status: 'ACTIVE' },
      }),
      prisma.feePayment.aggregate({
        where: {
          paymentDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          status: 'SUCCESS',
          enrollment: { academicYearId },
        },
        _sum: { amountPaid: true },
      }),
    ]);

    return {
      totalStudents: totalStudentsCount,
      summaryTotals: {
        assigned: Number(ledgersSummary._sum.assignedAmount || 0),
        paid: Number(ledgersSummary._sum.paidAmount || 0),
        discount: Number(ledgersSummary._sum.discountAmount || 0),
        fine: Number(ledgersSummary._sum.fineAmount || 0),
      },
      todayCollection: Number(todayPayments._sum.amountPaid || 0),
    };
  }
}