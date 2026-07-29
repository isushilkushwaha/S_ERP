import { randomUUID } from "node:crypto";

import { PrismaClient } from "@prisma/client";

import { storageProvider } from "./storage";
import { id } from "date-fns/locale";

const prisma = new PrismaClient();

export class StudentPhotoService {
  async uploadPhoto(
    id: string,
    buffer: Buffer,
    mimeType: string
  ) {
    // 1. Find student
    const student = await prisma.student.findUnique({
      where: {
        id: id,
      },
    });

    if (!student) {
      throw new Error("Student not found.");
    }

    // 2. Delete old photo
    if (student.photo) {
      await storageProvider.delete(student.photo);
    }

    // 3. Generate unique filename
    const fileName = student.studentCode;

    // 4. Upload new photo
    const photoUrl = await storageProvider.upload(
  buffer,
  fileName,
  mimeType
);


    // 5. Update database
    const updatedStudent = await prisma.student.update({
      where: {
        id: id,
      },
      data: {
        photo: photoUrl,
      },
    });

    return updatedStudent;
  }
}

export const studentPhotoService =
  new StudentPhotoService();