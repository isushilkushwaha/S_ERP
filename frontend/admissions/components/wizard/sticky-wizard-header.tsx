"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface StepItem {
  id: number;
  title: string;
  description: string;
}

export const WIZARD_STEPS: StepItem[] = [
  { id: 1, title: "Select Student", description: "Search registered candidate" },
  { id: 2, title: "Verify Profile", description: "Review registration details" },
  { id: 3, title: "Academic Scope", description: "Class, section & roll number" },
  { id: 4, title: "Fee Assignment", description: "Review ledger items" },
  { id: 5, title: "Review & Confirm", description: "Atomic submission" },
];

export interface StickyWizardHeaderProps {
  currentStep: number;
}

export function StickyWizardHeader({ currentStep }: StickyWizardHeaderProps) {
  const totalSteps = WIZARD_STEPS.length;
  const clampedStep = Math.min(Math.max(currentStep, 1), totalSteps);
  
  // Calculate completion percentage: Step 1 = 20%, Step 5 = 100%
  const progressPercent = useMemo(() => {
    return Math.round((clampedStep / totalSteps) * 100);
  }, [clampedStep, totalSteps]);

  // Estimated remaining time calculation (~1 minute per step)
  const remainingMinutes = useMemo(() => {
    const remaining = totalSteps - clampedStep + 1;
    return Math.max(remaining, 1);
  }, [clampedStep, totalSteps]);

  const activeStepMeta = WIZARD_STEPS[clampedStep - 1];

  return (
    <header
      role="navigation"
      aria-label="Admission Wizard Progress"
      className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-all duration-200 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3.5">
        
        {/* TOP ROW: BREADCRUMBS, TITLE, AND PROGRESS SUMMARY */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: Breadcrumbs & Header Title */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>Admissions</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span>Student Admission</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                Step {clampedStep} of {totalSteps}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Admission Wizard</span>
              </h1>
              <Badge
                variant="outline"
                className="hidden sm:inline-flex text-[10px] font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 rounded-full px-2.5 py-0.5"
              >
                <Sparkles className="w-3 h-3 mr-1 text-blue-500" />
                {activeStepMeta?.title || "Active Setup"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Complete student admission in {totalSteps} simple steps
            </p>
          </div>

          {/* Right: Progress Meter & Time Estimate */}
          <div className="flex items-center justify-between md:justify-end gap-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-xl">
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-medium">
                ~{remainingMinutes} min{remainingMinutes > 1 ? "s" : ""} remaining
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-24 sm:w-32">
                <Progress value={progressPercent} className="h-2 bg-slate-200 dark:bg-slate-800" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 min-w-[36px] text-right">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: CONTINUOUS TIMELINE STEPPER */}
        <div className="relative pt-2 pb-1">
          {/* Timeline Connector Bar Background */}
          <div className="hidden md:block absolute top-[22px] left-[32px] right-[32px] h-[2.5px] bg-slate-200 dark:bg-slate-800 z-0" />
          
          {/* Animated Active Progress Line Fill */}
          <motion.div
            className="hidden md:block absolute top-[22px] left-[32px] h-[2.5px] bg-gradient-to-r from-emerald-500 via-blue-500 to-blue-600 z-0 rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${Math.max(0, Math.min(100, ((clampedStep - 1) / (totalSteps - 1)) * 100))}%`,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />

          {/* Steps Horizontal Container */}
          <TooltipProvider>
            <ol className="relative z-10 flex items-center justify-between overflow-x-auto snap-x custom-scrollbar gap-4 md:gap-2 pb-2 md:pb-0">
              {WIZARD_STEPS.map((step) => {
                const isCompleted = clampedStep > step.id;
                const isCurrent = clampedStep === step.id;
                const isPending = clampedStep < step.id;

                return (
                  <li
                    key={step.id}
                    className="flex-1 min-w-[140px] md:min-w-0 snap-start"
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className={cn(
                            "group flex items-center md:flex-col md:text-center gap-2.5 p-1.5 md:p-0 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                            isCurrent && "bg-blue-50/50 dark:bg-blue-950/20 md:bg-transparent"
                          )}
                        >
                          {/* Circular Step Indicator Badge */}
                          <div className="relative shrink-0">
                            {isCurrent && (
                              <motion.span
                                layoutId="activeStepPulse"
                                className="absolute -inset-1 rounded-full bg-blue-500/20 dark:bg-blue-500/30 animate-pulse"
                                transition={{ duration: 0.2 }}
                              />
                            )}

                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={cn(
                                "relative w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-200 border shadow-xs",
                                isCompleted &&
                                  "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-500 shadow-emerald-500/20",
                                isCurrent &&
                                  "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-500 ring-4 ring-blue-500/20 shadow-blue-500/30",
                                isPending &&
                                  "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800"
                              )}
                            >
                              <AnimatePresence mode="wait">
                                {isCompleted ? (
                                  <motion.div
                                    key="check"
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                  </motion.div>
                                ) : (
                                  <motion.span
                                    key="number"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                  >
                                    {step.id}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </div>

                          {/* Step Text Label Block */}
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "text-xs font-semibold leading-tight truncate transition-colors",
                                isCompleted && "text-slate-800 dark:text-slate-200",
                                isCurrent && "text-blue-600 dark:text-blue-400 font-bold",
                                isPending && "text-slate-400 dark:text-slate-500"
                              )}
                            >
                              {step.title}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        <p className="font-semibold">{step.title}</p>
                        <p className="text-[10px] text-slate-400">{step.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ol>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}