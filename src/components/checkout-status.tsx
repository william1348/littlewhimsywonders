type CheckoutState = "success" | "cancelled" | "processing" | "pending" | "failed";

export function CheckoutStatus({ state, persisted = true }: { state: CheckoutState; persisted?: boolean }) {
  if (state === "success") {
    return (
      <div role="status" className="rounded-lg bg-card px-4 py-3 ring-1 ring-green/30">
        <p className="text-sm text-green">
          {persisted
            ? "Payment received. Stripe emailed your receipt, and this order is in the studio desk."
            : "Payment received. Stripe emailed your receipt, and this order is syncing to the studio desk."}
        </p>
      </div>
    );
  }

  if (state === "processing") {
    return (
      <div role="status" className="rounded-lg bg-card px-4 py-3 ring-1 ring-foreground/20">
        <p className="text-sm text-muted-foreground">Confirming this checkout with Stripe…</p>
      </div>
    );
  }

  if (state === "pending") {
    return (
      <div role="status" className="rounded-lg bg-card px-4 py-3 ring-1 ring-copper/25">
        <p className="text-sm text-copper">Payment is still pending. Stripe will update this checkout shortly.</p>
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div role="status" className="rounded-lg bg-card px-4 py-3 ring-1 ring-copper/25">
        <p className="text-sm text-copper">Payment was not completed. You can try checkout again whenever you are ready.</p>
      </div>
    );
  }

  return (
    <div role="status" className="rounded-lg bg-card px-4 py-3 ring-1 ring-copper/25">
      <p className="text-sm text-copper">
        Checkout was cancelled. Nothing was charged, and you can try again whenever you are ready.
      </p>
    </div>
  );
}
