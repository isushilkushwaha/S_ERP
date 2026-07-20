import { Prisma } from "@prisma/client";

import { CreateStudentInput } from "../schemas/create-student.schema";
import { UpdateStudentInput } from "../schemas/update-student.schema";
import { StudentQuery } from "../types/student";
import { studentRepository } from "../repositories/student.repository";
import { NotFoundError } from "@/lib/errors/not-found-error";
import { ConflictError } from "@/lib/errors/conflict-error"

export class StudentService {
  // async getStudents(query: StudentQuery) {
  //   const page = query.page ?? 1;
  //   const limit = query.limit ?? 10;

  //   const skip = (page - 1) * limit;

  //   const [students, total] = await Promise.all([
  //     studentRepository.findMany({
  //       search: query.search,
  //       status: query.status,
  //       skip,
  //       take: limit,
  //     }),
  //     studentRepository.count({
  //       search: query.search,
  //       status: query.status,
  //     }),
  //   ]);

  //   return {
  //     data: students,
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  async getStudents(query: StudentQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  const skip = (page - 1) * limit;

  const [students, total] = await Promise.all([
    studentRepository.findMany({
      search: query.search,
      status: query.status,
      skip,
      take: limit,
    }),
    studentRepository.count({
      search: query.search,
      status: query.status,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    success: true,

    message: "Students fetched successfully.",

    data: students,

    meta: {
      page,
      limit,

      totalItems: total,

      totalPages,

      hasNextPage: page < totalPages,

      hasPreviousPage: page > 1,
    },
  };
}

  async getStudentById(id: string) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new NotFoundError("Student not found.");
    }

    //return student;
    return {
  success: true,

  message: "Student fetched successfully.",

  data: student,
};
  }

  async createStudent(data: CreateStudentInput) {
    const existingStudentCode =
      await studentRepository.findByStudentCode(
        data.studentCode
      );

    if (existingStudentCode) {
      throw new Error("Student code already exists.");
    }

    const existingAdmission =
      await studentRepository.findByAdmissionNumber(
        data.admissionNumber
      );

    if (existingAdmission) {
      throw new Error("Admission number already exists.");
    }

    // return studentRepository.create(
    //   data as Prisma.StudentCreateInput
    // );
    const student = await studentRepository.create(
  data as Prisma.StudentCreateInput
);

return {
  success: true,

  message: "Student created successfully.",

  data: student,
};

  }

  async updateStudent(
    id: string,
    data: UpdateStudentInput
  ) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new Error("Student not found.");
    }

    if (
      data.studentCode &&
      data.studentCode !== student.studentCode
    ) {
      const existing =
        await studentRepository.findByStudentCode(
          data.studentCode
        );

      if (existing) {
        throw new ConflictError(
  "Student code already exists."
);
      }
    }

    if (
      data.admissionNumber &&
      data.admissionNumber !== student.admissionNumber
    ) {
      const existing =
        await studentRepository.findByAdmissionNumber(
          data.admissionNumber
        );

      if (existing) {
        throw new ConflictError(
  "Admission number already exists."
);
      }
    }

    // return studentRepository.update(
    //   id,
    //   data as Prisma.StudentUpdateInput
    // );
  const updatedStudent = await studentRepository.update(
  id,
  data as Prisma.StudentUpdateInput
);

return {
  success: true,

  message: "Student updated successfully.",

  data: updatedStudent,
};

  }

  async deleteStudent(id: string) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new Error("Student not found.");
    }

    //return studentRepository.softDelete(id);
    await studentRepository.softDelete(id);

return {
  success: true,

  message: "Student deleted successfully.",
};
  }
}

export const studentService = new StudentService();