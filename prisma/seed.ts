

import {
  PrismaClient,
  RoleName,
  AdminType,
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