import { createHash, timingSafeEqual } from "node:crypto";
import { runConsultationMaintenance } from "./consultation-maintenance.server";

export function hasConsultationCronAuthorization(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization");
  if (!secret || secret.length < 32 || !authorization?.startsWith("Bearer ")) return false;
  const expected = createHash("sha256").update(`Bearer ${secret}`).digest();
  const received = createHash("sha256").update(authorization).digest();
  return timingSafeEqual(expected, received);
}

export async function handleConsultationCron(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!hasConsultationCronAuthorization(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  }
  try {
    await runConsultationMaintenance();
    return Response.json({ ok: true }, { headers });
  } catch {
    console.warn("consultation_maintenance_failed");
    return Response.json({ error: "Maintenance unavailable" }, { status: 503, headers });
  }
}
