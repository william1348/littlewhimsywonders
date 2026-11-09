"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
};

export function AdminEmailBoard() {
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<Subscriber[] | null>(null);
  const [storage, setStorage] = useState<"database" | "local-file" | null>(null);
  const [stage, setStage] = useState<"production" | "preview" | null>(null);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/subscribers", { headers: { accept: "application/json" } });
      const body = (await response.json().catch(() => null)) as (EmailData & { message?: string }) | null;
      if (!response.ok) {
        if (response.status === 401) {
          setLocked(true);
          setRows(null);
          setStorage(null);
          setStage(null);
          setLoading(false);
          return;
        }
        setLocked(false);
        setRows(null);
        setStorage(null);
        setStage(null);
        setMessage(body?.message ?? "The admin list could not be opened.");
        setLoading(false);
        return;
      }
      if (!body || !Array.isArray(body.subscribers)) {
        setLocked(false);
        setRows(null);
        setStorage(null);
        setStage(null);
        setMessage("The admin list returned an unexpected reply.");
        setLoading(false);
        return;
      }
      setLocked(false);
      setRows(body.subscribers);
      setStorage(body.storage);
      setStage(body.stage);
    } catch {
      setLocked(false);
      setRows(null);
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

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        setMessage(body?.message ?? "Sign-in failed.");
        setSaving(false);
        return;
      }
      setPassword("");
      await load();
    } catch {
      setMessage("The studio could not be reached. Try again in a moment.");
    } finally {
      setSaving(false);
    }
  }

  async function onLogout() {
    setSaving(true);
    setMessage("");
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: { accept: "application/json" },
      });
      setLocked(true);
      setRows(null);
      setStorage(null);
      setStage(null);
      setPassword("");
    } catch {
      setMessage("Sign-out failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Opening admin…</p>;
  }

  if (locked) {
    return (
      <section className="max-w-md rounded-xl bg-card p-6 ring-1 ring-foreground/10">
        <h2 className="font-heading text-3xl tracking-tight">Admin sign-in</h2>
        <p className="mt-2 text-sm text-muted-foreground">Enter the admin password to see saved email addresses.</p>
        <form className="mt-5 flex flex-col gap-3" onSubmit={onLogin}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(message)}
            />
          </div>
          <Button type="submit" size="lg" className="h-11 rounded-lg px-4" disabled={saving}>
            {saving ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        {message ? <p className="mt-3 text-sm text-oxide">{message}</p> : null}
      </section>
    );
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
          <Button type="button" variant="outline" onClick={() => void load()} disabled={saving}>
            Refresh
          </Button>
          <Button type="button" variant="outline" onClick={() => void onLogout()} disabled={saving}>
            Sign out
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
    </section>
  );
}
