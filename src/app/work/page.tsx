import type { Metadata } from "next";

import { WorkBrowser } from "@/components/work-browser";
import { pieces } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Art Pieces",
  description: "Art pieces currently available from the Little Whimsy Wonders studio.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <p className="text-xs tracking-[0.18em] text-oxide uppercase">The room</p>
      <h1 className="mt-3 max-w-2xl font-heading text-5xl tracking-tight">Art pieces</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Browse the collection, open any piece for full details, and send a purchase request from its page.
      </p>
      <div className="mt-10">
        <WorkBrowser pieces={pieces} />
      </div>
    </main>
  );
}
