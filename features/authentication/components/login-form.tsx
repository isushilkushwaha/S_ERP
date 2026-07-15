

"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { login } from "@/features/authentication/actions/login";
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

  async function onSubmit(data: LoginSchema) {
    const result = await login(data);
    if (!result.success) {
      toast.error(result.message || "Invalid credentials");
    } else {
      toast.success("Login successful!");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Branding Panel */}
          <div className="hidden lg:flex flex-col space-y-6">
            <div className="flex items-center gap-2 text-slate-900">
              
              
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
               School Management System
            </h1>
            
            {/* Abstract Placeholder Illustration */}
            <div className="h-64 bg-slate-200/50 rounded-2xl flex items-center justify-center border border-slate-200">
              <div className="grid grid-cols-2 gap-4 opacity-20">
                <div className="w-20 h-20 bg-slate-900 rounded-lg" />
                <div className="w-20 h-20 bg-slate-900 rounded-full" />
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
              <p className="text-slate-500 mt-1">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email or Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    {...register("login")}
                    className="w-full rounded-xl border border-zinc-200 pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                    placeholder="admin@school.edu"
                  />
                </div>
                {errors.login && <p className="text-xs text-red-600">{errors.login.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-xl border border-zinc-200 pl-10 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" className="rounded border-zinc-300 text-slate-900 focus:ring-slate-900" />
                <label className="text-sm text-slate-600">Remember me</label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="py-2 border-t border-zinc-200 bg-white text-center">
        <div className="max-w-md mx-auto px-4 text-slate-500 text-xs space-y-2">
          
          
        
          <p>© 2026 SH Tech Lab. All rights reserved. Version 1.0.0.</p>
        </div>
      </footer>
    </div>
  );
}