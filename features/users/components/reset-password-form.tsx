"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { resetUserPassword } from "@/features/users/actions/reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/features/users/schemas/reset-password-schema";

interface ResetPasswordFormProps {
  userId: string;
  onSuccess?: () => void;
}

export function ResetPasswordForm({
  userId,
  onSuccess,
}: ResetPasswordFormProps) {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (values: ResetPasswordSchema) => {
    startTransition(async () => {
      const result = await resetUserPassword(userId, values);

      if (!result.success) {
        toast.error(result.message ?? "Failed to reset password.");
        return;
      }

      toast.success(result.message);

      reset();

      onSuccess?.();
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          New Password
        </label>

        <Input
          type="password"
          placeholder="Enter new password"
          {...register("password")}
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Confirm Password
        </label>

        <Input
          type="password"
          placeholder="Confirm password"
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={pending}
      >
        {pending
          ? "Resetting..."
          : "Reset Password"}
      </Button>
    </form>
  );
}