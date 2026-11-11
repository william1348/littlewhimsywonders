type CheckoutState = "success" | "cancelled";

export function CheckoutStatus({ state }: { state: CheckoutState }) {
  if (state === "success") {
    return (
      <div role="status" className="rounded-lg bg-card px-4 py-3 ring-1 ring-green/30">
        <p className="text-sm text-green">
          Payment received. Stripe emailed your receipt, and this order will appear in the studio desk.
        </p>
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
