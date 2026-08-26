// // frontend/admissions/components/wizard/admission-wizard.tsx

// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAdmissionWizard } from "@/frontend/admissions/hooks/use-admission-wizard";
// import { useCreateAdmissionMutation } from "@/frontend/admissions/hooks/use-create-admission-mutation";
// import { useActiveAcademicYear } from "@/frontend/settings/academic-years/hooks/use-active-academic-year";
// import { StickyWizardHeader } from "./sticky-wizard-header";
// import { Step1SelectStudent } from "./steps/step-1-select-student";
// import { Step2VerifyRegistration } from "./steps/step-2-verify-registration";
// import { Step3AcademicAdmission } from "./steps/step-3-academic-admission";
// import { Step4FeeAssignment } from "./steps/step-4-fee-assignment";
// import { Step5InstallmentTemplate } from "./steps/step-5-installment-template";
// import { Step6ReviewConfirm } from "./steps/step-6-review-confirm";
// import { Card, CardContent } from "@/components/ui/card";
// import { Step3AcademicAdmissionInput } from "@/features/admissions/validators/admission.validator";

// interface AdmissionWizardProps {
//   tenantId?: string;
// }

// interface MutationResponse {
//   id?: string;
//   data?: {
//     id?: string;
//     enrollmentId?: string;
//   };
//   enrollmentId?: string;
// }

// interface MilestoneStateDTO {
//   id?: string;
//   name: string;
//   dueDate?: string | null;
//   componentIds: string[];
//   value?: number; // 👈 Captures the calculated amount for Step 6
//   displayOrder: number;
// }

// export function AdmissionWizard({ tenantId = "tenant_default_01" }: AdmissionWizardProps) {
//   const router = useRouter();
//   const wizard = useAdmissionWizard();
//   const createAdmissionMutation = useCreateAdmissionMutation();

//   const { data: activeAcademicYear, isLoading: isLoadingActiveYear } = useActiveAcademicYear();
//   const [submissionError, setSubmissionError] = useState<string | null>(null);

//   // --- WIZARD FINANCIAL & SCHEDULE EXTENSION STATE ---
//   const [concessionData, setConcessionData] = useState<{
//     discountType: string;
//     discountAmount: number;
//     description: string;
//     finalPayable: number;
//   } | null>(null);

//   const [installmentPlanSelection, setInstallmentPlanSelection] = useState<{
//     planId: string;
//     planName: string;
//     milestones: MilestoneStateDTO[];
//   } | null>(null);

//   const handleConfirmAdmission = () => {
//     if (!wizard.selectedStudent || !wizard.academicDetails) return;

//     setSubmissionError(null);

//     const cleanSectionId =
//       wizard.academicDetails.sectionId && wizard.academicDetails.sectionId.trim() !== ""
//         ? wizard.academicDetails.sectionId
//         : undefined;

//     createAdmissionMutation.mutate(
//       {
//         studentId: wizard.selectedStudent.id,
//         academicYearId: wizard.academicDetails.academicYearId!,
//         classId: wizard.academicDetails.classId!,
//         sectionId: cleanSectionId,
//         admissionDate: wizard.academicDetails.admissionDate!,
//         admissionNumber: wizard.academicDetails.admissionNumber || "AUTO",
//         rollNumber: wizard.academicDetails.rollNumber!,
//         medium: wizard.academicDetails.medium!,
//         stream: wizard.academicDetails.stream || null,
//         admissionType: wizard.academicDetails.admissionType!,
//         house: wizard.academicDetails.house || null,
//         boardRegistrationNumber: wizard.academicDetails.boardRegistrationNumber || null,
//         isHostelRequired: wizard.academicDetails.isHostelRequired ?? false,
//         isTransportRequired: wizard.academicDetails.isTransportRequired ?? false,
//         remarks: wizard.academicDetails.remarks || null,
        
//         // --- ATTACH FINANCIAL CONCESSION & INSTALLMENT DATA ---
//         feeStructureId: wizard.assignedFeeStructure?.feeStructureId!,
//         concession: concessionData ? {
//           discountType: concessionData.discountType,
//           discountAmount: concessionData.discountAmount,
//           description: concessionData.description,
//         } : null,
//         installmentPlanId: installmentPlanSelection?.planId || null,

//         tenantId,
//       },
//       {
//         onSuccess: (response: unknown) => {
//           const res = response as MutationResponse;
//           const createdId = res?.id || res?.data?.id || res?.enrollmentId || res?.data?.enrollmentId;
//           if (createdId) {
//             router.push(`/admissions/${createdId}`);
//           } else {
//             router.push("/admissions");
//           }
//         },
//         onError: (error: unknown) => {
//           const err = error as Error;
//           setSubmissionError(err.message || "Failed to confirm student admission.");
//         },
//       }
//     );
//   };

//   const finalPayableAmount = concessionData 
//     ? concessionData.finalPayable 
//     : (wizard.assignedFeeStructure?.totalAmount || 0);

//   return (
//     <div className="min-h-screen bg-muted/10 pb-12">
//       <StickyWizardHeader currentStep={wizard.currentStep} />

//       <main className="max-w-5xl mx-auto mt-8 px-4">
//         <Card className="shadow-sm border-border">
//           <CardContent className="p-6 md:p-8">
//             {/* Step 1: Select Student */}
//             {wizard.currentStep === 1 && (
//               <Step1SelectStudent
//                 selectedStudent={wizard.selectedStudent}
//                 activeAcademicYearName={
//                   isLoadingActiveYear
//                     ? "Loading Session..."
//                     : activeAcademicYear?.name || "No Active Year"
//                 }
//                 activeAcademicYearId={activeAcademicYear?.id || undefined}
//                 onSelectStudent={wizard.setSelectedStudent}
//                 onNext={wizard.goToNextStep}
//               />
//             )}

//             {/* Step 2: Verify Profile */}
//             {wizard.currentStep === 2 && wizard.selectedStudent && (
//               <Step2VerifyRegistration
//                 student={wizard.selectedStudent}
//                 onNext={wizard.goToNextStep}
//                 onBack={wizard.goToPreviousStep}
//               />
//             )}

//             {/* Step 3: Academic Scope */}
//             {wizard.currentStep === 3 && (
//               <Step3AcademicAdmission
//                 initialValues={wizard.academicDetails}
//                 onComplete={(details, feeStructure) => {
//                   wizard.setAcademicDetails(details);
//                   wizard.setAssignedFeeStructure(feeStructure);
//                   wizard.goToNextStep();
//                 }}
//                 onBack={wizard.goToPreviousStep}
//               />
//             )}

//             {/* Step 4: Fee Assignment & Concession */}
//             {wizard.currentStep === 4 && (
//               <Step4FeeAssignment
//                 feeStructure={wizard.assignedFeeStructure}
//                 initialConcession={concessionData}
//                 onNext={(data) => {
//                   setConcessionData(data);
//                   wizard.goToNextStep();
//                 }}
//                 onBack={wizard.goToPreviousStep}
//               />
//             )}

//             {/* Step 5: Installment Plan */}
//             {wizard.currentStep === 5 && wizard.assignedFeeStructure && (
//               <Step5InstallmentTemplate
//                 feeStructureId={wizard.assignedFeeStructure.feeStructureId}
//                 finalPayable={finalPayableAmount}
//                 initialMilestones={installmentPlanSelection?.milestones}
//                 onSaveMilestones={(planId, planName, savedMilestones) => {
//                   const formattedMilestones: MilestoneStateDTO[] = savedMilestones.map((m: any, idx) => ({
//                     id: m.id,
//                     name: m.name,
//                     dueDate: m.dueDate,
//                     displayOrder: m.displayOrder ?? idx + 1,
//                     componentIds: m.componentIds || [],
//                     value: m.value || 0, // 👈 Captures calculated value for review screen
//                   }));
//                   setInstallmentPlanSelection({ planId, planName, milestones: formattedMilestones });
//                 }}
//                 onNext={wizard.goToNextStep}
//                 onBack={wizard.goToPreviousStep}
//               />
//             )}

//             {/* Step 6: Final Review & Confirm */}
//             {wizard.currentStep === 6 &&
//               wizard.selectedStudent &&
//               wizard.academicDetails &&
//               wizard.assignedFeeStructure && (
//                 <Step6ReviewConfirm
//                   student={wizard.selectedStudent}
//                   academicDetails={wizard.academicDetails as Step3AcademicAdmissionInput}
//                   feeStructure={wizard.assignedFeeStructure}
//                   concession={concessionData}
//                   selectedPlanName={installmentPlanSelection?.planName}
//                   installmentMilestones={installmentPlanSelection?.milestones}
//                   isSubmitting={createAdmissionMutation.isPending}
//                   errorMessage={submissionError}
//                   onConfirm={handleConfirmAdmission}
//                   onBack={wizard.goToPreviousStep}
//                 />
//               )}
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }

// frontend/admissions/components/wizard/admission-wizard.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmissionWizard } from "@/frontend/admissions/hooks/use-admission-wizard";
import { useCreateAdmissionMutation } from "@/frontend/admissions/hooks/use-create-admission-mutation";
import { useActiveAcademicYear } from "@/frontend/settings/academic-years/hooks/use-active-academic-year";
import { StickyWizardHeader } from "./sticky-wizard-header";
import { Step1SelectStudent } from "./steps/step-1-select-student";
import { Step2VerifyRegistration } from "./steps/step-2-verify-registration";
import { Step3AcademicAdmission } from "./steps/step-3-academic-admission";
import { Step4FeeAssignment } from "./steps/step-4-fee-assignment";
import { Step5InstallmentTemplate } from "./steps/step-5-installment-template";
import { Step6ReviewConfirm } from "./steps/step-6-review-confirm";
import { Card, CardContent } from "@/components/ui/card";
import { Step3AcademicAdmissionInput } from "@/features/admissions/validators/admission.validator";

interface AdmissionWizardProps {
  tenantId?: string;
}

interface MutationResponse {
  id?: string;
  data?: {
    id?: string;
    enrollmentId?: string;
  };
  enrollmentId?: string;
}

interface MilestoneStateDTO {
  id?: string;
  name: string;
  dueDate?: string | null;
  componentIds: string[];
  value?: number;
  displayOrder: number;
}

export function AdmissionWizard({ tenantId = "tenant_default_01" }: AdmissionWizardProps) {
  const router = useRouter();
  const wizard = useAdmissionWizard();
  const createAdmissionMutation = useCreateAdmissionMutation();

  const { data: activeAcademicYear, isLoading: isLoadingActiveYear } = useActiveAcademicYear();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // --- WIZARD FINANCIAL & SCHEDULE EXTENSION STATE ---
  const [concessionData, setConcessionData] = useState<{
    discountType: string;
    discountAmount: number;
    description: string;
    finalPayable: number;
  } | null>(null);

  const [installmentPlanSelection, setInstallmentPlanSelection] = useState<{
    planId: string;
    planName: string;
    milestones: MilestoneStateDTO[];
  } | null>(null);

  const handleConfirmAdmission = () => {
    if (!wizard.selectedStudent || !wizard.academicDetails) return;

    setSubmissionError(null);

    const cleanSectionId =
      wizard.academicDetails.sectionId && wizard.academicDetails.sectionId.trim() !== ""
        ? wizard.academicDetails.sectionId
        : undefined;

    createAdmissionMutation.mutate(
      {
        studentId: wizard.selectedStudent.id,
        academicYearId: wizard.academicDetails.academicYearId!,
        classId: wizard.academicDetails.classId!,
        sectionId: cleanSectionId,
        admissionDate: wizard.academicDetails.admissionDate!,
        admissionNumber: wizard.academicDetails.admissionNumber || "AUTO",
        rollNumber: wizard.academicDetails.rollNumber!,
        medium: wizard.academicDetails.medium!,
        stream: wizard.academicDetails.stream || null,
        admissionType: wizard.academicDetails.admissionType!,
        house: wizard.academicDetails.house || null,
        boardRegistrationNumber: wizard.academicDetails.boardRegistrationNumber || null,
        isHostelRequired: wizard.academicDetails.isHostelRequired ?? false,
        isTransportRequired: wizard.academicDetails.isTransportRequired ?? false,
        remarks: wizard.academicDetails.remarks || null,
        
        // --- ATTACH FINANCIAL CONCESSION & INSTALLMENT DATA ---
        feeStructureId: wizard.assignedFeeStructure?.feeStructureId!,
        concession: concessionData ? {
          discountType: concessionData.discountType,
          discountAmount: concessionData.discountAmount,
          description: concessionData.description,
        } : null,
        installmentPlanId: installmentPlanSelection?.planId || null,

        // 👈 INCLUDED CUSTOM INSTALLMENT MILESTONES SO THEY PERSIST TO THE DATABASE
        installments: installmentPlanSelection?.milestones
          ? installmentPlanSelection.milestones.map((m) => ({
              name: m.name,
              dueDate: m.dueDate || null,
              value: m.value || 0,
              componentIds: m.componentIds || [],
            }))
          : [],

        tenantId,
      },
      {
        onSuccess: (response: unknown) => {
          const res = response as MutationResponse;
          const createdId = res?.id || res?.data?.id || res?.enrollmentId || res?.data?.enrollmentId;
          if (createdId) {
            router.push(`/admissions/${createdId}`);
          } else {
            router.push("/admissions");
          }
        },
        onError: (error: unknown) => {
          const err = error as Error;
          setSubmissionError(err.message || "Failed to confirm student admission.");
        },
      }
    );
  };

  const finalPayableAmount = concessionData 
    ? concessionData.finalPayable 
    : (wizard.assignedFeeStructure?.totalAmount || 0);

  return (
    <div className="min-h-screen bg-muted/10 pb-12">
      <StickyWizardHeader currentStep={wizard.currentStep} />

      <main className="max-w-5xl mx-auto mt-8 px-4">
        <Card className="shadow-sm border-border">
          <CardContent className="p-6 md:p-8">
            {/* Step 1: Select Student */}
            {wizard.currentStep === 1 && (
              <Step1SelectStudent
                selectedStudent={wizard.selectedStudent}
                activeAcademicYearName={
                  isLoadingActiveYear
                    ? "Loading Session..."
                    : activeAcademicYear?.name || "No Active Year"
                }
                activeAcademicYearId={activeAcademicYear?.id || undefined}
                onSelectStudent={wizard.setSelectedStudent}
                onNext={wizard.goToNextStep}
              />
            )}

            {/* Step 2: Verify Profile */}
            {wizard.currentStep === 2 && wizard.selectedStudent && (
              <Step2VerifyRegistration
                student={wizard.selectedStudent}
                onNext={wizard.goToNextStep}
                onBack={wizard.goToPreviousStep}
              />
            )}

            {/* Step 3: Academic Scope */}
            {wizard.currentStep === 3 && (
              <Step3AcademicAdmission
                initialValues={wizard.academicDetails}
                onComplete={(details, feeStructure) => {
                  wizard.setAcademicDetails(details);
                  wizard.setAssignedFeeStructure(feeStructure);
                  wizard.goToNextStep();
                }}
                onBack={wizard.goToPreviousStep}
              />
            )}

            {/* Step 4: Fee Assignment & Concession */}
            {wizard.currentStep === 4 && (
              <Step4FeeAssignment
                feeStructure={wizard.assignedFeeStructure}
                initialConcession={concessionData}
                onNext={(data) => {
                  setConcessionData(data);
                  wizard.goToNextStep();
                }}
                onBack={wizard.goToPreviousStep}
              />
            )}

            {/* Step 5: Installment Plan */}
            {wizard.currentStep === 5 && wizard.assignedFeeStructure && (
              <Step5InstallmentTemplate
                feeStructureId={wizard.assignedFeeStructure.feeStructureId}
                finalPayable={finalPayableAmount}
                initialMilestones={installmentPlanSelection?.milestones}
                onSaveMilestones={(planId, planName, savedMilestones) => {
                  const formattedMilestones: MilestoneStateDTO[] = savedMilestones.map((m: any, idx) => ({
                    id: m.id,
                    name: m.name,
                    dueDate: m.dueDate,
                    displayOrder: m.displayOrder ?? idx + 1,
                    componentIds: m.componentIds || [],
                    value: m.value || 0,
                  }));
                  setInstallmentPlanSelection({ planId, planName, milestones: formattedMilestones });
                }}
                onNext={wizard.goToNextStep}
                onBack={wizard.goToPreviousStep}
              />
            )}

            {/* Step 6: Final Review & Confirm */}
            {wizard.currentStep === 6 &&
              wizard.selectedStudent &&
              wizard.academicDetails &&
              wizard.assignedFeeStructure && (
                <Step6ReviewConfirm
                  student={wizard.selectedStudent}
                  academicDetails={wizard.academicDetails as Step3AcademicAdmissionInput}
                  feeStructure={wizard.assignedFeeStructure}
                  concession={concessionData}
                  selectedPlanName={installmentPlanSelection?.planName}
                  installmentMilestones={installmentPlanSelection?.milestones}
                  isSubmitting={createAdmissionMutation.isPending}
                  errorMessage={submissionError}
                  onConfirm={handleConfirmAdmission}
                  onBack={wizard.goToPreviousStep}
                />
              )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}