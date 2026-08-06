"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  academicYearFormSchema,
  type AcademicYearFormValues,
  ACADEMIC_YEAR_STATUS,
  type AcademicYear,
} from "@/frontend/settings/academic-years";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

export interface AcademicYearFormProps {
  initialData?: AcademicYear;
  isLoading?: boolean;
  onSubmit: (values: AcademicYearFormValues) => void | Promise<void>;
  onCancel?: () => void;
}

export function AcademicYearForm({
  initialData,
  isLoading = false,
  onSubmit,
  onCancel,
}: AcademicYearFormProps) {
  const form = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearFormSchema),
    defaultValues: {
      name: "",
      code: "",
      startDate: "",
      endDate: "",
      status: ACADEMIC_YEAR_STATUS.UPCOMING,
      sortOrder: 1,
    },
  });

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      name: initialData.name,
      code: initialData.code,
      startDate: initialData.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : "",
      endDate: initialData.endDate
        ? new Date(initialData.endDate).toISOString().split("T")[0]
        : "",
      status: initialData.status,
      sortOrder: initialData.sortOrder,
    });
  }, [initialData, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Academic Year Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2025-2026"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Academic Year Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2025-26"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ACADEMIC_YEAR_STATUS.UPCOMING}>
                      Upcoming
                    </SelectItem>
                    <SelectItem value={ACADEMIC_YEAR_STATUS.ACTIVE}>
                      Active
                    </SelectItem>
                    <SelectItem value={ACADEMIC_YEAR_STATUS.ARCHIVED}>
                      Archived
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sort Order */}
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    disabled={isLoading}
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? 1
                          : Number(event.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t pt-6">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {initialData
                  ? "Update Academic Year"
                  : "Create Academic Year"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}