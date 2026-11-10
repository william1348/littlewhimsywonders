"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postJson } from "@/lib/client-api";

export function ListForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [localFile, setLocalFile] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    const result = await postJson("/api/subscribe", { email });
    if (!result.ok) {
      setStatus("error");
      setMessage(result.message);
      return;
    }
    setStatus("done");
    setMessage(result.message);
    setLocalFile(result.storage === "local-file");
    setEmail("");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="list-email">Email</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="list-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 bg-card px-3 sm:max-w-sm"
            aria-invalid={status === "error"}
          />
          <Button type="submit" size="lg" className="h-11 rounded-lg px-4" disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Join the list"}
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">One note when a new edition is pulled. No weekly letter.</p>
      {message ? (
        <p role={status === "error" ? "alert" : "status"} className={status === "error" ? "text-sm text-copper" : "text-sm"}>
          {message}
        </p>
      ) : null}
      {localFile ? (
        <p className="text-sm text-muted-foreground">
          This copy is saving to a file on the machine running it. A published copy uses the studio database.
        </p>
      ) : null}
    </form>
  );
}
