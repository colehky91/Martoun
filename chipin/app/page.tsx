import Link from "next/link";

/* Placeholder. The real landing page is step 10. */
export default function Home() {
  return (
    <main className="mx-auto max-w-[430px] px-3.5 pt-10">
      <h1 className="font-display text-[26px] leading-[1.12] tracking-[-0.015em]">
        CHIP<span className="text-mustard">IN</span>
      </h1>
      <p className="mt-2 font-mono text-[13px] text-soft">
        Example page:{" "}
        <Link href="/maya" className="text-ink underline">
          chipin.co/maya
        </Link>
      </p>
    </main>
  );
}
