import Link from "next/link";

import { PrintArt } from "@/components/print-art";
import type { Piece } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export function PieceCard({ piece }: { piece: Piece }) {
  return (
    <article className="flex flex-col gap-3">
      <Link
        href={`/work/${piece.slug}`}
        className="block bg-kraft ring-1 ring-foreground/10 transition-transform duration-200 hover:-translate-y-0.5"
      >
        <PrintArt piece={piece} />
      </Link>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-heading text-2xl leading-none tracking-tight">
          <Link href={`/work/${piece.slug}`} className="hover:text-copper">
            {piece.title}
          </Link>
        </h2>
        <p className="shrink-0 text-sm tabular-nums">{formatPrice(piece.price)}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {piece.kind === "original" ? "Original" : piece.edition}
        <span aria-hidden="true"> · </span>
        {piece.size}
      </p>
      <Link
        href={`/work/${piece.slug}`}
        className="w-fit text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        View details and purchase
      </Link>
    </article>
  );
}
