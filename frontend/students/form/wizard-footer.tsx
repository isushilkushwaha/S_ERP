"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;

  onPrevious: () => void;
  onNext: () => void;
}

// WizardFooter.tsx

export function WizardFooter({
  currentStep,
  totalSteps,
  isSubmitting,
  onPrevious,
  onNext,
}: WizardFooterProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between border-t pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
      >
        Previous
      </Button>

      {/* Render standard button for intermediate navigation */}
      {!isLastStep && (
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
        >
          {currentStep === totalSteps - 2 ? "Review" : "Next"}
        </Button>
      )}

      {/* Render submit button strictly when on the Review step */}
      {isLastStep && (
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[170px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Student...
            </>
          ) : (
            "Register Student"
          )}
        </Button>
      )}
    </div>
  );
}