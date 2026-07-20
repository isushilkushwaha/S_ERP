import {
  DocumentType,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class StudentDocumentRepository {
  // ======================================================
  // LIST
  // ======================================================

  async findMany(params: {
    search?: string;
    studentId?: string;
    documentType?: DocumentType;
    verified?: boolean;
    skip?: number;
    take?: number;
  }) {
    const {
      search,
      studentId,
      documentType,
      verified,
      skip = 0,
      take = 10,
    } = params;

    return prisma.studentDocument.findMany({
      where: {
        ...(studentId && { studentId }),

        ...(documentType && { documentType }),

        ...(verified !== undefined && { verified }),

        ...(search && {
          OR: [
            {
              fileName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              documentNumber: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              student: {
                firstName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
            {
              student: {
                lastName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          ],
        }),
      },

      include: {
        student: true,
      },

      skip,
      take,

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ======================================================
  // COUNT
  // ======================================================

  async count(params: {
    search?: string;
    studentId?: string;
    documentType?: DocumentType;
    verified?: boolean;
  }) {
    const {
      search,
      studentId,
      documentType,
      verified,
    } = params;

    return prisma.studentDocument.count({
      where: {
        ...(studentId && { studentId }),

        ...(documentType && { documentType }),

        ...(verified !== undefined && { verified }),

        ...(search && {
          OR: [
            {
              fileName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              documentNumber: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              student: {
                firstName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
            {
              student: {
                lastName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          ],
        }),
      },
    });
  }

  // ======================================================
  // FIND ONE
  // ======================================================

  async findById(id: string) {
    return prisma.studentDocument.findUnique({
      where: {
        id,
      },

      include: {
        student: true,
      },
    });
  }

  // ======================================================
  // MASTER LOOKUP
  // ======================================================

  async findStudentById(studentId: string) {
    return prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });
  }

  // ======================================================
  // DUPLICATE CHECK
  // ======================================================

  async findByStudentAndDocumentType(
    studentId: string,
    documentType: DocumentType
  ) {
    return prisma.studentDocument.findFirst({
      where: {
        studentId,
        documentType,
      },
    });
  }

  async findByStudentAndDocumentTypeExceptId(
    id: string,
    studentId: string,
    documentType: DocumentType
  ) {
    return prisma.studentDocument.findFirst({
      where: {
        studentId,
        documentType,

        NOT: {
          id,
        },
      },
    });
  }

  // ======================================================
  // CREATE
  // ======================================================

  async create(
    data: Prisma.StudentDocumentCreateInput
  ) {
    return prisma.studentDocument.create({
      data,

      include: {
        student: true,
      },
    });
  }

  // ======================================================
  // UPDATE
  // ======================================================

  async update(
    id: string,
    data: Prisma.StudentDocumentUpdateInput
  ) {
    return prisma.studentDocument.update({
      where: {
        id,
      },

      data,

      include: {
        student: true,
      },
    });
  }

  // ======================================================
  // DELETE
  // ======================================================

  async delete(id: string) {
    return prisma.studentDocument.delete({
      where: {
        id,
      },
    });
  }
}

export const studentDocumentRepository =
  new StudentDocumentRepository();