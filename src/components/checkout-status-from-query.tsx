"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CheckoutStatus } from "@/components/checkout-status";

type CheckoutStatusFromQueryProps = {
  className?: string;
};

type ApiStatus = "paid" | "unpaid" | "failed";

type VerificationState =
  | { sessionId: string; status: ApiStatus; persisted: boolean }
  | { sessionId: string; error: true }
  | null;

export function CheckoutStatusFromQuery({ className }: CheckoutStatusFromQueryProps) {
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");
  const sessionId = searchParams.get("session_id")?.trim() ?? "";
  const shouldVerify = checkout === "success" && Boolean(sessionId);
  const [verification, setVerification] = useState<VerificationState>(null);

  useEffect(() => {
    if (!shouldVerify) return;

    let cancelled = false;
    const query = encodeURIComponent(sessionId);
    void fetch(`/api/checkout/status?session_id=${query}`, { headers: { accept: "application/json" } })
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as { status?: ApiStatus; persisted?: boolean } | null;
        if (!response.ok || !body || (body.status !== "paid" && body.status !== "unpaid" && body.status !== "failed")) {
          throw new Error("checkout_status_failed");
        }
        if (cancelled) return;
        setVerification({ sessionId, status: body.status, persisted: Boolean(body.persisted) });
      })
      .catch(() => {
        if (cancelled) return;
        setVerification({ sessionId, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId, shouldVerify]);

  if (checkout !== "success" && checkout !== "cancelled") return null;

  if (checkout === "cancelled") {
    return (
      <div className={className}>
        <CheckoutStatus state="cancelled" />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className={className}>
        <CheckoutStatus state="success" persisted={false} />
      </div>
    );
  }

  if (!verification || verification.sessionId !== sessionId) {
    return (
      <div className={className}>
        <CheckoutStatus state="processing" />
      </div>
    );
  }

  if ("error" in verification) {
    return (
      <div className={className}>
        <CheckoutStatus state="success" persisted={false} />
      </div>
    );
  }

  const state = verification.status === "paid" ? "success" : verification.status === "unpaid" ? "pending" : "failed";
  return (
    <div className={className}>
      <CheckoutStatus state={state} persisted={verification.persisted} />
    </div>
  );
}
