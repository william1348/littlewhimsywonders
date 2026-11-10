import Stripe from "stripe";

import { defaultStage } from "@/lib/access";
import { allowRequest, json, readBody, sameOrigin } from "@/lib/http";
import { getCollectionItem, getPiece } from "@/lib/catalog";
import { isRecord } from "@/lib/validators";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return json({ message: "That request did not come from this site." }, 403);
  }
  if (!allowRequest(request, "checkout")) {
    return json({ message: "Too many checkout attempts. Try again in a moment." }, 429);
  }

  const body = await readBody(request);
  if (body instanceof Response) return body;
  const record = isRecord(body) ? body : {};

  const pieceSlug = typeof record.pieceSlug === "string" ? record.pieceSlug : "";
  const collectionSlug = typeof record.collectionSlug === "string" ? record.collectionSlug : "";
  const itemId = typeof record.itemId === "string" ? record.itemId : "";

  const piece = pieceSlug ? getPiece(pieceSlug) : undefined;
  const collectionItem = !piece && collectionSlug && itemId ? getCollectionItem(collectionSlug, itemId) : undefined;

  const title = piece?.title ?? collectionItem?.title;
  const summary = piece?.summary ?? collectionItem?.summary ?? "";
  const price = piece?.price ?? collectionItem?.price;
  if (!title || !price || price < 1) {
    return json({ message: "That item is not available for checkout." }, 400);
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return json({ message: "Checkout is not configured yet." }, 503);
  }

  const stripe = new Stripe(secretKey);
  const baseUrl = requestBaseUrl(request);
  const returnPath = piece ? `/work/${piece.slug}` : `/collections/${collectionSlug}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(price * 100),
            product_data: {
              name: title,
              description: summary,
            },
          },
        },
      ],
      metadata: {
        stage: defaultStage(),
        itemTitle: title,
        pieceSlug: piece?.slug ?? "",
        collectionSlug,
        itemId,
      },
      success_url: `${baseUrl}${returnPath}?checkout=success`,
      cancel_url: `${baseUrl}${returnPath}?checkout=cancelled`,
    });
    if (!session.url) {
      return json({ message: "Checkout is not available right now." }, 503);
    }
    return json({ url: session.url });
  } catch (error) {
    console.error("checkout_failed", error);
    return json({ message: "Checkout could not be started. Try again in a moment." }, 503);
  }
}

function requestBaseUrl(request: Request): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? (host?.startsWith("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");
  if (!host) return "http://127.0.0.1:3847";
  return `${proto}://${host}`;
}
