import { DocumentType } from "@prisma/client";

export interface StudentDocumentQuery {
  search?: string;

  studentId?: string;

  documentType?: DocumentType;

  verified?: boolean;

  page?: number;

  limit?: number;
}

export interface StudentDocumentListItem {
  id: string;

  studentId: string;

  studentName: string;

  documentType: DocumentType;

  documentNumber: string | null;

  fileName: string;

  fileUrl: string;

  issueDate: Date | null;

  expiryDate: Date | null;

  verified: boolean;

  remarks: string | null;

  createdAt: Date;
}

export interface StudentDocumentDetails {
  id: string;

  studentId: string;

  documentType: DocumentType;

  documentNumber: string | null;

  fileName: string;

  fileUrl: string;

  issueDate: Date | null;

  expiryDate: Date | null;

  verified: boolean;

  remarks: string | null;

  createdAt: Date;

  updatedAt: Date;
}

export interface StudentDocumentPaginationResult {
  data: StudentDocumentListItem[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}