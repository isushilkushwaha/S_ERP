import { ClassConfiguration } from "./configuration";
import { Section } from "./section";

export type Medium = "ENGLISH" | "HINDI" | "BOTH";
export type Status = "ACTIVE" | "INACTIVE";

export interface Class {
  id: string;
  tenantId: string;
  name: string;
  shortName?: string | null;
  code: string;
  description?: string | null;
  medium: Medium;
  displayOrder: number;
  status: Status;
  version: number;
  createdAt: string;
  updatedAt: string;
  configuration?: ClassConfiguration | null;
  sections?: Section[];
}

export interface CreateClassPayload {
  name: string;
  shortName?: string;
  code: string;
  description?: string;
  medium?: Medium;
  displayOrder: number;
  status?: Status;
  defaultConfig?: {
    sectionsEnabled?: boolean;
    defaultSectionCapacity?: number;
    maxStudentsWithoutSection?: number;
  };
}

export interface UpdateClassPayload {
  name?: string;
  shortName?: string;
  code?: string;
  description?: string;
  medium?: Medium;
  displayOrder?: number;
  status?: Status;
}