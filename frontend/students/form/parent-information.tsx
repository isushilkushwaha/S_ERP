"use client";

import { useFormContext } from "react-hook-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import type { StudentFormValues } from "../schemas/student-form.schema";

export function ParentInformation() {
  const form = useFormContext<StudentFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parent Information</CardTitle>

        <CardDescription>
          Enter father, mother and guardian details.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Father Information */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">
            Father Details
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="fatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father Name *</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Father Name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fatherOccupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Occupation
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Occupation"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fatherMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="9876543210"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fatherEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="father@example.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Mother Information */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">
            Mother Details
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="motherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother Name *</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Mother Name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motherOccupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Occupation
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Occupation"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motherMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="9876543210"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motherEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="mother@example.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Guardian Information */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">
            Guardian Details
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="guardianName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Guardian Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Guardian Name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guardianRelation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Relationship
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Uncle, Aunt..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guardianMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="9876543210"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guardianEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="guardian@example.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}