import { AcademicYearRepository } from "../repository/academic-year.repository";

import {
  AcademicYearDTO,
  AcademicYearListResponse,
  AcademicYearQueryOptions,
} from "../types/academic-year.types";
import {
  AcademicYearRepositoryCreateInput,
  AcademicYearRepositoryUpdateInput,
} from "../types/academic-year.types";

import {
  
  ACADEMIC_YEAR_STATUS,
} from "../constants/academic-year.constants";


import { ACADEMIC_YEAR_ERRORS } from "../constants/academic-year.constants";

export class AcademicYearService {
  constructor(
    private readonly repository: AcademicYearRepository
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                               Private Helpers                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Returns the academic year or throws if it does not exist.
   */
  private async getExistingAcademicYear(
    id: string
  ): Promise<AcademicYearDTO> {
    const academicYear = await this.repository.findById(id);

    if (!academicYear) {
      throw new Error(
        ACADEMIC_YEAR_ERRORS.NOT_FOUND
      );
    }

    return academicYear;
  }

  /**
   * Checks whether an academic year name already exists.
   */
  protected async isNameExists(
    name: string,
    excludeId?: string
  ): Promise<boolean> {
    const academicYear = await this.repository.findByName(name);

    if (!academicYear) {
      return false;
    }

    if (excludeId && academicYear.id === excludeId) {
      return false;
    }

    return true;
  }

  /**
   * Checks whether an academic year code already exists.
   */
  protected async isCodeExists(
    code: string,
    excludeId?: string
  ): Promise<boolean> {
    const academicYear = await this.repository.findByCode(code);

    if (!academicYear) {
      return false;
    }

    if (excludeId && academicYear.id === excludeId) {
      return false;
    }

    return true;
  }

  /* -------------------------------------------------------------------------- */
  /*                               Read Operations                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Get Academic Year by ID.
   */
  async getById(
    id: string
  ): Promise<AcademicYearDTO> {
    return this.getExistingAcademicYear(id);
  }

  /**
   * Get Active Academic Year.
   */
  async getActive(): Promise<AcademicYearDTO | null> {
    return this.repository.findActive();
  }

  /**
   * Get paginated Academic Years.
   */
  async getAll(
    options: AcademicYearQueryOptions
  ): Promise<AcademicYearListResponse> {
    return this.repository.findAll(options);
  }

  /**
   * Search Academic Years.
   */
  async search(
    query: string
  ): Promise<AcademicYearDTO[]> {
    const keyword = query.trim();

    if (!keyword) {
      return [];
    }

    return this.repository.search(keyword);
  }

  /**
   * Total Academic Years.
   */
  async count(): Promise<number> {
    return this.repository.count();
  }
  /* -------------------------------------------------------------------------- */
/*                              Validation Helpers                            */
/* -------------------------------------------------------------------------- */

private validateDateRange(
  startDate: Date,
  endDate: Date
): void {
  if (startDate >= endDate) {
    throw new Error(
      ACADEMIC_YEAR_ERRORS.INVALID_DATE_RANGE
    );
  }
}

private async getNextSortOrder(): Promise<number> {
  const result = await this.repository.findAll({
    page: 1,
    limit: 1,
    sortBy: "sortOrder",
    sortOrder: "desc",
  });

  if (result.data.length === 0) {
    return 1;
  }

  return (result.data[0].sortOrder ?? 0) + 1;
}

/* -------------------------------------------------------------------------- */
/*                                   Create                                   */
/* -------------------------------------------------------------------------- */

async create(
  data: AcademicYearRepositoryCreateInput
): Promise<AcademicYearDTO> {
  this.validateDateRange(
    data.startDate,
    data.endDate
  );

  if (await this.isNameExists(data.name)) {
    throw new Error(
      ACADEMIC_YEAR_ERRORS.DUPLICATE_NAME
    );
  }

  if (await this.isCodeExists(data.code)) {
    throw new Error(
      ACADEMIC_YEAR_ERRORS.DUPLICATE_CODE
    );
  }

  const academicYear = await this.repository.create({
    ...data,
    sortOrder:
      data.sortOrder ??
      (await this.getNextSortOrder()),
  });

  /*
   * If user creates an ACTIVE year,
   * Part 3 will deactivate/archive
   * the previous active year.
   */

  if (
    academicYear.status ===
    ACADEMIC_YEAR_STATUS.ACTIVE
  ) {
    return this.activate(academicYear.id);
  }

  return academicYear;
}

/* -------------------------------------------------------------------------- */
/*                                   Update                                   */
/* -------------------------------------------------------------------------- */

async update(
  id: string,
  data: AcademicYearRepositoryUpdateInput
): Promise<AcademicYearDTO> {
  const existing =
    await this.getExistingAcademicYear(id);

  const startDate =
    data.startDate ?? existing.startDate;

  const endDate =
    data.endDate ?? existing.endDate;

  this.validateDateRange(
    startDate,
    endDate
  );

  if (
    data.name &&
    (await this.isNameExists(
      data.name,
      id
    ))
  ) {
    throw new Error(
      ACADEMIC_YEAR_ERRORS.DUPLICATE_NAME
    );
  }

  if (
    data.code &&
    (await this.isCodeExists(
      data.code,
      id
    ))
  ) {
    throw new Error(
     ACADEMIC_YEAR_ERRORS.DUPLICATE_CODE
    );
  }

  const academicYear =
    await this.repository.update(
      id,
      data
    );

  /*
   * Activation logic
   * handled in Part 3.
   */

  if (
    data.status ===
    ACADEMIC_YEAR_STATUS.ACTIVE
  ) {
    return this.activate(id);
  }

  return academicYear;
}

/* -------------------------------------------------------------------------- */
/*                                  Activate                                  */
/* -------------------------------------------------------------------------- */

async activate(
  id: string
): Promise<AcademicYearDTO> {
  const academicYear =
    await this.getExistingAcademicYear(id);

  if (
    academicYear.status ===
    ACADEMIC_YEAR_STATUS.ACTIVE
  ) {
    return academicYear;
  }

  const currentActive =
    await this.repository.findActive();

  if (
    currentActive &&
    currentActive.id !== academicYear.id
  ) {
    await this.repository.archive(currentActive.id);
  }

  return this.repository.activate(id);
}

/* -------------------------------------------------------------------------- */
/*                                  Archive                                   */
/* -------------------------------------------------------------------------- */

async archive(
  id: string
): Promise<AcademicYearDTO> {
  const academicYear =
    await this.getExistingAcademicYear(id);

  if (
    academicYear.status !==
    ACADEMIC_YEAR_STATUS.ACTIVE
  ) {
    return this.repository.archive(id);
  }

  throw new Error(
ACADEMIC_YEAR_ERRORS.CANNOT_ARCHIVE_ACTIVE
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Restore                                   */
/* -------------------------------------------------------------------------- */

async restore(
  id: string
): Promise<AcademicYearDTO> {
  await this.getExistingAcademicYear(id);

  return this.repository.restore(id);
}

/* -------------------------------------------------------------------------- */
/*                                   Delete                                   */
/* -------------------------------------------------------------------------- */

async delete(
  id: string
): Promise<void> {
  const academicYear =
    await this.getExistingAcademicYear(id);

  if (
    academicYear.status ===
    ACADEMIC_YEAR_STATUS.ACTIVE
  ) {
    throw new Error(
      ACADEMIC_YEAR_ERRORS.CANNOT_DELETE_ACTIVE
    );
  }

  /*
   * Future validation:
   *
   * Check StudentEnrollment records.
   *
   * if (hasEnrollments)
   *    throw ACADEMIC_YEAR_HAS_ENROLLMENTS
   */

  await this.repository.softDelete(id);
}
  
}
