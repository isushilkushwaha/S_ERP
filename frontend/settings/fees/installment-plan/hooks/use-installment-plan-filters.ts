import { useState, useMemo } from 'react';
import { FeeStructure } from '../types/installment-plan.types';
import { getDefaultPlan } from '../utils/installment-plan.utils';

export function useInstallmentPlanFilters(
  feeStructures: FeeStructure[],
  initialAcademicYearId: string = ''
) {
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(
    initialAcademicYearId
  );
  const [selectedClassId, setSelectedClassId] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStructures = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return feeStructures.filter((structure) => {
      const defaultPlan = getDefaultPlan(structure);
      const isConfigured = Boolean(defaultPlan);

      const matchesClass =
        selectedClassId === 'ALL' ||
        structure.classId === selectedClassId;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'CONFIGURED' && isConfigured) ||
        (statusFilter === 'NOT_CONFIGURED' && !isConfigured);

      const searchableText = [
        structure.class?.name,
        structure.class?.code,
        structure.name,
        defaultPlan?.name,
        defaultPlan?.code,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);

      return matchesClass && matchesStatus && matchesSearch;
    });
  }, [feeStructures, selectedClassId, statusFilter, searchQuery]);

  const handleResetFilters = () => {
    setSelectedClassId('ALL');
    setStatusFilter('ALL');
    setSearchQuery('');
  };

  return {
    selectedAcademicYearId,
    setSelectedAcademicYearId,
    selectedClassId,
    setSelectedClassId,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    filteredStructures,
    handleResetFilters,
  };
}