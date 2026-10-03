import React, { useState } from 'react';
import {
  FileText,
  Layers,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  FileSearch,
  CheckCircle,
  Hash,
  BookOpen,
  Bookmark,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { DocumentMetadata, ExtractedPage, DocumentChunk } from '../types';
import { SupportedLanguage, translations } from '../utils/translations';

interface DocumentInspectorViewProps {
  document: DocumentMetadata | null;
  pages: ExtractedPage[];
  chunks: DocumentChunk[];
  onExtractFacts: () => Promise<void>;
  isProcessing: boolean;
  hasFacts: boolean;
  onProceedToFacts: () => void;
  theme?: 'gov-light' | 'gov-dark';
  language?: SupportedLanguage;
}

export const DocumentInspectorView: React.FC<DocumentInspectorViewProps> = ({
  document,
  pages,
  chunks,
  onExtractFacts,
  isProcessing,
  hasFacts,
  onProceedToFacts,
  theme = 'gov-light',
  language = 'EN',
}) => {
  const isDark = theme === 'gov-dark';
  const t = translations[language];
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'pages' | 'chunks'>('pages');
  const [searchQuery, setSearchQuery] = useState('');

  const currentPage = pages[selectedPageIndex] || pages[0];
  const pageChunks = chunks.filter((c) => c.pageNumber === (currentPage?.pageNumber || 1));

  const filteredChunks = searchQuery
    ? chunks.filter((c) => c.text.toLowerCase().includes(searchQuery.toLowerCase()) || c.sectionTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    : pageChunks;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Document Summary Card */}
      <div
        className={`rounded-2xl p-6 border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Stage 02: Source Clause Decomposition
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              ID: {document?.id || 'DOC-UNASSIGNED'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {document?.title || document?.filename}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
            <span>
              Total Pages: <strong className="text-slate-900 dark:text-white">{pages.length}</strong>
            </span>
            <span>•</span>
            <span>
              Extracted Clauses: <strong className="text-slate-900 dark:text-white">{chunks.length}</strong>
            </span>
            <span>•</span>
            <span>
              Character Count:{' '}
              <strong className="text-slate-900 dark:text-white">
                {pages.reduce((a, b) => a + b.charCount, 0).toLocaleString()}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasFacts ? (
            <button
              onClick={onProceedToFacts}
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <span>Review Master Facts</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          ) : (
            <button
              onClick={onExtractFacts}
              disabled={isProcessing}
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>{isProcessing ? 'Extracting Master Facts...' : 'Extract Master Facts'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Page Index & Clause Navigator (4 Cols) */}
        <div
          className={`lg:col-span-4 rounded-2xl p-5 border shadow-xs space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Document Page Index</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500">
              {pages.length} Pages
            </span>
          </div>

          {/* Page Selector Tabs */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                onClick={() => setSelectedPageIndex(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedPageIndex === idx
                    ? isDark
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-xs'
                      : 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-xs'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Page {p.pageNumber}</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {p.charCount.toLocaleString()} chars
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate font-mono">
                  {p.sourceLocation}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Verbatim Source Clause Viewer (8 Cols) */}
        <div
          className={`lg:col-span-8 rounded-2xl p-6 border shadow-xs space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Verbatim Text — Page {currentPage?.pageNumber}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {currentPage?.sourceLocation}
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search clause text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`text-xs pl-8 pr-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Extracted Verbatim Text Content */}
          <div
            className={`p-5 rounded-xl border text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto ${
              isDark
                ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {currentPage?.text}
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing Page {currentPage?.pageNumber} of {pages.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={selectedPageIndex === 0}
                onClick={() => setSelectedPageIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                Previous Page
              </button>
              <button
                disabled={selectedPageIndex === pages.length - 1}
                onClick={() => setSelectedPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
