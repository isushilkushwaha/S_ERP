export interface Class {
  id: string;
  name: string;
  displayOrder: number;
}

export interface ClassQuery {
  academicYearId?: string;
}

export interface ClassListResponse {
  data: Class[];
}

export interface ClassResponse {
  data: Class;
  message: string;
}