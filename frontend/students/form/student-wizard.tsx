"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import type { StudentFormValues } from "../schemas/student-form.schema";

import { STUDENT_REGISTRATION_STEPS } from "./wizard";
import { Stepper } from "./stepper";
import { WizardFooter } from "./wizard-footer";
import { WizardHeader } from "./wizard-header";

interface StudentWizardProps {
  form: UseFormReturn<StudentFormValues>;
  isSubmitting: boolean;
}

export function StudentWizard({
  form,
  isSubmitting,
}: StudentWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STUDENT_REGISTRATION_STEPS[currentStep];

  const nextStep = async () => {
    // Review step has no fields to validate
    if (step.fields.length > 0) {
      const valid = await form.trigger(step.fields);

      if (!valid) return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const CurrentStep = step.component;

  return (
    <div className="space-y-6">
      <WizardHeader
        currentStep={currentStep}
        totalSteps={STUDENT_REGISTRATION_STEPS.length}
        step={step}
      />

      <Stepper
        steps={STUDENT_REGISTRATION_STEPS}
        currentStep={currentStep}
      />

      {CurrentStep && <CurrentStep form={form} />}

      <WizardFooter
        currentStep={currentStep}
        totalSteps={STUDENT_REGISTRATION_STEPS.length}
        isSubmitting={isSubmitting}
        onPrevious={previousStep}
        onNext={nextStep}
      />
    </div>
  );
}