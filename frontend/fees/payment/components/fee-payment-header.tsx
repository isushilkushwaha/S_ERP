// frontend/fees/payment/components/fee-payment-header.tsx

import type {
  StudentFeeProfileData,
} from "../../types/fee-payment.types";

interface Props {
  student: StudentFeeProfileData["student"];
}

export function FeePaymentHeader({
  student,
}: Props) {
  return (
    <section className="rounded-lg border bg-muted/20 p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Student"
          value={student.studentName}
        />

        <Info
          label="Admission No."
          value={student.admissionNumber}
        />

        <Info
          label="Class / Section"
          value={`${student.className} - ${student.sectionName}`}
        />

        <Info
          label="Academic Year"
          value={student.academicYearName}
        />
      </div>
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value || "—"}
      </p>
    </div>
  );
}