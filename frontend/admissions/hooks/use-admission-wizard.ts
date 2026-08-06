import { useState } from "react";
import { 
  StudentRegistrationSummaryDTO, 
  AssignedFeeStructureDTO 
} from "@/features/admissions/dto/admission.dto";
import { Step3AcademicAdmissionInput } from "@/features/admissions/validators/admission.validator";

export interface AdmissionWizardState {
  currentStep: number;
  selectedStudent: StudentRegistrationSummaryDTO | null;
  academicDetails: Partial<Step3AcademicAdmissionInput> | null;
  assignedFeeStructure: AssignedFeeStructureDTO | null;
}

export function useAdmissionWizard() {
  const [wizardState, setWizardState] = useState<AdmissionWizardState>({
    currentStep: 1,
    selectedStudent: null,
    academicDetails: null,
    assignedFeeStructure: null,
  });

  const setSelectedStudent = (student: StudentRegistrationSummaryDTO | null) => {
    setWizardState((prev) => ({ ...prev, selectedStudent: student }));
  };

  const setAcademicDetails = (details: Step3AcademicAdmissionInput) => {
    setWizardState((prev) => ({ ...prev, academicDetails: details }));
  };

  const setAssignedFeeStructure = (feeStructure: AssignedFeeStructureDTO | null) => {
    setWizardState((prev) => ({ ...prev, assignedFeeStructure: feeStructure }));
  };

  const goToNextStep = () => {
    setWizardState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 5),
    }));
  };

  const goToPreviousStep = () => {
    setWizardState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setWizardState((prev) => ({ ...prev, currentStep: step }));
    }
  };

  return {
    ...wizardState,
    setSelectedStudent,
    setAcademicDetails,
    setAssignedFeeStructure,
    goToNextStep,
    goToPreviousStep,
    goToStep,
  };
}