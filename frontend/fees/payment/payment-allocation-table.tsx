// frontend/fees/payment/payment-allocation-table.tsx

"use client";

import type {
  StudentFeeInstallment,
} from "../types/fee-payment.types";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Props {
  installments: StudentFeeInstallment[];

  allocations: Record<
    string,
    number
  >;

  onAllocationChange: (
    ledgerId: string,
    amount: number,
  ) => void;
}

export function PaymentAllocationTable({
  installments,
  allocations,
  onAllocationChange,
}: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">
        Payment Allocation
      </h3>

      {installments.map(
        (installment) => (
          <div
            key={
              installment.installmentId
            }
            className="rounded-lg border"
          >
            <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    M
                    {installment.sequence}
                  </Badge>

                  <span className="font-medium">
                    {installment.name}
                  </span>
                </div>
              </div>

              <span className="font-semibold">
                ₹
                {installment.balanceAmount.toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>

            <div className="divide-y">
              {installment.components
                .filter(
                  (component) =>
                    component.balanceAmount >
                    0,
                )
                .map(
                  (component) => (
                    <div
                      key={
                        component.ledgerId
                      }
                      className="grid grid-cols-[1fr_120px_140px] items-center gap-4 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {
                            component.componentName
                          }
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {
                            component.componentCode
                          }
                        </p>
                      </div>

                      <div className="text-right text-sm">
                        Due ₹
                        {component.balanceAmount.toLocaleString(
                          "en-IN",
                        )}
                      </div>

                      <Input
                        type="number"
                        min="0"
                        max={
                          component.balanceAmount
                        }
                        step="0.01"
                        value={
                          allocations[
                            component
                              .ledgerId
                          ] || ""
                        }
                        onChange={(event) =>
                          onAllocationChange(
                            component.ledgerId,
                            Number(
                              event.target
                                .value || 0,
                            ),
                          )
                        }
                        className="text-right"
                      />
                    </div>
                  ),
                )}
            </div>
          </div>
        ),
      )}
    </div>
  );
}