"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { WizardStep } from "./wizard";

interface StepperProps {
  steps: WizardStep[];
  currentStep: number;
}

export function Stepper({
  steps,
  currentStep,
}: StepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors",
                    completed &&
                      "border-primary bg-primary text-primary-foreground",
                    active &&
                      "border-primary text-primary",
                    !completed &&
                      !active &&
                      "border-muted-foreground text-muted-foreground"
                  )}
                >
                  {completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>

                <span
                  className={cn(
                    "mt-2 text-sm font-medium",
                    active && "text-primary",
                    !active &&
                      "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-[2px] flex-1",
                    completed
                      ? "bg-primary"
                      : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}