import { Prisma } from "@prisma/client";

import { studentEnrollmentRepository } from "../repositories/student-enrollment.repository";

import { CreateEnrollmentInput } from "../schemas/create-enrollment.schema";
import { UpdateEnrollmentInput } from "../schemas/update-enrollment.schema";
import { StudentEnrollmentQuery } from "../types/enrollment";

import { NotFoundError } from "@/lib/errors/not-found-error";
import { ConflictError } from "@/lib/errors/conflict-error";
import { BadRequestError } from "@/lib/errors/bad-request-error";

export class StudentEnrollmentService {
  // ======================================================
  // GET ALL
  // ======================================================

  async getEnrollments(
    query: StudentEnrollmentQuery
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      studentEnrollmentRepository.findMany({
        search: query.search,
        academicYearId: query.academicYearId,
        classId: query.classId,
        sectionId: query.sectionId,
        enrollmentStatus: query.enrollmentStatus,
        skip,
        take: limit,
      }),

      studentEnrollmentRepository.count({
        search: query.search,
        academicYearId: query.academicYearId,
        classId: query.classId,
        sectionId: query.sectionId,
        enrollmentStatus: query.enrollmentStatus,
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ======================================================
  // GET ONE
  // ======================================================

  async getEnrollmentById(id: string) {
    const enrollment =
      await studentEnrollmentRepository.findById(id);

    if (!enrollment) {
      throw new NotFoundError(
        "Student enrollment not found."
      );
    }

    return enrollment;
  }

  // ======================================================
// CREATE
// ======================================================

async createEnrollment(
  data: CreateEnrollmentInput
) {
  // -----------------------------
  // Validate Student
  // -----------------------------
  const student =
    await studentEnrollmentRepository.findStudentById(
      data.studentId
    );

  if (!student) {
    throw new NotFoundError("Student not found.");
  }

  // -----------------------------
  // Validate Academic Year
  // -----------------------------
  const academicYear =
    await studentEnrollmentRepository.findAcademicYearById(
      data.academicYearId
    );

  if (!academicYear) {
    throw new NotFoundError(
      "Academic year not found."
    );
  }

  // -----------------------------
  // Validate Class
  // -----------------------------
  const classData =
    await studentEnrollmentRepository.findClassById(
      data.classId
    );

  if (!classData) {
    throw new NotFoundError("Class not found.");
  }

  // -----------------------------
  // Validate Section
  // -----------------------------
  const section =
    await studentEnrollmentRepository.findSectionById(
      data.sectionId
    );

  if (!section) {
    throw new NotFoundError("Section not found.");
  }

  // -----------------------------
  // Validate Section belongs to Class
  // -----------------------------
  if (section.classId !== data.classId) {
    throw new BadRequestError(
      "Selected section does not belong to the selected class."
    );
  }

  // -----------------------------
  // Check Student Enrollment
  // -----------------------------
  const existingEnrollment =
    await studentEnrollmentRepository.findStudentEnrollment(
      data.studentId,
      data.academicYearId
    );

  if (existingEnrollment) {
    throw new ConflictError(
      "Student is already enrolled in this academic year."
    );
  }

  // -----------------------------
  // Check Roll Number
  // -----------------------------
  const existingRollNumber =
    await studentEnrollmentRepository.findRollNumber(
      data.academicYearId,
      data.classId,
      data.sectionId,
      data.rollNumber
    );

  if (existingRollNumber) {
    throw new ConflictError(
      "Roll number already exists in this class and section."
    );
  }

  // -----------------------------
  // Validate Stream
  // -----------------------------
  const seniorClasses = ["11", "12"];

  const requiresStream = seniorClasses.includes(
    classData.name
  );

  if (requiresStream && !data.stream) {
    throw new BadRequestError(
      "Stream is required for Class 11 and 12."
    );
  }

  if (!requiresStream && data.stream) {
    throw new BadRequestError(
      "Stream is only applicable for Class 11 and 12."
    );
  }

  // -----------------------------
  // Create Enrollment
  // -----------------------------
  return studentEnrollmentRepository.create({
    student: {
      connect: {
        id: data.studentId,
      },
    },

    academicYear: {
      connect: {
        id: data.academicYearId,
      },
    },

    class: {
      connect: {
        id: data.classId,
      },
    },

    section: {
      connect: {
        id: data.sectionId,
      },
    },

    rollNumber: data.rollNumber,

    medium: data.medium,

    stream: data.stream,

    house: data.house,

    boardRegistrationNumber:
      data.boardRegistrationNumber,

    admissionType: data.admissionType,

    enrollmentStatus: data.enrollmentStatus,

    joinedDate: data.joinedDate,

    leftDate: data.leftDate,

    remarks: data.remarks,
  });
}

  // ======================================================
// UPDATE
// ======================================================

async updateEnrollment(
  id: string,
  data: UpdateEnrollmentInput
) {
  const enrollment =
    await studentEnrollmentRepository.findById(id);

  if (!enrollment) {
    throw new NotFoundError(
      "Student enrollment not found."
    );
  }

  const studentId =
    data.studentId ?? enrollment.studentId;

  const academicYearId =
    data.academicYearId ??
    enrollment.academicYearId;

  const classId =
    data.classId ?? enrollment.classId;

  const sectionId =
    data.sectionId ?? enrollment.sectionId;

  const rollNumber =
    data.rollNumber ?? enrollment.rollNumber;

  // -----------------------------
  // Validate Student
  // -----------------------------

  const student =
    await studentEnrollmentRepository.findStudentById(
      studentId
    );

  if (!student) {
    throw new NotFoundError("Student not found.");
  }

  // -----------------------------
  // Validate Academic Year
  // -----------------------------

  const academicYear =
    await studentEnrollmentRepository.findAcademicYearById(
      academicYearId
    );

  if (!academicYear) {
    throw new NotFoundError(
      "Academic year not found."
    );
  }

  // -----------------------------
  // Validate Class
  // -----------------------------

  const classData =
    await studentEnrollmentRepository.findClassById(
      classId
    );

  if (!classData) {
    throw new NotFoundError("Class not found.");
  }

  // -----------------------------
  // Validate Section
  // -----------------------------

  const section =
    await studentEnrollmentRepository.findSectionById(
      sectionId
    );

  if (!section) {
    throw new NotFoundError("Section not found.");
  }

  if (section.classId !== classId) {
    throw new BadRequestError(
      "Selected section does not belong to selected class."
    );
  }

  // -----------------------------
  // Duplicate Enrollment
  // -----------------------------

  const duplicateEnrollment =
    await studentEnrollmentRepository.findStudentEnrollmentExceptId(
      id,
      studentId,
      academicYearId
    );

  if (duplicateEnrollment) {
    throw new ConflictError(
      "Student is already enrolled in this academic year."
    );
  }

  // -----------------------------
  // Duplicate Roll Number
  // -----------------------------

  const duplicateRoll =
    await studentEnrollmentRepository.findRollNumberExceptId(
      id,
      academicYearId,
      classId,
      sectionId,
      rollNumber
    );

  if (duplicateRoll) {
    throw new ConflictError(
      "Roll number already exists."
    );
  }

  // -----------------------------
  // Stream Validation
  // -----------------------------

  const seniorClasses = ["11", "12"];

  const requiresStream =
    seniorClasses.includes(classData.name);

  if (
    requiresStream &&
    !data.stream &&
    !enrollment.stream
  ) {
    throw new BadRequestError(
      "Stream is required for Class 11 and 12."
    );
  }

  if (
    !requiresStream &&
    (data.stream ?? enrollment.stream)
  ) {
    throw new BadRequestError(
      "Stream is only applicable for Class 11 and 12."
    );
  }

  return studentEnrollmentRepository.update(
    id,
    {
      student:
        data.studentId
          ? {
              connect: {
                id: studentId,
              },
            }
          : undefined,

      academicYear:
        data.academicYearId
          ? {
              connect: {
                id: academicYearId,
              },
            }
          : undefined,

      class:
        data.classId
          ? {
              connect: {
                id: classId,
              },
            }
          : undefined,

      section:
        data.sectionId
          ? {
              connect: {
                id: sectionId,
              },
            }
          : undefined,

      rollNumber: data.rollNumber,

      medium: data.medium,

      stream: data.stream,

      house: data.house,

      boardRegistrationNumber:
        data.boardRegistrationNumber,

      admissionType: data.admissionType,

      enrollmentStatus:
        data.enrollmentStatus,

      joinedDate: data.joinedDate,

      leftDate: data.leftDate,

      remarks: data.remarks,
    }
  );
}

  // ======================================================
// DELETE
// ======================================================

async deleteEnrollment(id: string) {
  const enrollment =
    await studentEnrollmentRepository.findById(id);

  if (!enrollment) {
    throw new NotFoundError(
      "Student enrollment not found."
    );
  }

  return studentEnrollmentRepository.delete(id);
}
}

export const studentEnrollmentService =
  new StudentEnrollmentService();