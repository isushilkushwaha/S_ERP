// frontend/settings/fees/installment-plan/components/configure/fee-component-selector.tsx

import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ChevronsUpDown, Check, Lock } from 'lucide-react';
import { FeeComponentSummary } from '../../types/installment-plan.types';
import { cn } from '@/lib/utils';

interface FeeComponentSelectorProps {
  index: number;
  isPopoverOpen: boolean;
  onPopoverChange: (open: boolean) => void;
  currentSelectedIds: string[];
  feeComponentsList: FeeComponentSummary[];
  componentAssignmentMap: Map<string, number>;
  onToggleComponent: (milestoneIndex: number, componentId: string) => void;
}

export function FeeComponentSelector({
  index,
  isPopoverOpen,
  onPopoverChange,
  currentSelectedIds,
  feeComponentsList,
  componentAssignmentMap,
  onToggleComponent,
}: FeeComponentSelectorProps) {
  const selectedHereSet = new Set(currentSelectedIds);

  return (
    <div className="space-y-2 md:col-span-5">
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Fee Components
      </label>

      <Popover open={isPopoverOpen} onOpenChange={onPopoverChange}>
        {/* PopoverTrigger renders its own button natively, so we pass trigger classes directly */}
        <PopoverTrigger className="inline-flex items-center justify-between w-full px-3 py-2 text-xs font-normal bg-card border rounded-md shadow-xs h-9 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <span className="truncate">
            {currentSelectedIds.length > 0
              ? `${currentSelectedIds.length} component${
                  currentSelectedIds.length > 1 ? 's' : ''
                } selected`
              : 'Select fee components...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent className="w-[360px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search fee components..."
              className="text-xs"
            />
            <CommandList>
              <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                No fee components found.
              </CommandEmpty>
              <CommandGroup>
                {feeComponentsList.map((component) => {
                  const isSelectedHere = selectedHereSet.has(component.id);
                  const assignedToMilestone = componentAssignmentMap.get(
                    component.id
                  );
                  const isAssignedToAnotherMilestone =
                    assignedToMilestone !== undefined &&
                    assignedToMilestone !== index;

                  return (
                    <CommandItem
                      key={component.id}
                      value={`${component.name} ${component.code}`}
                      disabled={isAssignedToAnotherMilestone}
                      onSelect={() =>
                        onToggleComponent(index, component.id)
                      }
                      className={cn(
                        'flex items-center justify-between gap-3 py-3',
                        isAssignedToAnotherMilestone &&
                          'cursor-not-allowed opacity-50'
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <div
                          className={cn(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                            isSelectedHere
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground/40'
                          )}
                        >
                          {isSelectedHere && <Check className="h-3 w-3" />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">
                            {component.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {component.code}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          ₹{component.amount.toLocaleString('en-IN')}
                        </span>
                        {isAssignedToAnotherMilestone && (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <p className="text-[10px] text-muted-foreground">
        Each component can be assigned to only one milestone.
      </p>
    </div>
  );
}