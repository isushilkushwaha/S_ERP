import { NotFoundError } from "@/lib/errors/not-found-error";

import { classRepository } from "../repositories/class.repository";
import { ClassQuery } from "../types/class";

export class ClassService {
  async getClasses(query: ClassQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      classRepository.findMany({
        search: query.search,
        skip,
        take: limit,
      }),

      classRepository.count({
        search: query.search,
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

  async getClass(id: string) {
    const classData =
      await classRepository.findById(id);

    if (!classData) {
      throw new NotFoundError(
        "Class not found."
      );
    }

    return classData;
  }
}

export const classService =
  new ClassService();