"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getPiece } from "@/lib/catalog";
import { formatWhen } from "@/lib/format";

type Subscriber = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  pieces: string[];
  createdAt: string;
};

type DeskData = {
  storage: "database" | "local-file";
  subscribers: Subscriber[];
  inquiries: Inquiry[];
};

export function DeskBoard() {
  const [data, setData] = useState<DeskData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/desk", { headers: { accept: "application/json" } });
      const body = (await response.json().catch(() => null)) as (DeskData & { message?: string }) | null;
      if (!response.ok) {
        setData(null);
        setError(body?.message ?? (response.status === 403 ? "The desk is for the studio admin." : "The desk could not be opened."));
        setLoading(false);
        return;
      }
      if (!body || !Array.isArray(body.subscribers) || !Array.isArray(body.inquiries)) {
        setError("The desk sent an unexpected reply.");
        setLoading(false);
        return;
      }
      setData(body);
    } catch {
      setData(null);
      setError("The studio could not be reached. Try again in a moment.");
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

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-muted-foreground">
          Addresses and hold requests for this studio. The list stays here. It is not sent anywhere else.
        </p>
        <Button type="button" variant="outline" size="lg" className="h-10 rounded-lg px-4" onClick={() => void load()}>
          Refresh
        </Button>
      </div>

      {loading ? <p className="text-muted-foreground">Opening the desk…</p> : null}
      {!loading && error ? (
        <div role="alert" className="rounded-lg border border-border bg-card px-4 py-4">
          <p>{error}</p>
        </div>
      ) : null}

      {data ? (
        <>
          {data.storage === "local-file" ? (
            <p className="rounded-lg bg-secondary px-4 py-3 text-sm">
              Sample store: this copy is saving to a file on the machine running it. A published copy uses the studio database.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Saved in the studio database.</p>
          )}

          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-3xl tracking-tight">Mailing list</h2>
            {data.subscribers.length === 0 ? (
              <p className="text-muted-foreground">No addresses yet. The form on the studio page is empty.</p>
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
                    {data.subscribers.map((row) => (
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
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-3xl tracking-tight">Hold requests</h2>
            {data.inquiries.length === 0 ? (
              <p className="text-muted-foreground">No holds yet. A request from a piece, or from the bag, shows up here.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {data.inquiries.map((row) => (
                  <li key={row.id} className="rounded-lg bg-card px-4 py-4 ring-1 ring-foreground/10">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium">
                        {row.name} <span className="font-normal text-muted-foreground">{row.email}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{formatWhen(row.createdAt)}</p>
                    </div>
                    <p className="mt-2 text-sm">
                      {row.pieces.map((slug) => getPiece(slug)?.title ?? slug).join(", ")}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm">{row.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
