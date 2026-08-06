export class AdmissionDomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = "AdmissionDomainError";
  }
}

export class StudentNotFoundError extends AdmissionDomainError {
  constructor(studentId: string) {
    super(`Student with ID '${studentId}' was not found.`, "STUDENT_NOT_FOUND", 404);
  }
}

export class AlreadyEnrolledError extends AdmissionDomainError {
  constructor() {
    super("Student is already enrolled in the selected academic year.", "ALREADY_ENROLLED", 409);
  }
}

export class RollNumberConflictError extends AdmissionDomainError {
  constructor(rollNumber: number) {
    super(`Roll number ${rollNumber} is already taken in this class section.`, "ROLL_NUMBER_EXISTS", 409);
  }
}

export class MissingFeeStructureError extends AdmissionDomainError {
  constructor() {
    super("No active Fee Structure found for the selected Academic Year and Class.", "MISSING_FEE_STRUCTURE", 422);
  }
}