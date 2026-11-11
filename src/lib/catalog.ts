export type PieceKind = "print" | "original";
export type CollectionTag = "Boos" | "Hats" | "Other" | "Globes";

export type Piece = {
  slug: string;
  title: string;
  kind: PieceKind;
  price: number;
  edition: string;
  size: string;
  paper: string;
  year: number;
  summary: string;
  description: string;
  image?: string;
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  tags: CollectionTag[];
  items: CollectionItem[];
};

export type CollectionItem = {
  id: string;
  title: string;
  image: string;
  price: number;
  summary: string;
};

export const pieces: Piece[] = [
  {
    slug: "boos-in-a-bottle",
    title: "Boos in a Bottle",
    kind: "original",
    price: 48,
    edition: "Unique",
    size: "3 in bottle",
    paper: "Clay, moss, and cork in glass",
    year: 2026,
    summary: "A tiny ghost and a cello, corked in for the winter.",
    description:
      "Handmade clay boo with a miniature cello, moss, and dried petals inside a corked bottle.",
    image: "/img/cello-boo-bottle.jpg",
  },
  {
    slug: "guitar-boo-bottle",
    title: "Guitar Boo",
    kind: "original",
    price: 48,
    edition: "Unique",
    size: "3 in bottle",
    paper: "Clay, moss, and cork in glass",
    year: 2026,
    summary: "A quiet boo and a guitar, standing in the tulips.",
    description:
      "Handmade clay boo with a miniature guitar, moss, and dried petals inside a corked bottle.",
    image: "/img/guitar-boo-bottle.jpg",
  },
  {
    slug: "mushroom-boo",
    title: "Mushroom Boo",
    kind: "original",
    price: 42,
    edition: "Unique",
    size: "3 in bottle",
    paper: "Clay, moss, and cork in glass",
    year: 2026,
    summary: "A boo under a purple cap, among the flowers.",
    description:
      "Handmade clay mushroom boo with moss and petals inside a corked bottle.",
    image: "/img/mushroom-boo-bottle.jpg",
  },
  {
    slug: "threshold-no-4",
    title: "Threshold No. 4",
    kind: "print",
    price: 85,
    edition: "Edition of 30",
    size: "18 × 24 in",
    paper: "Hahnemühle Photo Rag, 308 gsm",
    year: 2026,
    summary: "A doorway reduced to a slit of oxide on ruled bands.",
    description:
      "Pulled from a drawing made while the hallway light was out. The bands are the floorboards. The red is the gap under the door.",
  },
  {
    slug: "bowl-late",
    title: "Bowl, Late",
    kind: "original",
    price: 420,
    edition: "Unique",
    size: "11 × 14 in",
    paper: "Stonehenge, graphite and gouache",
    year: 2025,
    summary: "One bowl, the table, and the shadow that stayed after dinner.",
    description:
      "The original drawing. There is no print of it. The ellipse is slightly wrong on purpose, the way a bowl looks when you are tired.",
  },
  {
    slug: "fence-study",
    title: "Fence Study",
    kind: "print",
    price: 64,
    edition: "Edition of 40",
    size: "12 × 16 in",
    paper: "Hahnemühle Photo Rag, 308 gsm",
    year: 2026,
    summary: "Verticals from the alley fence, one of them missing.",
    description:
      "Counted on a walk and then miscounted in the studio. The gap is the part that mattered.",
  },
  {
    slug: "two-intervals",
    title: "Two Intervals",
    kind: "print",
    price: 110,
    edition: "Edition of 25",
    size: "16 × 20 in",
    paper: "Hahnemühle Photo Rag, 308 gsm",
    year: 2024,
    summary: "Two blocks of time, offset, sharing a corner.",
    description:
      "Made after a week of cutting mats. The overlap is the only place both intervals are true.",
  },
  {
    slug: "night-register",
    title: "Night Register",
    kind: "print",
    price: 36,
    edition: "Open edition",
    size: "8 × 10 in",
    paper: "Warm white text, 170 gsm",
    year: 2026,
    summary: "A ledger page with a single pale mark.",
    description:
      "The small print. It ships in a glassine sleeve, flat, not in a tube.",
  },
  {
    slug: "orchard-plan",
    title: "Orchard Plan",
    kind: "original",
    price: 680,
    edition: "Unique",
    size: "14 × 17 in",
    paper: "Graph paper, ink",
    year: 2023,
    summary: "A planting plan for trees that were never put in the ground.",
    description:
      "Drawn for a yard that was sold first. The dots are the trees. Three of them are crossed out.",
  },
  {
    slug: "red-margin",
    title: "Red Margin",
    kind: "print",
    price: 140,
    edition: "Edition of 15",
    size: "18 × 18 in",
    paper: "Hahnemühle Photo Rag, 308 gsm",
    year: 2025,
    summary: "Almost nothing, except the bar the plate could not leave out.",
    description:
      "The quietest print in the room. It wants a wall where a poster would be too loud.",
  },
  {
    slug: "kitchen-north",
    title: "Kitchen, North Light",
    kind: "print",
    price: 48,
    edition: "Edition of 50",
    size: "11 × 14 in",
    paper: "Hahnemühle Photo Rag, 188 gsm",
    year: 2026,
    summary: "The north window in four panes, and a stem in the lower one.",
    description:
      "Morning, before the coffee. The stem is a cutting that did take.",
  },
];

export const collectionTags: CollectionTag[] = ["Boos", "Hats", "Other", "Globes"];

export const collections: Collection[] = [
  {
    slug: "boos",
    title: "Lil' Boos",
    description:
      "Tiny ghost scenes in bottles, ornaments, and snowglobes with moss, petals, and cozy storybook details.",
    tags: ["Boos", "Globes"],
    items: [
      {
        id: "boos-in-a-bottle",
        title: "Boos in a Bottle",
        image: "/img/cello-boo-bottle.jpg",
        price: 48,
        summary: "Tiny ghost in glass with a miniature instrument and moss.",
      },
      {
        id: "boo-ornament",
        title: "Boo Ornament",
        image: "/img/guitar-boo-bottle.jpg",
        price: 46,
        summary: "A pocket-size boo ornament with dried flowers and soft color.",
      },
      {
        id: "till-death-snowglobe-boos",
        title: "Till Death Snowglobe Boos",
        image: "/img/mushroom-boo-bottle.jpg",
        price: 52,
        summary: "Mushroom-cap boo in a globe-style scene with moss and petals.",
      },
    ],
  },
  {
    slug: "hats",
    title: "Petal Hats",
    description:
      "Whimsical wearable hats and toppers with hand-painted details, ribbons, and playful boo-inspired accents.",
    tags: ["Hats", "Other"],
    items: [
      {
        id: "moonlight-boo-hat",
        title: "Moonlight Boo Hat",
        image: "/img/studio-boos-pumpkins.jpg",
        price: 64,
        summary: "Soft-shape hat with boo detailing and moonlight trim.",
      },
      {
        id: "witchy-ribbon-cap",
        title: "Witchy Ribbon Cap",
        image: "/img/studio-ghost-trio.jpg",
        price: 58,
        summary: "Ribbon-tied cap with hand-painted whimsical marks.",
      },
      {
        id: "pocket-parade-topper",
        title: "Pocket Parade Topper",
        image: "/img/rene-koozie-sticker.png",
        price: 62,
        summary: "Playful topper style with a parade of tiny stitched details.",
      },
    ],
  },
  {
    slug: "customs-and-commissions",
    title: "Customs & Commissions",
    description:
      "One-of-one made-to-order art designed around your ideas, colors, and memories, from ornaments to full scene pieces.",
    tags: ["Other"],
    items: [
      {
        id: "custom-boo-portrait",
        title: "Custom Boo Portrait",
        image: "/img/rene-trail-sticker.png",
        price: 180,
        summary: "Made-to-order portrait style with your preferred palette and mood.",
      },
      {
        id: "personalized-ornament",
        title: "Personalized Ornament",
        image: "/img/rene-alien-sticker.png",
        price: 95,
        summary: "Custom ornament with names, date, and character details.",
      },
      {
        id: "one-off-snowglobe-scene",
        title: "One-Off Snowglobe Scene",
        image: "/img/rene-kiss-studio.jpg",
        price: 240,
        summary: "A one-of-one commission scene designed around your story.",
      },
    ],
  },
];

const bySlug = new Map(pieces.map((piece) => [piece.slug, piece]));
const collectionsBySlug = new Map(collections.map((collection) => [collection.slug, collection]));

export function getPiece(slug: string): Piece | undefined {
  return bySlug.get(slug);
}

export function getCollection(slug: string): Collection | undefined {
  return collectionsBySlug.get(slug);
}

export function getCollectionItem(collectionSlug: string, itemId: string): CollectionItem | undefined {
  return collectionsBySlug.get(collectionSlug)?.items.find((item) => item.id === itemId);
}

export const featuredSlugs = ["threshold-no-4", "red-margin", "bowl-late"] as const;

export function featuredPieces(): Piece[] {
  return featuredSlugs.map((slug) => bySlug.get(slug)).filter((piece): piece is Piece => Boolean(piece));
}
