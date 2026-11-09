import { defaultStage } from "@/lib/access";
import { adminPasswordConfigured, hasAdminSession } from "@/lib/admin-auth";
import { json, sameOrigin } from "@/lib/http";
import { listDesk, storeFailureResponse } from "@/lib/store";

export async function GET(request: Request) {
  if (!sameOrigin(request)) {
    return json({ message: "That request did not come from this site." }, 403);
  }
  if (!adminPasswordConfigured()) {
    return json({ message: "Admin password is not configured." }, 503);
  }
  if (!hasAdminSession(request)) {
    return json({ message: "Enter the admin password to view this page." }, 401);
  }

  try {
    const data = await listDesk(defaultStage());
    return json({
      storage: data.storage,
      stage: data.stage,
      subscribers: data.subscribers,
    });
  } catch (error) {
    return storeFailureResponse(error);
  }
}
