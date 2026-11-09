import { requirePerson } from "@/lib/access";
import { allowRequest, json, readBody, sameOrigin } from "@/lib/http";
import { addInquiry, storageMode, storeFailureResponse } from "@/lib/store";
import { cleanEmail, cleanMessage, cleanName, cleanPieces, isRecord } from "@/lib/validators";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return json({ message: "That request did not come from this site." }, 403);
  }
  if (!allowRequest(request, "inquiries")) {
    return json({ message: "Too many notes at once. Wait a few minutes and try again." }, 429);
  }
  const person = await requirePerson(request);
  if (person instanceof Response) return person;

  const body = await readBody(request);
  if (body instanceof Response) return body;
  const record = isRecord(body) ? body : {};
  const name = cleanName(record.name);
  const email = cleanEmail(record.email);
  const message = cleanMessage(record.message);
  const pieces = cleanPieces(record.pieces);
  if (!name) return json({ message: "Enter your name." }, 400);
  if (!email) return json({ message: "Enter a valid email address." }, 400);
  if (!message) return json({ message: "Add a short note." }, 400);
  if (!pieces) return json({ message: "Choose a piece from the studio." }, 400);

  try {
    await addInquiry({ name, email, message, pieces, stage: person.stage });
  } catch (error) {
    return storeFailureResponse(error);
  }

  return json({
    message: "Hold requested. North Room will write back about shipping and payment.",
    storage: storageMode(),
  });
}
