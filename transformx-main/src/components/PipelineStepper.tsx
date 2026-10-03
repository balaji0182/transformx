import React from 'react';
import {
  UploadCloud,
  FileSearch,
  CheckSquare,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Check,
  ArrowRight,
} from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/translations';

interface PipelineStepperProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  hasDocument: boolean;
  hasFacts: boolean;
  hasOutputs: boolean;
  theme?: 'gov-light' | 'gov-dark';
  language?: SupportedLanguage;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStep,
  onSelectStep,
  hasDocument,
  hasFacts,
  hasOutputs,
  theme = 'gov-light',
  language = 'EN',
}) => {
  const isDark = theme === 'gov-dark';
  const t = translations[language];

  const steps = [
    {
      number: 1,
      label: t.upload,
      sublabel: 'PDF / DOCX / OCR',
      icon: UploadCloud,
      enabled: true,
    },
    {
      number: 2,
      label: t.understand,
      sublabel: 'Clauses & Offsets',
      icon: FileSearch,
      enabled: hasDocument,
    },
    {
      number: 3,
      label: t.facts,
      sublabel: 'Evidence Ledger',
      icon: CheckSquare,
      enabled: hasFacts || hasDocument,
    },
    {
      number: 4,
      label: t.transform,
      sublabel: 'Multi-Format Studio',
      icon: Sparkles,
      enabled: hasFacts,
    },
    {
      number: 5,
      label: t.verify,
      sublabel: 'Claim-to-Fact Audit',
      icon: ShieldCheck,
      enabled: hasOutputs || hasFacts,
    },
    {
      number: 6,
      label: t.export,
      sublabel: 'Sign-off & Export',
      icon: FileCheck,
      enabled: hasOutputs,
    },
  ];

  return (
    <nav
      className={`border-b px-4 sm:px-6 lg:px-8 py-2.5 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}
      aria-label="Workflow Pipeline Stages"
    >
      <div className="max-w-7xl mx-auto">
        <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCurrent = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isClickable = step.enabled;

            return (
              <li key={step.number} className="w-full">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onSelectStep(step.number)}
                  className={`w-full flex items-center p-2 rounded-xl text-left transition-all border ${
                    isCurrent
                      ? isDark
                        ? 'bg-indigo-950/70 border-indigo-500/80 text-white ring-2 ring-indigo-500/30 shadow-md'
                        : 'bg-white border-indigo-600 text-indigo-950 ring-2 ring-indigo-500/20 shadow-md'
                      : isCompleted
                      ? isDark
                        ? 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                        : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                      : isDark
                      ? 'bg-slate-900/40 border-slate-800/40 text-slate-600 opacity-60 cursor-not-allowed'
                      : 'bg-slate-100/50 border-slate-200/60 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Step Number / Icon Badge */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2.5 flex-shrink-0 font-bold text-xs transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isDark
                        ? 'bg-slate-800 text-slate-500'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>

                  {/* Step Title & Subtitle */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold truncate leading-tight ${
                        isCurrent
                          ? isDark
                            ? 'text-indigo-300'
                            : 'text-indigo-900'
                          : isCompleted
                          ? isDark
                            ? 'text-slate-200'
                            : 'text-slate-800'
                          : isDark
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-[10px] truncate leading-tight font-medium ${
                        isCurrent
                          ? isDark
                            ? 'text-indigo-400/80'
                            : 'text-indigo-600'
                          : isDark
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.sublabel}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
