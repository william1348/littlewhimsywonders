"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "cn";

const instagramUrl = "https://www.instagram.com/littlewhimsywonders/";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background shadow-[0_3px_14px_rgba(34,10,4,0.08)] md:shadow-none">
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
            <span className="mt-2 block text-xs tracking-[0.18em] text-copper uppercase">
              <span className="ml-[1.5px] inline-block">Rene Kiss | </span>
              Handmade in Colorado
            </span>
          </span>
        </Link>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <>
                <path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
        <nav aria-label="Studio" className="hidden flex-wrap items-center gap-x-5 gap-y-2 md:flex">
          <Link
            href="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
            className={cn(
              "text-base underline-offset-4 hover:underline",
              pathname === "/about" ? "text-foreground underline decoration-copper decoration-2" : "text-muted-foreground",
            )}
          >
            About
          </Link>
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={cn(
              "text-base underline-offset-4 hover:underline",
              pathname === "/contact" ? "text-foreground underline decoration-copper decoration-2" : "text-muted-foreground",
            )}
          >
            Contact
          </Link>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
            </svg>
          </a>
        </nav>
        <nav
          aria-label="Mobile studio"
          aria-hidden={!menuOpen}
          className={cn(
            "w-full overflow-hidden transition-all duration-300 ease-out md:hidden",
            menuOpen
              ? "mt-2 max-h-52 translate-y-0 border-t border-border pt-3 opacity-100"
              : "max-h-0 -translate-y-1 border-t border-transparent pt-0 opacity-0 pointer-events-none",
          )}
        >
          <div className="flex flex-col gap-3">
            <Link
              href="/about"
              aria-current={pathname === "/about" ? "page" : undefined}
              className={cn(
                "text-base underline-offset-4 hover:underline",
                pathname === "/about" ? "text-foreground underline decoration-copper decoration-2" : "text-muted-foreground",
              )}
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
              className={cn(
                "text-base underline-offset-4 hover:underline",
                pathname === "/contact" ? "text-foreground underline decoration-copper decoration-2" : "text-muted-foreground",
              )}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="w-fit text-muted-foreground hover:text-foreground"
              aria-label="Instagram"
              onClick={() => setMenuOpen(false)}
            >
              <span className="inline-flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
                </svg>
                Instagram
              </span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
