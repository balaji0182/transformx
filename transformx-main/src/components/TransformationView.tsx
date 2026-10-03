import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Radio,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  Building,
  CheckSquare,
  Mail,
  Bell,
  Share2,
  BookOpen,
  Sliders,
  Layers,
  Package,
} from 'lucide-react';
import {
  MasterFact,
  TargetAudienceFormat,
  TransformationOutput,
  TransformationTone,
  TransformationLength,
  OutputLanguage,
} from '../types';
import { SupportedLanguage, translations } from '../utils/translations';

interface TransformationViewProps {
  facts: MasterFact[];
  outputs: Record<TargetAudienceFormat, TransformationOutput | null>;
  onTransform: (format: TargetAudienceFormat | 'all' | 'pack') => Promise<void>;
  onProceedToVerification: () => void;
  isProcessing: boolean;
  theme?: 'gov-light' | 'gov-dark';
  language?: SupportedLanguage;
}

export const TransformationView: React.FC<TransformationViewProps> = ({
  facts,
  outputs,
  onTransform,
  onProceedToVerification,
  isProcessing,
  theme = 'gov-light',
  language = 'EN',
}) => {
  const isDark = theme === 'gov-dark';
  const t = translations[language];
  const approvedFacts = facts.filter((f) => f.status === 'approved');
  const hasApprovedFacts = approvedFacts.length > 0;

  // Configuration controls state
  const [selectedTone, setSelectedTone] = useState<TransformationTone>('Formal');
  const [selectedLength, setSelectedLength] = useState<TransformationLength>('Medium');
  const [selectedOutputLang, setSelectedOutputLang] = useState<OutputLanguage>(
    language === 'TA' ? 'Tamil' : 'English'
  );
  const [activeTab, setActiveTab] = useState<'formats' | 'pack'>('formats');

  const formatList: Array<{
    format: TargetAudienceFormat;
    title: string;
    targetAudience: string;
    tone: string;
    icon: React.ElementType;
    description: string;
    badge: string;
  }> = [
    {
      format: 'executive_summary',
      title: t.executiveBrief,
      targetAudience: 'Ministers, Board Members, CXOs & Policy Directors',
      tone: 'Concise, Strategic, Decision-Oriented',
      icon: FileText,
      description: 'Condenses complex gazettes into 8-12 high-priority strategic mandates, compliance timelines, and financial liabilities.',
      badge: 'Executive',
    },
    {
      format: 'press_release',
      title: t.pressRelease,
      targetAudience: 'National Media, Industry Associations & General Public',
      tone: 'Authoritative, Journalistic, Formal',
      icon: Radio,
      description: 'Official press communication featuring standard dateline, key announcements, official spokesperson quotation, and official channels.',
      badge: 'Public & Media',
    },
    {
      format: 'citizen_faq',
      title: t.citizenFaq,
      targetAudience: 'Citizens, Small Enterprises, Regulated Entities',
      tone: 'Plain Language, Jargon-Free, Highly Accessible',
      icon: Users,
      description: 'Translates legalistic directives into clear Question & Answer pairs, answering what, when, how, and penalties in everyday terms.',
      badge: 'Public Access',
    },
    {
      format: 'official_email',
      title: t.officialEmail,
      targetAudience: 'Nodal Officers, District Collectors, Compliance Teams',
      tone: 'Administrative, Action-Oriented, Direct',
      icon: Mail,
      description: 'Formal advisory email with clear subject line, mandatory directives, deadline callouts, and reporting contact.',
      badge: 'Inter-Agency',
    },
    {
      format: 'public_notice',
      title: t.publicNotice,
      targetAudience: 'General Public & Commercial Entities',
      tone: 'Statutory, Legal Notice Layout',
      icon: Bell,
      description: 'Formal gazette notice clarifying applicability scope, statutory penalties, and compliance requirements.',
      badge: 'Gazette Notice',
    },
    {
      format: 'social_post',
      title: t.socialPost,
      targetAudience: 'Social Media Followers, Digital Communities',
      tone: 'Bite-Sized, High-Impact, Informative',
      icon: Share2,
      description: 'Series of informative social advisories highlighting core takeaways and links to official channels.',
      badge: 'Digital Outreach',
    },
    {
      format: 'briefing_note',
      title: t.briefingNote,
      targetAudience: 'Senior Secretaries, Appointed Advisors',
      tone: 'Analytical, High-Context, Brief',
      icon: BookOpen,
      description: 'One-page policy briefing note with strategic background, key provisions, risk analysis, and action recommendations.',
      badge: 'Briefing',
    },
  ];

  const anyOutputGenerated = Object.values(outputs).some((o) => o !== null);
  const generatedCount = Object.values(outputs).filter((o) => o !== null).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Transformation Controls */}
      <div
        className={`rounded-2xl p-6 border shadow-xs transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Stage 04: Multi-Audience Transformation Studio
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {approvedFacts.length} Approved Master Facts Loaded
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Controlled Audience Transformation Engine</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every transformed communication is mathematically derived exclusively from approved Master Facts. Statements cannot contain unsupported claims.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onTransform('pack')}
              disabled={!hasApprovedFacts || isProcessing}
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Package className="w-4 h-4 mr-1.5" />
              <span>{isProcessing ? 'Generating...' : t.generatePack}</span>
            </button>

            {anyOutputGenerated && (
              <button
                onClick={onProceedToVerification}
                className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <span>Audit &amp; Verify ({generatedCount})</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            )}
          </div>
        </div>

        {/* Global Transformation Configuration Sliders / Options */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Tone Selector */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              Communication Tone
            </label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value as TransformationTone)}
              className={`w-full p-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="Formal">Formal &amp; Authoritative</option>
              <option value="Conversational">Accessible &amp; Conversational</option>
              <option value="Urgent / Advisory">Urgent Compliance Advisory</option>
              <option value="Simplified Public">Simplified Public Guidance</option>
            </select>
          </div>

          {/* Length Selector */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              Detail Level
            </label>
            <select
              value={selectedLength}
              onChange={(e) => setSelectedLength(e.target.value as TransformationLength)}
              className={`w-full p-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="Short">Short (Executive Takeaways)</option>
              <option value="Medium">Medium (Standard Policy Format)</option>
              <option value="Detailed">Detailed (Exhaustive Grounding)</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              Output Language
            </label>
            <select
              value={selectedOutputLang}
              onChange={(e) => setSelectedOutputLang(e.target.value as OutputLanguage)}
              className={`w-full p-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="English">English</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Format Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {formatList.map((item) => {
          const Icon = item.icon;
          const output = outputs[item.format];
          const isGenerated = output !== null;

          return (
            <div
              key={item.format}
              className={`rounded-2xl p-6 border shadow-xs flex flex-col justify-between transition-all ${
                isGenerated
                  ? isDark
                    ? 'bg-slate-900 border-emerald-500/50 shadow-emerald-950/20'
                    : 'bg-white border-emerald-300 shadow-emerald-50'
                  : isDark
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Audience:</strong> {item.targetAudience}
                  </p>
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Tone:</strong> {item.tone}
                  </p>
                </div>
              </div>

              {/* Action Button & Status Strip */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {isGenerated ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    <CheckCircle className="w-4 h-4" />
                    <span>{output.stats.grounding_score_percent}% Grounded</span>
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">
                    Ready to generate
                  </span>
                )}

                <button
                  onClick={() => onTransform(item.format)}
                  disabled={!hasApprovedFacts || isProcessing}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isGenerated
                      ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>{isGenerated ? 'Regenerate' : 'Generate'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
