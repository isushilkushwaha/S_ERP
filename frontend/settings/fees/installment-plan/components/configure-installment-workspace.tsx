'use client';

import React, { useEffect } from 'react';

import { useFeeStructure } from '../hooks/use-fee-structure';
import { useSaveInstallmentPlan } from '../hooks/use-save-installment-plan';
import { useInstallmentForm } from '../hooks/use-installment-form';
import { useInstallmentComponents } from '../hooks/use-installment-components';
import { useInstallmentCalculations } from '../hooks/use-installment-calculations';
import { useInstallmentMilestones } from '../hooks/use-installment-milestones';
import { useInstallmentPopovers } from '../hooks/use-installment-popovers';

// Components
import { InstallmentArchitectureNotice } from './configure/installment-architecture-notice';
import { InstallmentPageHeader } from './configure/installment-page-header';
import { FeeStructureSummary } from './configure/fee-structure-summary';
import { InstallmentPlanDetails } from './configure/installment-plan-details';
import { InstallmentBuilder } from './configure/installment-builder';
import { FinancialSummary } from './configure/financial-summary';
import { InstallmentFormActions } from './configure/installment-form-actions';
import { InstallmentLoading } from './states/installment-loading';
import { InstallmentError } from './states/installment-error';

// Types
import { ConfigureInstallmentWorkspaceProps, InstallmentItemInput } from '../types/installment-plan.types';

export function ConfigureInstallmentWorkspace({
  feeStructureId,
}: ConfigureInstallmentWorkspaceProps) {
  const {
    feeStructure,
    isLoading,
    error: fetchError,
  } = useFeeStructure(feeStructureId);

  const {
    saveConfiguration,
    isSaving,
  } = useSaveInstallmentPlan(feeStructureId);

  const form = useInstallmentForm();
  const { control, register, watch, setValue, reset, getValues, fields, append, remove } = form;

  const items = (watch('items') || []) as InstallmentItemInput[];

  const { feeComponentsList, totalFee } = useInstallmentComponents(feeStructure);

  const calculations = useInstallmentCalculations({
    items,
    feeComponentsList,
    totalFee,
  });

  const {
    componentAssignmentMap,
    usedComponentIds,
    hasDuplicateComponents,
    milestoneAmounts,
    totalAllocated,
    remainingAmount,
    isAllComponentsCovered,
    isBalanced,
    canAddMilestone,
  } = calculations;

  const { openPopovers, setOpenPopovers, setPopoverOpen } = useInstallmentPopovers();

  const { handleAddMilestone, handleRemoveMilestone } = useInstallmentMilestones({
    append,
    remove,
    fieldsLength: fields.length,
    canAddMilestone,
    setOpenPopovers,
  });

  // Load existing plan / initialize form
  useEffect(() => {
    if (!feeStructure) {
      return;
    }

    const defaultPlan = feeStructure.installmentPlan;

    if (defaultPlan) {
      reset({
        academicYearId: feeStructure.academicYearId,
        classId: feeStructure.classId,
        name:
          defaultPlan.name ||
          `${feeStructure.class?.name || 'Class'} Default Plan`,
        code:
          defaultPlan.code ||
          `DEF-${feeStructure.class?.code || 'PLN'}`,
        planType: 'CUSTOM',
        effectiveFrom: defaultPlan.effectiveFrom
          ? defaultPlan.effectiveFrom.split('T')[0]
          : feeStructure.effectiveFrom
          ? feeStructure.effectiveFrom.split('T')[0]
          : '',
        effectiveTo: defaultPlan.effectiveTo
          ? defaultPlan.effectiveTo.split('T')[0]
          : '',
        items:
          defaultPlan.items?.map((item: any, index: number) => ({
            name: item.name || `Installment ${index + 1}`,
            dueRule: 'FIXED_DATE',
            dueDate: item.dueDate ? item.dueDate.split('T')[0] : '', // Formats DB date to input format YYYY-MM-DD
            calculationType: 'FIXED_AMOUNT',
            value: Number(item.value || 0),
            displayOrder: item.displayOrder || index + 1,
            feeComponentIds:
              item.components?.map(
                (component: any) => component.feeComponentId
              ) || [],
          })) || [],
      });
      return;
    }

    reset({
      academicYearId: feeStructure.academicYearId,
      classId: feeStructure.classId,
      name: `${feeStructure.class?.name || 'Class'} Default Plan`,
      code: `DEF-${feeStructure.class?.code || 'PLN'}`,
      planType: 'CUSTOM',
      effectiveFrom: feeStructure.effectiveFrom
        ? feeStructure.effectiveFrom.split('T')[0]
        : '',
      effectiveTo: feeStructure.effectiveTo
        ? feeStructure.effectiveTo.split('T')[0]
        : '',
      items: [
        {
          name: 'Installment 1',
          dueRule: 'FIXED_DATE',
          dueDate: feeStructure.effectiveFrom
            ? feeStructure.effectiveFrom.split('T')[0]
            : '',
          calculationType: 'FIXED_AMOUNT',
          value: 0,
          displayOrder: 1,
          feeComponentIds: [],
        },
      ],
    });
  }, [feeStructure, reset]);

  

  const handleComponentToggle = (
    milestoneIndex: number,
    componentId: string
  ) => {
    // 1. Grab the ENTIRE array of items (This is the trick to force a re-render)
    const currentItems = [...(getValues('items') || [])];
    const currentMilestone = currentItems[milestoneIndex];
    const currentIds = currentMilestone.feeComponentIds || [];

    const isSelectedHere = currentIds.includes(componentId);
    const assignedToMilestone = componentAssignmentMap.get(componentId);

    // Prevent selecting a component if it's already assigned to another milestone
    if (
      assignedToMilestone !== undefined &&
      assignedToMilestone !== milestoneIndex
    ) {
      return;
    }

    const updatedIds = isSelectedHere
      ? currentIds.filter((id) => id !== componentId)
      : [...currentIds, componentId];

    // 2. Calculate the exact new amount
    const calculatedAmount = feeComponentsList
      .filter((component) => updatedIds.includes(component.id))
      .reduce((sum, component) => sum + component.amount, 0);

    // 3. Update the specific milestone object inside our cloned array
    currentItems[milestoneIndex] = {
      ...currentMilestone,
      feeComponentIds: updatedIds,
      value: calculatedAmount,
    };

    // 4. 🚀 CRITICAL FIX: Replace the ENTIRE 'items' array at once
    // This forces React Hook Form to instantly update the UI and recalculate amounts!
    setValue('items', currentItems, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (values: any) => {
    if (!isAllComponentsCovered || hasDuplicateComponents || !isBalanced) {
      return;
    }

    const finalItems = values.items.map((item: any, index: number) => {
      const componentIds = item.feeComponentIds || [];
      const calculatedAmount = feeComponentsList
        .filter((component) => componentIds.includes(component.id))
        .reduce((sum, component) => sum + component.amount, 0);

      // 👇 CRITICAL FIX: Format the date properly for the backend!
      let formattedDate = null;
      if (item.dueDate) {
        formattedDate = new Date(item.dueDate).toISOString(); 
      }

      return {
        ...item,
        calculationType: 'FIXED_AMOUNT' as const,
        value: calculatedAmount,
        displayOrder: index + 1,
        dueDate: formattedDate, // Send strictly formatted ISO string
        feeComponentIds: componentIds,
      };
    });

    saveConfiguration({
      ...values,
      planType: 'CUSTOM',
      items: finalItems,
    });
  };

  if (isLoading) {
    return <InstallmentLoading />;
  }

  if (fetchError) {
    return <InstallmentError error={fetchError} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <InstallmentArchitectureNotice />
      <InstallmentPageHeader feeStructure={feeStructure} />

      <FeeStructureSummary
        feeStructure={feeStructure}
        feeComponents={feeComponentsList}
        totalFee={totalFee}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InstallmentPlanDetails register={register} />

        <InstallmentBuilder
          fields={fields}
          register={register}
          items={items}
          feeComponentsList={feeComponentsList}
          componentAssignmentMap={componentAssignmentMap}
          openPopovers={openPopovers}
          onPopoverChange={(index, open) => setPopoverOpen(index, open)}
          milestoneAmounts={milestoneAmounts}
          canAddMilestone={canAddMilestone}
          onAddMilestone={handleAddMilestone}
          onRemoveMilestone={handleRemoveMilestone}
          onToggleComponent={handleComponentToggle}
        />

        <FinancialSummary
          totalFee={totalFee}
          usedComponentIds={usedComponentIds}
          feeComponentsList={feeComponentsList}
          totalAllocated={totalAllocated}
          remainingAmount={remainingAmount}
          isAllComponentsCovered={isAllComponentsCovered}
          hasDuplicateComponents={hasDuplicateComponents}
          isBalanced={isBalanced}
          componentAssignmentMap={componentAssignmentMap}
        />

        <InstallmentFormActions
          isBalanced={isBalanced}
          feeComponentsCount={feeComponentsList.length}
          usedComponentIdsSize={usedComponentIds.size}
          isSaving={isSaving}
          hasDuplicateComponents={hasDuplicateComponents}
        />
      </form>
    </div>
  );
}