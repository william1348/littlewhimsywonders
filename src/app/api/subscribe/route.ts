import { stageFromRequest } from "@/lib/access";
import { allowRequest, json, readBody, sameOrigin } from "@/lib/http";
import { addSubscriber, storageMode, storeFailureResponse } from "@/lib/store";
import { cleanEmail, isRecord } from "@/lib/validators";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return json({ message: "That request did not come from this site." }, 403);
  }
  if (!allowRequest(request, "subscribe")) {
    return json({ message: "Too many notes at once. Wait a few minutes and try again." }, 429);
  }

  const body = await readBody(request);
  if (body instanceof Response) return body;
  const email = cleanEmail(isRecord(body) ? body.email : undefined);
  if (!email) return json({ message: "Enter a valid email address." }, 400);
  const stage = await stageFromRequest(request);

  try {
    await addSubscriber({ email, source: "list", stage });
  } catch (error) {
    return storeFailureResponse(error);
  }

  return json({
    message: "You're on the list. North Room writes when a new edition is pulled.",
    storage: storageMode(),
  });
}
