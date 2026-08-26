export const PLAN_TYPE_OPTIONS = [
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Quarterly', value: 'QUARTERLY' },
  { label: 'Half-Yearly', value: 'HALF_YEARLY' },
  { label: 'Annual', value: 'ANNUAL' },
  { label: 'Custom', value: 'CUSTOM' },
] as const;

export const DUE_RULE_OPTIONS = [
  { label: 'Fixed Date', value: 'FIXED_DATE' },
  { label: 'Admission Date', value: 'ADMISSION_DATE' },
  { label: 'Offset Days', value: 'OFFSET_DAYS' },
] as const;

export const CALC_TYPE_OPTIONS = [
  { label: 'Percentage (%)', value: 'PERCENTAGE' },
  { label: 'Fixed Amount (₹)', value: 'FIXED_AMOUNT' },
] as const;

export const STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
] as const;