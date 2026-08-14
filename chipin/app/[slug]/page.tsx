import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GiverList } from "@/components/GiverList";
import { Receipt } from "@/components/Receipt";
import { TopBar } from "@/components/TopBar";
import { getAskPage } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAskPage(slug);
  if (!page) return { title: "Chip In" };

  return {
    title: `${page.displayName} — ${page.title}`,
    description: `Chip in to ${page.displayName}. Proof of purchase posted after funding.`,
  };
}

export default async function AskPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = getAskPage(slug);
  if (!page) notFound();

  return (
    <>
      <TopBar slug={page.slug} />
      <main className="mx-auto max-w-[430px] px-3.5">
        <Receipt page={page} />
        <GiverList givers={page.givers} />
      </main>
    </>
  );
}
