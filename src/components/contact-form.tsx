"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postJson } from "@/lib/client-api";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [note, setNote] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setNote("");

    const result = await postJson("/api/contact", { name, email, message });
    if (!result.ok) {
      setStatus("error");
      setNote(result.message);
      return;
    }

    setStatus("done");
    setNote(result.message);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
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
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
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
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          maxLength={2000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us what you are looking for."
          className="min-h-32 bg-card px-3"
          aria-invalid={status === "error"}
        />
      </div>

      <Button type="submit" size="lg" className="h-11 w-fit rounded-lg px-4" disabled={status === "saving"}>
        {status === "saving" ? "Sending…" : "Send message"}
      </Button>

      {note ? (
        <p role={status === "error" ? "alert" : "status"} className={status === "error" ? "text-sm text-copper" : "text-sm"}>
          {note}
        </p>
      ) : null}
    </form>
  );
}
