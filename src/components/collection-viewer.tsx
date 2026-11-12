"use client";

import { useMemo, useState } from "react";

import { CheckoutButton } from "@/components/checkout-button";
import { CommissionIcon } from "@/components/commission-icon";
import { buttonVariants } from "@/components/ui/button";
import type { Collection } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "cn";
import Link from "next/link";

export function CollectionViewer({ collection }: { collection: Collection }) {
  const [selectedId, setSelectedId] = useState(collection.items[0]?.id ?? "");
  const selected = useMemo(
    () => collection.items.find((item) => item.id === selectedId) ?? collection.items[0],
    [collection.items, selectedId],
  );

  if (!selected) {
    return <p className="text-muted-foreground">This collection has no items yet.</p>;
  }

  return (
    <section className="grid gap-8 md:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-xl bg-kraft ring-1 ring-foreground/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selected.image} alt={selected.title} className="h-auto w-full object-cover" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {collection.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={cn(
                "overflow-hidden rounded-lg ring-1 ring-foreground/15 transition-all",
                item.id === selected.id ? "ring-2 ring-green" : "opacity-85 hover:opacity-100",
              )}
              aria-pressed={item.id === selected.id}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="aspect-square h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
        <p className="text-xs tracking-[0.18em] text-copper uppercase">{collection.title}</p>
        <h2 className="font-heading text-4xl tracking-tight">{selected.title}</h2>
        <p className="font-heading text-3xl tabular-nums">{formatPrice(selected.price)}</p>
        <p className="leading-relaxed text-muted-foreground">{selected.summary}</p>
        <div className="flex flex-col gap-3">
          <CheckoutButton
            collectionSlug={collection.slug}
            itemId={selected.id}
            label="Buy now with Stripe"
            className="h-11 rounded-lg px-4"
          />
          <Link
            href="/studio"
            className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-lg bg-green px-4 font-light text-white hover:bg-green/90")}
          >
            <span className="inline-flex items-center gap-2">
              <CommissionIcon className="text-white/90" />
              Order Custom / Commission
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
