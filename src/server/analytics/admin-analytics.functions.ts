import { createServerFn } from "@tanstack/react-start";

import { requireAdmin } from "../auth/authorization.server";
import { getAdminAnalyticsSummary } from "./admin-analytics.repository.server";

export const getAdminAnalytics = createServerFn({ method: "GET" }).handler(
  async () => {
    const user = await requireAdmin();
    try {
      return { summary: await getAdminAnalyticsSummary(), user };
    } catch (error) {
      console.error("ADMIN_ANALYTICS_UNAVAILABLE", { message: error instanceof Error ? error.message : "Unknown error" });
      return { summary: null, user };
    }
  },
);
