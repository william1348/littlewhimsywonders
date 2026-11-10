"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { gallerySlides, type GallerySlide } from "@/lib/gallery";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const LOOP = [...gallerySlides, ...gallerySlides];
const FULL_SPEED = 36;
const SPEED_MS = 500;

export function HomeCarousel() {
  const titleId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const speedRef = useRef(FULL_SPEED);
  const fromSpeedRef = useRef(FULL_SPEED);
  const toSpeedRef = useRef(FULL_SPEED);
  const speedStartedRef = useRef(0);
  const pausedRef = useRef(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null;
  const slide = openIndex === null ? null : gallerySlides[openIndex];
  const openRef = useRef(open);
  openRef.current = open;

  const setPaused = useCallback((next: boolean) => {
    if (pausedRef.current === next) return;
    pausedRef.current = next;
    fromSpeedRef.current = speedRef.current;
    toSpeedRef.current = next ? 0 : FULL_SPEED;
    speedStartedRef.current = performance.now();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPaused(true);
      speedRef.current = 0;
      toSpeedRef.current = 0;
      return;
    }

    function onMove(event: MouseEvent) {
      const rect = sectionRef.current?.getBoundingClientRect();
      const overCarousel =
        !!rect &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      const inMiddle = event.clientX / window.innerWidth >= 0.25 && event.clientX / window.innerWidth <= 0.75;
      setPaused(openRef.current || (overCarousel && inMiddle));
    }

    window.addEventListener("mousemove", onMove);

    let frame = 0;
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = Math.min(1, (now - speedStartedRef.current) / SPEED_MS);
      const eased = 1 - (1 - t) * (1 - t);
      speedRef.current = fromSpeedRef.current + (toSpeedRef.current - fromSpeedRef.current) * eased;
      offsetRef.current += speedRef.current * dt;
      const loopWidth = (trackRef.current?.scrollWidth ?? 0) / 2;
      if (loopWidth > 0 && offsetRef.current >= loopWidth) {
        offsetRef.current -= loopWidth;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [setPaused]);

  useEffect(() => {
    setPaused(open);
  }, [open, setPaused]);

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
      <section ref={sectionRef} aria-label="Studio photos" className="relative h-[320px] w-full overflow-hidden">
        <div ref={trackRef} className="flex h-full w-max will-change-transform">
          {LOOP.map((item, index) => (
            <button
              key={`${item.src}-${index}`}
              type="button"
              className="group/slide relative h-full shrink-0 cursor-pointer overflow-hidden"
              onClick={() => setOpenIndex(index % gallerySlides.length)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} className="h-full w-auto max-w-none object-cover" />
              <span className="absolute inset-0 bg-page/25 transition-opacity duration-500 group-hover/slide:opacity-0" />
              <span className="pointer-events-none absolute right-2 bottom-2 rounded-md bg-page/95 px-2 py-1 text-xs tracking-wide text-burgundy opacity-0 shadow-none transition-opacity duration-500 group-hover/slide:opacity-100">
                {item.title}
              </span>
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-page to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-page to-transparent" />
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
        <button
          type="button"
          onClick={onClose}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 rounded-lg border-page/40 bg-transparent px-4 text-page hover:bg-white/10 hover:text-page",
          )}
        >
          Close
        </button>
      </div>
    </div>
  );
}
