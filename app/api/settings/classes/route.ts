// import { NextResponse } from "next/server";
// import { PrismaClient, Status } from "@prisma/client";
// import { ClassService } from "@/features/settings/classes/services/class.service";
// import { createClassSchema } from "@/features/settings/classes/schema/create-class.schema";
// import { getRequestContext, handleApiError } from "@/lib/api-context";

// const prisma = new PrismaClient();
// const classService = new ClassService(prisma);

// /**
// //  * GET /api/settings/classes
// //  * Query Params: ?status=ACTIVE|INACTIVE
// //  */
// // export async function GET(req: Request) {
// //   try {
// //     const { tenantId } = getRequestContext(req);
// //     const { searchParams } = new URL(req.url);
// //     const statusParam = searchParams.get("status") as Status | null;

// //     const classes = await classService.getAllClasses(
// //       tenantId,
// //       statusParam && Object.values(Status).includes(statusParam) ? statusParam : undefined
// //     );

// //     return NextResponse.json({ success: true, data: classes }, { status: 200 });
// //   } catch (error) {
// //     return handleApiError(error);
// //   }
// // }


// /**
//  * GET /api/settings/classes
//  *
//  * Query Params:
//  * ?academicYearId=UUID
//  * ?status=ACTIVE|INACTIVE
//  */
// export async function GET(req: Request) {
//   try {
//     const { tenantId } = getRequestContext(req);
//     const { searchParams } = new URL(req.url);

//     const academicYearId =
//       searchParams.get("academicYearId");

//     const statusParam =
//       searchParams.get("status") as Status | null;

//     const status =
//       statusParam &&
//       Object.values(Status).includes(statusParam)
//         ? statusParam
//         : undefined;

//     const classes =
//       await classService.getAllClasses(
//         tenantId,
//         status,
//         academicYearId || undefined
//       );

//     return NextResponse.json(
//       {
//         success: true,
//         data: classes,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return handleApiError(error);
//   }
// }

// /**
//  * POST /api/settings/classes
//  */
// export async function POST(req: Request) {
//   try {
//     const { tenantId, userId } = getRequestContext(req);
//     const body = await req.json();

//     const validatedData = createClassSchema.parse(body);

//     const createdClass = await classService.createClass(tenantId, {
//       ...validatedData,
//       createdBy: userId,
//     });

//     return NextResponse.json({ success: true, data: createdClass }, { status: 201 });
//   } catch (error) {
//     return handleApiError(error);
//   }
// }

import { NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";

import { ClassService } from "@/features/settings/classes/services/class.service";
import { createClassSchema } from "@/features/settings/classes/schema/create-class.schema";
import {
  getRequestContext,
  handleApiError,
} from "@/lib/api-context";

const prisma = new PrismaClient();
const classService = new ClassService(prisma);

/**
 * GET /api/settings/classes
 *
 * Query Params:
 * ?academicYearId=UUID
 * ?status=ACTIVE|INACTIVE
 *
 * If academicYearId is provided:
 *   Return only classes assigned to that academic year.
 *
 * If academicYearId is not provided:
 *   Return master classes.
 */
export async function GET(req: Request) {
  try {
    const { tenantId } =
      getRequestContext(req);

    const { searchParams } =
      new URL(req.url);

    const academicYearId =
      searchParams.get(
        "academicYearId"
      );

    const statusParam =
      searchParams.get(
        "status"
      ) as Status | null;

    const status =
      statusParam &&
      Object.values(Status).includes(
        statusParam
      )
        ? statusParam
        : undefined;

    const classes =
      await classService.getAllClasses(
        tenantId,
        status,
        academicYearId || undefined
      );

    return NextResponse.json(
      {
        success: true,
        data: classes,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/settings/classes
 *
 * Creates:
 *
 * 1. Master Class
 * 2. AcademicYearClass assignment
 * 3. Default academic-year configuration
 *
 * academicYearId comes from the currently
 * selected academic year in the frontend.
 */
export async function POST(req: Request) {
  try {
    const {
      tenantId,
      userId,
    } = getRequestContext(req);

    const body = await req.json();

    const validatedData =
      createClassSchema.parse(body);

    if (!validatedData.academicYearId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Academic year is required when creating a class.",
        },
        {
          status: 400,
        }
      );
    }

    const createdClass =
      await classService.createClass(
        tenantId,
        {
          ...validatedData,
          academicYearId:
            validatedData.academicYearId,
          createdBy: userId,
        }
      );

    return NextResponse.json(
      {
        success: true,
        data: createdClass,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}