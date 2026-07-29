"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  MapPin,
  Building,
  Globe,
  Hash,
  Map,
  AlertCircle,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Student } from "../../types/student";
import {
  addressSchema,
  type AddressFormValues,
} from "../../schemas/update/address-schema";
import { useUpdateAddress } from "../../hooks/update/use-update-address";

interface AddressFormProps {
  student: Student;
  onCancel: () => void;
}

export function AddressForm({ student, onCancel }: AddressFormProps) {
  const mutation = useUpdateAddress();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    values: {
      addressLine1: student.addressLine1 ?? "",
      addressLine2: student.addressLine2 ?? "",
      city: student.city ?? "",
      district: student.district ?? "",
      state: student.state ?? "",
      country: student.country ?? "",
      postalCode: student.postalCode ?? "",
    },
  });

  const onSubmit = (values: AddressFormValues) => {
    const payload: AddressFormValues = {
      addressLine1: values.addressLine1 || null,
      addressLine2: values.addressLine2 || null,
      city: values.city || null,
      district: values.district || null,
      state: values.state || null,
      country: values.country || null,
      postalCode: values.postalCode || null,
    };

    mutation.mutate(
      {
        id: student.id,
        payload,
      },
      {
        onSuccess: () => {
          toast.success("Residential address updated successfully.");
          onCancel();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to update address information."
          );
        },
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
      {/* SECTION 1: Street Address Lines */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
          <Building className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            Street Address
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Address Line 1 */}
          <div className="space-y-2 md:col-span-2">
            <Label
              htmlFor="addressLine1"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Address Line 1 <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="addressLine1"
                placeholder="House/Flat No., Building, Street..."
                autoComplete="address-line1"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.addressLine1 ? "border-destructive" : ""
                }`}
                {...form.register("addressLine1")}
              />
            </div>
            {form.formState.errors.addressLine1 && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.addressLine1.message}
              </p>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="space-y-2 md:col-span-2">
            <Label
              htmlFor="addressLine2"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Address Line 2
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
              <Input
                id="addressLine2"
                placeholder="Apartment, Suite, Unit, Landmark..."
                autoComplete="address-line2"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.addressLine2 ? "border-destructive" : ""
                }`}
                {...form.register("addressLine2")}
              />
            </div>
            {form.formState.errors.addressLine2 && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.addressLine2.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: Region & Location Details */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            City, Region & Postal Details
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* City */}
          <div className="space-y-2">
            <Label
              htmlFor="city"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              City
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="city"
                placeholder="City Name"
                autoComplete="address-level2"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.city ? "border-destructive" : ""
                }`}
                {...form.register("city")}
              />
            </div>
            {form.formState.errors.city && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.city.message}
              </p>
            )}
          </div>

          {/* District */}
          <div className="space-y-2">
            <Label
              htmlFor="district"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              District
            </Label>
            <div className="relative">
              <Map className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="district"
                placeholder="District"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.district ? "border-destructive" : ""
                }`}
                {...form.register("district")}
              />
            </div>
            {form.formState.errors.district && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.district.message}
              </p>
            )}
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label
              htmlFor="state"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              State / Province
            </Label>
            <div className="relative">
              <Map className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="state"
                placeholder="State / Province"
                autoComplete="address-level1"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.state ? "border-destructive" : ""
                }`}
                {...form.register("state")}
              />
            </div>
            {form.formState.errors.state && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.state.message}
              </p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label
              htmlFor="postalCode"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Postal / ZIP Code
            </Label>
            <div className="relative">
              
              <Input
                id="postalCode"
                placeholder="e.g. 208001"
                autoComplete="postal-code"
                disabled={mutation.isPending}
                className={`pl-9 font-mono border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.postalCode ? "border-destructive" : ""
                }`}
                {...form.register("postalCode")}
              />
            </div>
            {form.formState.errors.postalCode && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.postalCode.message}
              </p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-2">
            <Label
              htmlFor="country"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Country
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="country"
                placeholder="e.g. India"
                autoComplete="country-name"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.country ? "border-destructive" : ""
                }`}
                {...form.register("country")}
              />
            </div>
            {form.formState.errors.country && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.country.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-border/80 pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={mutation.isPending}
          className="px-5 font-semibold transition-colors hover:bg-muted"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="gap-2 px-6 font-semibold shadow-xs transition-colors"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 shrink-0" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}