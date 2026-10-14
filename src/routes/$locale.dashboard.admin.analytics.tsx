import { createFileRoute } from "@tanstack/react-router";

import { AdminAnalyticsPage } from "../components/page/admin-analytics-page";
import { getAdminAnalytics } from "../server/analytics/admin-analytics.functions";

export const Route = createFileRoute("/$locale/dashboard/admin/analytics")({
  loader: () => getAdminAnalytics(),
  component: AdminAnalyticsRoute,
});

function AdminAnalyticsRoute() {
  const { summary, user } = Route.useLoaderData();
  return <AdminAnalyticsPage profile={user} summary={summary} />;
}
