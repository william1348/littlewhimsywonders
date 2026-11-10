import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-20">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">Missing</p>
      <h1 className="font-heading text-5xl tracking-tight">That piece is not in the room.</h1>
      <p className="max-w-md text-muted-foreground">The link may be old, or the title was typed wrong.</p>
      <Link href="/work" className={cn(buttonVariants({ size: "lg" }), "mt-2 h-11 w-fit rounded-lg px-4")}>
        Back to the work
      </Link>
    </main>
  );
}
