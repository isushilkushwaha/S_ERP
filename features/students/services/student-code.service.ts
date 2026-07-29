import { prisma } from "@/lib/prisma";

const STUDENT_CODE_PREFIX = "STD";
const STUDENT_CODE_LENGTH = 6;

export class StudentCodeService {
  async getNextStudentCode(): Promise<string> {
    // Get the latest student by studentCode
    const lastStudent = await prisma.student.findFirst({
  orderBy: {
    createdAt: "desc",
  },
  select: {
    studentCode: true,
  },
});

    // If no students exist, start from STD000001
    if (!lastStudent) {
      return `${STUDENT_CODE_PREFIX}${"1".padStart(
        STUDENT_CODE_LENGTH,
        "0"
      )}`;
    }

    // Extract numeric part
    const lastNumber = Number(
      lastStudent.studentCode.replace(STUDENT_CODE_PREFIX, "")
    );

    // Increment
    const nextNumber = lastNumber + 1;

    // Format as STD000001
    return `${STUDENT_CODE_PREFIX}${String(nextNumber).padStart(
      STUDENT_CODE_LENGTH,
      "0"
    )}`;
  }
}

export const studentCodeService = new StudentCodeService();