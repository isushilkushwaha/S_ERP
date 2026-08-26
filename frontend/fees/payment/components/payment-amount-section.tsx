"use client";

import { Input } from "@/components/ui/input";

interface PaymentAmountSectionProps {
  amount: number;

  totalDue: number;

  onAmountChange: (
    value: number,
  ) => void;
}

export function PaymentAmountSection({
  amount,
  totalDue,
  onAmountChange,
}: PaymentAmountSectionProps) {
  return (
    <section className="rounded-lg border p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label
            htmlFor="amount-paid"
            className="mb-2 block text-sm font-medium"
          >
            Amount Received
          </label>

          <Input
            id="amount-paid"
            type="number"
            min="0"
            max={totalDue}
            step="0.01"
            value={
              amount > 0
                ? amount
                : ""
            }
            onChange={(event) => {
              onAmountChange(
                Number(
                  event.target.value ||
                    0,
                ),
              );
            }}
            placeholder="Enter amount"
            className="h-11 text-lg font-semibold"
          />
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            Outstanding
          </p>

          <p className="text-lg font-bold">
            ₹
            {totalDue.toLocaleString(
              "en-IN",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}