// frontend/fees/payment/components/payment-summary.tsx

import { CheckCircle2 } from "lucide-react";

interface Props {
  amountPaid: number;
  totalAllocated: number;
  remaining: number;
}

export function PaymentSummary({
  amountPaid,
  totalAllocated,
  remaining,
}: Props) {
  const valid =
    Math.abs(
      amountPaid -
        totalAllocated,
    ) < 0.01;

  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Item
          label="Amount Received"
          value={amountPaid}
        />

        <Item
          label="Allocated"
          value={totalAllocated}
        />

        <Item
          label="Remaining Due"
          value={remaining}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm">
        <CheckCircle2
          className={
            valid
              ? "h-4 w-4 text-emerald-600"
              : "h-4 w-4 text-destructive"
          }
        />

        <span>
          {valid
            ? "Allocation matches payment."
            : "Allocation does not match payment."}
        </span>
      </div>
    </div>
  );
}

function Item({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-bold">
        ₹
        {value.toLocaleString(
          "en-IN",
        )}
      </p>
    </div>
  );
}