"use client";

import { useState } from "react";

import { PieceCard } from "@/components/piece-card";
import { Button } from "@/components/ui/button";
import type { Piece, PieceKind } from "@/lib/catalog";

const filters = [
  { id: "all", label: "All" },
  { id: "print", label: "Prints" },
  { id: "original", label: "Originals" },
] as const;

export function WorkBrowser({ pieces }: { pieces: Piece[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const visible = pieces.filter((piece) => filter === "all" || piece.kind === (filter as PieceKind));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the work">
        {filters.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="lg"
            variant={filter === item.id ? "default" : "outline"}
            className="h-10 rounded-full px-4"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="text-muted-foreground">Nothing in that group.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((piece) => (
            <PieceCard key={piece.slug} piece={piece} />
          ))}
        </div>
      )}
    </div>
  );
}
