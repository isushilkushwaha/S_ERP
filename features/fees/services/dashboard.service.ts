import { DashboardRepository } from '../repositories/dashboard.repository';
import { calculateLedgerTotals, deriveFeeStatus } from '../calculations/fee-summary';

export class DashboardService {
  private repository = new DashboardRepository();

  async getDashboardData(query: {
    academicYearId?: string;
    page?: number;
    limit?: number;
    search?: string;
    classId?: string;
    sectionId?: string;
    feeStatus?: string;
  }) {
    let academicYearId = query.academicYearId;

    if (!academicYearId) {
      const activeYear = await this.repository.getActiveAcademicYear();
      if (!activeYear) throw new Error('No active academic year found.');
      academicYearId = activeYear.id;
    }

    const academicYear = await this.repository.getAcademicYearById(academicYearId);
    if (!academicYear) throw new Error('Academic year not found.');

    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const skip = (page - 1) * limit;

    // Execute independent queries concurrently
    const [summaryRaw, classes, enrollmentsData] = await Promise.all([
      this.repository.getGlobalSummaryStats(academicYearId),
      this.repository.getClassesByTenant(),
      this.repository.getEnrollmentsWithLedgers({
        academicYearId,
        skip,
        take: limit,
        search: query.search,
        classId: query.classId,
        sectionId: query.sectionId,
      }),
    ]);

    // Calculate global summary metrics
    let totalAssignedAmount = 0;
    let totalCollectedAmount = 0;
    let totalDueAmount = 0;
    let paidStudentsCount = 0;
    let partialStudentsCount = 0;
    let dueStudentsCount = 0;

    // For filter processing if feeStatus filter is active post-fetch or pre-fetch
    const studentsList = enrollmentsData.enrollments.map((item) => {
      const totals = calculateLedgerTotals(item.feeLedgers);
      const status = deriveFeeStatus(totals.assigned, totals.due, totals.paid);

      totalAssignedAmount += totals.assigned;
      totalCollectedAmount += totals.paid;
      totalDueAmount += totals.due;

      if (status === 'PAID') paidStudentsCount++;
      else if (status === 'PARTIAL') partialStudentsCount++;
      else dueStudentsCount++;

      const studentName = [
        item.student.firstName,
        item.student.middleName,
        item.student.lastName,
      ]
        .filter(Boolean)
        .join(' ');

      return {
        enrollmentId: item.id,
        admissionNumber: item.admissionNumber,
        studentName,
        fatherName: item.student.fatherName,
        className: item.class.name,
        sectionName: item.section?.name ?? 'No Section',
        mobile: item.student.mobile || '',
        assigned: totals.assigned,
        paid: totals.paid,
        due: totals.due,
        status,
      };
    });

    // Optional client-side equivalent filter for status if passed
    const filteredStudents = query.feeStatus
      ? studentsList.filter((s) => s.status === query.feeStatus)
      : studentsList;

    // Sections for filter dropdown if classId is present
    const sections = query.classId
      ? await this.repository.getSectionsByClass(query.classId)
      : [];

    return {
      academicYear: {
        id: academicYear.id,
        name: academicYear.name,
        code: academicYear.code,
        status: academicYear.status,
      },
      summary: {
        totalStudents: summaryRaw.totalStudents,
        totalAssignedAmount,
        totalCollectedAmount,
        totalDueAmount,
        todayCollection: summaryRaw.todayCollection,
        paidStudents: paidStudentsCount,
        partialStudents: partialStudentsCount,
        dueStudents: dueStudentsCount,
      },
      filters: {
        classes,
        sections,
        feeStatuses: ['PAID', 'PARTIAL', 'DUE', 'OVERDUE'],
      },
      pagination: {
        page,
        limit,
        total: enrollmentsData.total,
        totalPages: Math.ceil(enrollmentsData.total / limit),
      },
      students: filteredStudents,
    };
  }

  async getAcademicYearsList() {
    return this.repository.getAllAcademicYears();
  }
}