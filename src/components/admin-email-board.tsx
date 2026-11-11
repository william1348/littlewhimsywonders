"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatWhen } from "@/lib/format";

type Subscriber = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
};

type EmailData = {
  storage: "database" | "local-file";
  stage: "production" | "preview";
  subscribers: Subscriber[];
  orders: {
    id: string;
    title: string;
    customerEmail: string;
    amountTotal: number;
    currency: string;
    status: "paid" | "unpaid" | "failed";
    createdAt: string;
  }[];
};

export function AdminEmailBoard() {
  const [rows, setRows] = useState<Subscriber[] | null>(null);
  const [orders, setOrders] = useState<EmailData["orders"]>([]);
  const [storage, setStorage] = useState<"database" | "local-file" | null>(null);
  const [stage, setStage] = useState<"production" | "preview" | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/subscribers", { headers: { accept: "application/json" } });
      const body = (await response.json().catch(() => null)) as (EmailData & { message?: string }) | null;
      if (!response.ok) {
        setRows(null);
        setOrders([]);
        setStorage(null);
        setStage(null);
        setMessage(body?.message ?? "The admin list could not be opened.");
        setLoading(false);
        return;
      }
      if (!body || !Array.isArray(body.subscribers) || !Array.isArray(body.orders)) {
        setRows(null);
        setOrders([]);
        setStorage(null);
        setStage(null);
        setMessage("The admin list returned an unexpected reply.");
        setLoading(false);
        return;
      }
      setRows(body.subscribers);
      setOrders(body.orders);
      setStorage(body.storage);
      setStage(body.stage);
    } catch {
      setRows(null);
      setOrders([]);
      setStorage(null);
      setStage(null);
      setMessage("The studio could not be reached. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  if (loading) {
    return <p className="text-muted-foreground">Opening admin…</p>;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {storage === "database"
              ? "Saved in the studio database."
              : "Sample store: this copy is saving to a local file."}
          </p>
          <p className="text-xs text-muted-foreground uppercase">Stage: {stage ?? "production"}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => void load()}>
            Refresh
          </Button>
        </div>
      </div>
      {message ? (
        <div role="alert" className="rounded-lg border border-border bg-card px-4 py-3">
          <p>{message}</p>
        </div>
      ) : null}
      {!rows || rows.length === 0 ? (
        <p className="text-muted-foreground">No addresses yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg ring-1 ring-foreground/10">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.source}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatWhen(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-2">
        <h2 className="font-heading text-2xl tracking-tight">Card checkouts</h2>
      </div>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">No card checkouts yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg ring-1 ring-foreground/10">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3">{row.title}</td>
                  <td className="px-4 py-3">{row.customerEmail || "—"}</td>
                  <td className="px-4 py-3">{formatMoney(row.amountTotal, row.currency)}</td>
                  <td className="px-4 py-3 capitalize">{row.status}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatWhen(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function formatMoney(amountCents: number, currency: string): string {
  const normalized = currency || "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalized.toUpperCase(),
    }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${normalized.toUpperCase()}`;
  }
}
