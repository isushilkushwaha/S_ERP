export interface ClassConfiguration {
  id: string;
  classId: string;
  sectionsEnabled: boolean;
  defaultSectionCapacity?: number | null;
  maxStudentsWithoutSection?: number | null;
  autoAllocationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateConfigurationPayload {
  classId: string;
  sectionsEnabled: boolean;
  defaultSectionCapacity?: number | null;
  maxStudentsWithoutSection?: number | null;
  autoAllocationEnabled?: boolean;
}