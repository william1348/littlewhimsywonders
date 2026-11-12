import { stageFromRequest } from "@/lib/access";
import { allowRequest, json, readBody, sameOrigin } from "@/lib/http";
import { contactMailerStatus, sendContactMessage } from "@/lib/mailer";
import { cleanEmail, cleanMessage, cleanName, isRecord } from "@/lib/validators";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return json({ message: "That request did not come from this site." }, 403);
  }
  if (!allowRequest(request, "contact")) {
    return json({ message: "Too many notes at once. Wait a few minutes and try again." }, 429);
  }

  const body = await readBody(request);
  if (body instanceof Response) return body;
  const record = isRecord(body) ? body : {};

  const name = cleanName(record.name);
  const email = cleanEmail(record.email);
  const message = cleanMessage(record.message);
  if (!name) return json({ message: "Enter your name." }, 400);
  if (!email) return json({ message: "Enter a valid email address." }, 400);
  if (!message) return json({ message: "Add a short note." }, 400);

  const stage = await stageFromRequest(request);
  const mailStatus = contactMailerStatus();
  if (!mailStatus.configured) {
    return json({ message: "Contact email is not configured yet." }, 503);
  }

  try {
    await sendContactMessage({ name, email, message, stage });
  } catch (error) {
    console.error("contact_email_failed", error);
    return json({ message: "Message could not be sent. Try again in a moment." }, 503);
  }

  return json({ message: "Thanks — your message was sent to the studio inbox." });
}
