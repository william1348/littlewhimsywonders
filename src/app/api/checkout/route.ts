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
  const allowedShippingCountries = shippingCountries();
  const taxCode = stripeTaxCode();
  const automaticTaxEnabled = stripeAutomaticTaxEnabled();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      ...(automaticTaxEnabled ? { automatic_tax: { enabled: true } } : {}),
      billing_address_collection: "required",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(price * 100),
            product_data: {
              name: title,
              description: summary,
              ...(taxCode ? { tax_code: taxCode } : {}),
            },
          },
        },
      ],
      ...(allowedShippingCountries ? { shipping_address_collection: { allowed_countries: allowedShippingCountries } } : {}),
      metadata: {
        stage: defaultStage(),
        itemTitle: title,
        pieceSlug: piece?.slug ?? "",
        collectionSlug,
        itemId,
      },
      success_url: `${baseUrl}${returnPath}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${returnPath}?checkout=cancelled`,
    });
    if (!session.url) {
      return json({ message: "Checkout is not available right now." }, 503);
    }
    return json({ url: session.url });
  } catch (error) {
    console.error("checkout_failed", error);
    return json({ message: "Checkout could not be started. Check STRIPE_SECRET_KEY and optional Stripe tax settings." }, 503);
  }
}

function requestBaseUrl(request: Request): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? (host?.startsWith("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");
  if (!host) return "http://127.0.0.1:3847";
  return `${proto}://${host}`;
}

function stripeTaxCode(): string | null {
  const value = process.env.STRIPE_TAX_CODE?.trim();
  return value ? value : null;
}

function stripeAutomaticTaxEnabled(): boolean {
  const value = process.env.STRIPE_AUTOMATIC_TAX?.trim().toLowerCase();
  return value === "true";
}

function shippingCountries(): Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] | null {
  const raw = process.env.STRIPE_SHIPPING_COUNTRIES?.trim();
  if (!raw) return null;
  const values = raw
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter((value) => /^[A-Z]{2}$/.test(value));
  const countries = [...new Set(values)] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[];
  return countries.length > 0 ? countries : null;
}
