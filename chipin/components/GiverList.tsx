import { money } from "@/lib/money";
import type { Giver } from "@/lib/data";

export function GiverList({ givers }: { givers: Giver[] }) {
  return (
    <div className="mt-4 px-1.5">
      <h3 className="mb-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.11em] text-soft">
        Who chipped in
      </h3>

      {givers.length === 0 ? (
        <div className="flex items-center gap-2.5 border-b border-rule py-[9px] text-sm text-soft">
          Nobody yet. Be first.
        </div>
      ) : (
        givers.map((g, i) => (
          <div
            key={`${g.name}-${i}`}
            className="flex items-center gap-2.5 border-b border-rule py-[9px]"
          >
            <div
              className={`w-[22px] font-display text-sm ${
                i === 0 ? "text-mustard" : "text-soft"
              }`}
            >
              {i + 1}
            </div>
            <div className="flex-1 text-sm font-medium">{g.name}</div>
            <div className="font-mono text-[13px] font-bold">
              {money(g.amountCents)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
