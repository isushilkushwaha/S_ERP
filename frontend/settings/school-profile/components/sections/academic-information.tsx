"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BOARDS } from "../../utils";
import type { CreateSchoolProfileRequest } from "../../types";

export function AcademicInformation() {
  const form = useFormContext<CreateSchoolProfileRequest>();

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          Academic Information
        </h3>

        <p className="text-sm text-muted-foreground">
          Configure your school's academic board and affiliation details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="board"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Board</FormLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {BOARDS.map((board) => (
                    <SelectItem
                      key={board}
                      value={board}
                    >
                      {board}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Affiliation Number</FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter affiliation number"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="principalName"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Principal Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter principal name"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}