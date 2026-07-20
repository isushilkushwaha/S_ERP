import { NotFoundError } from "@/lib/errors/not-found-error";

import { academicYearRepository } from "../repositories/academic-year.repository";
import { AcademicYearQuery } from "../types/academic-year";

export class AcademicYearService {
  async getAcademicYears(
    query: AcademicYearQuery
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      academicYearRepository.findMany({
        search: query.search,
        status: query.status,
        skip,
        take: limit,
      }),

      academicYearRepository.count({
        search: query.search,
        status: query.status,
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

  async getAcademicYear(id: string) {
    const academicYear =
      await academicYearRepository.findById(id);

    if (!academicYear) {
      throw new NotFoundError(
        "Academic year not found."
      );
    }

    return academicYear;
  }

  async getCurrentAcademicYear() {
    const academicYear =
      await academicYearRepository.findCurrent();

    if (!academicYear) {
      throw new NotFoundError(
        "Current academic year not found."
      );
    }

    return academicYear;
  }
}

export const academicYearService =
  new AcademicYearService();