import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";

import { BagProvider } from "@/components/bag";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Little Whimsy Wonders",
    template: "%s · Little Whimsy Wonders",
  },
  description:
    "A world of whimsy through multi-medium art. Bringing a touch of magic through everyday life. Browse the collection, send a purchase request, and join the list.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <BagProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-card focus:px-3 focus:py-2"
          >
            Skip to content
          </a>
          <SiteHeader />
          <div id="content" className="flex-1">
            {children}
          </div>
          <SiteFooter />
        </BagProvider>
      </body>
    </html>
  );
}
