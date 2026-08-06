"use client";

import { useFormContext } from "react-hook-form";

import {
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

import type { CreateSchoolProfileRequest } from "../../types";
import {
  CURRENCIES,
  TIMEZONES,
} from "../../utils";

export function Localization() {
  const form = useFormContext<CreateSchoolProfileRequest>();

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Localization</h3>

        <p className="text-sm text-muted-foreground">
          Configure your schools regional preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Timezone */}
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {TIMEZONES.map((timezone) => (
                    <SelectItem
                      key={timezone}
                      value={timezone}
                    >
                      {timezone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Currency */}
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem
                      key={currency}
                      value={currency}
                    >
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>

              <Select
                value={field.value ? "true" : "false"}
                onValueChange={(value) =>
                  field.onChange(value === "true")
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="true">
                    Active
                  </SelectItem>

                  <SelectItem value="false">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}