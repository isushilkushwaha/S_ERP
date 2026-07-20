import { Medium } from "@prisma/client";

export interface ClassQuery {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ClassListItem {
  id: string;
  name: string;
  displayOrder: number;
  medium: Medium;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassPaginationResult {
  data: ClassListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}