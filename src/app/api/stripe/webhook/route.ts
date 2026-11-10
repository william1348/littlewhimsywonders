import Stripe from "stripe";

import { defaultStage } from "@/lib/access";
import { json } from "@/lib/http";
import { addOrder, storeFailureResponse, type OrderStatus } from "@/lib/store";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return json({ message: "Stripe webhook is not configured." }, 503);
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return json({ message: "Missing Stripe signature header." }, 400);
  }

  const payload = await request.text();
  const stripe = new Stripe(secretKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("stripe_webhook_signature_failed", error);
    return json({ message: "Webhook signature verification failed." }, 400);
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;
      await saveOrder(session, normalizeStatus(session.payment_status));
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await saveOrder(session, "failed");
    }
  } catch (error) {
    return storeFailureResponse(error);
  }

  return json({ received: true });
}

async function saveOrder(session: Stripe.Checkout.Session, status: OrderStatus) {
  const title = session.metadata?.itemTitle?.trim() || "Little Whimsy Wonders order";
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? "";
  await addOrder({
    sessionId: session.id,
    title,
    customerEmail,
    amountTotal: session.amount_total ?? 0,
    currency: (session.currency ?? "usd").toUpperCase(),
    status,
    source: "stripe-checkout",
    stage: session.metadata?.stage === "preview" ? "preview" : defaultStage(),
  });
}

function normalizeStatus(status: Stripe.Checkout.Session.PaymentStatus | null): OrderStatus {
  if (status === "paid") return "paid";
  if (status === "unpaid") return "unpaid";
  return "failed";
}
