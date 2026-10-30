import { createFileRoute } from "@tanstack/react-router";
import { ConsultationStatusPage } from "../components/page/consultation-status-page";
import { ConsultationLoadError, ConsultationLoading } from "../components/page/consultation-load-state";
import { getConsultationStatus } from "../server/consultations/consultation.functions";
import { consultationTokenSchema } from "../server/consultations/consultation.schemas";

export const Route = createFileRoute("/$locale/consultation/$token")({
  loader: ({ params }) => consultationTokenSchema.safeParse(params.token).success
    ? getConsultationStatus({ data: { token: params.token } })
    : { booking: null, whatsappNumber: null, serverNow: new Date().toISOString() },
  shouldReload: true,
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }, { name: "referrer", content: "no-referrer" }] }),
  component: StatusRoute,
  pendingComponent: ConsultationLoading,
  errorComponent: ConsultationLoadError,
});

function StatusRoute() { return <ConsultationStatusPage initial={Route.useLoaderData()} token={Route.useParams().token} />; }
