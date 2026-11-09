"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { HoldForm } from "@/components/hold-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getPiece, type Piece } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "cn";

type BagContextValue = {
  slugs: string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const BagContext = createContext<BagContextValue | null>(null);
const storageKey = "north-room-bag";

export function BagProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        setSlugs(parsed.filter((slug): slug is string => typeof slug === "string" && Boolean(getPiece(slug))));
      } catch {
        window.localStorage.removeItem(storageKey);
      } finally {
        setReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(storageKey, JSON.stringify(slugs));
  }, [ready, slugs]);

  const value = useMemo<BagContextValue>(
    () => ({
      slugs,
      add: (slug) => {
        if (!getPiece(slug)) return;
        setSlugs((current) => (current.includes(slug) ? current : [...current, slug].slice(0, 8)));
      },
      remove: (slug) => setSlugs((current) => current.filter((item) => item !== slug)),
      clear: () => setSlugs([]),
    }),
    [slugs],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag(): BagContextValue {
  const value = useContext(BagContext);
  if (!value) throw new Error("Bag is unavailable.");
  return value;
}

export function BagButton({ piece }: { piece: Piece }) {
  const bag = useBag();
  const held = bag.slugs.includes(piece.slug);
  return (
    <Button
      type="button"
      variant={held ? "secondary" : "outline"}
      size="lg"
      className="h-11 rounded-lg px-4"
      onClick={() => (held ? bag.remove(piece.slug) : bag.add(piece.slug))}
    >
      {held ? "In the bag" : "Add to bag"}
    </Button>
  );
}

export function BagSheet() {
  const bag = useBag();
  const pieces = bag.slugs.map((slug) => getPiece(slug)).filter((piece): piece is Piece => Boolean(piece));
  const total = pieces.reduce((sum, piece) => sum + piece.price, 0);

  return (
    <Sheet>
      <SheetTrigger className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 rounded-full px-4")}>
        Bag{pieces.length > 0 ? ` · ${pieces.length}` : ""}
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl">Bag</SheetTitle>
          <SheetDescription>A hold request for the pieces below. Payment happens by reply, not on this page.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-4 pb-6">
          {pieces.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing held yet. Add a print from the work.</p>
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {pieces.map((piece) => (
                  <li key={piece.slug} className="flex items-start justify-between gap-3 border-b border-border pb-3">
                    <div>
                      <p className="font-medium">{piece.title}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(piece.price)}</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => bag.remove(piece.slug)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
              <p className="text-sm">
                Together <span className="tabular-nums">{formatPrice(total)}</span>, before shipping.
              </p>
              <HoldForm
                idPrefix="bag"
                pieces={pieces.map((piece) => ({ slug: piece.slug, title: piece.title }))}
              />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
