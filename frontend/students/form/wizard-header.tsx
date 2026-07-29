"use client";

import type { WizardStep } from "./wizard";

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  step: WizardStep;
}

export function WizardHeader({
  currentStep,
  totalSteps,
  step,
}: WizardHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student Registration
          </h1>

          <p className="text-muted-foreground">
            Complete the student registration process.
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </p>

          <p className="font-medium">
            {step.title}
          </p>
        </div>
      </div>
    </div>
  );
}