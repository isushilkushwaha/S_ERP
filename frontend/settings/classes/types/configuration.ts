export interface ClassConfiguration {
  id: string;

  academicYearId: string;
  classId: string;

  sectionsEnabled: boolean;

  defaultSectionCapacity?:
    | number
    | null;

  maxStudentsWithoutSection?:
    | number
    | null;

  autoAllocationEnabled: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateConfigurationPayload {
  academicYearId: string;
  classId: string;

  sectionsEnabled: boolean;

  defaultSectionCapacity?:
    | number
    | null;

  maxStudentsWithoutSection?:
    | number
    | null;

  autoAllocationEnabled?: boolean;
}