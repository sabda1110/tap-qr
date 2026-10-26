import { randomUUID } from "node:crypto";
import { getCookie, getRequestIP, getRequestProtocol, setCookie } from "@tanstack/react-start/server";
import { allowPublicEvent } from "./public-event-limiter.server";

export async function recordLimitedPublicEvent(key: string, record: () => Promise<void>) {
  try {
    let visitorId = getCookie("tapqr_analytics");
    if (!visitorId || !/^[a-f0-9-]{36}$/.test(visitorId)) {
      visitorId = randomUUID();
      setCookie("tapqr_analytics", visitorId, {
        httpOnly: true, sameSite: "lax", path: "/", maxAge: 86_400,
        secure: getRequestProtocol({ xForwardedProto: true }) === "https",
      });
    }
    const allowed = await allowPublicEvent(key, {
      ip: getRequestIP({ xForwardedFor: true }) ?? "unknown",
      visitorId,
    });
    if (allowed) await record();
  } catch {
    // Public navigation remains usable when analytics or its limiter is down.
    console.error("PUBLIC_ANALYTICS_RECORD_FAILED");
  }
}
