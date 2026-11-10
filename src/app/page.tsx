import Link from "next/link";

import { ListForm } from "@/components/list-form";
import { PieceCard } from "@/components/piece-card";
import { buttonVariants } from "@/components/ui/button";
import { featuredPieces } from "@/lib/catalog";
import { cn } from "cn";

export default function HomePage() {
  const featured = featuredPieces();

  return (
    <main>
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 pt-3 pb-8 md:grid-cols-[1.3fr_0.7fr] md:pb-12">
        <div>
          <h1 className="max-w-xl font-heading text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl">
            <span className="block text-green">A world of whimsy through multi-medium art</span>
            <span className="mt-2 block text-2xl text-copper">Bringing a touch of magic through everyday life</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Browse the collection, open each piece for full details, and send a purchase request directly from the piece page.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/work" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-lg px-4")}>
              Browse the gallery
            </Link>
            <Link href="/work/threshold-no-4" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-lg px-4")}>
              View an art piece
            </Link>
          </div>
        </div>
        <aside className="border-t border-border pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-secondary text-sm text-muted-foreground ring-1 ring-foreground/10">
            Placeholder image
          </div>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-heading text-3xl tracking-tight">Featured pieces</h2>
          <Link href="/work" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            View all pieces
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((piece) => (
            <PieceCard key={piece.slug} piece={piece} />
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
