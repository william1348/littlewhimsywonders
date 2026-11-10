import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Little Whimsy Wonders.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-12 md:py-16">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">About</p>
      <h1 className="mt-3 font-heading text-5xl tracking-tight">Little Whimsy Wonders</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
        <p>Little Whimsy Wonders is a multi-medium studio by Rene Kiss based in Denver, Colorado.</p>
        <p>
          The work moves between playful sculptures, hand-built miniatures, custom commissions, and seasonal one-off pieces.
          Every release is small and made with story-first details.
        </p>
      </div>
    </main>
  );
}
