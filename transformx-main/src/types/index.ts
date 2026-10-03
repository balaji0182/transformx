export type FactCategory =
  | 'Requirement'
  | 'Deadline'
  | 'Date'
  | 'Number'
  | 'Entity'
  | 'Authority'
  | 'Scope'
  | 'Process'
  | 'Penalty'
  | 'Definition'
  | 'Contact'
  | 'Other';

export type FactStatus = 'pending' | 'approved' | 'edited' | 'rejected' | 'needs_review';

export type ClaimVerificationStatus = 'VERIFIED' | 'REVIEW REQUIRED' | 'UNSUPPORTED' | 'BLOCKED';

export interface FactSource {
  page: number;
  section?: string;
  evidence_quote: string;
  char_start?: number;
  char_end?: number;
}

export interface MasterFact {
  fact_id: string;
  claim: string;
  category: FactCategory;
  entities: string[];
  values: string[];
  source: FactSource;
  confidence: number;
  status: FactStatus;
  edited_claim?: string;
  rejection_reason?: string;
  created_at?: string;
  reviewed_at?: string;
}

export interface ExtractedPage {
  pageNumber: number;
  text: string;
  sourceLocation: string;
  charCount: number;
  isScannedDetected?: boolean;
}

export interface DocumentChunk {
  chunkId: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  charStart: number;
  charEnd: number;
  sectionTitle?: string;
}

export interface DocumentMetadata {
  id: string;
  filename: string;
  fileSize: number;
  pageCount: number;
  uploadTime: string;
  mimeType: string;
  status: 'uploaded' | 'extracted' | 'chunked' | 'facts_extracted' | 'ready' | 'error';
  errorMessage?: string;
  isSample?: boolean;
  sampleKey?: string;
  title?: string;
}

export interface GeneratedClaim {
  claim_id: string;
  text: string;
  supporting_fact_ids: string[];
  verification_status: ClaimVerificationStatus;
  verification_notes?: string;
  confidence_score?: number;
  source_citations?: {
    fact_id: string;
    page: number;
    evidence_quote: string;
  }[];
  flagged_inconsistencies?: string[];
}

export interface OutputSection {
  title?: string;
  type?: 'paragraph' | 'bullet_points' | 'faq_pair' | 'header' | 'quote' | 'callout';
  question?: string; // for FAQ
  answer?: string; // for FAQ
  speaker?: string; // for quote in press release
  claims: GeneratedClaim[];
}

export type TargetAudienceFormat =
  | 'executive_summary'
  | 'press_release'
  | 'citizen_faq'
  | 'official_email'
  | 'public_notice'
  | 'social_post'
  | 'briefing_note';

export type UserRole = 'Admin' | 'Officer' | 'Reviewer' | 'Viewer';

export type TransformationTone = 'Formal' | 'Conversational' | 'Urgent / Advisory' | 'Simplified Public';
export type TransformationLength = 'Short' | 'Medium' | 'Detailed';
export type OutputLanguage = 'English' | 'Tamil';

export interface TransformationConfig {
  format: TargetAudienceFormat;
  audience: string;
  tone: TransformationTone;
  language: OutputLanguage;
  length: TransformationLength;
}

export interface TransformationOutput {
  id: string;
  format: TargetAudienceFormat;
  title: string;
  subtitle?: string;
  dateline?: string;
  generated_at: string;
  stats: {
    total_claims: number;
    verified_claims: number;
    review_required_claims: number;
    blocked_claims: number;
    grounding_score_percent: number;
    approved_facts_used: number;
  };
  sections: OutputSection[];
  raw_markdown?: string;
  audit_hash: string;
}

export interface ConsistencyCheckItem {
  fact_id: string;
  canonical_claim: string;
  category: FactCategory;
  occurrences: {
    format: TargetAudienceFormat;
    format_label: string;
    extracted_statement: string;
    is_consistent: boolean;
    discrepancy_details?: string;
  }[];
  overall_status: 'consistent' | 'discrepancy_detected';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action_type: 'UPLOAD' | 'FACT_EXTRACT' | 'FACT_APPROVE' | 'FACT_EDIT' | 'FACT_REJECT' | 'TRANSFORM' | 'VERIFY' | 'INJECT_TEST_CLAIM' | 'EXPORT';
  summary: string;
  details?: Record<string, any>;
}

export interface SessionData {
  sessionId: string;
  document: DocumentMetadata | null;
  pages: ExtractedPage[];
  chunks: DocumentChunk[];
  facts: MasterFact[];
  outputs: Record<TargetAudienceFormat, TransformationOutput | null>;
  consistencyChecks: ConsistencyCheckItem[];
  auditLogs: AuditLogEntry[];
  currentStep: number;
  isProcessing: boolean;
  processingStage?: string;
  error?: string | null;
}
