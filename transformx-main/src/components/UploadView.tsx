import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Shield,
  FileCheck,
  Zap,
  ArrowRight,
  AlertCircle,
  Clock,
  Building,
  CheckCircle2,
  Lock,
  Sparkles,
  Layers,
  CheckSquare,
  ShieldCheck,
  Award,
  ChevronRight,
  FileSearch,
} from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/translations';

interface UploadViewProps {
  onUploadFile: (file: File) => Promise<void>;
  onLoadSample: (sampleKey: string) => Promise<void>;
  onNavigateToStep?: (step: number) => void;
  isProcessing: boolean;
  error: string | null;
  theme?: 'gov-light' | 'gov-dark';
  language?: SupportedLanguage;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onUploadFile,
  onLoadSample,
  onNavigateToStep,
  isProcessing,
  error,
  theme = 'gov-light',
  language = 'EN',
}) => {
  const isDark = theme === 'gov-dark';
  const t = translations[language];
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      onUploadFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      onUploadFile(file);
    }
  };

  const workflowPaths = [
    {
      step: 1,
      title: 'Upload & Parse Document',
      desc: 'Ingest PDF, DOCX or TXT files with optical character recognition and clause segmentation.',
      icon: UploadCloud,
      badge: 'Step 01',
      badgeColor: isDark ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      step: 2,
      title: 'Inspect Source Clauses',
      desc: 'View extracted text, character offsets, and page boundaries to verify source fidelity.',
      icon: FileSearch,
      badge: 'Step 02',
      badgeColor: isDark ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      step: 3,
      title: 'Master Facts Ledger',
      desc: 'Categorized knowledge ledger of approved claims with verbatim page citations and confidence scores.',
      icon: CheckSquare,
      badge: 'Step 03',
      badgeColor: isDark ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      step: 4,
      title: 'Audience Studio',
      desc: 'Generate Executive Briefs, Press Releases, Citizen FAQs, Official Emails, and Public Notices.',
      icon: Sparkles,
      badge: 'Step 04',
      badgeColor: isDark ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      step: 5,
      title: 'Deterministic Grounding',
      desc: 'Interactive split-screen claim-to-fact linking with active anti-hallucination blocker.',
      icon: ShieldCheck,
      badge: 'Step 05',
      badgeColor: isDark ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      step: 6,
      title: 'Compliance Sign-off',
      desc: 'Human-in-the-loop review sign-off, DOCX export, and tamper-evident SHA-256 audit ledger.',
      icon: FileCheck,
      badge: 'Step 06',
      badgeColor: isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300',
    },
  ];

  const sampleDossiers = [
    {
      key: 'cert-in-cybersecurity',
      tag: 'Cybersecurity Directive',
      tagBadge: isDark ? 'bg-red-950/80 text-red-300 border-red-800' : 'bg-red-50 text-red-800 border-red-200',
      title: 'CERT-In Incident Reporting & Log Retention Directive',
      docNum: 'No. 20(3)/2022-CERT-In/DIR-01',
      dept: 'Indian Computer Emergency Response Team (CERT-In)',
      highlights: [
        'Mandatory 6-hour incident reporting window',
        '5-year rolling ICT system logs retention',
        '₹1 Crore penal liability under Section 70B(7)',
      ],
      pageCount: 3,
    },
    {
      key: 'green-hydrogen-mission',
      tag: 'Energy Policy',
      tagBadge: isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      title: 'National Green Hydrogen Mission Guidelines',
      docNum: 'MNRE/GH2/2024-26/POL-08',
      dept: 'Ministry of New and Renewable Energy',
      highlights: [
        '₹19,744 Crore total financial allocation',
        '5 MMT annual green hydrogen capacity by 2030',
        'Strategic Interventions (SIGHT) incentive scheme',
      ],
      pageCount: 2,
    },
    {
      key: 'dpdp-compliance-circular',
      tag: 'Data Governance',
      tagBadge: isDark ? 'bg-blue-950/80 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-800 border-blue-200',
      title: 'DPDP Statutory Advisory for Data Fiduciaries',
      docNum: 'DPBI/ADV/2026/04',
      dept: 'Data Protection Board of India',
      highlights: [
        '72-hour breach notice to DPBI and data principals',
        'Verifiable parental consent for minors under 18',
        'Up to ₹250 Crore penalty for personal data breach',
      ],
      pageCount: 2,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Hero Section (Matched with UX4G Reference Design) */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Display Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {t.heroHeading}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          {t.heroSubheading}
        </p>

        {/* Quick Integrity Proof Metric Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Deterministic Fact-Grounded
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active Anti-Hallucination Blocker
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold">
            <Award className="w-3.5 h-3.5" />
            Human-in-the-Loop Sign-off
          </span>
        </div>
      </div>

      {/* 2. Choose Your Path Section (Matched with UX4G Reference Grid) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.chooseYourPath}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.chooseYourPathDesc}
            </p>
          </div>
        </div>

        {/* 6 Path Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowPaths.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                onClick={() => onNavigateToStep?.(item.step)}
                className={`group relative p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col justify-between ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-indigo-100/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Workflow</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extraction & Ingestion Error Notice */}
      {error && (
        <div
          id="extraction-error-banner"
          className="p-5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/70 border-2 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 shadow-md space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-100">
                Document Extraction Notice
              </h4>
              <p className="text-xs leading-relaxed font-mono font-medium text-rose-800 dark:text-rose-200">
                {error}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-rose-200 dark:border-rose-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-rose-700 dark:text-rose-300 text-[11px]">
              Supported file types: Searchable PDFs, Word (.docx), Plain text (.txt, .md), and legible scans.
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Select Another File
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Document Upload & Sample Dossier Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload Desk (5 Cols) */}
        <div
          className={`lg:col-span-5 rounded-2xl p-6 border shadow-xs space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Upload New Document
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              PDF / TXT / DOCX
            </span>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[240px] ${
              dragActive
                ? isDark
                  ? 'border-indigo-400 bg-indigo-950/30'
                  : 'border-indigo-500 bg-indigo-50'
                : isDark
                ? 'border-slate-700 bg-slate-900/60 hover:border-indigo-400/80 hover:bg-slate-800/60'
                : 'border-slate-300 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,application/pdf,text/plain"
              onChange={handleFileChange}
              className="hidden"
              disabled={isProcessing}
            />

            {isProcessing ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-300 animate-pulse">
                  Decomposing document clauses &amp; pages...
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  OCR Engine &amp; Master Fact Extractor active
                </p>
              </div>
            ) : selectedFileName ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shadow-xs">
                  <FileCheck className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white max-w-[240px] truncate">
                  {selectedFileName}
                </p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  Click or drag another document to replace
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to browse or drag &amp; drop document
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Supports Policy Circulars, Gazettes, Directives &amp; SOPs
                  </p>
                </div>
                <span className="px-3 py-1 rounded-md text-[11px] font-semibold bg-indigo-600 text-white shadow-xs">
                  Select Document
                </span>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Zero-Retention Privacy Assurance</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
              Documents are processed in isolated sandboxes with deterministic bounding box and page-level citations. No training on user data.
            </p>
          </div>
        </div>

        {/* Right Column: Pre-Loaded Official Policy Dossiers (7 Cols) */}
        <div
          className={`lg:col-span-7 rounded-2xl p-6 border shadow-xs space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pre-Loaded Reference Policy Dossiers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any benchmark document for instant live pipeline evaluation
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              Instant Ready
            </span>
          </div>

          <div className="space-y-3">
            {sampleDossiers.map((sample) => (
              <div
                key={sample.key}
                onClick={() => !isProcessing && onLoadSample(sample.key)}
                className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-indigo-500/60'
                    : 'bg-slate-50/80 border-slate-200 hover:bg-white hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${sample.tagBadge}`}>
                        {sample.tag}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {sample.docNum}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {sample.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {sample.dept}
                    </p>
                  </div>

                  <button
                    disabled={isProcessing}
                    className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Key Highlight Bullets */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-slate-600 dark:text-slate-300">
                  {sample.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
