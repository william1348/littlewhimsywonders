"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postJson } from "@/lib/client-api";

export function HoldForm({
  pieces,
  idPrefix = "hold",
}: {
  pieces: { slug: string; title: string }[];
  idPrefix?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [note, setNote] = useState("");
  const [localFile, setLocalFile] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setNote("");
    const result = await postJson("/api/inquiries", {
      name,
      email,
      message,
      pieces: pieces.map((piece) => piece.slug),
    });
    if (!result.ok) {
      setStatus("error");
      setNote(result.message);
      return;
    }
    setStatus("done");
    setNote(result.message);
    setLocalFile(result.storage === "local-file");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-name`}>Name</Label>
          <Input
            id={`${idPrefix}-name`}
            name="name"
            required
            maxLength={80}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-11 bg-card px-3"
            aria-invalid={status === "error"}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-email`}>Email</Label>
          <Input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 bg-card px-3"
            aria-invalid={status === "error"}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-message`}>Note</Label>
        <Textarea
          id={`${idPrefix}-message`}
          name="message"
          required
          maxLength={2000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Where it should ship, or when you can pick it up."
          className="min-h-28 bg-card px-3"
          aria-invalid={status === "error"}
        />
      </div>
      <Button type="submit" size="lg" className="h-11 w-fit rounded-lg px-4" disabled={status === "saving" || pieces.length === 0}>
        {status === "saving" ? "Sending…" : "Request a hold"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Nothing is charged here. North Room writes back about shipping and payment. If the piece is gone, you hear that too.
      </p>
      {note ? (
        <p role={status === "error" ? "alert" : "status"} className={status === "error" ? "text-sm text-oxide" : "text-sm"}>
          {note}
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
