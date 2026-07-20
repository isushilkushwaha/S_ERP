import { NotFoundError } from "@/lib/errors/not-found-error";

import { sectionRepository } from "../repositories/section.repository";
import { SectionQuery } from "../types/section";

export class SectionService {
  async getSections(query: SectionQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      sectionRepository.findMany({
        search: query.search,
        classId: query.classId,
        skip,
        take: limit,
      }),

      sectionRepository.count({
        search: query.search,
        classId: query.classId,
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

  async getSection(id: string) {
    const section =
      await sectionRepository.findById(id);

    if (!section) {
      throw new NotFoundError(
        "Section not found."
      );
    }

    return section;
  }
}

export const sectionService =
  new SectionService();