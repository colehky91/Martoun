import type { Rail } from "./rails";

/** Shapes follow the data model in CLAUDE.md. Supabase replaces this in step 2. */
export type Giver = {
  name: string;
  amountCents: number;
};

export type AskPage = {
  slug: string;
  displayName: string;
  rail: Rail;
  handle: string;
  handleVerified: boolean;
  title: string;
  goalCents: number;
  /** Confirmed donations only. Never a raw sum. */
  raisedCents: number;
  fundedAt: string | null;
  receiptUrl: string | null;
  givers: Giver[];
};

const FIXTURES: Record<string, AskPage> = {
  maya: {
    slug: "maya",
    displayName: "Maya",
    rail: "paypal",
    handle: "mayacooks",
    handleVerified: true,
    title: "Steak and sweet potato for my roommate's birthday",
    goalCents: 3000,
    raisedCents: 1800,
    fundedAt: null,
    receiptUrl: null,
    givers: [
      { name: "Tasha", amountCents: 1000 },
      { name: "quietwallet", amountCents: 500 },
      { name: "Marc-Andre", amountCents: 300 },
    ],
  },
  // A funded ask, so the FUNDED stamp and the proof block can be eyeballed.
  theo: {
    slug: "theo",
    displayName: "Theo",
    rail: "cashapp",
    handle: "theoruns",
    handleVerified: true,
    title: "New laces before Sunday's race",
    goalCents: 1200,
    raisedCents: 1200,
    fundedAt: "2026-08-12T18:04:00Z",
    receiptUrl: null,
    givers: [
      { name: "bigspender_88", amountCents: 1000 },
      { name: "Anonymous", amountCents: 200 },
    ],
  },
};

export function getAskPage(slug: string): AskPage | null {
  return FIXTURES[slug.toLowerCase()] ?? null;
}
