import { InstallmentPlanFormValues } from '../schemas/installment-plan.schema';

export interface FeeComponent {
  id: string;
  name?: string;
  code?: string;
  amount?: number | string;
}

export interface InstallmentPlanItem {
  id: string;
  name?: string;
  value?: number | string;
  displayOrder?: number;
  components?: Array<{
    feeComponentId: string;
    feeComponent?: FeeComponent;
  }>;
}

export interface InstallmentPlan {
  id: string;
  name?: string;
  code?: string;
  planType?: string;
  status?: string;
  items?: InstallmentPlanItem[];
}

export interface FeeStructure {
  id: string;
  name?: string;
  academicYearId?: string;
  classId?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  status?: string;
  academicYear?: {
    id?: string;
    name?: string;
    code?: string;
  };
  class?: {
    id?: string;
    name?: string;
    code?: string;
     medium?: 'ENGLISH' | 'HINDI' | 'BOTH';
  };
  items?: Array<{
    id?: string;
    feeComponentId?: string;
    amount?: number | string;
    feeComponent?: FeeComponent;
  }>;
  installmentPlanId?: string;
  installmentPlan?: InstallmentPlan | null; 
  feeStructureInstallmentPlans?: Array<{
    id?: string;
    isDefault?: boolean;
    installmentPlan?: InstallmentPlan;
  }>;
}



export interface FeeComponentSummary {
  id: string;
  name: string;
  code: string;
  amount: number;
}

export interface InstallmentItemInput {
  name: string;
  dueRule: string;
  dueDate: string;
  calculationType: string;
  value: number;
  displayOrder: number;
  feeComponentIds: string[];
}

export interface ConfigureInstallmentWorkspaceProps {
  feeStructureId: string;
}

export type InstallmentFormValues = InstallmentPlanFormValues;