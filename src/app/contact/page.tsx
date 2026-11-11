import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a message to Little Whimsy Wonders.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">Contact</p>
      <h1 className="mt-3 font-heading text-5xl tracking-tight">Reach the studio</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Send a note about commissions, custom requests, or any question about the work. Messages go directly to the studio inbox.
      </p>
      <div className="mt-8 max-w-3xl rounded-xl bg-card p-6 ring-1 ring-foreground/10">
        <ContactForm />
      </div>
    </main>
  );
}
