export type GallerySlide = {
  src: string;
  alt: string;
  title: string;
  slug: string | null;
};

export const gallerySlides: GallerySlide[] = [
  {
    src: "/img/cello-boo-bottle.jpg",
    alt: "A tiny clay ghost and cello corked in a glass bottle on a snowy ledge",
    title: "Boos in a Bottle",
    slug: "boos-in-a-bottle",
  },
  {
    src: "/img/guitar-boo-bottle.jpg",
    alt: "A tiny clay ghost and guitar corked in a glass bottle among tulips",
    title: "Guitar Boo",
    slug: "guitar-boo-bottle",
  },
  {
    src: "/img/mushroom-boo-bottle.jpg",
    alt: "A mushroom-capped clay ghost in a glass bottle surrounded by flowers",
    title: "Mushroom Boo",
    slug: "mushroom-boo",
  },
  {
    src: "/img/studio-boos-pumpkins.jpg",
    alt: "Clay ghosts and tiny pumpkins on a studio table in progress",
    title: "In the studio",
    slug: null,
  },
  {
    src: "/img/studio-ghost-trio.jpg",
    alt: "Three clay ghosts and pumpkins on a work table",
    title: "Little boos in progress",
    slug: null,
  },
];
