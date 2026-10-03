import {
  MasterFact,
  TransformationOutput,
  GeneratedClaim,
  ConsistencyCheckItem,
  ClaimVerificationStatus,
} from '../src/types';

export function verifyTransformationOutput(
  output: TransformationOutput,
  allMasterFacts: MasterFact[]
): TransformationOutput {
  const factMap = new Map<string, MasterFact>();
  for (const f of allMasterFacts) {
    factMap.set(f.fact_id, f);
  }

  let totalClaims = 0;
  let verifiedClaims = 0;
  let reviewRequiredClaims = 0;
  let blockedClaims = 0;

  const verifiedSections = output.sections.map((section) => {
    const verifiedClaimsList = section.claims.map((claim) => {
      totalClaims++;
      const result = verifySingleClaim(claim, factMap);

      if (result.verification_status === 'VERIFIED') {
        verifiedClaims++;
      } else if (result.verification_status === 'REVIEW REQUIRED') {
        reviewRequiredClaims++;
      } else {
        blockedClaims++;
      }

      return result;
    });

    return {
      ...section,
      claims: verifiedClaimsList,
    };
  });

  const groundingScore =
    totalClaims > 0
      ? Math.round((verifiedClaims / totalClaims) * 100)
      : 100;

  const approvedFactsUsed = new Set<string>();
  for (const sec of verifiedSections) {
    for (const clm of sec.claims) {
      for (const fid of clm.supporting_fact_ids) {
        if (factMap.get(fid)?.status === 'approved') {
          approvedFactsUsed.add(fid);
        }
      }
    }
  }

  return {
    ...output,
    stats: {
      total_claims: totalClaims,
      verified_claims: verifiedClaims,
      review_required_claims: reviewRequiredClaims,
      blocked_claims: blockedClaims,
      grounding_score_percent: groundingScore,
      approved_facts_used: approvedFactsUsed.size,
    },
    sections: verifiedSections,
  };
}

export function verifySingleClaim(
  claim: GeneratedClaim,
  factMap: Map<string, MasterFact>
): GeneratedClaim {
  // 1. Check if supporting facts exist
  if (!claim.supporting_fact_ids || claim.supporting_fact_ids.length === 0) {
    return {
      ...claim,
      verification_status: 'UNSUPPORTED',
      verification_notes: 'No supporting Master Fact ID attached to this generated statement.',
      confidence_score: 0.0,
      source_citations: [],
    };
  }

  const citations: Array<{ fact_id: string; page: number; evidence_quote: string }> = [];
  let allApproved = true;
  let anyRejected = false;
  let anyPending = false;
  const missingFacts: string[] = [];

  for (const factId of claim.supporting_fact_ids) {
    const fact = factMap.get(factId);
    if (!fact) {
      missingFacts.push(factId);
      continue;
    }

    citations.push({
      fact_id: fact.fact_id,
      page: fact.source.page,
      evidence_quote: fact.source.evidence_quote,
    });

    if (fact.status === 'rejected') {
      anyRejected = true;
    } else if (fact.status !== 'approved') {
      allApproved = false;
      anyPending = true;
    }
  }

  if (missingFacts.length > 0) {
    return {
      ...claim,
      verification_status: 'UNSUPPORTED',
      verification_notes: `Cited Fact IDs do not exist in Master Facts repository: [${missingFacts.join(', ')}].`,
      confidence_score: 0.1,
      source_citations: citations,
    };
  }

  if (anyRejected) {
    return {
      ...claim,
      verification_status: 'BLOCKED',
      verification_notes: 'Generation blocked: refers to a Master Fact that was explicitly rejected by the human reviewer.',
      confidence_score: 0.0,
      source_citations: citations,
    };
  }

  if (anyPending || !allApproved) {
    return {
      ...claim,
      verification_status: 'REVIEW REQUIRED',
      verification_notes: 'Human review required: grounded in pending/unapproved Master Facts.',
      confidence_score: 0.75,
      source_citations: citations,
    };
  }

  // Check for suspicious numeric contradictions
  const claimNumbers = extractNumbers(claim.text);
  const factsNumbers = claim.supporting_fact_ids
    .map((fid) => factMap.get(fid))
    .filter(Boolean)
    .flatMap((f) => f!.values.flatMap(extractNumbers));

  // If claim introduces numbers that don't match any fact values
  const ungroundedNumbers = claimNumbers.filter(
    (num) => !factsNumbers.some((fn) => fn === num || num.includes(fn) || fn.includes(num))
  );

  if (ungroundedNumbers.length > 0 && factsNumbers.length > 0) {
    return {
      ...claim,
      verification_status: 'UNSUPPORTED',
      verification_notes: `Potential factual distortion: contains numbers (${ungroundedNumbers.join(', ')}) not found in supporting facts (${factsNumbers.join(', ')}).`,
      confidence_score: 0.3,
      source_citations: citations,
    };
  }

  return {
    ...claim,
    verification_status: 'VERIFIED',
    verification_notes: `Source-grounded & verified against ${citations.length} approved Master Fact(s).`,
    confidence_score: 0.98,
    source_citations: citations,
  };
}

function extractNumbers(text: string): string[] {
  const matches = text.match(/\b\d+(?:,\d+)*(?:\.\d+)?(?:\s*(?:crore|lakh|hours?|days?|years?|MMT|GW|MW|%|percent|Cr))?\b/gi);
  return matches ? matches.map((m) => m.toLowerCase().trim()) : [];
}

export function runCrossFormatConsistencyCheck(
  outputs: Record<string, TransformationOutput | null>,
  masterFacts: MasterFact[]
): ConsistencyCheckItem[] {
  const items: ConsistencyCheckItem[] = [];

  // Filter master facts that have numerical or deadline claims
  const criticalFacts = masterFacts.filter(
    (f) => f.status === 'approved' && (f.category === 'Deadline' || f.category === 'Number' || f.category === 'Penalty' || f.values.length > 0)
  );

  for (const fact of criticalFacts) {
    const occurrences: ConsistencyCheckItem['occurrences'] = [];
    const factId = fact.fact_id;

    for (const [formatKey, output] of Object.entries(outputs)) {
      if (!output) continue;

      const formatLabel =
        formatKey === 'executive_summary'
          ? 'Executive Summary'
          : formatKey === 'press_release'
          ? 'Press Release'
          : 'Citizen FAQ';

      // Find claims supporting this fact
      const matchingClaims: string[] = [];
      for (const section of output.sections) {
        for (const claim of section.claims) {
          if (claim.supporting_fact_ids.includes(factId)) {
            matchingClaims.push(claim.text);
          }
        }
      }

      if (matchingClaims.length > 0) {
        // Check if values match
        const claimText = matchingClaims.join(' ');
        let isConsistent = true;
        let discrepancyDetails: string | undefined = undefined;

        for (const val of fact.values) {
          // Normalizing for matching (e.g. "6 hours" or "6 (six) hours")
          const cleanVal = val.toLowerCase().replace(/[^a-z0-9]/g, '');
          const cleanClaim = claimText.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (cleanVal.length > 2 && !cleanClaim.includes(cleanVal)) {
            // Check numbers
            const nums = val.match(/\d+/g);
            if (nums && !nums.every((n) => claimText.includes(n))) {
              isConsistent = false;
              discrepancyDetails = `Value '${val}' from Fact ${factId} could not be precisely validated in ${formatLabel}.`;
            }
          }
        }

        occurrences.push({
          format: formatKey as any,
          format_label: formatLabel,
          extracted_statement: matchingClaims[0],
          is_consistent: isConsistent,
          discrepancy_details: discrepancyDetails,
        });
      }
    }

    if (occurrences.length > 0) {
      const hasDiscrepancy = occurrences.some((o) => !o.is_consistent);
      items.push({
        fact_id: factId,
        canonical_claim: fact.claim,
        category: fact.category,
        occurrences,
        overall_status: hasDiscrepancy ? 'discrepancy_detected' : 'consistent',
      });
    }
  }

  return items;
}
