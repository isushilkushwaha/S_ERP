// frontend/admissions/components/wizard/sticky-wizard-header.tsx

"use client";

import React, { useMemo } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export interface StepItem {
  id: number;
  title: string;
  description: string;
}

export const WIZARD_STEPS: StepItem[] = [
  { id: 1, title: "Select Student", description: "Find registered student" },
  { id: 2, title: "Verify Registration", description: "Review student information" },
  { id: 3, title: "Academic Allocation", description: "Assign class and section" },
  { id: 4, title: "Fee Assignment", description: "Review fees and concession" },
  { id: 5, title: "Installment Plan", description: "Set payment schedule" },
  { id: 6, title: "Review & Confirm", description: "Create admission" },
];

export interface StickyWizardHeaderProps {
  currentStep: number;
}

export function StickyWizardHeader({ currentStep }: StickyWizardHeaderProps) {
  const totalSteps = WIZARD_STEPS.length;
  const clampedStep = Math.min(Math.max(currentStep, 1), totalSteps);
  
  // Calculate completion percentage: Step 1 = ~17%, Step 6 = 100%
  const progressPercent = useMemo(() => {
    return Math.round((clampedStep / totalSteps) * 100);
  }, [clampedStep, totalSteps]);

  const activeStepMeta = WIZARD_STEPS[clampedStep - 1];

  return (
    <header
      role="navigation"
      aria-label="Admission Wizard Progress"
      className="w-full  bg-background transition-colors duration-150 "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        
        {/* TOP ROW: BREADCRUMBS, TITLE, AND PROGRESS SUMMARY */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          
          {/* Left: Breadcrumbs & Header Title */}
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
              <span>Admissions</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
              <span>Student Admission</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-foreground font-medium">
                Step {clampedStep} of {totalSteps}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                {activeStepMeta?.title || "New Student Admission"}
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              {activeStepMeta?.description || "Complete the admission process for the active academic session."}
            </p>
          </div>

          {/* Right: Progress Meter */}
          <div className="flex items-center justify-between md:justify-end gap-3 bg-card border border-border px-3 py-2 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground">
              Progress
            </span>
            <div className="flex items-center space-x-2.5">
              <div className="w-24 sm:w-28">
                <Progress value={progressPercent} className="h-1.5 bg-muted" />
              </div>
              <span className="text-xs font-mono font-medium text-foreground min-w-[32px] text-right">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: PROFESSIONAL HORIZONTAL STEPPER */}
        <div className="pt-1 pb-1 hidden md:block">
          <ol className="flex items-center justify-between gap-2">
            {WIZARD_STEPS.map((step, idx) => {
              const isCompleted = clampedStep > step.id;
              const isCurrent = clampedStep === step.id;
              const isPending = clampedStep < step.id;

              return (
                <li
                  key={step.id}
                  className="flex-1 min-w-0"
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors border",
                        isCompleted &&
                          "bg-emerald-600 text-white border-emerald-600",
                        isCurrent &&
                          "bg-primary text-primary-foreground border-primary ring-2 ring-primary/20",
                        isPending &&
                          "bg-card text-muted-foreground border-border"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        step.id
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-xs font-medium leading-tight truncate transition-colors",
                          isCompleted && "text-foreground font-medium",
                          isCurrent && "text-foreground font-semibold",
                          isPending && "text-muted-foreground"
                        )}
                      >
                        {step.title}
                      </p>
                    </div>

                    {idx < WIZARD_STEPS.length - 1 && (
                      <div className="flex-1 h-[1px] bg-border mx-2 hidden lg:block" />
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* MOBILE STEP SUMMARY */}
        <div className="md:hidden flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
          <span>Active Step: <strong className="text-foreground">{activeStepMeta?.title}</strong></span>
          <span className="font-mono">{clampedStep} of {totalSteps}</span>
        </div>

      </div>
    </header>
  );
}