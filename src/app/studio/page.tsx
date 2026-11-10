import type { Metadata } from "next";

import { ListForm } from "@/components/list-form";

export const metadata: Metadata = {
  title: "Studio",
  description: "A note from Little Whimsy Wonders, and the mailing list for the next edition.",
};

export default function StudioPage() {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
      <article className="max-w-xl">
        <p className="text-xs tracking-[0.18em] text-copper uppercase">The studio</p>
        <h1 className="mt-3 font-heading text-5xl tracking-tight">One room, north light.</h1>
        <div className="mt-6 flex flex-col gap-4 leading-relaxed text-muted-foreground">
          <p>
            Little Whimsy Wonders is a rented room with a north window, a drying rack, and a table that is never clear. The prints are short editions. When a drawing is better than the print it would become, the drawing is for sale instead.
          </p>
          <p>
            Visits are by note, and only when a piece is being picked up. The studio does not publish a street address.
          </p>
          <p>
            Shipping is flat, in a board or a sleeve. Payment is arranged in the reply. If you would rather not correspond, the list below is only for the next time something is pulled.
          </p>
        </div>
      </article>
      <section className="h-fit rounded-xl bg-card p-6 ring-1 ring-foreground/10">
        <h2 className="font-heading text-3xl tracking-tight">The list</h2>
        <p className="mt-2 mb-6 text-sm text-muted-foreground">
          Leave an address. It is kept for the studio and shown on the admin page, not passed on.
        </p>
        <ListForm />
      </section>
    </main>
  );
}
