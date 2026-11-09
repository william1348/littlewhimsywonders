"use client";

import { useState } from "react";

import { PieceCard } from "@/components/piece-card";
import { Button } from "@/components/ui/button";
import type { Collection, CollectionTag, Piece, PieceKind } from "@/lib/catalog";

const pieceFilters = [
  { id: "all", label: "All" },
  { id: "print", label: "Prints" },
  { id: "original", label: "Originals" },
] as const;

const tagFilters = ["Boos", "Hats", "Other", "Globes"] as const;

export function WorkBrowser({ pieces, collections }: { pieces: Piece[]; collections: Collection[] }) {
  const [pieceFilter, setPieceFilter] = useState<(typeof pieceFilters)[number]["id"]>("all");
  const [tagFilter, setTagFilter] = useState<CollectionTag | "all">("all");
  const visiblePieces = pieces.filter((piece) => pieceFilter === "all" || piece.kind === (pieceFilter as PieceKind));
  const visibleCollections = collections.filter((collection) => tagFilter === "all" || collection.tags.includes(tagFilter));

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-3xl tracking-tight">Collections</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter collections by tag">
          <Button
            type="button"
            size="lg"
            variant={tagFilter === "all" ? "default" : "outline"}
            className="h-10 rounded-full px-4"
            aria-pressed={tagFilter === "all"}
            onClick={() => setTagFilter("all")}
          >
            All tags
          </Button>
          {tagFilters.map((tag) => (
            <Button
              key={tag}
              type="button"
              size="lg"
              variant={tagFilter === tag ? "default" : "outline"}
              className="h-10 rounded-full px-4"
              aria-pressed={tagFilter === tag}
              onClick={() => setTagFilter(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
        {visibleCollections.length === 0 ? (
          <p className="text-muted-foreground">No collections in that tag yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleCollections.map((collection) => (
              <article key={collection.slug} className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
                <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{collection.tags.join(" · ")}</p>
                <h3 className="mt-2 font-heading text-3xl tracking-tight">{collection.title}</h3>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
                  {collection.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-3xl tracking-tight">Art pieces</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the work">
          {pieceFilters.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="lg"
              variant={pieceFilter === item.id ? "default" : "outline"}
              className="h-10 rounded-full px-4"
              aria-pressed={pieceFilter === item.id}
              onClick={() => setPieceFilter(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        {visiblePieces.length === 0 ? (
          <p className="text-muted-foreground">Nothing in that group.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePieces.map((piece) => (
              <PieceCard key={piece.slug} piece={piece} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
