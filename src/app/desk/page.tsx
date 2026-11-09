import type { Metadata } from "next";

import { DeskBoard } from "@/components/desk-board";

export const metadata: Metadata = {
  title: "Desk",
  description: "Mailing list and hold requests for Little Whimsy Wonders.",
};

export default function DeskPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <p className="text-xs tracking-[0.18em] text-oxide uppercase">Studio only</p>
      <h1 className="mt-3 font-heading text-5xl tracking-tight">Desk</h1>
      <div className="mt-8">
        <DeskBoard />
      </div>
    </main>
  );
}
