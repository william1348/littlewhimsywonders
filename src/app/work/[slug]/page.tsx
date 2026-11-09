import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BagButton } from "@/components/bag";
import { HoldForm } from "@/components/hold-form";
import { PrintArt } from "@/components/print-art";
import { Badge } from "@/components/ui/badge";
import { getPiece, pieces } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return pieces.map((piece) => ({ slug: piece.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) return { title: "Piece" };
  return { title: piece.title, description: piece.summary };
}

export default function PiecePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<main className="mx-auto w-full max-w-6xl px-5 py-16 text-muted-foreground">Opening the piece…</main>}>
      <PieceBody params={params} />
    </Suspense>
  );
}

async function PieceBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) notFound();

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
      <div className="bg-[#f6f1e7] ring-1 ring-foreground/10">
        <PrintArt piece={piece} />
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs tracking-[0.18em] text-oxide uppercase">
            {piece.kind === "original" ? "Original" : "Print"} · {piece.year}
          </p>
          <h1 className="mt-3 font-heading text-5xl tracking-tight">{piece.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{piece.summary}</p>
        </div>
        <p className="font-heading text-3xl tabular-nums">{formatPrice(piece.price)}</p>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Edition</dt>
            <dd>{piece.edition}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Size</dt>
            <dd>{piece.size}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Paper</dt>
            <dd>{piece.paper}</dd>
          </div>
        </dl>
        <p className="leading-relaxed">{piece.description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <BagButton piece={piece} />
          <Badge variant="outline">{piece.kind === "original" ? "Leaves once" : piece.edition}</Badge>
        </div>
        <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
          <h2 className="font-heading text-2xl tracking-tight">Request a hold</h2>
          <div className="mt-4">
            <HoldForm pieces={[{ slug: piece.slug, title: piece.title }]} />
          </div>
        </div>
        <Link href="/work" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          Back to the work
        </Link>
      </div>
    </main>
  );
}
