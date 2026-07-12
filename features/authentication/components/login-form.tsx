// "use client";

// import { useState } from "react";
// import { Eye, EyeOff, Loader2 } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   loginSchema,
//   type LoginSchema,
// } from "@/features/authentication/schemas/login-schema";

// export function LoginForm() {
//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginSchema>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       login: "",
//       password: "",
//     },
//   });

//   async function onSubmit(data: LoginSchema) {
//     console.log(data);

//     // Next step:
//     // await login(data)
//   }

//   return (
//     <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow">
//       <h1 className="mb-2 text-3xl font-bold">
//         School ERP
//       </h1>

//       <p className="mb-6 text-sm text-gray-500">
//         Login to continue
//       </p>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="space-y-5"
//       >
//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Email or Username
//           </label>

//           <input
//             {...register("login")}
//             className="w-full rounded-md border px-3 py-2"
//             placeholder="admin@school.com"
//           />

//           {errors.login && (
//             <p className="mt-1 text-sm text-red-500">
//               {errors.login.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Password
//           </label>

//           <div className="relative">
//             <input
//               {...register("password")}
//               type={showPassword ? "text" : "password"}
//               className="w-full rounded-md border px-3 py-2 pr-10"
//               placeholder="••••••••"
//             />

//             <button
//               type="button"
//               onClick={() =>
//                 setShowPassword(!showPassword)
//               }
//               className="absolute right-3 top-3"
//             >
//               {showPassword ? (
//                 <EyeOff size={18} />
//               ) : (
//                 <Eye size={18} />
//               )}
//             </button>
//           </div>

//           {errors.password && (
//             <p className="mt-1 text-sm text-red-500">
//               {errors.password.message}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="flex w-full items-center justify-center rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
//         >
//           {isSubmitting ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Signing in...
//             </>
//           ) : (
//             "Sign In"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; // Imported sonner

import { login } from "@/features/authentication/actions/login"; // Imported action
import {
  loginSchema,
  type LoginSchema,
} from "@/features/authentication/schemas/login-schema";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  // Updated onSubmit handler
  async function onSubmit(data: LoginSchema) {
    const result = await login(data);

    if (!result.success) {
      toast.error(result.message || "Invalid credentials");
    } else {
      toast.success("Login successful!");
      // Optionally redirect or perform post-login logic here
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow">
      <h1 className="mb-2 text-3xl font-bold">School ERP</h1>

      <p className="mb-6 text-sm text-gray-500">Login to continue</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Email or Username
          </label>

          <input
            {...register("login")}
            className="w-full rounded-md border px-3 py-2"
            placeholder="admin@school.com"
          />

          {errors.login && (
            <p className="mt-1 text-sm text-red-500">{errors.login.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="w-full rounded-md border px-3 py-2 pr-10"
              placeholder="••••••••"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}