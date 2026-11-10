"use client";

import { useSearchParams } from "next/navigation";

import { CheckoutStatus } from "@/components/checkout-status";

type CheckoutStatusFromQueryProps = {
  className?: string;
};

export function CheckoutStatusFromQuery({ className }: CheckoutStatusFromQueryProps) {
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");
  if (checkout !== "success" && checkout !== "cancelled") return null;
  return (
    <div className={className}>
      <CheckoutStatus state={checkout} />
    </div>
  );
}
