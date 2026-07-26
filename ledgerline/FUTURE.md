# FUTURE

Ideas deliberately **not** built into the sales demo, parked here to keep the pilot scope tight.
Nothing below is implied to exist today — don't reference these on calls as shipped features.

## Intake

- **Larger files / multi-document upload** — direct-to-storage uploads (signed URLs) to get past
  the serverless 4.5 MB body limit; batch drag-and-drop of a whole submission folder.
- **Email-in intake** — forward `submissions@` and get extractions back in the inbox.
- **Multi-page viewer with source highlighting** — click a field, see the exact region of the
  page it came from (huge trust builder for E&O-sensitive buyers).

## Extraction quality

- **Document-type-specific schemas** — dedicated field sets per ACORD form number, carrier dec
  page layouts, and loss-run formats, instead of one generic field list.
- **Cross-document reconciliation** — compare a COI against the underlying dec page and flag
  mismatched limits or dates.
- **Configurable confidence thresholds** — let each agency decide what auto-passes vs. what
  always queues for review.
- **Human-review queue** — a lightweight two-pane verify screen; reviewed extractions become
  the ground truth for measuring accuracy per document type.

## Delivery

- **AMS-friendly export formats** — CSV column mappings matching what common agency management
  systems import (build only when a pilot customer names their AMS; do not imply integrations
  that don't exist).
- **API / webhook** — push completed extractions into whatever the agency already uses.
- **Streaming progress** — stream extraction results field-by-field instead of one shot, so big
  loss runs feel faster.

## Trust & ops

- **SOC 2 / security page** — formalize the data-handling story once there's a real pipeline.
- **Per-agency usage dashboard** — docs processed, time saved, review rates (needs accounts,
  which the pilot demo deliberately omits).
- **Rate limiting / abuse protection on the public endpoint** — a per-IP throttle before the
  demo URL gets shared widely.
