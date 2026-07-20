

import {
  PrismaClient,
  RoleName,
  AdminType,
  AcademicYearStatus,
  Medium,
  
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // ------------------------------------------------------------------
  // Create Roles
  // ------------------------------------------------------------------

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

  // ------------------------------------------------------------------
  // Hash Passwords
  // ------------------------------------------------------------------

  const adminPassword = await bcrypt.hash(
    process.env.DEFAULT_ADMIN_PASSWORD ?? "Admin@123",
    12
  );

  const teacherPassword = await bcrypt.hash(
    process.env.DEFAULT_TEACHER_PASSWORD ?? "Teacher@123",
    12
  );

  // ------------------------------------------------------------------
  // Default Primary Admin
  // ------------------------------------------------------------------

  const adminEmail =
    process.env.DEFAULT_ADMIN_EMAIL ?? "admin@school.com";

  await prisma.user.upsert({
    where: {
      email: adminEmail,
    },

    update: {
      fullName: "System Administrator",
      username:
        process.env.DEFAULT_ADMIN_USERNAME ?? "admin",
      passwordHash: adminPassword,
      roleId: adminRole.id,

      // Always keep this account PRIMARY
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

  console.log("✅ Primary Admin ready");

  // ------------------------------------------------------------------
  // Default Teacher
  // ------------------------------------------------------------------

  const teacherEmail =
    process.env.DEFAULT_TEACHER_EMAIL ??
    "teacher@school.com";

  await prisma.user.upsert({
    where: {
      email: teacherEmail,
    },

    update: {
      fullName: "Demo Teacher",
      username:
        process.env.DEFAULT_TEACHER_USERNAME ??
        "teacher",
      passwordHash: teacherPassword,
      roleId: teacherRole.id,

      adminType: null,

      isActive: true,
    },

    create: {
      fullName: "Demo Teacher",
      email: teacherEmail,
      username:
        process.env.DEFAULT_TEACHER_USERNAME ??
        "teacher",
      passwordHash: teacherPassword,
      roleId: teacherRole.id,

      adminType: null,

      isActive: true,
    },
  });


  console.log("✅ Demo Teacher ready");


  // ------------------------------------------------------------------
// Academic Years
// ------------------------------------------------------------------

const academicYears = [
  {
    name: "2025-26",
    code: "2025-26",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2026-03-31"),
    isCurrent: false,
  },
  {
    name: "2026-27",
    code: "2026-27",
    startDate: new Date("2026-04-01"),
    endDate: new Date("2027-03-31"),
    isCurrent: true,
  },
  {
    name: "2027-28",
    code: "2027-28",
    startDate: new Date("2027-04-01"),
    endDate: new Date("2028-03-31"),
    isCurrent: false,
  },
];

for (const year of academicYears) {
  await prisma.academicYear.upsert({
    where: {
      name: year.name,
    },
    update: year,
    create: {
      ...year,
      status: AcademicYearStatus.ACTIVE,
    },
  });
}

console.log("✅ Academic Years seeded");

// ------------------------------------------------------------------
// Classes
// ------------------------------------------------------------------

const classes = [
  "Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

for (const [index, className] of classes.entries()) {
  await prisma.class.upsert({
    where: {
      name: className,
    },
    update: {},

    create: {
      name: className,
      numericOrder: index + 1,
      medium: Medium.ENGLISH,
    },
  });
}

console.log("✅ Classes seeded");

// ------------------------------------------------------------------
// Sections
// ------------------------------------------------------------------

const allClasses = await prisma.class.findMany();

for (const schoolClass of allClasses) {
  for (const sectionName of ["A", "B"]) {
    await prisma.section.upsert({
      where: {
        classId_name: {
          classId: schoolClass.id,
          name: sectionName,
        },
      },

      update: {},

      create: {
        classId: schoolClass.id,
        name: sectionName,
        capacity: 40,
      },
    });
  }
}

console.log("✅ Sections seeded");



  console.log("🎉 Database seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Database seeding failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });