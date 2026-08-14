import { money, pct } from "@/lib/money";
import { RAILS } from "@/lib/rails";
import type { AskPage } from "@/lib/data";

export function Receipt({ page }: { page: AskPage }) {
  const funded = page.raisedCents >= page.goalCents;
  const percent = pct(page.raisedCents, page.goalCents);
  const short = Math.max(0, page.goalCents - page.raisedCents);

  return (
    <div className="receipt relative pb-1.5">
      {funded && (
        <div className="stamp absolute right-4 top-[22px] z-[2] border-[3px] border-stamp px-[9px] py-[5px] font-display text-[15px] tracking-[0.04em] text-stamp">
          FUNDED
        </div>
      )}

      <div className="px-5 pb-6 pt-5">
        <div className="mb-[3px] flex items-center gap-[9px]">
          <b className="text-[15px] font-semibold">{page.displayName}</b>
          {page.handleVerified ? (
            <span className="rounded-[2px] bg-go px-1.5 py-[3px] font-mono text-[9px] font-bold tracking-[0.09em] text-white">
              HANDLE VERIFIED
            </span>
          ) : (
            <span className="rounded-[2px] border border-stamp px-1.5 py-[3px] font-mono text-[9px] font-bold tracking-[0.09em] text-stamp">
              UNVERIFIED
            </span>
          )}
        </div>

        <div className="mb-4 font-mono text-[11.5px] text-soft">
          {RAILS[page.rail].pretty(page.handle)}
        </div>

        <h1 className="mb-[18px] font-display text-[26px] leading-[1.12] tracking-[-0.015em]">
          {page.title}
        </h1>

        <div className="mb-1.5">
          <div className="h-[9px] overflow-hidden rounded-[1px] bg-rule">
            <div
              className={`h-full ${funded ? "bg-go" : "bg-mustard"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="mt-1.5 font-mono text-[11px] tracking-[0.05em] text-soft">
            {percent}% — {money(page.raisedCents)} of {money(page.goalCents)}
          </div>
        </div>

        <div className="mb-3.5 border-y border-dashed border-rule py-3 font-mono text-[13px]">
          <Line label="Goal" value={money(page.goalCents)} first />
          <Line label="Raised" value={money(page.raisedCents)} />
          <Line label="Givers" value={String(page.givers.length)} />
          <Line label="Still short" value={money(short)} big />
        </div>

        <button
          type="button"
          disabled={funded}
          className="mt-[18px] w-full cursor-pointer rounded-[3px] bg-ink p-4 font-display text-[17px] tracking-[-0.01em] text-card focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-mustard disabled:cursor-default disabled:bg-go"
        >
          {funded ? "Fully funded" : "Chip in"}
        </button>

        <Proof page={page} funded={funded} />
      </div>
    </div>
  );
}

function Line({
  label,
  value,
  big = false,
  first = false,
}: {
  label: string;
  value: string;
  big?: boolean;
  first?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-2.5 ${
        big
          ? "mt-[7px] border-t border-rule pt-[7px] text-base"
          : first
            ? ""
            : "mt-[5px]"
      }`}
    >
      <span className="text-soft">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function Proof({ page, funded }: { page: AskPage; funded: boolean }) {
  return (
    <div className="mt-5 border-t border-dashed border-rule pt-4">
      <h3 className="mb-2.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.11em] text-soft">
        Proof of purchase
      </h3>

      {!funded ? (
        <div className="border-[1.5px] border-dashed border-rule px-3.5 py-[22px] text-center font-mono text-xs leading-[1.5] text-soft">
          Unlocks when the goal is hit.
          <br />
          {page.displayName} posts what she actually bought — or this page shows
          she never did.
        </div>
      ) : page.receiptUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.receiptUrl}
            alt={`What ${page.displayName} bought`}
            className="mb-2 block w-full rounded-[2px]"
          />
          <div className="font-mono text-[11px] text-soft">
            Posted by {page.displayName} after funding.
          </div>
        </>
      ) : (
        <div className="border-[1.5px] border-dashed border-rule px-3.5 py-[22px] text-center font-mono text-xs leading-[1.5] text-soft">
          Funded. Waiting on the receipt.
        </div>
      )}
    </div>
  );
}
