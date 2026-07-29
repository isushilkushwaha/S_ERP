export interface RemoveStudentRequest {
  studentCode: string;
  fullName: string;
}

export interface RemoveStudentResponse {
  success: boolean;
  message: string;
}

export interface RemoveStudentFormValues {
  studentCode: string;
  fullName: string;
  confirm: boolean;
}