// frontend/students/utils/student-validation.ts

export function isAdmissionNumberValid(
  admissionNumber: string
): boolean {
  return admissionNumber.trim().length > 0;
}

export function isMobileNumberValid(
  mobile?: string | null
): boolean {
  if (!mobile) return true;

  return /^[6-9]\d{9}$/.test(mobile);
}