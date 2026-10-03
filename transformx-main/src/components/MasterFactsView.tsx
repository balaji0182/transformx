import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Edit3,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  Quote,
  Layers,
  ChevronDown,
  Info,
  Check,
  X,
  Building2,
  Calendar,
  AlertCircle,
  Tag,
  Clock,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import { MasterFact, FactCategory, FactStatus } from '../types';
import { SupportedLanguage, translations } from '../utils/translations';

interface MasterFactsViewProps {
  facts: MasterFact[];
  onUpdateFact: (factId: string, status: FactStatus, editedClaim?: string, rejectionReason?: string) => Promise<void>;
  onBulkApprove: () => Promise<void>;
  onCreateFact: (claim: string, category: FactCategory, sourcePage: number, evidenceQuote: string) => Promise<void>;
  onProceedToTransform: () => void;
  isProcessing: boolean;
  theme?: 'gov-light' | 'gov-dark';
  language?: SupportedLanguage;
}

const CATEGORY_STYLES_LIGHT: Record<FactCategory, { bg: string; text: string; border: string }> = {
  Requirement: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Deadline: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  Date: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Number: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  Penalty: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  Authority: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  Entity: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Contact: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Scope: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  Process: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  Definition: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  Other: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
};

const CATEGORY_STYLES_DARK: Record<FactCategory, { bg: string; text: string; border: string }> = {
  Requirement: { bg: 'bg-blue-950/60', text: 'text-blue-300', border: 'border-blue-800' },
  Deadline: { bg: 'bg-rose-950/60', text: 'text-rose-300', border: 'border-rose-800' },
  Date: { bg: 'bg-amber-950/60', text: 'text-amber-300', border: 'border-amber-800' },
  Number: { bg: 'bg-slate-900', text: 'text-slate-200', border: 'border-slate-700' },
  Penalty: { bg: 'bg-red-950/60', text: 'text-red-300', border: 'border-red-800' },
  Authority: { bg: 'bg-indigo-950/60', text: 'text-indigo-300', border: 'border-indigo-800' },
  Entity: { bg: 'bg-purple-950/60', text: 'text-purple-300', border: 'border-purple-800' },
  Contact: { bg: 'bg-emerald-950/60', text: 'text-emerald-300', border: 'border-emerald-800' },
  Scope: { bg: 'bg-slate-900', text: 'text-slate-400', border: 'border-slate-800' },
  Process: { bg: 'bg-cyan-950/60', text: 'text-cyan-300', border: 'border-cyan-800' },
  Definition: { bg: 'bg-slate-900', text: 'text-slate-400', border: 'border-slate-800' },
  Other: { bg: 'bg-slate-900', text: 'text-slate-400', border: 'border-slate-800' },
};

export const MasterFactsView: React.FC<MasterFactsViewProps> = ({
  facts,
  onUpdateFact,
  onBulkApprove,
  onCreateFact,
  onProceedToTransform,
  isProcessing,
  theme = 'gov-light',
  language = 'EN',
}) => {
  const isDark = theme === 'gov-dark';
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [editingFactId, setEditingFactId] = useState<string | null>(null);
  const [editClaimText, setEditClaimText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New fact modal state
  const [newClaim, setNewClaim] = useState('');
  const [newCategory, setNewCategory] = useState<FactCategory>('Requirement');
  const [newPage, setNewPage] = useState(1);
  const [newQuote, setNewQuote] = useState('');

  // Counters
  const totalFacts = facts.length;
  const approvedFacts = facts.filter((f) => f.status === 'approved').length;
  const pendingFacts = facts.filter((f) => f.status === 'pending').length;
  const rejectedFacts = facts.filter((f) => f.status === 'rejected').length;
  const reviewRequiredFacts = facts.filter((f) => f.status === 'needs_review').length;

  const categoriesList: FactCategory[] = [
    'Requirement',
    'Deadline',
    'Date',
    'Number',
    'Penalty',
    'Authority',
    'Entity',
    'Contact',
    'Scope',
    'Process',
    'Definition',
    'Other',
  ];

  // Filtering
  const filteredFacts = facts.filter((f) => {
    const matchesSearch =
      searchQuery === '' ||
      f.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fact_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.entities.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.values.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || f.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStartEdit = (fact: MasterFact) => {
    setEditingFactId(fact.fact_id);
    setEditClaimText(fact.claim);
  };

  const handleSaveEdit = async (factId: string) => {
    if (editClaimText.trim()) {
      await onUpdateFact(factId, 'approved', editClaimText.trim());
      setEditingFactId(null);
    }
  };

  const handleCreateFactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newClaim.trim() && newQuote.trim()) {
      await onCreateFact(newClaim.trim(), newCategory, newPage, newQuote.trim());
      setNewClaim('');
      setNewQuote('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Control Bar */}
      <div
        className={`rounded-2xl p-6 border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Stage 03: Canonical Master Facts Ledger
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {facts.length} Verified Evidence Records
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Master Facts Knowledge Ledger</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Only approved facts are passed to the Multi-Audience Transformation Engine. Reject or edit ungrounded claims.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-indigo-600 dark:text-indigo-400" />
            <span>Add Custom Fact</span>
          </button>

          {pendingFacts > 0 && (
            <button
              onClick={onBulkApprove}
              disabled={isProcessing}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Approve All Pending ({pendingFacts})</span>
            </button>
          )}

          <button
            onClick={onProceedToTransform}
            disabled={approvedFacts === 0}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            <span>Proceed to Studio ({approvedFacts})</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>

      {/* Filter & Metric Bar */}
      <div
        className={`rounded-2xl p-4 border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search claims, entities, numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-xs pl-9 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Category & Status Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`p-2 rounded-xl border font-medium ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="ALL">All Categories ({totalFacts})</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat} ({facts.filter((f) => f.category === cat).length})
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`p-2 rounded-xl border font-medium ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="ALL">All Statuses ({totalFacts})</option>
            <option value="approved">Approved ({approvedFacts})</option>
            <option value="pending">Pending ({pendingFacts})</option>
            <option value="needs_review">Needs Review ({reviewRequiredFacts})</option>
            <option value="rejected">Rejected ({rejectedFacts})</option>
          </select>
        </div>
      </div>

      {/* Facts Card List */}
      <div className="space-y-3">
        {filteredFacts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed text-slate-500">
            No Master Facts found matching the active filters.
          </div>
        ) : (
          filteredFacts.map((fact) => {
            const catStyle = isDark
              ? CATEGORY_STYLES_DARK[fact.category] || CATEGORY_STYLES_DARK.Other
              : CATEGORY_STYLES_LIGHT[fact.category] || CATEGORY_STYLES_LIGHT.Other;

            const isApproved = fact.status === 'approved';
            const isRejected = fact.status === 'rejected';
            const isPending = fact.status === 'pending';

            return (
              <div
                key={fact.fact_id}
                className={`rounded-2xl p-5 border shadow-xs transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left content */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {fact.fact_id}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                        {fact.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        Page {fact.source.page}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {fact.status.toUpperCase()}
                      </span>
                    </div>

                    {editingFactId === fact.fact_id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editClaimText}
                          onChange={(e) => setEditClaimText(e.target.value)}
                          className={`w-full p-2.5 rounded-xl border text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                          rows={2}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveEdit(fact.fact_id)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                          >
                            Save Edit
                          </button>
                          <button
                            onClick={() => setEditingFactId(null)}
                            className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                        {fact.claim}
                      </p>
                    )}

                    {/* Verbatim Evidence Quote */}
                    <div
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                        isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Quote className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <p className="italic font-serif leading-relaxed text-[11px]">
                        "{fact.source.evidence_quote}"
                      </p>
                    </div>
                  </div>

                  {/* Right Human-in-the-loop review actions */}
                  <div className="flex sm:flex-col items-center justify-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => onUpdateFact(fact.fact_id, 'approved')}
                      disabled={isApproved}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 opacity-80 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isApproved ? 'Approved' : 'Approve'}</span>
                    </button>

                    <button
                      onClick={() => handleStartEdit(fact)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => onUpdateFact(fact.fact_id, 'rejected')}
                      disabled={isRejected}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        isRejected
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400 border border-rose-300 dark:border-rose-800 opacity-80 cursor-default'
                          : 'bg-slate-100 hover:bg-rose-100 hover:text-rose-800 text-slate-600 dark:bg-slate-800 dark:hover:bg-rose-950 dark:hover:text-rose-300 border border-slate-300 dark:border-slate-700 cursor-pointer'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Fact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Add Verified Master Fact</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFactSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1 uppercase text-[10px]">
                  Factual Claim
                </label>
                <textarea
                  required
                  rows={2}
                  value={newClaim}
                  onChange={(e) => setNewClaim(e.target.value)}
                  placeholder="e.g. Incident reporting must occur within 6 hours of initial detection."
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1 uppercase text-[10px]">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as FactCategory)}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1 uppercase text-[10px]">
                    Document Page #
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newPage}
                    onChange={(e) => setNewPage(Number(e.target.value))}
                    className={`w-full p-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1 uppercase text-[10px]">
                  Verbatim Source Evidence Quote
                </label>
                <textarea
                  required
                  rows={2}
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  placeholder="Paste the exact text snippet from the document proving this claim..."
                  className={`w-full p-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Add &amp; Approve Fact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
