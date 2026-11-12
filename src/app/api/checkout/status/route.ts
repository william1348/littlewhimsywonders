import Stripe from "stripe";

import { json, sameOrigin } from "@/lib/http";
import { getOrderStatusBySessionId, type OrderStatus } from "@/lib/store";

export async function GET(request: Request) {
  if (!sameOrigin(request)) {
    return json({ message: "That request did not come from this site." }, 403);
  }

  const sessionId = new URL(request.url).searchParams.get("session_id")?.trim() ?? "";
  if (!sessionId.startsWith("cs_") || sessionId.length > 255) {
    return json({ message: "That checkout session id is not valid." }, 400);
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return json({ message: "Checkout is not configured yet." }, 503);
  }

  const stripe = new Stripe(secretKey);
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const storedStatus = await getOrderStatusBySessionId(session.id);
    const status = storedStatus ?? normalizeStatus(session.payment_status);
    return json({
      sessionId: session.id,
      status,
      persisted: Boolean(storedStatus),
      paymentStatus: session.payment_status ?? "unknown",
    });
  } catch (error) {
    console.error("checkout_status_failed", error);
    return json({ message: "Checkout session could not be loaded." }, 404);
  }
}

function normalizeStatus(status: Stripe.Checkout.Session.PaymentStatus | null): OrderStatus {
  if (status === "paid") return "paid";
  if (status === "unpaid") return "unpaid";
  return "failed";
}
