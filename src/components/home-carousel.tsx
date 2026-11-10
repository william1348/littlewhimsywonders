"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { gallerySlides, type GallerySlide } from "@/lib/gallery";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const LOOP = [...gallerySlides, ...gallerySlides];

export function HomeCarousel() {
  const titleId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null;
  const slide = openIndex === null ? null : gallerySlides[openIndex];

  const close = useCallback(() => setOpenIndex(null), []);
  const go = useCallback((direction: -1 | 1) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return (current + direction + gallerySlides.length) % gallerySlides.length;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close, go]);

  return (
    <>
      <section aria-label="Studio photos" className={cn("group/carousel relative h-[320px] w-full overflow-hidden", open && "gallery-marquee-paused")}>
        <div className="gallery-marquee-track flex h-full w-max group-hover/carousel:[animation-play-state:paused]">
          {LOOP.map((item, index) => (
            <button
              key={`${item.src}-${index}`}
              type="button"
              className="relative h-full shrink-0 cursor-zoom-in overflow-hidden"
              onClick={() => setOpenIndex(index % gallerySlides.length)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} className="h-full w-auto max-w-none object-cover" />
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-page/30" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-page via-transparent to-page" />
      </section>

      {slide ? <GalleryView slide={slide} titleId={titleId} onClose={close} onPrev={() => go(-1)} onNext={() => go(1)} /> : null}
    </>
  );
}

function GalleryView({
  slide,
  titleId,
  onClose,
  onPrev,
  onNext,
}: {
  slide: GallerySlide;
  titleId: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex flex-col bg-linework text-page"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <h2 id={titleId} className="font-heading text-xl tracking-tight sm:text-2xl">
          {slide.title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-white/10"
          aria-label="Close gallery"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 py-4">
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-2 rounded-lg p-2 hover:bg-white/10 sm:left-4"
          aria-label="Previous image"
        >
          <ChevronLeft className="size-8" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.src} alt={slide.alt} className="max-h-full max-w-full object-contain" />
        <button
          type="button"
          onClick={onNext}
          className="absolute right-2 rounded-lg p-2 hover:bg-white/10 sm:right-4"
          aria-label="Next image"
        >
          <ChevronRight className="size-8" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-4">
        {slide.slug ? (
          <Link href={`/work/${slide.slug}`} className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-lg px-4")}>
            View this piece
          </Link>
        ) : (
          <Link href="/work" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-lg px-4")}>
            Browse the work
          </Link>
        )}
        <button type="button" onClick={onClose} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-lg px-4 border-page/40 bg-transparent text-page hover:bg-white/10 hover:text-page")}>
          Close
        </button>
      </div>
    </div>
  );
}
