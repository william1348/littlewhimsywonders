"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type CheckoutButtonProps = {
  pieceSlug?: string;
  collectionSlug?: string;
  itemId?: string;
  label?: string;
  className?: string;
};

export function CheckoutButton({ pieceSlug, collectionSlug, itemId, label = "Buy now", className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onCheckout() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ pieceSlug, collectionSlug, itemId }),
      });
      const body = (await response.json().catch(() => null)) as { url?: string; message?: string } | null;
      if (!response.ok || !body?.url) {
        setError(body?.message ?? "Checkout is not available right now.");
        setLoading(false);
        return;
      }
      window.location.href = body.url;
    } catch {
      setError("Checkout could not be started. Try again in a moment.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" size="lg" className={className} onClick={onCheckout} disabled={loading}>
        {loading ? "Opening checkout…" : label}
      </Button>
      {error ? <p className="text-sm text-oxide">{error}</p> : null}
    </div>
  );
}
