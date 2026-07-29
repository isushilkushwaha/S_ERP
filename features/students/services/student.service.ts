import { Prisma } from "@prisma/client";

import { CreateStudentInput } from "../schemas/create-student.schema";
import { UpdateStudentInput } from "../schemas/update/update-student.schema";
import { StudentQuery } from "../types/student";
import { studentRepository } from "../repositories/student.repository";
import { studentCodeService } from "./student-code.service";
import type { RemoveStudentInput } from "../schemas/remove-student.schema";


import { NotFoundError } from "@/lib/errors/not-found-error";

export class StudentService {
  updateRegistration(studentId: string, payload: { emisNumber?: string | null | undefined; apaarId?: string | null | undefined; penNumber?: string | null | undefined; }) {
      throw new Error("Method not implemented.");
  }
  async getStudents(query: StudentQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      studentRepository.findMany({
        search: query.search,
        skip,
        take: limit,
      }),
      studentRepository.count({
        search: query.search,
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

    return {
      success: true,
      message: "Student fetched successfully.",
      data: student,
    };
  }

  async createStudent(data: CreateStudentInput) {
    // Generate Student Code automatically
    const studentCode =
      await studentCodeService.getNextStudentCode();

    const student = await studentRepository.create({
      ...(data as Prisma.StudentCreateInput),
      studentCode,
    });

    return {
      success: true,
      message: "Student registered successfully.",
      data: student,
    };
  }

  async updateStudent(
    id: string,
    data: UpdateStudentInput
  ) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new NotFoundError("Student not found.");
    }

    // Student Code should never be updated manually
    const { studentCode, ...updateData } = data as any;

    const updatedStudent = await studentRepository.update(
      id,
      updateData as Prisma.StudentUpdateInput
    );

    return {
      success: true,
      message: "Student updated successfully.",
      data: updatedStudent,
    };
  }

  // async deleteStudent(id: string) {
  //   const student = await studentRepository.findById(id);

  //   if (!student) {
  //     throw new NotFoundError("Student not found.");
  //   }

  //   await studentRepository.softDelete(id);

  //   return {
  //     success: true,
  //     message: "Student deleted successfully.",
  //   };
  // }

  

async removeStudent(
  
    payload: RemoveStudentInput
) {
    const student =
        await studentRepository.findByStudentCode(
            payload.studentCode
        );

    if (!student) {
        throw new NotFoundError(
            "Student Code not found."
        );
    }

    const databaseName = [
        student.firstName,
        student.middleName,
        student.lastName,
    ]
        .filter(Boolean)
        .join(" ")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

    const enteredName = payload.fullName
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

    if (databaseName !== enteredName) {
        throw new Error(
            "Student Full Name does not match."
        );
    }

    await studentRepository.delete(student.id);

    return {
        success: true,
        message:
            "Student removed successfully.",
    };
}

  
}

export const studentService = new StudentService();