import {
  AcademicYearDTO,
  AcademicYearListResponse,
  AcademicYearQueryOptions,
  AcademicYearRepositoryCreateInput,
  AcademicYearRepositoryUpdateInput,
} from "../types/academic-year.types";

export interface AcademicYearRepository {
  create(
    data: AcademicYearRepositoryCreateInput
  ): Promise<AcademicYearDTO>;

  update(
    id: string,
    data: AcademicYearRepositoryUpdateInput
  ): Promise<AcademicYearDTO>;

  delete(id: string): Promise<void>;

  softDelete(id: string): Promise<void>;

  restore(id: string): Promise<AcademicYearDTO>;

  findById(id: string): Promise<AcademicYearDTO | null>;

  findByName(name: string): Promise<AcademicYearDTO | null>;

  findByCode(code: string): Promise<AcademicYearDTO | null>;

  findActive(): Promise<AcademicYearDTO | null>;

  findAll(
    options: AcademicYearQueryOptions
  ): Promise<AcademicYearListResponse>;

  search(
    query: string
  ): Promise<AcademicYearDTO[]>;

  archive(id: string): Promise<AcademicYearDTO>;

  activate(id: string): Promise<AcademicYearDTO>;

  count(): Promise<number>;
}