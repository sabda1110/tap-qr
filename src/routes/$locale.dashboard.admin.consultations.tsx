import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AdminConsultationsPage } from "../components/page/admin-consultations-page";
import { AdminConsultationsLoadError, AdminConsultationsLoading } from "../components/page/admin-consultations-load-state";
import { getAdminConsultations } from "../server/consultations/consultation.functions";
import { consultationFiltersSchema, consultationTokenSchema } from "../server/consultations/consultation.schemas";

export const Route = createFileRoute("/$locale/dashboard/admin/consultations")({
  validateSearch: consultationFiltersSchema.extend({
    tab: z.enum(["bookings", "slots", "settings"]).optional(),
    focus: consultationTokenSchema.optional(),
  }),
  loader: () => getAdminConsultations(),
  staleTime: 25_000,
  component: ConsultationsRoute,
  pendingComponent: AdminConsultationsLoading,
  errorComponent: AdminConsultationsLoadError,
});

function ConsultationsRoute() {
  return <AdminConsultationsPage initial={Route.useLoaderData()} search={Route.useSearch()} />;
}
