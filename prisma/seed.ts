// import {
//   PrismaClient,
//   RoleName,
//   AdminType,
//   Status,
//   Medium,
//   AcademicYearStatus,
// } from "@prisma/client";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// async function main() {
//   console.log("🌱 Starting database seeding for Master Data...");

//   // ------------------------------------------------------------------
//   // 1. System Roles
//   // ------------------------------------------------------------------

//   const adminRole = await prisma.role.upsert({
//     where: { name: RoleName.ADMIN },
//     update: {},
//     create: { name: RoleName.ADMIN },
//   });

//   const teacherRole = await prisma.role.upsert({
//     where: { name: RoleName.TEACHER },
//     update: {},
//     create: { name: RoleName.TEACHER },
//   });

//   console.log("✅ Roles created");

//   // ------------------------------------------------------------------
//   // 2. Default System Admin & Teacher
//   // ------------------------------------------------------------------

//   const adminPassword = await bcrypt.hash(
//     process.env.DEFAULT_ADMIN_PASSWORD ?? "Admin@123",
//     12
//   );

//   const teacherPassword = await bcrypt.hash(
//     process.env.DEFAULT_TEACHER_PASSWORD ?? "Teacher@123",
//     12
//   );

//   const adminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@school.com";

//   const adminUser = await prisma.user.upsert({
//     where: { email: adminEmail },
//     update: {
//       fullName: "System Administrator",
//       username: process.env.DEFAULT_ADMIN_USERNAME ?? "admin",
//       passwordHash: adminPassword,
//       roleId: adminRole.id,
//       adminType: AdminType.PRIMARY,
//       isActive: true,
//     },
//     create: {
//       fullName: "System Administrator",
//       email: adminEmail,
//       username: process.env.DEFAULT_ADMIN_USERNAME ?? "admin",
//       passwordHash: adminPassword,
//       roleId: adminRole.id,
//       adminType: AdminType.PRIMARY,
//       isActive: true,
//     },
//   });

//   const teacherEmail = process.env.DEFAULT_TEACHER_EMAIL ?? "teacher@school.com";

//   await prisma.user.upsert({
//     where: { email: teacherEmail },
//     update: {
//       fullName: "Demo Teacher",
//       username: process.env.DEFAULT_TEACHER_USERNAME ?? "teacher",
//       passwordHash: teacherPassword,
//       roleId: teacherRole.id,
//       adminType: null,
//       isActive: true,
//     },
//     create: {
//       fullName: "Demo Teacher",
//       email: teacherEmail,
//       username: process.env.DEFAULT_TEACHER_USERNAME ?? "teacher",
//       passwordHash: teacherPassword,
//       roleId: teacherRole.id,
//       adminType: null,
//       isActive: true,
//     },
//   });

//   // Dynamic system admin user ID reference
//   const SYSTEM_ADMIN_ID = adminUser.id;

//   console.log(`✅ Primary Admin (ID: ${SYSTEM_ADMIN_ID}) & Demo Teacher ready`);

//   // ------------------------------------------------------------------
//   // 3. School Profile
//   // ------------------------------------------------------------------

//   const schoolCode = "DEMO-SCHOOL-01";
//   const existingSchool = await prisma.schoolProfile.findFirst({
//     where: { schoolCode, deletedAt: null },
//   });

//   if (!existingSchool) {
//     await prisma.schoolProfile.create({
//       data: {
//         schoolName: "Demo International School",
//         schoolCode,
//         admissionPrefix: "ADM",
//         addressLine1: "123 Education Way",
//         city: "Varanasi",
//         state: "Uttar Pradesh",
//         country: "India",
//         currency: "INR",
//         timezone: "Asia/Kolkata",
//         isActive: true,
//       },
//     });
//     console.log("✅ School Profile seeded");
//   } else {
//     await prisma.schoolProfile.update({
//       where: { id: existingSchool.id },
//       data: { admissionPrefix: "ADM" },
//     });
//     console.log("✅ School Profile updated with admissionPrefix = 'ADM'");
//   }

//   // ------------------------------------------------------------------
//   // 4. Academic Years & Counter Initialization
//   // ------------------------------------------------------------------

//   console.log("🌱 Seeding Academic Years...");

//   const academicYears = [
//     {
//       name: "2025-26",
//       code: "AY202526",
//       startDate: new Date("2025-04-01"),
//       endDate: new Date("2026-03-31"),
//       status: AcademicYearStatus.ACTIVE,
//       sortOrder: 1,
//       description: "Current Active Academic Session",
//     },
//     {
//       name: "2026-27",
//       code: "AY202627",
//       startDate: new Date("2026-04-01"),
//       endDate: new Date("2027-03-31"),
//       status: AcademicYearStatus.UPCOMING,
//       sortOrder: 2,
//       description: "Upcoming Academic Session",
//     },
//     {
//       name: "2027-28",
//       code: "AY202728",
//       startDate: new Date("2027-04-01"),
//       endDate: new Date("2028-03-31"),
//       status: AcademicYearStatus.UPCOMING,
//       sortOrder: 3,
//       description: "Future Academic Session",
//     },
//   ];

//   const seededAcademicYearIds: string[] = [];

//   for (const year of academicYears) {
//     const existingYear = await prisma.academicYear.findFirst({
//       where: { code: year.code, deletedAt: null },
//     });

//     let academicYearId: string;

//     if (existingYear) {
//       academicYearId = existingYear.id;
//       await prisma.academicYear.update({
//         where: { id: academicYearId },
//         data: {
//           name: year.name,
//           startDate: year.startDate,
//           endDate: year.endDate,
//           status: year.status,
//           sortOrder: year.sortOrder,
//           description: year.description,
//         },
//       });
//     } else {
//       const createdYear = await prisma.academicYear.create({
//         data: {
//           name: year.name,
//           code: year.code,
//           startDate: year.startDate,
//           endDate: year.endDate,
//           status: year.status,
//           sortOrder: year.sortOrder,
//           description: year.description,
//         },
//       });
//       academicYearId = createdYear.id;
//     }

//     seededAcademicYearIds.push(academicYearId);

//     // Initialize 1-to-1 AcademicYearCounter
//     await prisma.academicYearCounter.upsert({
//       where: { academicYearId },
//       update: {},
//       create: {
//         academicYearId,
//         lastAdmissionSequence: 0,
//       },
//     });

//     console.log(`  ✓ Academic Year ${year.name} (${year.status}) + Counter Initialized`);
//   }

//   console.log("✅ Academic Years & Counters seeded");

//   // ------------------------------------------------------------------
//   // 5. Classes, Configurations, Sections & Roll Number Counters
//   // ------------------------------------------------------------------

//   console.log("🌱 Seeding Classes, Sections & Roll Number Counters...");

//   const DEFAULT_TENANT_ID = "tenant-demo-001";
//   const DEFAULT_SECTION_CAPACITY = 40;

//   interface SeedClassDefinition {
//     name: string;
//     shortName: string;
//     code: string;
//     description: string;
//     medium: Medium;
//     sectionsEnabled: boolean;
//     sections: string[];
//   }

//   const SEED_CLASSES: SeedClassDefinition[] = [
//     {
//       name: "Nursery",
//       shortName: "NUR",
//       code: "NUR-ENG",
//       description: "Pre-primary Foundation Stage 1",
//       medium: Medium.ENGLISH,
//       sectionsEnabled: false,
//       sections: ["General"],
//     },
//     {
//       name: "LKG",
//       shortName: "LKG",
//       code: "LKG-ENG",
//       description: "Pre-primary Foundation Stage 2",
//       medium: Medium.ENGLISH,
//       sectionsEnabled: false,
//       sections: ["General"],
//     },
//     {
//       name: "UKG",
//       shortName: "UKG",
//       code: "UKG-ENG",
//       description: "Pre-primary Foundation Stage 3",
//       medium: Medium.ENGLISH,
//       sectionsEnabled: false,
//       sections: ["General"],
//     },
//     ...Array.from({ length: 12 }, (_, index) => {
//       const classNumber = index + 1;
//       return {
//         name: `Class ${classNumber}`,
//         shortName: `Std ${classNumber}`,
//         code: `CLS${classNumber}-ENG`,
//         description: `Primary/Secondary Grade ${classNumber}`,
//         medium: Medium.ENGLISH,
//         sectionsEnabled: true,
//         sections: ["A", "B"],
//       };
//     }),
//   ];

//   for (let i = 0; i < SEED_CLASSES.length; i++) {
//     const item = SEED_CLASSES[i];
//     const computedDisplayOrder = i + 1;

//     await prisma.$transaction(async (tx) => {
//       // 1. Find or create Class
//       const existingClass = await tx.class.findFirst({
//         where: { tenantId: DEFAULT_TENANT_ID, code: item.code, deletedAt: null },
//       });

//       let classId: string;

//       if (existingClass) {
//         classId = existingClass.id;
//         await tx.class.update({
//           where: { id: classId },
//           data: {
//             name: item.name,
//             shortName: item.shortName,
//             description: item.description,
//             medium: item.medium,
//             displayOrder: computedDisplayOrder,
//             updatedBy: SYSTEM_ADMIN_ID,
//           },
//         });
//       } else {
//         const newClass = await tx.class.create({
//           data: {
//             tenantId: DEFAULT_TENANT_ID,
//             name: item.name,
//             shortName: item.shortName,
//             code: item.code,
//             description: item.description,
//             medium: item.medium,
//             displayOrder: computedDisplayOrder,
//             status: Status.ACTIVE,
//             createdBy: SYSTEM_ADMIN_ID,
//             updatedBy: SYSTEM_ADMIN_ID,
//           },
//         });
//         classId = newClass.id;
//       }

//       // 2. Class Configuration
//       await tx.classConfiguration.upsert({
//         where: { classId },
//         create: {
//           classId,
//           sectionsEnabled: item.sectionsEnabled,
//           defaultSectionCapacity: DEFAULT_SECTION_CAPACITY,
//           autoAllocationEnabled: true,
//         },
//         update: {
//           sectionsEnabled: item.sectionsEnabled,
//           defaultSectionCapacity: DEFAULT_SECTION_CAPACITY,
//         },
//       });

//       // 3. Upsert Mandatory Sections & Seed RollNumberCounters
//       for (let sIndex = 0; sIndex < item.sections.length; sIndex++) {
//         const sectionName = item.sections[sIndex];
//         const sectionDisplayOrder = sIndex + 1;

//         const existingSection = await tx.section.findFirst({
//           where: { classId, name: sectionName, deletedAt: null },
//         });

//         let sectionId: string;

//         if (existingSection) {
//           sectionId = existingSection.id;
//           await tx.section.update({
//             where: { id: sectionId },
//             data: {
//               displayOrder: sectionDisplayOrder,
//               capacity: DEFAULT_SECTION_CAPACITY,
//               updatedBy: SYSTEM_ADMIN_ID,
//             },
//           });
//         } else {
//           const createdSection = await tx.section.create({
//             data: {
//               classId,
//               name: sectionName,
//               displayOrder: sectionDisplayOrder,
//               capacity: DEFAULT_SECTION_CAPACITY,
//               status: Status.ACTIVE,
//               createdBy: SYSTEM_ADMIN_ID,
//               updatedBy: SYSTEM_ADMIN_ID,
//             },
//           });
//           sectionId = createdSection.id;
//         }

//         // 4. Initialize RollNumberCounter for every Academic Year
//         for (const ayId of seededAcademicYearIds) {
//           await tx.rollNumberCounter.upsert({
//             where: {
//               unique_roll_counter_scope: {
//                 academicYearId: ayId,
//                 classId,
//                 sectionId,
//               },
//             },
//             update: {},
//             create: {
//               academicYearId: ayId,
//               classId,
//               sectionId,
//               lastRollNumber: 0,
//             },
//           });
//         }
//       }
//     });

//     console.log(`  ✓ ${item.name} seeded with Sections [${item.sections.join(", ")}] + Roll Counters`);
//   }

//   // ------------------------------------------------------------------
//   // 6. Fee Components
//   // ------------------------------------------------------------------

//   console.log("🌱 Seeding Fee Components...");

//   const feeComponents = [
//     { name: "Admission Fee", code: "ADMISSION", displayOrder: 1, isRequired: true },
//     { name: "Tuition Fee", code: "TUITION", displayOrder: 2, isRequired: true },
//     { name: "Examination Fee", code: "EXAMINATION", displayOrder: 3, isRequired: true },
//     { name: "Development Fee", code: "DEVELOPMENT", displayOrder: 4, isRequired: true },
//     { name: "Computer Fee", code: "COMPUTER", displayOrder: 5, isRequired: false },
//     { name: "Sports Fee", code: "SPORTS", displayOrder: 6, isRequired: false },
//     { name: "Library Fee", code: "LIBRARY", displayOrder: 7, isRequired: false },
//     { name: "Transport Fee", code: "TRANSPORT", displayOrder: 8, isRequired: false },
//   ];

//   for (const component of feeComponents) {
//     const existing = await prisma.feeComponent.findFirst({
//       where: {
//         tenantId: DEFAULT_TENANT_ID,
//         code: component.code,
//         deletedAt: null,
//       },
//     });

//     if (existing) {
//       await prisma.feeComponent.update({
//         where: { id: existing.id },
//         data: { ...component },
//       });
//     } else {
//       await prisma.feeComponent.create({
//         data: {
//           tenantId: DEFAULT_TENANT_ID,
//           ...component,
//         },
//       });
//     }
//   }

//   console.log("✅ Fee Components seeded");
//   console.log("🎉 Database seeding completed successfully.");
// }

// main()
//   .catch((error) => {
//     console.error("❌ Database seeding failed.");
//     console.error(error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import {
  PrismaClient,
  RoleName,
  AdminType,
  AcademicYearStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // ============================================================
  // 1. SYSTEM ROLES
  // ============================================================

  const adminRole = await prisma.role.upsert({
    where: {
      name: RoleName.ADMIN,
    },
    update: {},
    create: {
      name: RoleName.ADMIN,
    },
  });

  const teacherRole = await prisma.role.upsert({
    where: {
      name: RoleName.TEACHER,
    },
    update: {},
    create: {
      name: RoleName.TEACHER,
    },
  });

  console.log("✅ Roles created");

  // ============================================================
  // 2. DEFAULT ADMIN & TEACHER
  // ============================================================

  const adminPassword = await bcrypt.hash(
    process.env.DEFAULT_ADMIN_PASSWORD ?? "Admin@123",
    12
  );

  const teacherPassword = await bcrypt.hash(
    process.env.DEFAULT_TEACHER_PASSWORD ?? "Teacher@123",
    12
  );

  const adminEmail =
    process.env.DEFAULT_ADMIN_EMAIL ?? "admin@school.com";

  const teacherEmail =
    process.env.DEFAULT_TEACHER_EMAIL ?? "teacher@school.com";

  const adminUser = await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      fullName: "System Administrator",
      username:
        process.env.DEFAULT_ADMIN_USERNAME ?? "admin",
      passwordHash: adminPassword,
      roleId: adminRole.id,
      adminType: AdminType.PRIMARY,
      isActive: true,
    },
    create: {
      fullName: "System Administrator",
      email: adminEmail,
      username:
        process.env.DEFAULT_ADMIN_USERNAME ?? "admin",
      passwordHash: adminPassword,
      roleId: adminRole.id,
      adminType: AdminType.PRIMARY,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: {
      email: teacherEmail,
    },
    update: {
      fullName: "Demo Teacher",
      username:
        process.env.DEFAULT_TEACHER_USERNAME ?? "teacher",
      passwordHash: teacherPassword,
      roleId: teacherRole.id,
      adminType: null,
      isActive: true,
    },
    create: {
      fullName: "Demo Teacher",
      email: teacherEmail,
      username:
        process.env.DEFAULT_TEACHER_USERNAME ?? "teacher",
      passwordHash: teacherPassword,
      roleId: teacherRole.id,
      adminType: null,
      isActive: true,
    },
  });

  const SYSTEM_ADMIN_ID = adminUser.id;

  console.log(
    `✅ Primary Admin (ID: ${SYSTEM_ADMIN_ID}) & Demo Teacher ready`
  );

  // ============================================================
  // 3. SCHOOL PROFILE
  // ============================================================

  const schoolCode = "DEMO-SCHOOL-01";

  const existingSchool =
    await prisma.schoolProfile.findFirst({
      where: {
        schoolCode,
        deletedAt: null,
      },
    });

  if (!existingSchool) {
    await prisma.schoolProfile.create({
      data: {
        schoolName: "Demo International School",
        schoolCode,
        admissionPrefix: "ADM",
        addressLine1: "123 Education Way",
        city: "Varanasi",
        state: "Uttar Pradesh",
        country: "India",
        currency: "INR",
        timezone: "Asia/Kolkata",
        isActive: true,
      },
    });

    console.log("✅ School Profile seeded");
  } else {
    await prisma.schoolProfile.update({
      where: {
        id: existingSchool.id,
      },
      data: {
        admissionPrefix: "ADM",
      },
    });

    console.log(
      "✅ School Profile updated with admissionPrefix = 'ADM'"
    );
  }

  // ============================================================
  // 4. ACADEMIC YEARS
  // ============================================================

  console.log("🌱 Seeding Academic Years...");

  const academicYears = [
    {
      name: "2025-26",
      code: "AY202526",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2026-03-31"),
      status: AcademicYearStatus.ARCHIVED,
      sortOrder: 1,
      description: "Previous Academic Session",
    },
    {
      name: "2026-27",
      code: "AY202627",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2027-03-31"),
      status: AcademicYearStatus.ACTIVE,
      sortOrder: 2,
      description: "Current Active Academic Session",
    },
    {
      name: "2027-28",
      code: "AY202728",
      startDate: new Date("2027-04-01"),
      endDate: new Date("2028-03-31"),
      status: AcademicYearStatus.UPCOMING,
      sortOrder: 3,
      description: "Future Academic Session",
    },
  ];

  for (const year of academicYears) {
    const existingYear =
      await prisma.academicYear.findFirst({
        where: {
          code: year.code,
          deletedAt: null,
        },
      });

    let academicYearId: string;

    if (existingYear) {
      academicYearId = existingYear.id;

      await prisma.academicYear.update({
        where: {
          id: academicYearId,
        },
        data: {
          name: year.name,
          startDate: year.startDate,
          endDate: year.endDate,
          status: year.status,
          sortOrder: year.sortOrder,
          description: year.description,
        },
      });
    } else {
      const createdYear =
        await prisma.academicYear.create({
          data: {
            name: year.name,
            code: year.code,
            startDate: year.startDate,
            endDate: year.endDate,
            status: year.status,
            sortOrder: year.sortOrder,
            description: year.description,
          },
        });

      academicYearId = createdYear.id;
    }

    // Initialize academic-year admission counter.
    await prisma.academicYearCounter.upsert({
      where: {
        academicYearId,
      },
      update: {},
      create: {
        academicYearId,
        lastAdmissionSequence: 0,
      },
    });

    console.log(
      `  ✓ Academic Year ${year.name} (${year.status}) + Counter Initialized`
    );
  }

  console.log(
    "✅ Academic Years & Counters seeded"
  );

  // ============================================================
  // 5. FEE COMPONENTS
  // ============================================================

  console.log("🌱 Seeding Fee Components...");

const DEFAULT_TENANT_ID =
  "00000000-0000-0000-0000-000000000000";

  const feeComponents = [
    {
      name: "Admission Fee",
      code: "ADMISSION",
      displayOrder: 1,
      isRequired: true,
    },
    {
      name: "Tuition Fee",
      code: "TUITION",
      displayOrder: 2,
      isRequired: true,
    },
    {
      name: "Examination Fee",
      code: "EXAMINATION",
      displayOrder: 3,
      isRequired: true,
    },
    {
      name: "Development Fee",
      code: "DEVELOPMENT",
      displayOrder: 4,
      isRequired: true,
    },
    {
      name: "Computer Fee",
      code: "COMPUTER",
      displayOrder: 5,
      isRequired: false,
    },
    {
      name: "Sports Fee",
      code: "SPORTS",
      displayOrder: 6,
      isRequired: false,
    },
    {
      name: "Library Fee",
      code: "LIBRARY",
      displayOrder: 7,
      isRequired: false,
    },
    {
      name: "Transport Fee",
      code: "TRANSPORT",
      displayOrder: 8,
      isRequired: false,
    },
  ];

  for (const component of feeComponents) {
    const existing =
      await prisma.feeComponent.findFirst({
        where: {
          tenantId: DEFAULT_TENANT_ID,
          code: component.code,
          deletedAt: null,
        },
      });

    if (existing) {
      await prisma.feeComponent.update({
        where: {
          id: existing.id,
        },
        data: {
          name: component.name,
          code: component.code,
          displayOrder: component.displayOrder,
          isRequired: component.isRequired,
        },
      });
    } else {
      await prisma.feeComponent.create({
        data: {
          tenantId: DEFAULT_TENANT_ID,
          name: component.name,
          code: component.code,
          displayOrder: component.displayOrder,
          isRequired: component.isRequired,
        },
      });
    }
  }

  console.log("✅ Fee Components seeded");

  // ============================================================
  // IMPORTANT:
  //
  // NO MASTER CLASSES ARE CREATED HERE.
  //
  // NO AcademicYearClass RECORDS ARE CREATED HERE.
  //
  // NO AcademicYearClassSection RECORDS ARE CREATED HERE.
  //
  // Classes and sections will be assigned from:
  //
  // Settings → Classes & Sections
  //
  // The selected academic year controls the assignment.
  // ============================================================

  console.log(
    "ℹ️ No classes or sections were pre-assigned."
  );

  console.log(
    "🎉 Database seeding completed successfully."
  );
}

main()
  .catch((error) => {
    console.error(
      "❌ Database seeding failed."
    );
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });