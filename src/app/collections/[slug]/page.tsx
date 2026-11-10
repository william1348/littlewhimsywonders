import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { CheckoutStatusFromQuery } from "@/components/checkout-status-from-query";
import { CollectionViewer } from "@/components/collection-viewer";
import { collections, getCollection } from "@/lib/catalog";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection" };
  return {
    title: collection.title,
    description: `Browse the ${collection.title} collection from Little Whimsy Wonders.`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "customs-and-comissions") {
    redirect("/collections/customs-and-commissions");
  }
  const collection = getCollection(slug);
  if (!collection) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">Collections</p>
      <h1 className="mt-3 font-heading text-5xl tracking-tight">{collection.title}</h1>
      <p className="mt-4 text-muted-foreground">
        Choose a thumbnail to preview the piece, then buy now or request a custom commission.
      </p>
      <Suspense fallback={null}>
        <CheckoutStatusFromQuery className="mt-4" />
      </Suspense>
      <div className="mt-8">
        <CollectionViewer collection={collection} />
      </div>
      <Link href="/work" className="mt-8 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        Back to collections
      </Link>
    </main>
  );
}
