import { z } from "zod";

import { createDocumentSchema } from "./create-document.schema";

export const updateDocumentSchema =
  createDocumentSchema.partial();

export type UpdateDocumentInput =
  z.infer<typeof updateDocumentSchema>;