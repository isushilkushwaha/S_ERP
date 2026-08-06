import React from "react";
import { AdmissionWizard } from "@/frontend/admissions/components/wizard/admission-wizard";

export const metadata = {
  title: "New Student Admission | Helexora ERP",
  description: "Multi-step student admission wizard",
};

export default function NewAdmissionPage() {
  return <AdmissionWizard />;
}