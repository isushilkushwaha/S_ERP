import { Status } from "./class";

export interface Section {
  id: string;
  classId: string;
  name: string;
  displayOrder: number;
  capacity: number;
  status: Status;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionPayload {
  classId: string;
  name: string;
  displayOrder: number;
  capacity: number;
  status?: Status;
}

export interface UpdateSectionPayload {
  name?: string;
  displayOrder?: number;
  capacity?: number;
  status?: Status;
}