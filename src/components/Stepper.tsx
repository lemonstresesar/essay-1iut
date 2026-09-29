import React from 'react';
import { Language } from '../types';
import { t } from '../utils/translations';
import { Check, User, Search, Paperclip, FileCheck, CheckCircle2 } from 'lucide-react';

interface StepperProps {
  currentStep: number; // 1 to 5
  lang: Language;
  onStepClick?: (step: number) => void;
  maxAccessibleStep?: number;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  lang,
  onStepClick,
  maxAccessibleStep = 5,
}) => {
  const steps = [
    { number: 1, key: 'step1' as const, icon: User },
    { number: 2, key: 'step2' as const, icon: Search },
    { number: 3, key: 'step3' as const, icon: Paperclip },
    { number: 4, key: 'step4' as const, icon: FileCheck },
    { number: 5, key: 'step5' as const, icon: CheckCircle2 },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200/80 shadow-xs sticky top-20 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        {/* Progress Bar Container */}
        <div className="relative">
          {/* Background Track Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0 hidden sm:block">
            {/* Active connecting bar */}
            <div
              className="h-full bg-[#2563eb] transition-all duration-300"
              style={{
                width: `${((Math.min(currentStep, 5) - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps List */}
          <div className="flex items-center justify-between relative z-10">
            {steps.map((step) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              const isClickable = onStepClick && step.number <= maxAccessibleStep && step.number < currentStep;
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  onClick={() => {
                    if (isClickable) onStepClick(step.number);
                  }}
                  className={`flex flex-col items-center group ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {/* Step Node Icon / Number */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 shadow-xs ${
                      isCompleted
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-600/30'
                        : isCurrent
                        ? 'bg-[#0f2544] text-white ring-4 ring-[#2563eb]/20 scale-105'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <div className="flex items-center gap-1">
                        <span>{step.number}</span>
                      </div>
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-[11px] sm:text-xs mt-1.5 font-semibold text-center whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'text-[#0f2544] font-bold'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {t(lang, step.key)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
