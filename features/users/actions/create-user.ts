"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { UserGuard } from "@/lib/guards/user-guard";

import { prisma } from "@/lib/prisma";
import { createUserSchema } from "../schemas/user-schema";

export async function createUser(values: unknown) {
  const validated = createUserSchema.safeParse(values);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const data = validated.data;

  if (data.role === "ADMIN") {
  const allowed = await UserGuard.canCreateAdmin();

  if (!allowed) {
    return {
      success: false,
      message: "Only two administrator accounts are allowed.",
    };
  }
}

  const emailExists = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (emailExists) {
    return {
      success: false,
      message: "Email already exists.",
    };
  }

  const usernameExists = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (usernameExists) {
    return {
      success: false,
      message: "Username already exists.",
    };
  }

  const role = await prisma.role.findUnique({
    where: {
      name: data.role,
    },
  });

  if (!role) {
    return {
      success: false,
      message: "Invalid role.",
    };
  }

  const passwordHash = await bcrypt.hash(
    data.password,
    12
  );

  // await prisma.user.create({
  //   data: {
  //     fullName: data.fullName,
  //     email: data.email,
  //     username: data.username,
  //     passwordHash,
  //     roleId: role.id,
  //     isActive: data.isActive,
  //   },
  // });

  let adminType = null;

if (data.role === "ADMIN") {
  adminType = await UserGuard.getNextAdminType();

  if (!adminType) {
    return {
      success: false,
      message: "Maximum administrator accounts reached.",
    };
  }
}

await prisma.user.create({
  data: {
    fullName: data.fullName,
    email: data.email,
    username: data.username,
    passwordHash,
    roleId: role.id,
    adminType,
    isActive: data.isActive,
  },
});

  revalidatePath("/users");

  return {
    success: true,
    message: "User created successfully.",
  };
}




// "use server";

// import bcrypt from "bcrypt";
// import { revalidatePath } from "next/cache";

// import { prisma } from "@/lib/prisma";
// import { UserGuard } from "@/lib/guards/user-guard";

// import { createUserSchema } from "../schemas/user-schema";

// export async function createUser(values: unknown) {
//   try {
//     console.log("=================================");
//     console.log("🚀 CREATE USER START");
//     console.log("=================================");

//     console.log("Incoming Values:", values);

//     // ----------------------------------------
//     // Validate
//     // ----------------------------------------

//     const validated = createUserSchema.safeParse(values);

//     if (!validated.success) {
//       console.log("❌ Validation Failed");
//       console.log(validated.error.flatten());

//       return {
//         success: false,
//         message: "Validation failed.",
//         errors: validated.error.flatten().fieldErrors,
//       };
//     }

//     console.log("✅ Validation Passed");

//     const data = validated.data;

//     console.log("Parsed Data:", data);

//     // ----------------------------------------
//     // Admin Limit
//     // ----------------------------------------

//     if (data.role === "ADMIN") {
//       console.log("Checking admin limit...");

//       const allowed =
//         await UserGuard.canCreateAdmin();

//       console.log("Admin Allowed:", allowed);

//       if (!allowed) {
//         console.log("❌ Maximum Admin Reached");

//         return {
//           success: false,
//           message:
//             "Only two administrator accounts are allowed.",
//         };
//       }
//     }

//     // ----------------------------------------
//     // Email
//     // ----------------------------------------

//     console.log("Checking email...");

//     const emailExists =
//       await prisma.user.findUnique({
//         where: {
//           email: data.email,
//         },
//       });

//     console.log("Email Exists:", !!emailExists);

//     if (emailExists) {
//       return {
//         success: false,
//         message: "Email already exists.",
//       };
//     }

//     // ----------------------------------------
//     // Username
//     // ----------------------------------------

//     console.log("Checking username...");

//     const usernameExists =
//       await prisma.user.findUnique({
//         where: {
//           username: data.username,
//         },
//       });

//     console.log(
//       "Username Exists:",
//       !!usernameExists
//     );

//     if (usernameExists) {
//       return {
//         success: false,
//         message: "Username already exists.",
//       };
//     }

//     // ----------------------------------------
//     // Role
//     // ----------------------------------------

//     console.log("Finding role...");

//     const role =
//       await prisma.role.findUnique({
//         where: {
//           name: data.role,
//         },
//       });

//     console.log("Role:", role);

//     if (!role) {
//       return {
//         success: false,
//         message: "Invalid role.",
//       };
//     }

//     // ----------------------------------------
//     // Password
//     // ----------------------------------------

//     console.log("Hashing password...");

//     const passwordHash =
//       await bcrypt.hash(data.password, 12);

//     console.log("Password hashed");

//     // ----------------------------------------
//     // Admin Type
//     // ----------------------------------------

//     let adminType = null;

//     if (data.role === "ADMIN") {
//       console.log("Getting admin type...");

//       adminType =
//         await UserGuard.getNextAdminType();

//       console.log(
//         "Admin Type:",
//         adminType
//       );

//       if (!adminType) {
//         console.log(
//           "❌ getNextAdminType() returned null"
//         );

//         return {
//           success: false,
//           message:
//             "Maximum administrator accounts reached.",
//         };
//       }
//     }

//     console.log("About to create user...");

//     console.log({
//       fullName: data.fullName,
//       email: data.email,
//       username: data.username,
//       roleId: role.id,
//       adminType,
//       isActive: data.isActive,
//     });

//     // ----------------------------------------
//     // Create User
//     // ----------------------------------------

//     const user = await prisma.user.create({
//       data: {
//         fullName: data.fullName,
//         email: data.email,
//         username: data.username,
//         passwordHash,
//         roleId: role.id,
//         adminType,
//         isActive: data.isActive,
//       },
//     });

//     console.log("✅ User Created");
//     console.log(user);

//     revalidatePath("/users");

//     console.log("=================================");
//     console.log("🎉 CREATE USER SUCCESS");
//     console.log("=================================");

//     return {
//       success: true,
//       message: "User created successfully.",
//     };
//   } catch (error) {
//     console.error("=================================");
//     console.error("❌ CREATE USER ERROR");
//     console.error(error);
//     console.error("=================================");

//     return {
//       success: false,
//       message: "Internal Server Error",
//     };
//   }
// }