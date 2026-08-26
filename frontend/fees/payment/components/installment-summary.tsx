// frontend/fees/payment/components/installment-summary.tsx

import type {
  StudentFeeInstallment,
} from "../../types/fee-payment.types";

import { Badge } from "@/components/ui/badge";

interface Props {
  installments: StudentFeeInstallment[];
}

export function InstallmentSummary({
  installments,
}: Props) {
  return (
    <section className="rounded-lg border">
      <div className="border-b px-4 py-3">
        <h3 className="font-semibold">
          Pending Milestones
        </h3>

        <p className="text-xs text-muted-foreground">
          Payment will automatically move from
          the oldest pending component to the next.
        </p>
      </div>

      <div className="divide-y">
        {installments.map(
          (installment, index) => (
            <div
              key={
                installment.installmentId
              }
              className="p-4"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <Badge>
                      Next
                    </Badge>
                  )}

                  <span className="font-medium">
                    M
                    {installment.sequence}{" "}
                    {installment.name}
                  </span>
                </div>

                <span className="font-semibold">
                  ₹
                  {installment.balanceAmount.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
                          component
                            .ledgerId
                        }
                        className="flex justify-between rounded-md bg-muted/40 px-3 py-2 text-sm"
                      >
                        <span>
                          {
                            component.componentName
                          }
                        </span>

                        <span className="font-medium">
                          ₹
                          {component.balanceAmount.toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                    ),
                  )}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}