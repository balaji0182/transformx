import {
  SessionData,
  MasterFact,
  TransformationOutput,
  TargetAudienceFormat,
  AuditLogEntry,
} from '../src/types';
import { SAMPLE_DOCUMENTS } from './sampleDocuments';

class InMemorySessionStore {
  private sessions: Map<string, SessionData> = new Map();
  private sessionHistory: Array<{
    sessionId: string;
    documentId: string;
    filename: string;
    uploadTime: string;
    factCount: number;
    isSample: boolean;
  }> = [];

  constructor() {
    // Seed with initial benchmark session
    const defaultSample = SAMPLE_DOCUMENTS['cert-in-cybersecurity'];
    const initialSessionId = 'demo-certin-session';

    const defaultAuditLogs: AuditLogEntry[] = [
      {
        id: 'LOG-001',
        timestamp: new Date().toISOString(),
        actor: 'Compliance Officer (Demo)',
        action_type: 'UPLOAD',
        summary: 'Ingested official CERT-In Cyber Security Directions (No. 20(3)/2022-CERT-In/DIR-01)',
      },
      {
        id: 'LOG-002',
        timestamp: new Date().toISOString(),
        actor: 'Facts Engine v2.4',
        action_type: 'FACT_EXTRACT',
        summary: `Extracted ${defaultSample.preExtractedFacts.length} canonical Master Facts with page-level citations.`,
      },
    ];

    const initialSession: SessionData = {
      sessionId: initialSessionId,
      document: {
        id: defaultSample.id,
        filename: 'CERT-In_Directions_Cybersecurity_2026.pdf',
        fileSize: defaultSample.fileSize,
        pageCount: defaultSample.pageCount,
        uploadTime: new Date().toISOString(),
        mimeType: 'application/pdf',
        status: 'ready',
        isSample: true,
        sampleKey: 'cert-in-cybersecurity',
        title: defaultSample.title,
      },
      pages: defaultSample.pages.map((p) => ({
        pageNumber: p.pageNumber,
        sourceLocation: p.sourceLocation,
        text: p.text,
        charCount: p.text.length,
        isScannedDetected: false,
      })),
      chunks: defaultSample.pages.map((p, idx) => ({
        chunkId: `CHK-${String(idx + 1).padStart(3, '0')}`,
        pageNumber: p.pageNumber,
        chunkIndex: idx + 1,
        text: p.text,
        charStart: 0,
        charEnd: p.text.length,
        sectionTitle: p.sourceLocation,
      })),
      facts: JSON.parse(JSON.stringify(defaultSample.preExtractedFacts)),
      outputs: {
        executive_summary: null,
        press_release: null,
        citizen_faq: null,
        official_email: null,
        public_notice: null,
        social_post: null,
        briefing_note: null,
      },
      consistencyChecks: [],
      auditLogs: defaultAuditLogs,
      currentStep: 3,
      isProcessing: false,
    };

    this.sessions.set(initialSessionId, initialSession);
    this.sessionHistory.push({
      sessionId: initialSessionId,
      documentId: defaultSample.id,
      filename: 'CERT-In_Directions_Cybersecurity_2026.pdf',
      uploadTime: new Date().toISOString(),
      factCount: defaultSample.preExtractedFacts.length,
      isSample: true,
    });
  }

  public getSession(sessionId: string): SessionData {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = this.createNewSession(sessionId);
    }
    return session;
  }

  public createNewSession(sessionId: string = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`): SessionData {
    const session: SessionData = {
      sessionId,
      document: null,
      pages: [],
      chunks: [],
      facts: [],
      outputs: {
        executive_summary: null,
        press_release: null,
        citizen_faq: null,
        official_email: null,
        public_notice: null,
        social_post: null,
        briefing_note: null,
      },
      consistencyChecks: [],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'System',
          action_type: 'UPLOAD',
          summary: 'Initialized new isolated TransformX transformation session.',
        },
      ],
      currentStep: 1,
      isProcessing: false,
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  public updateSession(sessionId: string, updater: (session: SessionData) => void): SessionData {
    const session = this.getSession(sessionId);
    updater(session);
    this.sessions.set(sessionId, session);

    // Record into history if document exists
    if (session.document) {
      const existingHistIndex = this.sessionHistory.findIndex((h) => h.sessionId === sessionId);
      const historyEntry = {
        sessionId: session.sessionId,
        documentId: session.document.id,
        filename: session.document.filename,
        uploadTime: session.document.uploadTime,
        factCount: session.facts.length,
        isSample: !!session.document.isSample,
      };
      if (existingHistIndex >= 0) {
        this.sessionHistory[existingHistIndex] = historyEntry;
      } else {
        this.sessionHistory.unshift(historyEntry);
      }
    }

    return session;
  }

  public getSessionHistory() {
    return this.sessionHistory;
  }

  public addAuditLog(
    sessionId: string,
    action: AuditLogEntry['action_type'],
    summary: string,
    details?: Record<string, any>,
    actor: string = 'User'
  ) {
    const session = this.getSession(sessionId);
    session.auditLogs.unshift({
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor,
      action_type: action,
      summary,
      details,
    });
  }
}

export const sessionStore = new InMemorySessionStore();
