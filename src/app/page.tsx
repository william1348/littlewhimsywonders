import Link from "next/link";

import { PieceCard } from "@/components/piece-card";
import { buttonVariants } from "@/components/ui/button";
import { featuredPieces } from "@/lib/catalog";
import { cn } from "cn";

export default function HomePage() {
  const featured = featuredPieces();

  return (
    <main>
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.3fr_0.7fr] md:py-24">
        <div>
          <p className="text-xs tracking-[0.18em] text-oxide uppercase">Prints and a few originals</p>
          <h1 className="mt-4 max-w-xl font-heading text-5xl leading-[0.95] tracking-tight sm:text-6xl">
            Work from a rented room on the north side.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            North Room is a one-person print studio. Editions are short. The originals are the drawings, when the drawing is the better object.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/work" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-lg px-4")}>
              See the work
            </Link>
            <Link href="/studio" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-lg px-4")}>
              Join the list
            </Link>
          </div>
        </div>
        <aside className="flex flex-col justify-end gap-4 border-t border-border pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <p className="font-heading text-2xl leading-snug">Held, then shipped flat.</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A hold request saves your name, your email, and the piece. The studio writes back about shipping and how to pay. This site does not charge a card.
          </p>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-heading text-3xl tracking-tight">On the table</h2>
          <Link href="/work" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            All of it
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((piece) => (
            <PieceCard key={piece.slug} piece={piece} />
          ))}
        </div>
      </section>
    </main>
  );
}
