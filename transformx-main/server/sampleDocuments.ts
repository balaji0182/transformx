import { MasterFact } from '../src/types';

export interface SampleDocument {
  id: string;
  key: string;
  title: string;
  description: string;
  department: string;
  docNumber: string;
  dateIssued: string;
  pageCount: number;
  fileSize: number;
  pages: {
    pageNumber: number;
    sourceLocation: string;
    text: string;
  }[];
  preExtractedFacts: MasterFact[];
}

export const SAMPLE_DOCUMENTS: Record<string, SampleDocument> = {
  'cert-in-cybersecurity': {
    id: 'doc-certin-2026',
    key: 'cert-in-cybersecurity',
    title: 'CERT-In Directions under Section 70B(6) of IT Act, 2000 on Information Security Practices',
    description: 'Mandatory cybersecurity incident reporting, time synchronization, and 5-year log retention directives for all public and private service providers.',
    department: 'Indian Computer Emergency Response Team (CERT-In), Ministry of Electronics & IT',
    docNumber: 'No. 20(3)/2022-CERT-In/DIR-01',
    dateIssued: 'January 14, 2026',
    pageCount: 3,
    fileSize: 245760,
    pages: [
      {
        pageNumber: 1,
        sourceLocation: 'Page 1 - Scope and Time Synchronization',
        text: `GOVERNMENT OF INDIA
MINISTRY OF ELECTRONICS AND INFORMATION TECHNOLOGY
INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In)
ELECTRONICS NIKETAN, 6, CGO COMPLEX, NEW DELHI - 110003

DIRECTION UNDER SUB-SECTION (6) OF SECTION 70B OF THE INFORMATION TECHNOLOGY ACT, 2000

Subject: Directions relating to information security practices, procedure, prevention, response and reporting of cyber incidents for Safe & Trusted Internet.

1. Scope and Applicability:
These directions shall apply to all service providers, intermediaries, data centres, body corporate, and Government organisations operating within the territory of India or serving users in India.

2. Mandatory Time Synchronization:
(i) All service providers, intermediaries, data centres and body corporate shall connect to the Network Time Protocol (NTP) Server of National Physical Laboratory (NPL) or National Informatics Centre (NIC) or NTP servers traceable to these NTP servers, for synchronization of all their ICT system clocks.
(ii) Maintenance of accurate system logs with synchronized timestamps across all critical digital infrastructure is strictly mandatory to enable forensic analysis.`,
      },
      {
        pageNumber: 2,
        sourceLocation: 'Page 2 - Mandatory Incident Reporting & Log Retention',
        text: `3. Mandatory Reporting of Cyber Incidents within 6 Hours:
(i) Any service provider, intermediary, data centre, body corporate and Government organisation shall mandatorily report cyber incidents specified in Annexure-I to CERT-In within 6 (six) hours of noticing such incidents or being brought to notice about such incidents.
(ii) Incidents to be reported include unauthorized access of IT systems, ransomware attacks, identity theft, data breaches, targeted scanning/probing, and compromise of critical systems.
(iii) The cyber incidents can be reported to CERT-In via email at incident@cert-in.org.in or through the incident reporting portal at https://www.cert-in.org.in.

4. Retention of ICT System Logs for 5 Years:
(i) All service providers, intermediaries, data centres, body corporate and Government organisations shall enable and securely maintain all logs of their ICT systems for a rolling period of 5 (five) consecutive years within the Indian jurisdiction.
(ii) The logs shall be readily provided to CERT-In upon direction or requisition during cybersecurity investigations.`,
      },
      {
        pageNumber: 3,
        sourceLocation: 'Page 3 - Governance, Point of Contact & Penalties',
        text: `5. Designation of Point of Contact (PoC):
(i) Every organisation covered under these directions shall designate a Point of Contact (PoC) and intimate CERT-In in the prescribed format with full contact coordinates (name, designation, email, mobile phone).
(ii) The designated PoC shall be available 24x7 to receive communications and coordinates with CERT-In during critical threat advisories.

6. Know-Your-Customer (KYC) for Cloud & VPN Providers:
(i) Data centres, Virtual Private Server (VPS) providers, Cloud Service providers and Virtual Private Network (VPN) service providers shall register and maintain accurate verified customer names, ownership patterns, IP addresses allocated, and email addresses for a minimum period of 5 years.

7. Penal Provisions for Non-Compliance:
(i) Non-compliance with these directions shall invite punitive action under sub-section (7) of section 70B of the Information Technology Act, 2000.
(ii) Any service provider or corporate entity failing to comply with these directions may be punished with imprisonment for a term which may extend to one year or with a fine up to ₹1,00,00,000 (Rupees One Crore), or with both.`,
      },
    ],
    preExtractedFacts: [
      {
        fact_id: 'F001',
        claim: 'All service providers, intermediaries, data centres, body corporate, and Government organisations operating in India must synchronize all ICT system clocks with NTP servers of NPL or NIC.',
        category: 'Requirement',
        entities: ['CERT-In', 'National Physical Laboratory (NPL)', 'National Informatics Centre (NIC)'],
        values: ['NTP Servers', 'NPL', 'NIC'],
        source: {
          page: 1,
          section: 'Section 2(i) - Mandatory Time Synchronization',
          evidence_quote: 'All service providers, intermediaries, data centres and body corporate shall connect to the Network Time Protocol (NTP) Server of National Physical Laboratory (NPL) or National Informatics Centre (NIC)',
        },
        confidence: 0.98,
        status: 'approved',
      },
      {
        fact_id: 'F002',
        claim: 'Cyber security incidents specified in Annexure-I must be reported to CERT-In within 6 hours of detection.',
        category: 'Deadline',
        entities: ['CERT-In', 'Service Providers', 'Intermediaries'],
        values: ['6 hours', 'Annexure-I'],
        source: {
          page: 2,
          section: 'Section 3(i) - Mandatory Reporting of Cyber Incidents',
          evidence_quote: 'shall mandatorily report cyber incidents specified in Annexure-I to CERT-In within 6 (six) hours of noticing such incidents',
        },
        confidence: 0.99,
        status: 'approved',
      },
      {
        fact_id: 'F003',
        claim: 'Cyber incidents can be reported to CERT-In via incident@cert-in.org.in or the incident reporting portal.',
        category: 'Contact',
        entities: ['CERT-In'],
        values: ['incident@cert-in.org.in', 'https://www.cert-in.org.in'],
        source: {
          page: 2,
          section: 'Section 3(iii) - Reporting Channels',
          evidence_quote: 'cyber incidents can be reported to CERT-In via email at incident@cert-in.org.in or through the incident reporting portal at https://www.cert-in.org.in',
        },
        confidence: 0.97,
        status: 'approved',
      },
      {
        fact_id: 'F004',
        claim: 'All organisations must securely maintain and retain all ICT system logs for a rolling period of 5 consecutive years within Indian jurisdiction.',
        category: 'Requirement',
        entities: ['Service Providers', 'Data Centres', 'Body Corporate'],
        values: ['5 consecutive years', 'Indian jurisdiction'],
        source: {
          page: 2,
          section: 'Section 4(i) - Retention of ICT System Logs',
          evidence_quote: 'securely maintain all logs of their ICT systems for a rolling period of 5 (five) consecutive years within the Indian jurisdiction',
        },
        confidence: 0.98,
        status: 'approved',
      },
      {
        fact_id: 'F005',
        claim: 'Every covered organisation must designate a 24x7 Point of Contact (PoC) and furnish their coordinates to CERT-In.',
        category: 'Requirement',
        entities: ['CERT-In', 'Designated Point of Contact (PoC)'],
        values: ['24x7 availability', 'Name, designation, email, mobile phone'],
        source: {
          page: 3,
          section: 'Section 5 - Designation of Point of Contact',
          evidence_quote: 'designate a Point of Contact (PoC) and intimate CERT-In... The designated PoC shall be available 24x7',
        },
        confidence: 0.96,
        status: 'approved',
      },
      {
        fact_id: 'F006',
        claim: 'Cloud, VPS, and VPN providers must maintain verified customer KYC records and allocated IP addresses for at least 5 years.',
        category: 'Requirement',
        entities: ['Data Centres', 'VPS Providers', 'Cloud Service Providers', 'VPN Service Providers'],
        values: ['5 years', 'Verified customer names', 'Allocated IP addresses'],
        source: {
          page: 3,
          section: 'Section 6(i) - KYC for Cloud & VPN Providers',
          evidence_quote: 'Virtual Private Network (VPN) service providers shall register and maintain accurate verified customer names, ownership patterns, IP addresses allocated, and email addresses for a minimum period of 5 years',
        },
        confidence: 0.97,
        status: 'approved',
      },
      {
        fact_id: 'F007',
        claim: 'Failure to comply with CERT-In directions is punishable under Section 70B(7) of IT Act with imprisonment up to 1 year or a fine up to ₹1,00,00,000 (Rupees One Crore) or both.',
        category: 'Penalty',
        entities: ['CERT-In', 'IT Act 2000 Section 70B(7)'],
        values: ['Up to 1 year imprisonment', 'Fine up to ₹1,00,00,000 (Rupees One Crore)'],
        source: {
          page: 3,
          section: 'Section 7 - Penal Provisions for Non-Compliance',
          evidence_quote: 'punished with imprisonment for a term which may extend to one year or with a fine up to ₹1,00,00,000 (Rupees One Crore), or with both',
        },
        confidence: 0.99,
        status: 'approved',
      },
    ],
  },
  'green-hydrogen-mission': {
    id: 'doc-greenhydrogen-2026',
    key: 'green-hydrogen-mission',
    title: 'National Green Hydrogen Mission Guidelines & Strategic Allocation Framework',
    description: 'National roadmap for ₹19,744 Crore outlay, 5 MMT annual production targets by 2030, and SIGHT incentive mechanisms.',
    department: 'Ministry of New and Renewable Energy (MNRE), Government of India',
    docNumber: 'MNRE/GH2/2024-26/POL-08',
    dateIssued: 'February 02, 2026',
    pageCount: 2,
    fileSize: 198400,
    pages: [
      {
        pageNumber: 1,
        sourceLocation: 'Page 1 - Mission Targets & Financial Outlay',
        text: `MINISTRY OF NEW AND RENEWABLE ENERGY
GOVERNMENT OF INDIA
BLOCK-14, CGO COMPLEX, LODHI ROAD, NEW DELHI

NOTIFICATION: NATIONAL GREEN HYDROGEN MISSION STRATEGIC BLUEPRINT

1. Overall Financial Allocation:
The Union Cabinet has approved the initial financial outlay of ₹19,744 Crore for the National Green Hydrogen Mission.

2. Strategic Allocation Breakdown:
(a) ₹17,490 Crore allocated for the Strategic Interventions for Green Hydrogen Transition (SIGHT) programme.
(b) ₹1,466 Crore allocated for pilot projects and green hydrogen hubs.
(c) ₹400 Crore for Research and Development (R&D) in electrolyser technologies.
(d) ₹388 Crore towards enabling ecosystem components, standards, and skill development.

3. Key Target Outcomes by 2030:
(i) Development of green hydrogen production capacity of at least 5 MMT (Million Metric Tonnes) per annum.
(ii) Renewable energy capacity addition of about 125 GW in India.
(iii) Abatement of nearly 50 MMT of annual greenhouse gas (GHG) emissions by 2030.`,
      },
      {
        pageNumber: 2,
        sourceLocation: 'Page 2 - SIGHT Incentives & Nodal Administration',
        text: `4. SIGHT Program Components:
Under the Strategic Interventions for Green Hydrogen Transition (SIGHT) programme:
- Component I: Financial incentive for domestic manufacturing of electrolysers.
- Component II: Financial incentive for production of green hydrogen.

5. Nodal Implementation Agency:
(i) The Ministry of New and Renewable Energy (MNRE) will serve as the nodal ministry responsible for overall mission implementation and coordination.
(ii) Solar Energy Corporation of India (SECI) is designated as the implementing agency for bidding and disbursement of SIGHT financial incentives.

6. Fossil Fuel Import Reduction:
The mission aims to achieve cumulative reduction in fossil fuel imports exceeding ₹1,00,000 Crore by 2030 while attracting over ₹8,00,000 Crore in total investments.`,
      },
    ],
    preExtractedFacts: [
      {
        fact_id: 'F001',
        claim: 'The total financial outlay approved for the National Green Hydrogen Mission is ₹19,744 Crore.',
        category: 'Number',
        entities: ['Union Cabinet', 'MNRE', 'National Green Hydrogen Mission'],
        values: ['₹19,744 Crore'],
        source: {
          page: 1,
          section: 'Section 1 - Overall Financial Allocation',
          evidence_quote: 'initial financial outlay of ₹19,744 Crore for the National Green Hydrogen Mission',
        },
        confidence: 0.99,
        status: 'approved',
      },
      {
        fact_id: 'F002',
        claim: 'The SIGHT programme receives ₹17,490 Crore under the mission outlay.',
        category: 'Number',
        entities: ['SIGHT Programme', 'MNRE'],
        values: ['₹17,490 Crore'],
        source: {
          page: 1,
          section: 'Section 2(a) - Strategic Allocation Breakdown',
          evidence_quote: '₹17,490 Crore allocated for the Strategic Interventions for Green Hydrogen Transition (SIGHT) programme',
        },
        confidence: 0.98,
        status: 'approved',
      },
      {
        fact_id: 'F003',
        claim: 'India targets building at least 5 Million Metric Tonnes (MMT) of green hydrogen production capacity per annum by 2030.',
        category: 'Deadline',
        entities: ['National Green Hydrogen Mission'],
        values: ['5 MMT per annum', 'Year 2030'],
        source: {
          page: 1,
          section: 'Section 3(i) - Key Target Outcomes by 2030',
          evidence_quote: 'green hydrogen production capacity of at least 5 MMT (Million Metric Tonnes) per annum',
        },
        confidence: 0.99,
        status: 'approved',
      },
      {
        fact_id: 'F004',
        claim: 'The mission aims to abate approximately 50 MMT of annual greenhouse gas emissions by 2030.',
        category: 'Number',
        entities: ['National Green Hydrogen Mission'],
        values: ['50 MMT GHG emissions', 'Year 2030'],
        source: {
          page: 1,
          section: 'Section 3(iii) - Emissions Abatement',
          evidence_quote: 'Abatement of nearly 50 MMT of annual greenhouse gas (GHG) emissions by 2030',
        },
        confidence: 0.97,
        status: 'approved',
      },
      {
        fact_id: 'F005',
        claim: 'Ministry of New and Renewable Energy (MNRE) is the nodal ministry, and SECI is the implementing agency for SIGHT incentives.',
        category: 'Authority',
        entities: ['MNRE', 'Solar Energy Corporation of India (SECI)'],
        values: ['Nodal Ministry: MNRE', 'Implementing Agency: SECI'],
        source: {
          page: 2,
          section: 'Section 5 - Nodal Implementation Agency',
          evidence_quote: 'MNRE will serve as the nodal ministry... Solar Energy Corporation of India (SECI) is designated as the implementing agency',
        },
        confidence: 0.98,
        status: 'approved',
      },
    ],
  },
  'dpdp-compliance-circular': {
    id: 'doc-dpdp-2026',
    key: 'dpdp-compliance-circular',
    title: 'Digital Personal Data Protection (DPDP) Act Compliance Advisory for Data Fiduciaries',
    description: 'Mandatory consent architectures, 72-hour personal data breach notifications to DPBI, and penal provisions up to ₹250 Crore.',
    department: 'Data Protection Board of India (DPBI) & MeitY',
    docNumber: 'DPBI/ADV/2026/04',
    dateIssued: 'January 28, 2026',
    pageCount: 2,
    fileSize: 184320,
    pages: [
      {
        pageNumber: 1,
        sourceLocation: 'Page 1 - Data Fiduciary Obligations & Notice',
        text: `DATA PROTECTION BOARD OF INDIA
MINISTRY OF ELECTRONICS & INFORMATION TECHNOLOGY
NEW DELHI

ADVISORY ON COMPLIANCE UNDER DIGITAL PERSONAL DATA PROTECTION ACT

1. Obligation of Data Fiduciaries:
Every Data Fiduciary shall give to the Data Principal an itemised notice containing clear description of personal data sought, specified purpose of processing, and information regarding grievance redressal mechanisms.

2. Verifiable Consent for Children:
(i) Before processing any personal data of a child (individual below 18 years of age), a Data Fiduciary shall obtain verifiable consent of the parent or lawful guardian.
(ii) Data Fiduciaries are strictly prohibited from undertaking tracking, behavioural monitoring, or targeted advertising directed at children.`,
      },
      {
        pageNumber: 2,
        sourceLocation: 'Page 2 - Breach Notification & Penalties',
        text: `3. Mandatory Personal Data Breach Notification within 72 Hours:
(i) In the event of a personal data breach, the Data Fiduciary shall give intimation of such breach to the Data Protection Board of India (DPBI) and to each affected Data Principal within 72 (seventy-two) hours of becoming aware of the breach.
(ii) The notification must detail the nature of the breach, estimated affected individuals, potential risk mitigation actions taken, and the contact details of the Data Protection Officer (DPO).

4. Maximum Financial Penalties:
(i) Failure to take reasonable security safeguards to prevent personal data breach under Section 8(5) shall invite a financial penalty up to ₹250,00,00,000 (Rupees Two Hundred and Fifty Crore).
(ii) Failure to notify the Board and affected principals of a personal data breach shall invite a penalty up to ₹200,00,00,000 (Rupees Two Hundred Crore).`,
      },
    ],
    preExtractedFacts: [
      {
        fact_id: 'F001',
        claim: 'Data Fiduciaries must provide an itemised notice detailing data sought, purpose, and grievance mechanisms before processing personal data.',
        category: 'Requirement',
        entities: ['Data Fiduciary', 'Data Principal', 'DPBI'],
        values: ['Itemised notice', 'Grievance redressal'],
        source: {
          page: 1,
          section: 'Section 1 - Obligation of Data Fiduciaries',
          evidence_quote: 'Data Fiduciary shall give to the Data Principal an itemised notice containing clear description of personal data sought',
        },
        confidence: 0.98,
        status: 'approved',
      },
      {
        fact_id: 'F002',
        claim: 'Processing personal data of children under 18 requires verifiable parental or guardian consent, and targeted ads or behavioural tracking are strictly prohibited.',
        category: 'Requirement',
        entities: ['Child (under 18)', 'Parent/Guardian', 'Data Fiduciary'],
        values: ['Age under 18', 'Verifiable consent', 'Targeted ads prohibited'],
        source: {
          page: 1,
          section: 'Section 2 - Verifiable Consent for Children',
          evidence_quote: 'obtain verifiable consent of the parent or lawful guardian... strictly prohibited from undertaking tracking, behavioural monitoring, or targeted advertising directed at children',
        },
        confidence: 0.99,
        status: 'approved',
      },
      {
        fact_id: 'F003',
        claim: 'Data breaches must be intimated to the Data Protection Board of India (DPBI) and affected users within 72 hours.',
        category: 'Deadline',
        entities: ['Data Protection Board of India (DPBI)', 'Data Fiduciary', 'Data Principal'],
        values: ['72 hours', 'DPBI'],
        source: {
          page: 2,
          section: 'Section 3(i) - Mandatory Personal Data Breach Notification',
          evidence_quote: 'intimation of such breach to the Data Protection Board of India (DPBI) and to each affected Data Principal within 72 (seventy-two) hours',
        },
        confidence: 0.99,
        status: 'approved',
      },
      {
        fact_id: 'F004',
        claim: 'Failure to maintain reasonable security safeguards to prevent data breaches carries a penalty up to ₹250 Crore.',
        category: 'Penalty',
        entities: ['Data Protection Board of India', 'Section 8(5)'],
        values: ['Up to ₹250 Crore (₹250,00,00,000)'],
        source: {
          page: 2,
          section: 'Section 4(i) - Maximum Financial Penalties',
          evidence_quote: 'safeguards to prevent personal data breach under Section 8(5) shall invite a financial penalty up to ₹250,00,00,000 (Rupees Two Hundred and Fifty Crore)',
        },
        confidence: 0.98,
        status: 'approved',
      },
    ],
  },
};
