"use client";

import {
  Award,
  Building2,
  Clock,
  Coins,
  Edit2,
  Globe,
  Hash,
  Mail,
  MapPin,
  Phone,
  School,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { SchoolProfile } from "../types";

interface SchoolProfileDetailsProps {
  profile: SchoolProfile;
  onEdit: () => void;
}

function displayValue(value?: string | null) {
  return value?.trim() ? value : "—";
}

export function SchoolProfileDetails({
  profile,
  onEdit,
}: SchoolProfileDetailsProps) {
  const handleEditClick = () => {
    toast.info("Opening Profile Editor...", {
      description: "You can update school details and save changes.",
    });
    onEdit();
  };

  const formattedAddress = [
    profile?.city,
    profile?.district,
    profile?.state,
    profile?.country,
    profile?.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  // Safely check and format logo URL with proper optional chaining
  const hasValidLogo =
    profile?.logoUrl &&
    typeof profile.logoUrl === "string" &&
    profile.logoUrl.trim() !== "";

  const logoSrc = hasValidLogo
    ? profile.logoUrl!.startsWith("http") || profile.logoUrl!.startsWith("/")
      ? profile.logoUrl!
      : `/${profile.logoUrl!}`
    : null;

  return (
    <TooltipProvider>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Profile Banner Header */}
        <Card className="overflow-hidden border-border/50 shadow-sm">
          <div className="h-28 w-full bg-muted/50 border-b border-border/50" />

          <CardContent className="p-2 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-background bg-background shadow-md">
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted">
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={profile?.schoolName || "School Logo"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <School className="h-12 w-12 text-muted-foreground/60" />
                    )}
                  </div>
                </div>

                <div className="space-y-1 pb-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                      {profile?.schoolName}
                    </h1>
                    {profile?.board && (
                      <Badge variant="outline" className="font-medium bg-background/50">
                        {profile.board}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <span>School Code:</span>
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground border border-border/50">
                      {displayValue(profile?.schoolCode)}
                    </code>
                  </p>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="absolute top-6 right-6 sm:relative sm:top-0 sm:right-0">
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    onClick={handleEditClick}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10"
                  >
                    <Edit2 className="h-5 w-5" />
                    <span className="sr-only">Edit Profile</span>
                  </TooltipTrigger>

                  <TooltipContent side="left">
                    <p>Edit Profile Details</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vertical Cards */}
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-semibold">
                  Institutional Details
                </CardTitle>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                <DetailRow
                  icon={<Hash className="h-4 w-4" />}
                  label="Admission Prefix"
                  value={
                    <code className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary border border-primary/20">
                      {profile?.admissionPrefix || "ADM"}
                    </code>
                  }
                />
                <DetailRow
                  icon={<Award className="h-4 w-4" />}
                  label="Affiliation Number"
                  value={displayValue(profile?.affiliationNumber)}
                />
                <DetailRow
                  icon={<UserCheck className="h-4 w-4" />}
                  label="Principal / Head of Institution"
                  value={displayValue(profile?.principalName)}
                />
                <DetailRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Timezone"
                  value={displayValue(profile?.timezone)}
                />
                <DetailRow
                  icon={<Coins className="h-4 w-4" />}
                  label="Operating Currency"
                  value={displayValue(profile?.currency)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-semibold">
                  Contact Information
                </CardTitle>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                <DetailRow
                  icon={<Mail className="h-4 w-4" />}
                  label="Official Email"
                  value={displayValue(profile?.email)}
                  href={profile?.email ? `mailto:${profile.email}` : undefined}
                />
                <DetailRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Primary Phone"
                  value={displayValue(profile?.phone)}
                  href={profile?.phone ? `tel:${profile.phone}` : undefined}
                />
                {profile?.alternatePhone && (
                  <DetailRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Alternate Phone"
                    value={displayValue(profile.alternatePhone)}
                    href={`tel:${profile.alternatePhone}`}
                  />
                )}
                <DetailRow
                  icon={<Globe className="h-4 w-4" />}
                  label="Website"
                  value={displayValue(profile?.website)}
                  href={
                    profile?.website?.startsWith("http")
                      ? profile.website
                      : profile?.website
                      ? `https://${profile.website}`
                      : undefined
                  }
                  isExternal
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-semibold">
                  Physical Location
                </CardTitle>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <div className="p-6 flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted border border-border/50">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1.5 text-base">
                  <p className="font-semibold text-foreground">
                    {displayValue(profile?.addressLine1)}
                  </p>
                  {profile?.addressLine2 && (
                    <p className="text-muted-foreground">
                      {profile.addressLine2}
                    </p>
                  )}
                  {formattedAddress && (
                    <p className="text-sm font-medium text-muted-foreground pt-1 border-t border-border/40">
                      {formattedAddress}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  href?: string;
  isExternal?: boolean;
}

function DetailRow({ label, value, icon, href, isExternal }: DetailRowProps) {
  const isNoValue = value === "—";

  const content = (
    <div className="flex items-center justify-between gap-4 py-4 px-6 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3.5 overflow-hidden">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border/50">
          {icon}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-12 overflow-hidden">
          <p className="text-sm font-medium text-muted-foreground sm:w-48 shrink-0 truncate">
            {label}
          </p>
          <div
            className={`text-sm font-semibold truncate ${
              isNoValue
                ? "text-muted-foreground/70"
                : href
                ? "text-foreground group-hover:text-primary"
                : "text-foreground"
            }`}
          >
            {value}
          </div>
        </div>
      </div>

      {href && !isNoValue && (
        <Globe className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary/70 shrink-0" />
      )}
    </div>
  );

  if (href && !isNoValue) {
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="block group"
      >
        {content}
      </a>
    );
  }

  return content;
}