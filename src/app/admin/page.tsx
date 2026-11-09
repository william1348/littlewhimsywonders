import type { Metadata } from "next";

import { AdminEmailBoard } from "@/components/admin-email-board";

export const metadata: Metadata = {
  title: "Admin",
  description: "List of saved email addresses.",
};

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <p className="text-xs tracking-[0.18em] text-oxide uppercase">Studio only</p>
      <h1 className="mt-3 font-heading text-5xl tracking-tight">Admin</h1>
      <div className="mt-8">
        <AdminEmailBoard />
      </div>
    </main>
  );
}
