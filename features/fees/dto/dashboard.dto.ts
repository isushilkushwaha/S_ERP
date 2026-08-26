export interface AcademicYearDto {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface DashboardSummaryDto {
  totalStudents: number;
  totalAssignedAmount: number;
  totalCollectedAmount: number;
  totalDueAmount: number;
  todayCollection: number;
  paidStudents: number;
  partialStudents: number;
  dueStudents: number;
}

export interface DashboardFilterOption {
  id: string;
  name: string;
  code?: string;
}

export interface DashboardFiltersDto {
  classes: DashboardFilterOption[];
  sections: DashboardFilterOption[];
  feeStatuses: string[];
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StudentRowDto {
  enrollmentId: string;
  admissionNumber: string;
  studentName: string;
  fatherName: string;
  className: string;
  sectionName: string;
  mobile: string;
  assigned: number;
  paid: number;
  due: number;
  status: 'PAID' | 'PARTIAL' | 'DUE' | 'OVERDUE';
}

export interface DashboardResponseDto {
  academicYear: AcademicYearDto;
  summary: DashboardSummaryDto;
  filters: DashboardFiltersDto;
  pagination: PaginationDto;
  students: StudentRowDto[];
}