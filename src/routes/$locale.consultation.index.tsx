import { publicPageHead } from "../lib/seo/head";
import { createFileRoute } from "@tanstack/react-router";
import { ConsultationBookingPage } from "../components/page/consultation-booking-page";
import { ConsultationLoadError, ConsultationLoading } from "../components/page/consultation-load-state";
import { getConsultationAvailability } from "../server/consultations/consultation.functions";

export const Route = createFileRoute("/$locale/consultation/")({
  loader: () => getConsultationAvailability(),
  shouldReload: true,
  head: ({ params }) => publicPageHead(params.locale, "consultation"),
  component: BookingRoute,
  pendingComponent: ConsultationLoading,
  errorComponent: ConsultationLoadError,
});

function BookingRoute() { return <ConsultationBookingPage initial={Route.useLoaderData()} />; }
