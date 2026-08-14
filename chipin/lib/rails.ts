/** Payment rails. Users link their own — we never touch the money. */
export type Rail = "paypal" | "cashapp" | "venmo" | "interac";

type RailSpec = {
  label: string;
  /** How the handle reads on the public page. */
  pretty: (handle: string) => string;
  /** Deep link with the amount prefilled, in dollars. Null when no link exists. */
  link: ((handle: string, dollars: number) => string) | null;
  /** Shown at selection time. Empty when there's nothing to warn about. */
  warning: string;
};

export const RAILS: Record<Rail, RailSpec> = {
  paypal: {
    label: "PayPal",
    pretty: (h) => `paypal.me/${h}`,
    link: (h, d) => `https://paypal.me/${encodeURIComponent(h)}/${d}`,
    warning: "",
  },
  cashapp: {
    label: "Cash App",
    pretty: (h) => `cash.app/$${h.replace(/^\$/, "")}`,
    link: (h, d) =>
      `https://cash.app/$${encodeURIComponent(h.replace(/^\$/, ""))}/${d}`,
    warning:
      "Cash App only works in the US and UK. Everyone else sees a dead link.",
  },
  venmo: {
    label: "Venmo",
    pretty: (h) => `venmo.com/${h.replace(/^@/, "")}`,
    link: (h, d) =>
      `https://venmo.com/${encodeURIComponent(
        h.replace(/^@/, ""),
      )}?txn=pay&amount=${d}&note=Chip%20In`,
    warning:
      "Venmo is US-only. Also: Venmo shows your real name and friend list to anyone who looks you up.",
  },
  interac: {
    label: "Interac",
    pretty: (h) => h,
    link: null,
    warning:
      "Interac has no tap-to-pay link — givers must copy your email and send it manually. Expect most to drop off.",
  },
};
