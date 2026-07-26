import type { SampleDocument } from '../types';

export const acord25: SampleDocument = {
  id: 'acord-25',
  title: 'ACORD 25 certificate',
  subtitle: 'COI · GL, auto, umbrella, WC',
  docText: `ACORD  CERTIFICATE OF LIABILITY INSURANCE          DATE: 04/09/2026

THIS CERTIFICATE IS ISSUED AS A MATTER OF INFORMATION ONLY AND
CONFERS NO RIGHTS UPON THE CERTIFICATE HOLDER.

INSURED
  Bluewater Landscaping LLC
  118 Commerce Drive
  Wilmington, NC 28401

INSURERS AFFORDING COVERAGE                              NAIC #
  INSURER A: Meridian Casualty Insurance Co.             31447
  INSURER B: Pinehurst National Indemnity                20882
  INSURER C: Cape Fear Workers Compensation Fund         —

COVERAGES        CERTIFICATE NUMBER: 2026-04412

TYPE OF INSURANCE          POLICY NUMBER      EFF DATE    EXP DATE
A  COMMERCIAL GENERAL      GL-88213O45        01/15/2026  01/15/2027
   LIABILITY               [second-to-last character unclear: O or 0]
   ☒ OCCUR  ☐ CLAIMS-MADE
   EACH OCCURRENCE ................................. $1,000,000
   DAMAGE TO RENTED PREMISES ......................... $100,000
   MED EXP (Any one person) ........................... $10,000
   PERSONAL & ADV INJURY ........................... $1,000,000
   GENERAL AGGREGATE ............................... $2,000,000
   PRODUCTS - COMP/OP AGG .......................... $2,000,000

A  AUTOMOBILE LIABILITY    CA-5521907          01/15/2026  01/15/2027
   ☒ ANY AUTO
   COMBINED SINGLE LIMIT ........................... $1,000,000

B  UMBRELLA LIAB ☒ OCCUR   UMB-140338          01/15/2026  01/15/2027
   EACH OCCURRENCE ................................. $2,000,000
   AGGREGATE ....................................... $2,000,000

C  WORKERS COMPENSATION    WC-2026-70115       04/01/2026  04/01/2027
   ☒ PER STATUTE
   E.L. EACH ACCIDENT ................................ $500,000
   E.L. DISEASE - EA EMPLOYEE ........................ $500,000
   E.L. DISEASE - POLICY LIMIT ....................... $500,000

DESCRIPTION OF OPERATIONS / LOCATIONS / VEHICLES
  RE: Grounds maintenance contract #GM-2026-018. Certificate
  holder is included as additional insured with respect to
  general liability per form CG 20 10. Waiver of subrogation
  applies [checkbox faint] per CG 24 04.

CERTIFICATE HOLDER
  Ridgeline Property Group
  400 Waterfront Plaza, Suite 900
  Wilmington, NC 28401

CANCELLATION: SHOULD ANY OF THE ABOVE DESCRIBED POLICIES BE
CANCELLED BEFORE THE EXPIRATION DATE THEREOF, NOTICE WILL BE
DELIVERED IN ACCORDANCE WITH THE POLICY PROVISIONS.

AUTHORIZED REPRESENTATIVE: [signature on file]

— FICTIONAL SAMPLE DOCUMENT — all names, carriers, and values invented —`,
  result: {
    documentType: 'ACORD 25 — Certificate of Liability Insurance',
    documentTypeConfidence: 'high',
    summary:
      'A certificate of liability insurance for Bluewater Landscaping LLC showing general liability, auto, umbrella, and workers compensation coverage across three carriers, issued to certificate holder Ridgeline Property Group for a grounds maintenance contract. The GL policy number contains an ambiguous character and the waiver-of-subrogation checkbox is faint — both flagged for review.',
    fields: [
      { label: 'Insured', value: 'Bluewater Landscaping LLC', confidence: 'high', note: null },
      { label: 'Certificate Date', value: '04/09/2026', confidence: 'high', note: null },
      { label: 'Certificate Number', value: '2026-04412', confidence: 'high', note: null },
      { label: 'Insurer A', value: 'Meridian Casualty Insurance Co. (NAIC 31447)', confidence: 'high', note: null },
      { label: 'Insurer B', value: 'Pinehurst National Indemnity (NAIC 20882)', confidence: 'high', note: null },
      { label: 'Insurer C', value: 'Cape Fear Workers Compensation Fund', confidence: 'high', note: null },
      {
        label: 'GL — Policy Number',
        value: 'GL-88213O45',
        confidence: 'low',
        note: 'Second-to-last character is ambiguous (letter O vs zero). Confirm against the policy.',
      },
      { label: 'GL — Policy Period', value: '01/15/2026 – 01/15/2027', confidence: 'high', note: null },
      { label: 'GL — Each Occurrence', value: '$1,000,000', confidence: 'high', note: null },
      { label: 'GL — General Aggregate', value: '$2,000,000', confidence: 'high', note: null },
      { label: 'GL — Occurrence or Claims-Made', value: 'Occurrence', confidence: 'high', note: null },
      { label: 'Auto — Policy Number', value: 'CA-5521907', confidence: 'high', note: null },
      { label: 'Auto — Combined Single Limit', value: '$1,000,000', confidence: 'high', note: null },
      { label: 'Umbrella — Policy Number', value: 'UMB-140338', confidence: 'high', note: null },
      { label: 'Umbrella — Each Occurrence / Aggregate', value: '$2,000,000 / $2,000,000', confidence: 'high', note: null },
      { label: 'WC — Policy Number', value: 'WC-2026-70115', confidence: 'high', note: null },
      { label: 'WC — Policy Period', value: '04/01/2026 – 04/01/2027', confidence: 'high', note: 'Note: WC term differs from the other lines.' },
      { label: 'WC — E.L. Each Accident', value: '$500,000', confidence: 'high', note: null },
      { label: 'Additional Insured (GL)', value: 'Yes — per form CG 20 10', confidence: 'high', note: null },
      {
        label: 'Waiver of Subrogation',
        value: 'Appears checked — per CG 24 04',
        confidence: 'low',
        note: 'Checkbox is faint in the source document. Verify before relying on it.',
      },
      { label: 'Certificate Holder', value: 'Ridgeline Property Group, 400 Waterfront Plaza, Suite 900, Wilmington, NC 28401', confidence: 'high', note: null },
      { label: 'Description of Operations', value: 'RE: Grounds maintenance contract #GM-2026-018', confidence: 'high', note: null },
    ],
    warnings: [
      'One character of the GL policy number is ambiguous (O vs 0) — flagged for human review.',
      'The waiver-of-subrogation checkbox is faint; do not rely on it without confirming the endorsement.',
      'The workers compensation policy period differs from the other lines of coverage.',
    ],
  },
};
