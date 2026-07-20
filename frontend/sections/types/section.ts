export interface Section {
  id: string;
  name: string;
  classId: string;

  createdAt: string;
  updatedAt: string;
}

export interface SectionQuery {
  classId?: string;
}

export interface SectionResponse {
  data: Section;
  message: string;
}

export interface SectionListResponse {
  data: Section[];
}