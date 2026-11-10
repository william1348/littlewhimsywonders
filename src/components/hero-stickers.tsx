"use client";

import { useEffect, useState } from "react";

import { cn } from "cn";

const portraits = [
  {
    src: "/img/rene-alien-sticker.png",
    alt: "Rene Kiss holding a handmade green alien",
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
      {portraits.map((portrait, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={portrait.src}
          src={portrait.src}
          alt={index === active ? portrait.alt : ""}
          aria-hidden={index !== active}
          className={cn(
            "absolute top-0 h-full w-[90%] object-contain object-bottom drop-shadow-[0_16px_24px_rgba(34,10,4,0.4)] transition-opacity duration-1000 ease-in-out",
            index === 0 ? "left-0" : "right-0",
            index === active ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}
