import { canOpenDesk, requirePerson } from "@/lib/access";
import { json, sameOrigin } from "@/lib/http";
import { listDesk, storeFailureResponse } from "@/lib/store";

export async function GET(request: Request) {
  if (!sameOrigin(request)) {
    return json({ message: "That request did not come from this site." }, 403);
  }
  const person = await requirePerson(request);
  if (person instanceof Response) return person;
  if (!canOpenDesk(person)) {
    return json({ message: "The desk is for the studio admin." }, 403);
  }
  try {
    return json(await listDesk(person.stage));
  } catch (error) {
    return storeFailureResponse(error);
  }
}
