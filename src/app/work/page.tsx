import type { Metadata } from "next";

import { WorkBrowser } from "@/components/work-browser";
import { pieces } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Work",
  description: "Prints and originals currently in the North Room studio.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <p className="text-xs tracking-[0.18em] text-oxide uppercase">The room</p>
      <h1 className="mt-3 max-w-2xl font-heading text-5xl tracking-tight">Work</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Eight pieces. Prints are editioned. Originals leave once. Prices are the work itself, before a tube or a board.
      </p>
      <div className="mt-10">
        <WorkBrowser pieces={pieces} />
      </div>
    </main>
  );
}
