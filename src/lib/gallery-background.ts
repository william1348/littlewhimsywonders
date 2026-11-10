import type { Color } from "colorthief";

const FALLBACK = "#220A04";
const cache = new Map<string, string>();

function darkFromPalette(palette: Color[]): string {
  const darkest = [...palette].sort((a, b) => {
    const lightness = a.oklch().l - b.oklch().l;
    if (Math.abs(lightness) > 0.04) return lightness;
    return b.oklch().c - a.oklch().c;
  })[0];

  if (!darkest) return FALLBACK;
  if (darkest.isDark) return darkest.css();

  const { c, h } = darkest.oklch();
  return `oklch(0.16 ${Math.min(c, 0.1).toFixed(3)} ${h.toFixed(1)})`;
}

export async function galleryBackgroundFromImage(image: HTMLImageElement): Promise<string> {
  const key = image.currentSrc || image.src;
  const cached = cache.get(key);
  if (cached) return cached;

  try {
    const { getPalette } = await import("colorthief");
    const palette = await getPalette(image, { colorCount: 8, ignoreWhite: true });
    const color = palette?.length ? darkFromPalette(palette) : FALLBACK;
    cache.set(key, color);
    return color;
  } catch {
    return FALLBACK;
  }
}

export const GALLERY_BG_FALLBACK = FALLBACK;
