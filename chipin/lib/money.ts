/** Figures are always handled in cents. Only formatting turns them into dollars. */
export function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function pct(raisedCents: number, goalCents: number): number {
  if (goalCents <= 0) return 0;
  return Math.min(100, Math.round((raisedCents / goalCents) * 100));
}
