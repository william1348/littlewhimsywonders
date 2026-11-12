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
    <header
      className={cn(
        "sticky top-0 z-50 mb-5 bg-background transition-shadow duration-350 ease-out",
        menuOpen ? "shadow-[0_10px_24px_rgba(34,10,4,0.13)]" : "shadow-[0_4px_14px_rgba(34,10,4,0.08)]",
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-4 md:py-5">
        <div className="flex min-h-[78px] items-center justify-between gap-3 md:min-h-0 md:gap-4">
          <Link href="/" className="group flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/ghost-mushroom.png"
              alt=""
              className="h-[68px] w-auto [filter:brightness(1.14)_drop-shadow(0_0_0.7px_rgba(34,10,4,0.45))_drop-shadow(0_1px_2px_rgba(82,32,40,0.22))]"
            />
            <span>
              <span className="block font-heading text-3xl leading-none tracking-tight">Little Whimsy Wonders</span>
              <span className="mt-2 block text-xs tracking-[0.18em] text-copper uppercase">
                <span className="ml-[1.5px] inline-block">Rene Kiss |</span>
                <span className="ml-1 inline-block">Handmade in Colorado</span>
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
        </div>
        <nav
          aria-label="Mobile studio"
          aria-hidden={!menuOpen}
          className={cn(
            "grid transition-all duration-350 ease-out md:hidden",
            menuOpen ? "mt-2 grid-rows-[1fr] opacity-100 translate-y-0" : "mt-0 grid-rows-[0fr] opacity-0 -translate-y-1 pointer-events-none",
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-3 pt-2">
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
          </div>
        </nav>
      </div>
    </header>
  );
}
