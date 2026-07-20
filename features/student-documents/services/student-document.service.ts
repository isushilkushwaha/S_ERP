import {
  studentDocumentRepository,
} from "../repositories/student-document.repository";

import {
  CreateDocumentInput,
} from "../schemas/create-document.schema";

import {
  UpdateDocumentInput,
} from "../schemas/update-document.schema";

import {
  StudentDocumentQuery,
} from "../types/student-document";

import { NotFoundError } from "@/lib/errors/not-found-error";
import { ConflictError } from "@/lib/errors/conflict-error";

export class StudentDocumentService {

  // ======================================================
  // GET ALL
  // ======================================================

  async getDocuments(
    query: StudentDocumentQuery
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      studentDocumentRepository.findMany({
        search: query.search,
        studentId: query.studentId,
        documentType: query.documentType,
        verified: query.verified,
        skip,
        take: limit,
      }),

      studentDocumentRepository.count({
        search: query.search,
        studentId: query.studentId,
        documentType: query.documentType,
        verified: query.verified,
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

  async getDocument(id: string) {
    const document =
      await studentDocumentRepository.findById(id);

    if (!document) {
      throw new NotFoundError(
        "Student document not found."
      );
    }

    return document;
  }

  // ======================================================
  // CREATE
  // ======================================================

  async createDocument(
    data: CreateDocumentInput
  ) {

    const student =
      await studentDocumentRepository.findStudentById(
        data.studentId
      );

    if (!student) {
      throw new NotFoundError(
        "Student not found."
      );
    }

    const duplicate =
      await studentDocumentRepository.findByStudentAndDocumentType(
        data.studentId,
        data.documentType
      );

    if (duplicate) {
      throw new ConflictError(
        "This document already exists for the student."
      );
    }

    return studentDocumentRepository.create({

      student: {
        connect: {
          id: data.studentId,
        },
      },

      documentType: data.documentType,

      documentNumber: data.documentNumber,

      fileName: data.fileName,

      fileUrl: data.fileUrl,

      issueDate: data.issueDate,

      expiryDate: data.expiryDate,

      verified: data.verified,

      remarks: data.remarks,
    });
  }

  // ======================================================
  // UPDATE
  // ======================================================

  async updateDocument(
    id: string,
    data: UpdateDocumentInput
  ) {

    const existing =
      await studentDocumentRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(
        "Student document not found."
      );
    }

    const studentId =
      data.studentId ??
      existing.studentId;

    const documentType =
      data.documentType ??
      existing.documentType;

    const student =
      await studentDocumentRepository.findStudentById(
        studentId
      );

    if (!student) {
      throw new NotFoundError(
        "Student not found."
      );
    }

    const duplicate =
      await studentDocumentRepository.findByStudentAndDocumentTypeExceptId(
        id,
        studentId,
        documentType
      );

    if (duplicate) {
      throw new ConflictError(
        "This document already exists for the student."
      );
    }

    return studentDocumentRepository.update(
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

        documentType:
          data.documentType,

        documentNumber:
          data.documentNumber,

        fileName:
          data.fileName,

        fileUrl:
          data.fileUrl,

        issueDate:
          data.issueDate,

        expiryDate:
          data.expiryDate,

        verified:
          data.verified,

        remarks:
          data.remarks,
      }
    );
  }

  // ======================================================
  // DELETE
  // ======================================================

  async deleteDocument(id: string) {

    const existing =
      await studentDocumentRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(
        "Student document not found."
      );
    }

    return studentDocumentRepository.delete(id);
  }

}

export const studentDocumentService =
  new StudentDocumentService();