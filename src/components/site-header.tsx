"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BagSheet } from "@/components/bag";
import { cn } from "cn";

const links = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/desk", label: "Desk" },
];
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
            <span className="mt-1 block text-xs tracking-[0.18em] text-copper uppercase">Rene Kiss | Handmade in Colorado</span>
          </span>
        </Link>
        <nav aria-label="Studio" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm underline-offset-4 hover:underline",
                  active ? "text-foreground underline decoration-copper decoration-2" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Instagram
          </a>
          <BagSheet />
        </nav>
      </div>
    </header>
  );
}
