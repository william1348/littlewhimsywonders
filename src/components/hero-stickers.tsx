"use client";

import { useEffect, useState } from "react";

import { cn } from "cn";

const portraits = [
  {
    src: "/img/rene-alien-sticker.png",
    alt: "Rene Kiss holding a handmade green alien",
    bubble: "Holy Moly!",
  },
  {
    src: "/img/rene-koozie-sticker.png",
    alt: "Rene Kiss holding raccoon koozies",
  },
];

export function HeroStickers() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % portraits.length);
    }, 4200);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative h-72 md:h-full" aria-live="polite">
      {portraits.map((portrait, index) => {
        const visible = index === active;

        return (
          <div
            key={portrait.src}
            className={cn(
              "absolute top-0 h-full w-[90%] transition-opacity duration-1000 ease-in-out",
              index === 0 ? "left-0" : "right-0",
              visible ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={!visible}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portrait.src}
              alt={visible ? portrait.alt : ""}
              className={cn(
                "object-contain object-bottom drop-shadow-[0_16px_24px_rgba(34,10,4,0.4)]",
                portrait.bubble
                  ? "absolute right-0 bottom-0 h-[82%] w-[82%]"
                  : "h-full w-full",
              )}
            />
            {portrait.bubble ? (
              <div className="pointer-events-none absolute top-0 left-8 w-[7.85rem] -rotate-6 md:left-6 md:w-[8.65rem]">
                <svg
                  viewBox="0 0 240 150"
                  className="h-auto w-full overflow-visible"
                  aria-hidden="true"
                >
                  <path
                    d="M38 58 C22 18 78 6 122 16 C168 6 222 28 214 64 C228 102 168 128 118 122 C72 132 14 102 38 58 Z"
                    fill="#F6E6D0"
                    stroke="#F6E6D0"
                    strokeWidth="18"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M38 58 C22 18 78 6 122 16 C168 6 222 28 214 64 C228 102 168 128 118 122 C72 132 14 102 38 58 Z"
                    fill="#EAB46F"
                    stroke="#EAB46F"
                    strokeWidth="10"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M38 58 C22 18 78 6 122 16 C168 6 222 28 214 64 C228 102 168 128 118 122 C72 132 14 102 38 58 Z"
                    fill="#F6E6D0"
                    stroke="#220A04"
                    strokeWidth="5"
                    strokeLinejoin="round"
                  />
                  <path d="M132 118 L168 148 L112 124 Z" fill="#F6E6D0" />
                  <path
                    d="M132 118 L168 148 L112 124"
                    fill="none"
                    stroke="#F6E6D0"
                    strokeWidth="14"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <path
                    d="M132 118 L168 148 L112 124"
                    fill="none"
                    stroke="#EAB46F"
                    strokeWidth="8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <path d="M132 118 L168 148 L112 124 Z" fill="#F6E6D0" />
                  <path
                    d="M132 118 L168 148 L112 124"
                    fill="none"
                    stroke="#220A04"
                    strokeWidth="5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="absolute inset-0 flex items-center justify-center px-3 pb-3 font-heading text-[0.95rem] leading-none font-bold tracking-tight text-burgundy md:text-[1.05rem]">
                  {portrait.bubble}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
