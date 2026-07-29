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

import type { CreateSchoolProfileRequest } from "../../types";

export function AddressInformation() {
  const form = useFormContext<CreateSchoolProfileRequest>();

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Address Information</h3>
        <p className="text-sm text-muted-foreground">
          Enter the school's address details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Address Line 1 *</FormLabel>

              <FormControl>
                <Input
                  placeholder="House No., Street, Area"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Address Line 2</FormLabel>

              <FormControl>
                <Input
                  placeholder="Landmark (Optional)"
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
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City *</FormLabel>

              <FormControl>
                <Input
                  placeholder="Kanpur"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>

              <FormControl>
                <Input
                  placeholder="Kanpur Nagar"
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
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State *</FormLabel>

              <FormControl>
                <Input
                  placeholder="Uttar Pradesh"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country *</FormLabel>

              <FormControl>
                <Input
                  placeholder="India"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>

              <FormControl>
                <Input
                  placeholder="208001"
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