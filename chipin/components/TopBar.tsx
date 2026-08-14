export function TopBar({ slug }: { slug: string }) {
  return (
    <div className="mb-5 bg-forest py-[11px] text-paper">
      <div className="mx-auto flex max-w-[430px] items-center justify-between px-3.5">
        <div className="font-display text-base tracking-[-0.01em]">
          CHIP<span className="text-mustard">IN</span>
        </div>
        <div className="font-mono text-[11px] tracking-[0.04em] text-[#9CB3A9]">
          chipin.co/{slug}
        </div>
      </div>
    </div>
  );
}
