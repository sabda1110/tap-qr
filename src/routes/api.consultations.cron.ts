import { createFileRoute } from "@tanstack/react-router";
import { handleConsultationCron } from "../server/consultations/consultation-cron.server";

export const Route = createFileRoute("/api/consultations/cron")({
  server: {
    handlers: {
      GET: ({ request }) => handleConsultationCron(request),
      POST: ({ request }) => handleConsultationCron(request),
    },
  },
});
