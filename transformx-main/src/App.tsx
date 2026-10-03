import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PipelineStepper } from './components/PipelineStepper';
import { UploadView } from './components/UploadView';
import { DocumentInspectorView } from './components/DocumentInspectorView';
import { MasterFactsView } from './components/MasterFactsView';
import { TransformationView } from './components/TransformationView';
import { VerificationView } from './components/VerificationView';
import { ExportView } from './components/ExportView';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import {
  SessionData,
  DocumentMetadata,
  ExtractedPage,
  DocumentChunk,
  MasterFact,
  TransformationOutput,
  TargetAudienceFormat,
  ConsistencyCheckItem,
  AuditLogEntry,
  FactStatus,
  FactCategory,
  UserRole,
} from './types';
import { SupportedLanguage } from './utils/translations';

export function App() {
  const [sessionId, setSessionId] = useState<string>('demo-certin-session');
  const [document, setDocument] = useState<DocumentMetadata | null>(null);
  const [pages, setPages] = useState<ExtractedPage[]>([]);
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [facts, setFacts] = useState<MasterFact[]>([]);
  const [outputs, setOutputs] = useState<Record<TargetAudienceFormat, TransformationOutput | null>>({
    executive_summary: null,
    press_release: null,
    citizen_faq: null,
    official_email: null,
    public_notice: null,
    social_post: null,
    briefing_note: null,
  });
  const [consistencyChecks, setConsistencyChecks] = useState<ConsistencyCheckItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(3); // start on step 3 with pre-loaded demo
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // App Theme, Language & RBAC Role State
  const [theme, setTheme] = useState<'gov-light' | 'gov-dark'>('gov-light');
  const [language, setLanguage] = useState<SupportedLanguage>('EN');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [userRole, setUserRole] = useState<UserRole>('Senior Policy Officer');

  const isDark = theme === 'gov-dark';

  // Robust API Fetcher that handles HTML error pages, timeouts, and JSON failures gracefully
  const safeApiFetch = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `Server returned an invalid response (${res.status} ${res.statusText}). Recovery: Please verify document file integrity and retry.`
      );
    }
    if (!res.ok || data?.success === false) {
      throw new Error(data?.error || `Request failed with status code ${res.status}`);
    }
    return data;
  };

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'gov-light' ? 'gov-dark' : 'gov-light';
      if (next === 'gov-dark') {
        window.document.documentElement.classList.add('dark');
      } else {
        window.document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const handleChangeFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSize(size);
    const root = window.document.documentElement;
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${size}`);
  };

  const handleChangeLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  // Load initial session
  useEffect(() => {
    fetchSession(sessionId);
  }, []);

  const fetchSession = async (sId: string) => {
    try {
      const data = await safeApiFetch(`/api/session/${sId}`);
      if (data.session) {
        applySessionData(data.session);
      }
    } catch (err: any) {
      console.warn('[Session Sync Error]', err.message);
    }
  };

  const applySessionData = (session: SessionData) => {
    setSessionId(session.sessionId);
    setDocument(session.document);
    setPages(session.pages || []);
    setChunks(session.chunks || []);
    setFacts(session.facts || []);
    setOutputs(session.outputs || {
      executive_summary: null,
      press_release: null,
      citizen_faq: null,
      official_email: null,
      public_notice: null,
      social_post: null,
      briefing_note: null,
    });
    setConsistencyChecks(session.consistencyChecks || []);
    setAuditLogs(session.auditLogs || []);
    if (session.currentStep) {
      setCurrentStep(session.currentStep);
    }
  };

  // Upload File with Complete State Isolation & Zero Mock Fallbacks
  const handleUploadFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    // Completely reset prior document state to guarantee zero leakage
    setDocument(null);
    setPages([]);
    setChunks([]);
    setFacts([]);
    setOutputs({
      executive_summary: null,
      press_release: null,
      citizen_faq: null,
      official_email: null,
      public_notice: null,
      social_post: null,
      briefing_note: null,
    });
    setConsistencyChecks([]);

    const newSessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setSessionId(newSessionId);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', newSessionId);

      const data = await safeApiFetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      applySessionData(data.session);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Unable to extract content from this document: File could not be processed.');
      setCurrentStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  // Load Reference Benchmark Sample Document
  const handleLoadSample = async (sampleKey: string) => {
    setIsProcessing(true);
    setError(null);
    const newSessionId = `sample-sess-${Date.now()}`;
    setSessionId(newSessionId);

    try {
      const data = await safeApiFetch('/api/documents/load-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: newSessionId, sampleKey }),
      });

      applySessionData(data.session);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to load sample document.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Extract Master Facts strictly from current uploaded document
  const handleExtractFacts = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const data = await safeApiFetch('/api/facts/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      setFacts(data.facts);
      setCurrentStep(3);
      await fetchSession(sessionId);
    } catch (err: any) {
      setError(err.message || 'Master Facts extraction failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Update Fact (Approve, Edit, Reject)
  const handleUpdateFact = async (
    factId: string,
    status: FactStatus,
    editedClaim?: string,
    rejectionReason?: string
  ) => {
    try {
      const data = await safeApiFetch('/api/facts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          fact_id: factId,
          status,
          edited_claim: editedClaim,
          rejection_reason: rejectionReason,
        }),
      });

      if (data.fact) {
        setFacts((prev) =>
          prev.map((f) => (f.fact_id === factId ? data.fact : f))
        );
        await fetchSession(sessionId);
      }
    } catch (err: any) {
      console.error('[Fact Update Error]', err);
    }
  };

  // Bulk Approve Facts
  const handleBulkApprove = async () => {
    setIsProcessing(true);
    try {
      const data = await safeApiFetch('/api/facts/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (data.facts) {
        setFacts(data.facts);
        await fetchSession(sessionId);
      }
    } catch (err: any) {
      console.error('[Bulk Approve Error]', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Create Custom Verified Fact
  const handleCreateFact = async (
    claim: string,
    category: FactCategory,
    sourcePage: number,
    evidenceQuote: string
  ) => {
    try {
      const data = await safeApiFetch('/api/facts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          claim,
          category,
          source_page: sourcePage,
          evidence_quote: evidenceQuote,
        }),
      });

      if (data.fact) {
        setFacts((prev) => [...prev, data.fact]);
        await fetchSession(sessionId);
      }
    } catch (err: any) {
      console.error('[Create Fact Error]', err);
    }
  };

  // Transform Content (Single format or Incident Response Pack)
  const handleTransform = async (format: TargetAudienceFormat | 'all' | 'pack') => {
    setIsProcessing(true);
    setError(null);
    try {
      const data = await safeApiFetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, format }),
      });

      setOutputs(data.outputs);
      setConsistencyChecks(data.consistencyChecks || []);
      setCurrentStep(5);
      await fetchSession(sessionId);
    } catch (err: any) {
      setError(err.message || 'Transformation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Inject Test Unsupported Claim to demonstrate real-time blocker
  const handleInjectTestClaim = async (format: TargetAudienceFormat, scenario: string) => {
    setIsProcessing(true);
    try {
      const data = await safeApiFetch('/api/verify/inject-test-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, format, scenario }),
      });

      if (data.output) {
        setOutputs((prev) => ({
          ...prev,
          [format]: data.output,
        }));
        await fetchSession(sessionId);
      }
    } catch (err: any) {
      console.error('[Inject Test Claim Error]', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start New Isolated Session
  const handleResetSession = async () => {
    try {
      const data = await safeApiFetch('/api/session/new', { method: 'POST' });
      if (data.session) {
        applySessionData(data.session);
        setCurrentStep(1);
        setError(null);
      }
    } catch (err: any) {
      console.error('[Reset Session Error]', err);
    }
  };

  const hasDocument = document !== null;
  const hasFacts = facts.length > 0;
  const hasOutputs = Object.values(outputs).some((o) => o !== null);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark
          ? 'bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-300'
          : 'bg-[#F8FAFC] text-slate-900 selection:bg-indigo-600/20 selection:text-indigo-900'
      }`}
    >
      {/* Top Header with UX4G styling, role selection & language switcher */}
      <Header
        document={document}
        currentStep={currentStep}
        onResetSession={handleResetSession}
        onSelectStep={(step) => setCurrentStep(step)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        fontSize={fontSize}
        onChangeFontSize={handleChangeFontSize}
        language={language}
        onChangeLanguage={handleChangeLanguage}
        userRole={userRole}
        onChangeUserRole={setUserRole}
      />

      {/* 6-Stage Pipeline Stepper */}
      <PipelineStepper
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        hasDocument={hasDocument}
        hasFacts={hasFacts}
        hasOutputs={hasOutputs}
        theme={theme}
        language={language}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentStep === 1 && (
          <UploadView
            onUploadFile={handleUploadFile}
            onLoadSample={handleLoadSample}
            onNavigateToStep={(step) => setCurrentStep(step)}
            isProcessing={isProcessing}
            error={error}
            theme={theme}
            language={language}
          />
        )}

        {currentStep === 2 && (
          <DocumentInspectorView
            document={document}
            pages={pages}
            chunks={chunks}
            onExtractFacts={handleExtractFacts}
            isProcessing={isProcessing}
            hasFacts={hasFacts}
            onProceedToFacts={() => setCurrentStep(3)}
            theme={theme}
            language={language}
          />
        )}

        {currentStep === 3 && (
          <MasterFactsView
            facts={facts}
            onUpdateFact={handleUpdateFact}
            onBulkApprove={handleBulkApprove}
            onCreateFact={handleCreateFact}
            onProceedToTransform={() => setCurrentStep(4)}
            isProcessing={isProcessing}
            theme={theme}
            language={language}
          />
        )}

        {currentStep === 4 && (
          <TransformationView
            facts={facts}
            outputs={outputs}
            onTransform={handleTransform}
            onProceedToVerification={() => setCurrentStep(5)}
            isProcessing={isProcessing}
            theme={theme}
            language={language}
          />
        )}

        {currentStep === 5 && (
          <VerificationView
            outputs={outputs}
            facts={facts}
            consistencyChecks={consistencyChecks}
            onInjectTestClaim={handleInjectTestClaim}
            onProceedToExport={() => setCurrentStep(6)}
            isProcessing={isProcessing}
            theme={theme}
            language={language}
          />
        )}

        {currentStep === 6 && (
          <ExportView
            document={document}
            facts={facts}
            outputs={outputs}
            auditLogs={auditLogs}
            theme={theme}
            language={language}
          />
        )}
      </main>

      {/* Floating Accessibility Widget */}
      <AccessibilityWidget
        theme={theme}
        onToggleTheme={handleToggleTheme}
        fontSize={fontSize}
        onChangeFontSize={handleChangeFontSize}
        language={language}
        onChangeLanguage={handleChangeLanguage}
      />
    </div>
  );
}

export default App;
