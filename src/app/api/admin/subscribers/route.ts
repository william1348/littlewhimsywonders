import { defaultStage } from "@/lib/access";
import { json, sameOrigin } from "@/lib/http";
import { listDesk, storeFailureResponse } from "@/lib/store";

export async function GET(request: Request) {
  if (!sameOrigin(request)) {
    return json({ message: "That request did not come from this site." }, 403);
  }

  try {
    const data = await listDesk(defaultStage());
    return json({
      storage: data.storage,
      stage: data.stage,
      subscribers: data.subscribers,
      orders: data.orders,
    });
  } catch (error) {
    return storeFailureResponse(error);
  }
}
