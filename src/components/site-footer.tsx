import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 North Room. Short editions, printed in the room.</p>
        <p className="flex gap-4">
          <Link href="/studio" className="hover:text-foreground">
            The list
          </Link>
          <Link href="/work" className="hover:text-foreground">
            The work
          </Link>
        </p>
      </div>
    </footer>
  );
}
