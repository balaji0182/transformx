import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  FileText,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Layers,
  ShieldCheck,
  Search,
  Upload,
  UserCheck,
  HelpCircle,
} from 'lucide-react';
import { DocumentMetadata, UserRole } from '../types';
import { SupportedLanguage, translations } from '../utils/translations';

interface HeaderProps {
  document: DocumentMetadata | null;
  currentStep: number;
  onResetSession: () => void;
  onSelectStep: (step: number) => void;
  theme?: 'gov-light' | 'gov-dark';
  onToggleTheme?: () => void;
  fontSize?: 'normal' | 'large' | 'xlarge';
  onChangeFontSize?: (size: 'normal' | 'large' | 'xlarge') => void;
  language?: SupportedLanguage;
  onChangeLanguage?: (lang: SupportedLanguage) => void;
  userRole?: UserRole;
  onChangeUserRole?: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  document,
  currentStep,
  onResetSession,
  onSelectStep,
  theme = 'gov-light',
  onToggleTheme,
  language = 'EN',
  onChangeLanguage,
  userRole = 'Officer',
  onChangeUserRole,
}) => {
  const isDark = theme === 'gov-dark';
  const t = translations[language];
  const [isPipelineMenuOpen, setIsPipelineMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const pipelineSteps = [
    { number: 1, title: t.step1Title, tag: 'Upload' },
    { number: 2, title: t.step2Title, tag: 'Understand' },
    { number: 3, title: t.step3Title, tag: 'Master Facts' },
    { number: 4, title: t.step4Title, tag: 'Audience Studio' },
    { number: 5, title: t.step5Title, tag: 'Verify & Block' },
    { number: 6, title: t.step6Title, tag: 'Export & Sign-off' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* Top Main Navigation Bar (Clean Pill/Container UX4G Layout) */}
      <div
        className={`border-b backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 transition-colors ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-slate-100'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-6">
            <div
              className="flex items-center space-x-3 cursor-pointer group select-none"
              onClick={() => onSelectStep(1)}
            >
              {/* Modern Tech Brand Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <span>TX</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-xl tracking-tight leading-none text-slate-900 dark:text-white">
                    TRANSFORM<span className="text-indigo-600 dark:text-indigo-400">-X</span>
                  </h1>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    SIH26154
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 tracking-tight hidden sm:block">
                  {t.tagline}
                </p>
              </div>
            </div>

            {/* Navigation Menu Tabs */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Pipeline Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsPipelineMenuOpen(!isPipelineMenuOpen)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isDark
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Pipeline Flow</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isPipelineMenuOpen && (
                  <div
                    className={`absolute left-0 mt-2 w-64 rounded-xl shadow-xl border py-2 z-50 animate-in fade-in slide-in-from-top-1 ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/80'
                    }`}
                  >
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                      Transformation Pipeline
                    </div>
                    {pipelineSteps.map((step) => (
                      <button
                        key={step.number}
                        onClick={() => {
                          onSelectStep(step.number);
                          setIsPipelineMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors ${
                          currentStep === step.number
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{step.number}. {step.title}</span>
                        {currentStep === step.number && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Step Links */}
              <button
                onClick={() => onSelectStep(3)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  currentStep === 3
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.facts}
              </button>

              <button
                onClick={() => onSelectStep(4)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  currentStep === 4
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.transform}
              </button>

              <button
                onClick={() => onSelectStep(5)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  currentStep === 5
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.verify}
              </button>

              <button
                onClick={() => onSelectStep(6)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  currentStep === 6
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.export}
              </button>
            </nav>
          </div>

          {/* Right Controls: Role, Language, Theme, Action CTA */}
          <div className="flex items-center space-x-3">
            {/* Active Document Badge */}
            {document && (
              <div
                className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-mono ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-semibold max-w-[140px] truncate">{document.title || document.filename}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                  {document.pageCount}p
                </span>
              </div>
            )}

            {/* RBAC Role Selector */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline font-semibold">{userRole}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-44 rounded-xl shadow-xl border py-1.5 z-50 ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="px-3 py-1 text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Active RBAC Role
                  </div>
                  {(['Officer', 'Admin', 'Reviewer', 'Viewer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeUserRole?.(r);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                        userRole === r
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{r}</span>
                      {userRole === r && <CheckCircle2 className="w-3 h-3 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher Button */}
            <button
              onClick={() => onChangeLanguage?.(language === 'EN' ? 'TA' : 'EN')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-indigo-300 hover:bg-slate-750'
                  : 'bg-indigo-50/80 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              }`}
              title="Toggle English / Tamil language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'EN' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Toggle Light / Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Primary Action / Reset Button */}
            <button
              onClick={() => onSelectStep(1)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.uploadDocument}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Sub-Header */}
      <div
        className={`border-b text-xs px-4 sm:px-6 lg:px-8 py-2 transition-colors ${
          isDark
            ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
            : 'bg-slate-50/80 border-slate-200 text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] font-mono">
            <span
              className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={() => onSelectStep(1)}
            >
              {t.home}
            </span>
            <span>/</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {pipelineSteps.find((s) => s.number === currentStep)?.title || t.getStarted}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="hidden md:inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Deterministic Source Grounding Active
            </span>
            <button
              onClick={onResetSession}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t.resetSession}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
