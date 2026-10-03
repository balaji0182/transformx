import {
  MasterFact,
  TargetAudienceFormat,
  TransformationOutput,
  OutputSection,
  GeneratedClaim,
} from '../src/types';
import { generateStructuredContent } from './gemini';
import { Type } from '@google/genai';
import crypto from 'crypto';

const TRANSFORMATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'Format-appropriate title.' },
    subtitle: { type: Type.STRING, description: 'Optional subtitle or brief context.' },
    dateline: { type: Type.STRING, description: 'For press release (e.g. NEW DELHI, FEB 2026).' },
    sections: {
      type: Type.ARRAY,
      description: 'Structured sections of the transformed content.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Section heading.' },
          type: {
            type: Type.STRING,
            description: 'One of: paragraph, bullet_points, faq_pair, header, quote, callout',
          },
          question: { type: Type.STRING, description: 'Only for Citizen FAQ questions.' },
          answer: { type: Type.STRING, description: 'Only for Citizen FAQ answers.' },
          speaker: { type: Type.STRING, description: 'Only for Press Release official quote attribution.' },
          claims: {
            type: Type.ARRAY,
            description: 'List of individual sentences/bullet points with strict fact citations.',
            items: {
              type: Type.OBJECT,
              properties: {
                text: {
                  type: Type.STRING,
                  description: 'The exact generated statement.',
                },
                supporting_fact_ids: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Array of Fact IDs (e.g. ["F001", "F002"]) that strictly support this claim.',
                },
              },
              required: ['text', 'supporting_fact_ids'],
            },
          },
        },
        required: ['claims'],
      },
    },
  },
  required: ['title', 'sections'],
};

export async function transformContent(
  format: TargetAudienceFormat,
  approvedFacts: MasterFact[],
  documentTitle: string = 'Authoritative Policy Document'
): Promise<TransformationOutput> {
  if (approvedFacts.length === 0) {
    throw new Error('No approved master facts available for transformation. Please approve facts first.');
  }

  // Format the approved facts into a clean catalog
  const factsCatalog = approvedFacts
    .map(
      (f) =>
        `[${f.fact_id}] (${f.category}): ${f.claim} | Values: [${f.values.join(', ')}] | Entities: [${f.entities.join(', ')}] | Page ${f.source.page}: "${f.source.evidence_quote}"`
    )
    .join('\n');

  const audiencePrompts: Record<TargetAudienceFormat, { title: string; prompt: string; system: string }> = {
    executive_summary: {
      title: 'Executive Brief',
      prompt: `Generate an Executive Brief for decision-makers and senior leadership.
Document: "${documentTitle}"

APPROVED MASTER FACTS (Strict Source of Truth):
${factsCatalog}

REQUIREMENTS:
1. Executive, decision-oriented, highly concise tone.
2. Structure into logical sections (e.g. Strategic Mandates, Critical Timelines, Financial & Legal Implications, Immediate Actions Required).
3. 8-12 crisp bullet points / sentences.
4. EVERY single bullet point or statement MUST map to at least one approved Fact ID (e.g. ["F001"]).
5. DO NOT introduce ANY fact, date, number, penalty, or rule not in the approved list.`,
      system: `You are the TransformX Senior Executive Communications Engine.
Your strict mandate is: Transform the communication style, NEVER transform the facts.
Every single claim must cite its supporting approved Fact ID.`,
    },
    press_release: {
      title: 'Press Release',
      prompt: `Generate an Official Press Release for media, industry stakeholders, and public dissemination.
Document: "${documentTitle}"

APPROVED MASTER FACTS (Strict Source of Truth):
${factsCatalog}

REQUIREMENTS:
1. Standard journalistic press release layout: Strong headline, official Dateline, opening summary paragraph, key policy highlights, spokesperson quote section, and call-to-action / compliance note.
2. Neutral, authoritative, clear language.
3. Every sentence/claim MUST be tagged with the supporting Fact IDs.
4. DO NOT invent details, dates, or figures not present in the approved facts.`,
      system: `You are the TransformX Official Press & Public Information Engine.
Maintain complete journalistic rigor and 100% adherence to approved source facts.`,
    },
    citizen_faq: {
      title: 'Citizen & Stakeholder FAQ',
      prompt: `Generate a Citizen & Public FAQ in accessible, plain, non-jargon language.
Document: "${documentTitle}"

APPROVED MASTER FACTS (Strict Source of Truth):
${factsCatalog}

REQUIREMENTS:
1. Convert technical/legal requirements into clear "Question" and "Answer" pairs that normal citizens and small businesses can easily understand.
2. Avoid legalistic jargon while maintaining 100% factual accuracy of dates, deadlines, penalties, and contact emails.
3. Every Q&A item MUST specify the supporting Fact IDs used to construct the answer.`,
      system: `You are the TransformX Public Accessibility & Citizen FAQ Engine.
Translate complex policy into crystal-clear everyday language while keeping all numbers, rules, and facts 100% accurate.`,
    },
    official_email: {
      title: 'Official Advisory Email',
      prompt: `Generate an Official Advisory Email to nodal officers and regulated entities.
Document: "${documentTitle}"

APPROVED MASTER FACTS (Strict Source of Truth):
${factsCatalog}

REQUIREMENTS:
1. Clear subject line, administrative salutation, key compliance directives, critical deadlines, and designated contact channel.
2. Direct, actionable, and formal tone.
3. Every requirement or deadline must cite supporting Fact IDs.`,
      system: `You are the TransformX Official Advisory Email Generator.`,
    },
    public_notice: {
      title: 'Public Notice',
      prompt: `Generate a formal Public Notice for general publication.
Document: "${documentTitle}"

APPROVED MASTER FACTS (Strict Source of Truth):
${factsCatalog}

REQUIREMENTS:
1. Legal clarity, formal notice layout, scope of applicability, statutory obligations, and public inquiries point of contact.
2. Every item must cite supporting Fact IDs.`,
      system: `You are the TransformX Public Notice Transformation Engine.`,
    },
    social_post: {
      title: 'Social Media Awareness Advisory',
      prompt: `Generate a series of informative social media posts (e.g. LinkedIn / X thread) summarizing the key takeaways for the public.
Document: "${documentTitle}"

APPROVED MASTER FACTS (Strict Source of Truth):
${factsCatalog}

REQUIREMENTS:
1. Concise, high-impact bullet points with relevant advisory hashtags.
2. Every factual statement must cite supporting Fact IDs.`,
      system: `You are the TransformX Social Media Public Information Engine.`,
    },
    briefing_note: {
      title: 'Ministerial / Leadership Briefing Note',
      prompt: `Generate a concise 1-page Briefing Note for senior leadership review.
Document: "${documentTitle}"

APPROVED MASTER FACTS (Strict Source of Truth):
${factsCatalog}

REQUIREMENTS:
1. Issue summary, strategic context, key provisions, risk assessment / penalty exposure, and recommended next steps.
2. Every claim must cite supporting Fact IDs.`,
      system: `You are the TransformX Policy Briefing Note Generator.`,
    },
  };

  const selectedConfig = audiencePrompts[format];

  const aiResult = await generateStructuredContent<{
    title: string;
    subtitle?: string;
    dateline?: string;
    sections: Array<{
      title?: string;
      type?: string;
      question?: string;
      answer?: string;
      speaker?: string;
      claims: Array<{ text: string; supporting_fact_ids: string[] }>;
    }>;
  }>(selectedConfig.prompt, selectedConfig.system, TRANSFORMATION_SCHEMA);

  let rawSections: OutputSection[] = [];
  let title = `${selectedConfig.title}: ${documentTitle}`;
  let subtitle = '';
  let dateline = format === 'press_release' ? 'NEW DELHI, INDIA' : undefined;

  if (aiResult && aiResult.sections && aiResult.sections.length > 0) {
    title = aiResult.title || title;
    subtitle = aiResult.subtitle || '';
    dateline = aiResult.dateline || dateline;
    
    let claimIndex = 1;
    rawSections = aiResult.sections.map((sec) => ({
      title: sec.title,
      type: (sec.type as any) || 'paragraph',
      question: sec.question,
      answer: sec.answer,
      speaker: sec.speaker,
      claims: (sec.claims || []).map((c) => ({
        claim_id: `CLM-${format.slice(0, 3).toUpperCase()}-${String(claimIndex++).padStart(3, '0')}`,
        text: c.text,
        supporting_fact_ids: c.supporting_fact_ids || [],
        verification_status: 'VERIFIED',
      })),
    }));
  } else {
    // Deterministic High-Quality Generation Fallback
    rawSections = buildDeterministicSections(format, approvedFacts, documentTitle);
  }

  // Create initial transformation output object
  const auditString = `${format}-${approvedFacts.map((f) => f.fact_id).join(',')}-${Date.now()}`;
  const auditHash = crypto.createHash('sha256').update(auditString).digest('hex').substring(0, 16);

  return {
    id: `OUT-${format.toUpperCase()}-${Date.now()}`,
    format,
    title,
    subtitle,
    dateline,
    generated_at: new Date().toISOString(),
    stats: {
      total_claims: 0,
      verified_claims: 0,
      review_required_claims: 0,
      blocked_claims: 0,
      grounding_score_percent: 100,
      approved_facts_used: approvedFacts.length,
    },
    sections: rawSections,
    audit_hash: `TX-SHA256-${auditHash.toUpperCase()}`,
  };
}

function buildDeterministicSections(
  format: TargetAudienceFormat,
  facts: MasterFact[],
  docTitle: string
): OutputSection[] {
  let claimCounter = 1;

  if (format === 'executive_summary') {
    return [
      {
        title: 'Core Mandates & Directives',
        type: 'bullet_points',
        claims: facts
          .filter((f) => f.category === 'Requirement' || f.category === 'Scope')
          .slice(0, 4)
          .map((f) => ({
            claim_id: `CLM-EXE-${String(claimCounter++).padStart(3, '0')}`,
            text: f.claim,
            supporting_fact_ids: [f.fact_id],
            verification_status: 'VERIFIED',
          })),
      },
      {
        title: 'Key Timelines & Financial Parameters',
        type: 'bullet_points',
        claims: facts
          .filter((f) => f.category === 'Deadline' || f.category === 'Number' || f.category === 'Date')
          .slice(0, 4)
          .map((f) => ({
            claim_id: `CLM-EXE-${String(claimCounter++).padStart(3, '0')}`,
            text: f.claim,
            supporting_fact_ids: [f.fact_id],
            verification_status: 'VERIFIED',
          })),
      },
      {
        title: 'Governance & Penal Liabilities',
        type: 'bullet_points',
        claims: facts
          .filter((f) => f.category === 'Penalty' || f.category === 'Authority' || f.category === 'Contact')
          .slice(0, 3)
          .map((f) => ({
            claim_id: `CLM-EXE-${String(claimCounter++).padStart(3, '0')}`,
            text: f.claim,
            supporting_fact_ids: [f.fact_id],
            verification_status: 'VERIFIED',
          })),
      },
    ];
  } else if (format === 'press_release') {
    return [
      {
        title: 'Executive Announcement',
        type: 'paragraph',
        claims: facts.slice(0, 2).map((f) => ({
          claim_id: `CLM-PRE-${String(claimCounter++).padStart(3, '0')}`,
          text: `In a landmark directive concerning ${docTitle}, authorities have established that ${f.claim.toLowerCase().replace(/^all\b/, 'all')}`,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
      {
        title: 'Key Highlights & Framework',
        type: 'bullet_points',
        claims: facts.slice(2, 6).map((f) => ({
          claim_id: `CLM-PRE-${String(claimCounter++).padStart(3, '0')}`,
          text: f.claim,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
      {
        title: 'Compliance & Official Channels',
        type: 'callout',
        claims: facts.slice(6, 8).map((f) => ({
          claim_id: `CLM-PRE-${String(claimCounter++).padStart(3, '0')}`,
          text: f.claim,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
    ];
  } else if (format === 'official_email') {
    return [
      {
        title: 'Subject & Purpose',
        type: 'paragraph',
        claims: facts.slice(0, 1).map((f) => ({
          claim_id: `CLM-EML-${String(claimCounter++).padStart(3, '0')}`,
          text: `URGENT COMPLIANCE ADVISORY: Regarding ${docTitle} — Mandatory directive that ${f.claim.toLowerCase()}`,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
      {
        title: 'Mandatory Compliance Actions & Deadlines',
        type: 'bullet_points',
        claims: facts.filter((f) => f.category === 'Requirement' || f.category === 'Deadline').slice(0, 4).map((f) => ({
          claim_id: `CLM-EML-${String(claimCounter++).padStart(3, '0')}`,
          text: f.claim,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
      {
        title: 'Designated Communication Channels & Support',
        type: 'callout',
        claims: facts.filter((f) => f.category === 'Contact' || f.category === 'Authority' || f.category === 'Penalty').slice(0, 3).map((f) => ({
          claim_id: `CLM-EML-${String(claimCounter++).padStart(3, '0')}`,
          text: f.claim,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
    ];
  } else if (format === 'public_notice') {
    return [
      {
        title: 'Statutory Notice & Scope',
        type: 'paragraph',
        claims: facts.filter((f) => f.category === 'Scope' || f.category === 'Authority').slice(0, 2).map((f) => ({
          claim_id: `CLM-NOT-${String(claimCounter++).padStart(3, '0')}`,
          text: f.claim,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
      {
        title: 'Directives & Public Requirements',
        type: 'bullet_points',
        claims: facts.filter((f) => f.category === 'Requirement' || f.category === 'Deadline').slice(0, 5).map((f) => ({
          claim_id: `CLM-NOT-${String(claimCounter++).padStart(3, '0')}`,
          text: f.claim,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
      {
        title: 'Legal Consequences of Non-Compliance',
        type: 'callout',
        claims: facts.filter((f) => f.category === 'Penalty').slice(0, 2).map((f) => ({
          claim_id: `CLM-NOT-${String(claimCounter++).padStart(3, '0')}`,
          text: f.claim,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
    ];
  } else if (format === 'social_post') {
    return [
      {
        title: 'Key Takeaway Thread #1 (Core Mandate)',
        type: 'paragraph',
        claims: facts.slice(0, 2).map((f) => ({
          claim_id: `CLM-SOC-${String(claimCounter++).padStart(3, '0')}`,
          text: `📢 Important Advisory: Under ${docTitle}, ${f.claim}`,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
      {
        title: 'Key Takeaway Thread #2 (Timelines & Actions)',
        type: 'bullet_points',
        claims: facts.filter((f) => f.category === 'Deadline' || f.category === 'Requirement').slice(0, 3).map((f) => ({
          claim_id: `CLM-SOC-${String(claimCounter++).padStart(3, '0')}`,
          text: `⏱️ ${f.claim}`,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
      {
        title: 'Official Channel Links',
        type: 'callout',
        claims: facts.filter((f) => f.category === 'Contact' || f.category === 'Authority').slice(0, 2).map((f) => ({
          claim_id: `CLM-SOC-${String(claimCounter++).padStart(3, '0')}`,
          text: `🔗 Official Point of Contact: ${f.claim}`,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
    ];
  } else if (format === 'briefing_note') {
    return [
      {
        title: '1. Strategic Background & Context',
        type: 'paragraph',
        claims: facts.slice(0, 2).map((f) => ({
          claim_id: `CLM-BRF-${String(claimCounter++).padStart(3, '0')}`,
          text: f.claim,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
      {
        title: '2. Key Operational Provisions & Timelines',
        type: 'bullet_points',
        claims: facts.filter((f) => f.category === 'Requirement' || f.category === 'Deadline').slice(0, 4).map((f) => ({
          claim_id: `CLM-BRF-${String(claimCounter++).padStart(3, '0')}`,
          text: f.claim,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
      {
        title: '3. Risk Analysis & Legal Enforceability',
        type: 'callout',
        claims: facts.filter((f) => f.category === 'Penalty' || f.category === 'Authority').slice(0, 3).map((f) => ({
          claim_id: `CLM-BRF-${String(claimCounter++).padStart(3, '0')}`,
          text: f.claim,
          supporting_fact_ids: [f.fact_id],
          verification_status: 'VERIFIED',
        })),
      },
    ];
  } else {
    // citizen_faq
    return facts.slice(0, 6).map((f, idx) => {
      const qText = generateCitizenQuestion(f);
      return {
        title: `Question ${idx + 1}`,
        type: 'faq_pair',
        question: qText,
        answer: f.claim,
        claims: [
          {
            claim_id: `CLM-FAQ-${String(claimCounter++).padStart(3, '0')}`,
            text: f.claim,
            supporting_fact_ids: [f.fact_id],
            verification_status: 'VERIFIED',
          },
        ],
      };
    });
  }
}

function generateCitizenQuestion(fact: MasterFact): string {
  if (fact.category === 'Deadline') {
    return `What are the critical deadlines and reporting time limits I must adhere to?`;
  }
  if (fact.category === 'Penalty') {
    return `What are the legal consequences and penalties for non-compliance?`;
  }
  if (fact.category === 'Number') {
    return `What are the key financial allocations, metrics, and production targets?`;
  }
  if (fact.category === 'Contact') {
    return `How and where can citizens or organisations contact the authorities or submit reports?`;
  }
  if (fact.category === 'Authority') {
    return `Which government agency or nodal authority oversees this policy?`;
  }
  return `What is the key requirement under this directive?`;
}
