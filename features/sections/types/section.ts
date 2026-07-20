export interface SectionQuery {
  search?: string;
  classId?: string;
  page?: number;
  limit?: number;
}

export interface SectionListItem {
  id: string;
  name: string;

  classId: string;
  className: string;

  roomNumber: string | null;

  capacity: number | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface SectionPaginationResult {
  data: SectionListItem[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}