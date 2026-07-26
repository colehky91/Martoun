import type { SampleDocument } from '../types';

export const lossRun: SampleDocument = {
  id: 'loss-run',
  title: 'Auto loss run',
  subtitle: '3-year history · 6 claims',
  docText: `KEYSTONE MUTUAL INSURANCE GROUP
LOSS RUN REPORT — COMMERCIAL AUTO                 RUN DATE: 05/02/2026
[Scanned copy — page slightly rotated; some figures degraded]

INSURED:  Crestline Logistics LLC
POLICY:   CA-7734120 (and renewals)
PERIOD:   05/01/2023 through 05/01/2026          VALUED AS OF: 04/30/2026

--------------------------------------------------------------------------
CLAIM NO      DOL        DESCRIPTION                 STATUS   PAID      RESERVE
--------------------------------------------------------------------------
23-081447     07/19/2023 Rear-end collision, I-70    CLOSED   $18,250   $0
              EB; third-party BI + PD

23-102996     11/02/2023 Backing incident, dock 4;   CLOSED   $4,175    $0
              trailer damage only

24-033012     03/28/2024 Jackknife, wet pavement;    CLOSED   $61,900   $0
              tractor total loss

24-077508     08/14/2024 Windshield — road debris    CLOSED   $890      $0

25-019233     02/06/2025 Intersection collision;     OPEN     $22,400   $4[8?],500
              attorney-represented BI          [reserve figure degraded in scan]

25-114620     12/11/2025 Cargo shift, rollover       OPEN     $9,300    $27,000
              claim under investigation

--------------------------------------------------------------------------
TOTALS (ALL CLAIMS):                                PAID: $116,915
                                        REPORTED RESERVES: $75,500*
                                          TOTAL INCURRED: $192,415*
* includes degraded reserve figure — see claim 25-019233

FREQUENCY: 6 claims / 36 months        LARGEST SINGLE LOSS: $61,900

— FICTIONAL SAMPLE DOCUMENT — all names, carriers, and values invented —`,
  result: {
    documentType: 'Loss Run Report — Commercial Auto',
    documentTypeConfidence: 'high',
    summary:
      'A three-year commercial auto loss run for Crestline Logistics LLC covering 05/01/2023–05/01/2026, showing six claims: four closed and two open. Total paid is $116,915 with reported reserves of $75,500. The scan is slightly rotated and one open-claim reserve figure is degraded, so the reserve and incurred totals should be verified.',
    fields: [
      { label: 'Insured', value: 'Crestline Logistics LLC', confidence: 'high', note: null },
      { label: 'Carrier', value: 'Keystone Mutual Insurance Group', confidence: 'high', note: null },
      { label: 'Policy Number', value: 'CA-7734120 (and renewals)', confidence: 'high', note: null },
      { label: 'Experience Period', value: '05/01/2023 – 05/01/2026', confidence: 'high', note: null },
      { label: 'Valued As Of', value: '04/30/2026', confidence: 'high', note: null },
      { label: 'Claim 1 — Number / Date of Loss', value: '23-081447 / 07/19/2023', confidence: 'high', note: null },
      { label: 'Claim 1 — Description / Status', value: 'Rear-end collision, I-70 EB; third-party BI + PD — Closed', confidence: 'high', note: null },
      { label: 'Claim 1 — Paid', value: '$18,250', confidence: 'high', note: null },
      { label: 'Claim 2 — Number / Date of Loss', value: '23-102996 / 11/02/2023', confidence: 'high', note: null },
      { label: 'Claim 2 — Paid', value: '$4,175', confidence: 'high', note: null },
      { label: 'Claim 3 — Number / Date of Loss', value: '24-033012 / 03/28/2024', confidence: 'high', note: null },
      { label: 'Claim 3 — Description / Status', value: 'Jackknife, wet pavement; tractor total loss — Closed', confidence: 'high', note: null },
      { label: 'Claim 3 — Paid', value: '$61,900', confidence: 'high', note: null },
      { label: 'Claim 4 — Number / Date of Loss', value: '24-077508 / 08/14/2024', confidence: 'high', note: null },
      { label: 'Claim 4 — Paid', value: '$890', confidence: 'high', note: null },
      { label: 'Claim 5 — Number / Date of Loss', value: '25-019233 / 02/06/2025', confidence: 'high', note: null },
      { label: 'Claim 5 — Description / Status', value: 'Intersection collision; attorney-represented BI — Open', confidence: 'high', note: null },
      { label: 'Claim 5 — Paid', value: '$22,400', confidence: 'high', note: null },
      {
        label: 'Claim 5 — Reserve',
        value: '$48,500',
        confidence: 'low',
        note: 'Figure is degraded in the scan ("$4[8?],500") — could be $48,500 or $43,500. Request a clean copy.',
      },
      { label: 'Claim 6 — Number / Date of Loss', value: '25-114620 / 12/11/2025', confidence: 'high', note: null },
      { label: 'Claim 6 — Description / Status', value: 'Cargo shift, rollover; under investigation — Open', confidence: 'high', note: null },
      { label: 'Claim 6 — Paid / Reserve', value: '$9,300 / $27,000', confidence: 'high', note: null },
      { label: 'Total Paid (All Claims)', value: '$116,915', confidence: 'high', note: null },
      {
        label: 'Total Reported Reserves',
        value: '$75,500',
        confidence: 'medium',
        note: 'Total includes the degraded claim-5 reserve figure; verify once a clean copy is obtained.',
      },
      {
        label: 'Total Incurred',
        value: '$192,415',
        confidence: 'medium',
        note: 'Depends on the degraded reserve figure above.',
      },
      { label: 'Claim Frequency', value: '6 claims / 36 months', confidence: 'high', note: null },
      { label: 'Largest Single Loss', value: '$61,900', confidence: 'high', note: null },
    ],
    warnings: [
      'The source scan is slightly rotated and partially degraded.',
      'One open-claim reserve figure is unreadable in the scan; reserve and incurred totals are flagged for review.',
    ],
  },
};
