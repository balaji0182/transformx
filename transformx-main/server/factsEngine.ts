import { MasterFact, DocumentChunk, ExtractedPage, FactCategory } from '../src/types';
import { generateStructuredContent } from './gemini';
import { Type } from '@google/genai';

const FACT_SCHEMA = {
  type: Type.ARRAY,
  description: 'List of atomic master facts extracted from the document with verifiable evidence.',
  items: {
    type: Type.OBJECT,
    properties: {
      claim: {
        type: Type.STRING,
        description: 'Single atomic, declarative, unambiguous factual claim.',
      },
      category: {
        type: Type.STRING,
        description:
          'One of: Requirement, Deadline, Date, Number, Entity, Authority, Scope, Process, Penalty, Definition, Contact, Other',
      },
      entities: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Key named entities, departments, laws, or systems involved.',
      },
      values: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Concrete figures, time limits, monetary numbers, or dates in this fact.',
      },
      section: {
        type: Type.STRING,
        description: 'Section heading or paragraph location in this chunk.',
      },
      evidence_quote: {
        type: Type.STRING,
        description: 'Verbatim text snippet from the document chunk proving this claim. NEVER invent quotes.',
      },
      confidence: {
        type: Type.NUMBER,
        description: 'Confidence between 0.0 and 1.0 that this fact is explicitly grounded.',
      },
    },
    required: ['claim', 'category', 'evidence_quote', 'confidence'],
  },
};

export async function extractMasterFacts(
  chunks: DocumentChunk[],
  pages: ExtractedPage[]
): Promise<MasterFact[]> {
  const allExtractedFacts: MasterFact[] = [];
  let factCounter = 1;

  for (const chunk of chunks) {
    const chunkFacts = await extractFactsFromChunk(chunk, pages);
    for (const f of chunkFacts) {
      // Validate evidence quote exists in page or chunk text
      const page = pages.find((p) => p.pageNumber === chunk.pageNumber);
      const isQuotePresent = page
        ? page.text.toLowerCase().includes(f.source.evidence_quote.toLowerCase().slice(0, 30))
        : true;

      const factId = `F${String(factCounter).padStart(3, '0')}`;
      factCounter++;

      allExtractedFacts.push({
        ...f,
        fact_id: factId,
        confidence: isQuotePresent ? Math.max(0.7, f.confidence) : 0.4,
        status: isQuotePresent && f.confidence >= 0.8 ? 'pending' : 'needs_review',
      });
    }
  }

  // Deduplicate similar claims
  const deduplicated = deduplicateFacts(allExtractedFacts);
  return deduplicated;
}

async function extractFactsFromChunk(
  chunk: DocumentChunk,
  pages: ExtractedPage[]
): Promise<Omit<MasterFact, 'fact_id'>[]> {
  const prompt = `You are the Lead Master Facts Extraction Engine for TransformX.
Analyze the following document chunk from Page ${chunk.pageNumber} (${chunk.sectionTitle || 'General'}).

Extract ALL atomic, verifiable, unambiguous factual statements.
Rules:
1. Every claim MUST be grounded in a verbatim evidence quote from the chunk.
2. DO NOT invent facts, estimates, or external knowledge.
3. Categorize accurately into: Requirement, Deadline, Date, Number, Entity, Authority, Scope, Process, Penalty, Definition, Contact, Other.
4. Extract specific entities (organizations, acts, roles) and values (times, amounts, percentages).
5. If evidence is missing, DO NOT extract the claim.

CHUNK CONTENT (Page ${chunk.pageNumber}):
"""
${chunk.text}
"""`;

  const systemInstruction = `You are a strict legal and compliance factual extraction model.
You only extract facts with verbatim quotes from the input text. Never hallucinate.`;

  const aiResult = await generateStructuredContent<
    Array<{
      claim: string;
      category: string;
      entities?: string[];
      values?: string[];
      section?: string;
      evidence_quote: string;
      confidence: number;
    }>
  >(prompt, systemInstruction, FACT_SCHEMA);

  if (aiResult && Array.isArray(aiResult) && aiResult.length > 0) {
    return aiResult.map((item) => {
      const validCategory = normalizeCategory(item.category);
      return {
        claim: item.claim.trim(),
        category: validCategory,
        entities: item.entities || [],
        values: item.values || [],
        source: {
          page: chunk.pageNumber,
          section: item.section || chunk.sectionTitle || `Page ${chunk.pageNumber}`,
          evidence_quote: item.evidence_quote.trim(),
        },
        confidence: Math.min(1.0, Math.max(0.1, Number(item.confidence) || 0.9)),
        status: 'pending',
      };
    });
  }

  // Deterministic Fallback Rule-Based Extraction
  return extractFactsDeterministically(chunk);
}

function extractFactsDeterministically(chunk: DocumentChunk): Omit<MasterFact, 'fact_id'>[] {
  const text = chunk.text;
  const facts: Omit<MasterFact, 'fact_id'>[] = [];
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 15);

  for (const line of lines) {
    // Check for numbers, deadlines, penalties, requirements
    const isDeadline = /(?:within|before|by|deadline|period of|timeline|hours?|days?|years?|months?)/i.test(line);
    const isPenalty = /(?:punish|fine|imprisonment|penalty|liable|forfeit|₹|rupees|crore|lakh)/i.test(line);
    const isRequirement = /(?:shall|must|mandatory|obligat|require|need to|prohibit)/i.test(line);
    const isAuthority = /(?:ministry|cert-in|board|nodal|agency|director|officer|commission)/i.test(line);
    const isNumber = /[0-9]+(?:\.[0-9]+)?\s*(?:crore|lakh|mmt|gw|mw|%|percent|hours?|years?|days?)/i.test(line);

    if (isDeadline || isPenalty || isRequirement || isAuthority || isNumber) {
      let category: FactCategory = 'Other';
      if (isPenalty) category = 'Penalty';
      else if (isDeadline) category = 'Deadline';
      else if (isRequirement) category = 'Requirement';
      else if (isAuthority) category = 'Authority';
      else if (isNumber) category = 'Number';

      const entitiesMatch = line.match(/\b([A-Z][a-zA-Z0-9\-_]{2,}(?:\s+[A-Z][a-zA-Z0-9\-_]+)*)\b/g);
      const valuesMatch = line.match(/(?:₹\s*[\d,]+(?:\s*(?:crore|lakh))?|\b\d+\s*(?:hours?|days?|months?|years?|MMT|GW|MW|%|percent)\b)/gi);

      facts.push({
        claim: line.replace(/^[0-9]+[.)\s-]+/, '').trim(),
        category,
        entities: entitiesMatch ? Array.from(new Set(entitiesMatch)).slice(0, 4) : [],
        values: valuesMatch ? Array.from(new Set(valuesMatch)) : [],
        source: {
          page: chunk.pageNumber,
          section: chunk.sectionTitle || `Page ${chunk.pageNumber}`,
          evidence_quote: line.substring(0, 180),
        },
        confidence: 0.92,
        status: 'pending',
      });
    }
  }

  return facts.slice(0, 6);
}

function normalizeCategory(category: string): FactCategory {
  const allowed: FactCategory[] = [
    'Requirement',
    'Deadline',
    'Date',
    'Number',
    'Entity',
    'Authority',
    'Scope',
    'Process',
    'Penalty',
    'Definition',
    'Contact',
    'Other',
  ];
  const matched = allowed.find((c) => c.toLowerCase() === (category || '').toLowerCase());
  return matched || 'Other';
}

function deduplicateFacts(facts: MasterFact[]): MasterFact[] {
  const seenClaims = new Set<string>();
  const result: MasterFact[] = [];

  for (const fact of facts) {
    // Normalize claim text for comparison
    const key = fact.claim.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60);
    if (!seenClaims.has(key)) {
      seenClaims.add(key);
      result.push(fact);
    }
  }

  return result;
}
