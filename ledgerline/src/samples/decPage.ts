import type { SampleDocument } from '../types';

export const decPage: SampleDocument = {
  id: 'dec-page',
  title: 'Commercial dec page',
  subtitle: 'Package policy · property + GL',
  docText: `                    GRANITE PEAK INSURANCE COMPANY
                 A Stock Company · Harrisburg, PA 17101

              COMMERCIAL PACKAGE POLICY — DECLARATIONS

POLICY NUMBER: CPP-4102968-01                RENEWAL OF: CPP-4102968-00

NAMED INSURED AND MAILING ADDRESS
  Harborview Machining LLC
  2418 Industrial Parkway
  Dayton, OH 45404

POLICY PERIOD: From 03/01/2026 to 03/01/2027
  12:01 A.M. Standard Time at your mailing address shown above.

BUSINESS DESCRIPTION: Precision CNC machining — job shop
LEGAL ENTITY: Limited Liability Company

IN RETURN FOR THE PAYMENT OF THE PREMIUM, AND SUBJECT TO ALL THE
TERMS OF THIS POLICY, WE AGREE WITH YOU TO PROVIDE THE INSURANCE
AS STATED IN THIS POLICY.

DESCRIBED PREMISES
  Prem 1 / Bldg 1: 2418 Industrial Parkway, Dayton, OH 45404
  Construction: Joisted Masonry     Protection Class: 4

COMMERCIAL PROPERTY COVERAGE PART
  Building (Prem 1 / Bldg 1) ................... $1,850,000
  Business Personal Property ..................... $425,000
  Business Income (ALS) ................. Actual Loss - 12 mo
  Causes of Loss: Special      Coinsurance: 80%
  Deductible: $5,0[smudged]0   ← per occurrence

COMMERCIAL GENERAL LIABILITY COVERAGE PART
  Each Occurrence Limit ........................ $1,000,000
  General Aggregate Limit ...................... $2,000,000
  Products/Completed Ops Aggregate ............. $2,000,000
  Personal & Advertising Injury ................ $1,000,000
  Damage to Premises Rented to You ................ $100,000
  Medical Expense (any one person) ................. $10,000

PREMIUM SUMMARY
  Commercial Property .......................... $16,921.00
  Commercial General Liability .................. $9,847.00
  Terrorism (TRIA) ................................ $286.00
  Inspection surcharge — [handwritten: waived per UW 2/14]
  TOTAL POLICY PREMIUM ......................... $27,054.00

FORMS AND ENDORSEMENTS: See Schedule of Forms, IL 12 01 attached.

Countersigned: 02/18/2026   By: [signature illegible]

— FICTIONAL SAMPLE DOCUMENT — all names, carriers, and values invented —`,
  result: {
    documentType: 'Commercial Package Policy — Declarations Page',
    documentTypeConfidence: 'high',
    summary:
      'A commercial package declarations page for Harborview Machining LLC, a CNC machining shop in Dayton, OH, combining commercial property and general liability coverage through Granite Peak Insurance Company for the 03/01/2026–03/01/2027 term. Total policy premium is $27,054.00. The property deductible is partially smudged and a handwritten underwriting note appears in the premium summary.',
    fields: [
      { label: 'Named Insured', value: 'Harborview Machining LLC', confidence: 'high', note: null },
      { label: 'Mailing Address', value: '2418 Industrial Parkway, Dayton, OH 45404', confidence: 'high', note: null },
      { label: 'Carrier', value: 'Granite Peak Insurance Company', confidence: 'high', note: null },
      { label: 'Policy Number', value: 'CPP-4102968-01', confidence: 'high', note: null },
      { label: 'Policy Period — Effective', value: '03/01/2026', confidence: 'high', note: null },
      { label: 'Policy Period — Expiration', value: '03/01/2027', confidence: 'high', note: null },
      { label: 'Business Description', value: 'Precision CNC machining — job shop', confidence: 'high', note: null },
      { label: 'Property — Building Limit', value: '$1,850,000', confidence: 'high', note: null },
      { label: 'Property — Business Personal Property', value: '$425,000', confidence: 'high', note: null },
      { label: 'Property — Causes of Loss / Coinsurance', value: 'Special / 80%', confidence: 'high', note: null },
      {
        label: 'Property — Deductible',
        value: '$5,000',
        confidence: 'low',
        note: 'Printed as "$5,0[smudged]0" — could be $5,000 or $50,000. Verify against the policy form.',
      },
      { label: 'GL — Each Occurrence Limit', value: '$1,000,000', confidence: 'high', note: null },
      { label: 'GL — General Aggregate', value: '$2,000,000', confidence: 'high', note: null },
      { label: 'GL — Products/Completed Ops Aggregate', value: '$2,000,000', confidence: 'high', note: null },
      { label: 'GL — Damage to Premises Rented', value: '$100,000', confidence: 'high', note: null },
      { label: 'Premium — Commercial Property', value: '$16,921.00', confidence: 'high', note: null },
      { label: 'Premium — General Liability', value: '$9,847.00', confidence: 'high', note: null },
      { label: 'Premium — Terrorism (TRIA)', value: '$286.00', confidence: 'high', note: null },
      {
        label: 'Inspection Surcharge',
        value: 'Waived',
        confidence: 'medium',
        note: 'Handwritten note reads "waived per UW 2/14" — confirm with the underwriter file.',
      },
      { label: 'Total Policy Premium', value: '$27,054.00', confidence: 'high', note: null },
    ],
    warnings: [
      'The property deductible digit is smudged in the source document — flagged for human review.',
      'One handwritten annotation appears in the premium summary and was transcribed, not verified.',
    ],
  },
};
