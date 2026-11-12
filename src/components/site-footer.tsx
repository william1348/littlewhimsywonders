import Link from "next/link";

const instagramUrl = "https://www.instagram.com/littlewhimsywonders/";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Little Whimsy Wonders. Short editions, printed in the room.</p>
        <p className="flex gap-4">
          <Link href="/about" className="text-base hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="text-base hover:text-foreground">
            Contact
          </Link>
          <a href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-foreground" aria-label="Instagram">
            <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
            </svg>
          </a>
        </p>
      </div>
    </footer>
  );
}
