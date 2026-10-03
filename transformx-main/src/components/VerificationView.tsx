import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Radio,
  Users,
  Quote,
  Sparkles,
  Zap,
  ArrowRight,
  ChevronRight,
  Lock,
  Layers,
  Bug,
  Info,
  ExternalLink,
  RotateCcw,
  CheckSquare,
  Mail,
  Bell,
  Share2,
  BookOpen,
} from 'lucide-react';
import {
  TargetAudienceFormat,
  TransformationOutput,
  MasterFact,
  GeneratedClaim,
  ConsistencyCheckItem,
} from '../types';
import { SupportedLanguage, translations } from '../utils/translations';

interface VerificationViewProps {
  outputs: Record<TargetAudienceFormat, TransformationOutput | null>;
  facts: MasterFact[];
  consistencyChecks: ConsistencyCheckItem[];
  onInjectTestClaim: (format: TargetAudienceFormat, scenario: string) => Promise<void>;
  onProceedToExport: () => void;
  isProcessing: boolean;
  theme?: 'gov-light' | 'gov-dark';
  language?: SupportedLanguage;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  outputs,
  facts,
  consistencyChecks,
  onInjectTestClaim,
  onProceedToExport,
  isProcessing,
  theme = 'gov-light',
  language = 'EN',
}) => {
  const isDark = theme === 'gov-dark';
  const t = translations[language];

  // Find first available format
  const availableFormats = (Object.keys(outputs) as TargetAudienceFormat[]).filter(
    (fmt) => outputs[fmt] !== null
  );

  const [activeFormat, setActiveFormat] = useState<TargetAudienceFormat>(
    availableFormats[0] || 'executive_summary'
  );
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'verification' | 'consistency'>('verification');
  const [selectedScenario, setSelectedScenario] = useState<string>('deadline_distortion');

  const currentOutput = outputs[activeFormat];
  const factMap = new Map<string, MasterFact>();
  facts.forEach((f) => factMap.set(f.fact_id, f));

  // Flatten all claims from the active format
  const allClaims: GeneratedClaim[] = currentOutput
    ? currentOutput.sections.flatMap((s) => s.claims)
    : [];

  // Selected claim or default to first
  const selectedClaim =
    allClaims.find((c) => c.claim_id === selectedClaimId) || allClaims[0] || null;

  const supportingFacts = selectedClaim
    ? (selectedClaim.supporting_fact_ids.map((fid) => factMap.get(fid)).filter(Boolean) as MasterFact[])
    : [];

  const formatLabels: Record<TargetAudienceFormat, { label: string; icon: React.ElementType }> = {
    executive_summary: { label: t.executiveBrief, icon: FileText },
    press_release: { label: t.pressRelease, icon: Radio },
    citizen_faq: { label: t.citizenFaq, icon: Users },
    official_email: { label: t.officialEmail, icon: Mail },
    public_notice: { label: t.publicNotice, icon: Bell },
    social_post: { label: t.socialPost, icon: Share2 },
    briefing_note: { label: t.briefingNote, icon: BookOpen },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div
        className={`rounded-2xl p-6 border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Stage 05: Claim-to-Fact Verification Engine
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Zero-Hallucination Grounding
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Claim Verification &amp; Evidence Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Every generated claim is bidirectionally mapped to canonical Master Facts and verbatim source page evidence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onProceedToExport}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>Proceed to Sign-off &amp; Export</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>

      {/* Adversarial Blocker Simulator Banner */}
      <div
        className={`border rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
          isDark
            ? 'bg-rose-950/20 border-rose-800 text-white'
            : 'bg-rose-50/70 border-rose-200 text-slate-900'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 border border-rose-200 dark:border-rose-700 flex items-center justify-center text-rose-700 dark:text-rose-300 flex-shrink-0 mt-0.5">
            <Bug className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-rose-200">
                Interactive Anti-Hallucination Blocker Test
              </h3>
              <span className="text-[10px] font-mono bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-100 px-2 py-0.2 rounded-full font-bold">
                Live Simulation
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Inject synthetic ungrounded claims (e.g. false 48-hr deadline, inflated ₹500 Cr penalty) to observe the engine actively intercepting and blocking unverified text.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className={`text-xs p-2 rounded-lg border font-mono ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-white focus:border-rose-500'
                : 'bg-white border-slate-300 text-slate-900 focus:border-rose-600'
            }`}
          >
            <option value="deadline_distortion">Inject False Deadline (48h instead of 6h)</option>
            <option value="penalty_inflation">Inject Inflated Penalty (₹500 Crore)</option>
            <option value="rejected_fact_leak">Inject Rejected Master Fact</option>
          </select>

          <button
            onClick={() => onInjectTestClaim(activeFormat, selectedScenario)}
            disabled={!currentOutput || isProcessing}
            className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 mr-1" />
            Trigger Test Blocker
          </button>
        </div>
      </div>

      {/* Tabs & Format Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        {/* Format Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {(Object.keys(formatLabels) as TargetAudienceFormat[]).map((fmt) => {
            const hasData = outputs[fmt] !== null;
            const isSelected = activeFormat === fmt;
            const formatMeta = formatLabels[fmt];
            const Icon = formatMeta.icon;

            return (
              <button
                key={fmt}
                disabled={!hasData}
                onClick={() => {
                  setActiveFormat(fmt);
                  setSelectedClaimId(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : hasData
                    ? isDark
                      ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                      : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200'
                    : 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600 border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{formatMeta.label}</span>
                {hasData && (
                  <span className="ml-1 text-[10px] font-mono opacity-80">
                    ({outputs[fmt]?.stats.total_claims})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'verification'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Claim Verification
          </button>
          <button
            onClick={() => setActiveTab('consistency')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'consistency'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Cross-Format Consistency ({consistencyChecks.length})
          </button>
        </div>
      </div>

      {/* Main Verification Split Screen */}
      {activeTab === 'verification' ? (
        currentOutput ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Generated Content with Interactive Statement Clicks (7 Cols) */}
            <div
              className={`lg:col-span-7 border rounded-2xl p-6 shadow-xs space-y-4 ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Output Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                    {formatLabels[currentOutput.format]?.label || currentOutput.format}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    Hash: {currentOutput.audit_hash}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {currentOutput.title}
                </h3>
              </div>

              {/* Sections & Interactive Claim Blocks */}
              <div className="space-y-5">
                {currentOutput.sections.map((sec, secIdx) => (
                  <div key={secIdx} className="space-y-2">
                    {sec.title && (
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        {sec.title}
                      </h4>
                    )}

                    {sec.type === 'faq_pair' ? (
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Q: {sec.question}
                        </p>
                        <div className="space-y-1.5 pl-3 border-l-2 border-indigo-500">
                          {sec.claims.map((claim) => (
                            <ClaimCard
                              key={claim.claim_id}
                              claim={claim}
                              isSelected={selectedClaim?.claim_id === claim.claim_id}
                              onSelect={() => setSelectedClaimId(claim.claim_id)}
                              isDark={isDark}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {sec.claims.map((claim) => (
                          <ClaimCard
                            key={claim.claim_id}
                            claim={claim}
                            isSelected={selectedClaim?.claim_id === claim.claim_id}
                            onSelect={() => setSelectedClaimId(claim.claim_id)}
                            isDark={isDark}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Bidirectional Source Grounding & Evidence Inspector (5 Cols) */}
            <div
              className={`lg:col-span-5 border rounded-2xl p-6 shadow-xs space-y-4 sticky top-24 ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Quote className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Supporting Source Grounding</span>
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedClaim?.claim_id || 'SELECT CLAIM'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Verbatim page citation and proof for selected statement
                </p>
              </div>

              {selectedClaim ? (
                <div className="space-y-4">
                  {/* Selected Claim Summary Box */}
                  <div
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      selectedClaim.verification_status === 'VERIFIED'
                        ? isDark
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : selectedClaim.verification_status === 'BLOCKED'
                        ? isDark
                          ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                        : isDark
                        ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold font-mono text-[10px] mb-1">
                      <span>CLAIM ID: {selectedClaim.claim_id}</span>
                      <span>STATUS: {selectedClaim.verification_status}</span>
                    </div>
                    <p className="font-medium">"{selectedClaim.text}"</p>
                    {selectedClaim.verification_notes && (
                      <p className="text-[11px] font-mono mt-2 pt-2 border-t border-current/20 opacity-90">
                        {selectedClaim.verification_notes}
                      </p>
                    )}
                  </div>

                  {/* Supporting Master Facts */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Approved Master Facts ({supportingFacts.length})
                    </h4>

                    {supportingFacts.length > 0 ? (
                      supportingFacts.map((fact) => (
                        <div
                          key={fact.fact_id}
                          className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono text-[10px]">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              [{fact.fact_id}] {fact.category}
                            </span>
                            <span className="px-2 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold">
                              Page {fact.source.page}
                            </span>
                          </div>

                          <p className="font-semibold text-slate-900 dark:text-white">
                            {fact.claim}
                          </p>

                          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                            <span className="text-slate-400 font-bold mr-1">"</span>
                            {fact.source.evidence_quote}
                            <span className="text-slate-400 font-bold ml-1">"</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-rose-300 text-center text-xs text-rose-700 dark:text-rose-300">
                        <XCircle className="w-5 h-5 mx-auto mb-1 text-rose-500" />
                        <p className="font-bold">No Supporting Master Fact Found</p>
                        <p className="text-[11px] opacity-80">This statement is flagged as ungrounded or synthetic.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  Select any statement on the left to inspect its supporting source proof.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl border border-dashed text-slate-500">
            No transformations generated yet. Please generate outputs in Stage 04 first.
          </div>
        )
      ) : (
        /* Cross-Format Consistency Matrix */
        <div
          className={`border rounded-2xl p-6 shadow-xs space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cross-Format Fact Consistency Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Validates that numbers, dates, and penalties remain 100% identical across all generated formats.
            </p>
          </div>

          <div className="space-y-3">
            {consistencyChecks.map((item) => (
              <div
                key={item.fact_id}
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  item.overall_status === 'consistent'
                    ? isDark
                      ? 'bg-slate-800/40 border-slate-700'
                      : 'bg-slate-50 border-slate-200'
                    : isDark
                    ? 'bg-rose-950/30 border-rose-800'
                    : 'bg-rose-50 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    [{item.fact_id}] {item.canonical_claim}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      item.overall_status === 'consistent'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    {item.overall_status === 'consistent' ? 'CONSISTENT' : 'DISCREPANCY DETECTED'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  {item.occurrences.map((occ, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]"
                    >
                      <p className="font-mono font-bold text-slate-500">{occ.format_label}</p>
                      <p className="text-slate-800 dark:text-slate-200 mt-1">"{occ.extracted_statement}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ClaimCardProps {
  claim: GeneratedClaim;
  isSelected: boolean;
  onSelect: () => void;
  isDark: boolean;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claim, isSelected, onSelect, isDark }) => {
  const isVerified = claim.verification_status === 'VERIFIED';
  const isBlocked = claim.verification_status === 'BLOCKED';

  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-indigo-500 shadow-xs'
          : 'hover:border-indigo-300 dark:hover:border-slate-600'
      } ${
        isVerified
          ? isDark
            ? 'bg-slate-800/40 border-slate-700 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
          : isBlocked
          ? isDark
            ? 'bg-rose-950/30 border-rose-800 text-rose-200'
            : 'bg-rose-50 border-rose-300 text-rose-900'
          : isDark
          ? 'bg-amber-950/30 border-amber-800 text-amber-200'
          : 'bg-amber-50 border-amber-300 text-amber-900'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-mono text-[10px] text-slate-400 font-bold">
          {claim.claim_id}
        </span>
        <span
          className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded-full ${
            isVerified
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : isBlocked
              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}
        >
          {claim.verification_status}
        </span>
      </div>
      <p className="font-normal leading-relaxed">{claim.text}</p>
    </div>
  );
};
