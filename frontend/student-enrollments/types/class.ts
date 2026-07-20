// frontend/student-enrollments/types/class.ts

export interface Class {
  id: string;
  name: string;
  displayOrder: number;
}

export interface ClassListResponse {
  data: Class[];
}