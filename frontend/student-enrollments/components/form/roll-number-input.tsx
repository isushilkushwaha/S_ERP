"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

interface RollNumberInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;

  label?: string;
  placeholder?: string;
  description?: string;

  disabled?: boolean;
  required?: boolean;
}

export function RollNumberInput<T extends FieldValues>({
  control,
  name,

  label = "Roll Number",
  placeholder = "Enter roll number",

  description = "Leave empty if roll number will be generated automatically.",

  disabled = false,
  required = false,
}: RollNumberInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && (
              <span className="ml-1 text-destructive">*</span>
            )}
          </FormLabel>

          <FormControl>
            <Input
              {...field}
              value={field.value ?? ""}
              placeholder={placeholder}
              autoComplete="off"
              disabled={disabled}
              maxLength={20}
            />
          </FormControl>

          {description && (
            <FormDescription>{description}</FormDescription>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}