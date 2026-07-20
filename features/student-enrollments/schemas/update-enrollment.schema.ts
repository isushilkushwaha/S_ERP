// import { z } from "zod";

// import { createEnrollmentSchema } from "./create-enrollment.schema";

// export const updateEnrollmentSchema =
//   createEnrollmentSchema.partial();

// export type UpdateEnrollmentInput =
//   z.infer<typeof updateEnrollmentSchema>;

import { z } from "zod";

import {
  enrollmentSchemaBase,
} from "./create-enrollment.schema";

export const updateEnrollmentSchema =
  enrollmentSchemaBase
    .partial()
    .superRefine((data, ctx) => {
      if (
        data.joinedDate &&
        data.leftDate &&
        data.leftDate < data.joinedDate
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leftDate"],
          message:
            "Left date cannot be before joined date.",
        });
      }
    });

export type UpdateEnrollmentInput =
  z.infer<typeof updateEnrollmentSchema>;