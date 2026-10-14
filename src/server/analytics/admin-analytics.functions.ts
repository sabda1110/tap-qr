import { createServerFn } from "@tanstack/react-start";

import { requireAdmin } from "../auth/authorization.server";
import { getAdminAnalyticsSummary } from "./admin-analytics.repository.server";

export const getAdminAnalytics = createServerFn({ method: "GET" }).handler(
  async () => {
    const user = await requireAdmin();
    const summary = await getAdminAnalyticsSummary();
    return { summary, user };
  },
);
