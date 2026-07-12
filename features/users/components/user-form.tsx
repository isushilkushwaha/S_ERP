"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createUser } from "@/features/users/actions/create-user";
import {
  createUserSchema,
  type CreateUserSchema,
} from "@/features/users/schemas/user-schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormProps {
  onSuccess?: () => void;
}

export function UserForm({
  onSuccess,
}: UserFormProps) {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "TEACHER",
      isActive: true,
    },
  });

  const role = watch("role");
  const isActive = watch("isActive");

  const onSubmit = (values: CreateUserSchema) => {
    startTransition(async () => {
      const result = await createUser(values);

      if (!result.success) {
        toast.error(result.message ?? "Unable to create user.");
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
      {/* Full Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Full Name
        </label>

        <Input
          placeholder="John Doe"
          {...register("fullName")}
        />

        {errors.fullName && (
          <p className="text-sm text-red-500">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Email
        </label>

        <Input
          type="email"
          placeholder="teacher@school.com"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Username
        </label>

        <Input
          placeholder="teacher01"
          {...register("username")}
        />

        {errors.username && (
          <p className="text-sm text-red-500">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Password
        </label>

        <Input
          type="password"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Confirm Password
        </label>

        <Input
          type="password"
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Role
        </label>

        <Select
          value={role}
          onValueChange={(value) =>
            setValue("role", value as "ADMIN" | "TEACHER", {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ADMIN">
              Administrator
            </SelectItem>

            <SelectItem value="TEACHER">
              Teacher
            </SelectItem>
          </SelectContent>
        </Select>

        {errors.role && (
          <p className="text-sm text-red-500">
            {errors.role.message}
          </p>
        )}
      </div>

      {/* Active */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="font-medium">
            Active User
          </p>

          <p className="text-sm text-muted-foreground">
            Allow this user to login
          </p>
        </div>

        <Switch
          checked={isActive}
          onCheckedChange={(checked) =>
            setValue("isActive", checked, {
              shouldValidate: true,
            })
          }
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full"
      >
        {pending ? "Saving..." : "Save User"}
      </Button>
    </form>
  );
}