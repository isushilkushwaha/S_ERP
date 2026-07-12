"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { updateUser } from "@/features/users/actions/update-user";
import {
  updateUserSchema,
  type UpdateUserSchema,
} from "@/features/users/schemas/update-user-schema";
import { UserWithRole } from "../types/user-with-role";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

interface EditUserFormProps {
  user: UserWithRole;
  onSuccess?: () => void;
}

export function EditUserForm({ user, onSuccess }: EditUserFormProps) {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      role: user.role.name,
      isActive: user.isActive,
    },
  });

  const onSubmit = (values: UpdateUserSchema) => {
    startTransition(async () => {
      const result = await updateUser(user.id, values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("User updated");
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Full Name */}
      <div>
        <label className="mb-2 block text-sm font-medium">Full Name</label>
        <Input {...register("fullName")} />
        <p className="text-sm text-red-500">{errors.fullName?.message}</p>
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input {...register("email")} />
        <p className="text-sm text-red-500">{errors.email?.message}</p>
      </div>

      {/* Username */}
      <div>
        <label className="mb-2 block text-sm font-medium">Username</label>
        <Input {...register("username")} />
        <p className="text-sm text-red-500">{errors.username?.message}</p>
      </div>

      {/* Role */}
      {/* <div>
        <label className="mb-2 block text-sm font-medium">Role</label>
        <Select
          value={watch("role")}
          onValueChange={(value) => setValue("role", value as "ADMIN" | "TEACHER")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Administrator</SelectItem>
            <SelectItem value="TEACHER">Teacher</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* Active Switch */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Active</label>
        <Switch
          checked={watch("isActive")}
          onCheckedChange={(checked) => setValue("isActive", checked)}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Updating..." : "Update User"}
      </Button>
    </form>
  );
}