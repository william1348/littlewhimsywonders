"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "cn";

const instagramUrl = "https://www.instagram.com/littlewhimsywonders/";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
        <Link href="/" className="group flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/ghost-mushroom.png"
            alt=""
            className="h-16 w-auto [filter:brightness(1.14)_drop-shadow(0_0_0.7px_rgba(34,10,4,0.45))_drop-shadow(0_1px_2px_rgba(82,32,40,0.22))]"
          />
          <span>
            <span className="block font-heading text-3xl leading-none tracking-tight">Little Whimsy Wonders</span>
            <span className="mt-2 block text-xs tracking-[0.18em] text-copper uppercase">Rene Kiss | Handmade in Colorado</span>
          </span>
        </Link>
        <nav aria-label="Studio" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
            className={cn(
              "text-sm underline-offset-4 hover:underline",
              pathname === "/about" ? "text-foreground underline decoration-copper decoration-2" : "text-muted-foreground",
            )}
          >
            About
          </Link>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
            </svg>
          </a>
        </nav>
      </div>
    </header>
  );
}
