import Link from "next/link";
import { Suspense } from "react";

import { HeroStickers } from "@/components/hero-stickers";
import { HomeCarousel } from "@/components/home-carousel";
import { ListForm } from "@/components/list-form";
import { CommissionIcon } from "@/components/commission-icon";
import { buttonVariants } from "@/components/ui/button";
import { collections } from "@/lib/catalog";
import { cn } from "cn";

export default function HomePage() {
  const homeCollections = collections;

  return (
    <main>
      <section className="mx-auto grid w-full max-w-6xl items-stretch gap-10 px-5 pt-3 pb-8 md:grid-cols-[1.3fr_0.7fr] md:pb-12">
        <div>
          <h1 className="max-w-xl font-heading text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl">
            <span className="block text-green">A world of whimsy through multi-medium art</span>
            <span className="mt-2 block text-2xl text-copper">Bringing a touch of magic into everyday life</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Browse the collection, open each piece for full details, and send a purchase request directly from the piece page.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/work" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-lg px-4")}>
              Browse the gallery
            </Link>
            <Link href="/studio" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-lg px-4")}>
              <span className="inline-flex items-center gap-2">
                <CommissionIcon className="text-foreground/65" />
                Commission an art piece
              </span>
            </Link>
          </div>
        </div>
        <aside className="border-t border-border pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <HeroStickers />
        </aside>
      </section>

      <Suspense fallback={<div className="h-[320px] w-full bg-kraft/60" />}>
        <HomeCarousel />
      </Suspense>

      <section className="mx-auto w-full max-w-6xl px-5 pt-16 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-heading text-3xl tracking-tight">Collections</h2>
          <Link href="/work" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            View all collections
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {homeCollections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group block rounded-xl bg-card p-5 ring-1 ring-foreground/10 shadow-[0_8px_20px_rgba(34,10,4,0.08)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="mb-4 overflow-hidden rounded-lg ring-1 ring-foreground/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={collection.items[0]?.image}
                  alt={collection.items[0]?.title ?? collection.title}
                  className="h-72 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-80"
                />
              </div>
              <h3 className="font-heading text-[1.75rem] tracking-tight text-burgundy">{collection.title}</h3>
              <p className="mt-3 text-sm leading-6 text-green/90">
                {collection.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20">
        <div className="grid gap-8 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 md:grid-cols-[1fr_1.1fr] md:p-8">
          <div>
            <p className="text-xs tracking-[0.18em] text-copper uppercase">Mailing list</p>
            <h2 className="mt-3 font-heading text-4xl tracking-tight">Join the list</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Get a short note when new art pieces are released. No weekly newsletter and no sharing your address.
            </p>
          </div>
          <div className="max-w-xl">
            <ListForm />
          </div>
        </div>
      </section>
    </main>
  );
}
