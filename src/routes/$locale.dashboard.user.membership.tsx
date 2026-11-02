import { createFileRoute } from "@tanstack/react-router";
import { MembershipDashboardPage } from "../components/page/membership-dashboard-page";
import { getCurrentAuthenticatedUser } from "../server/auth/auth.functions";
import { getOwnerMembership } from "../server/membership/membership.functions";
import { getUserDashboardOutlets } from "../server/outlets/user-outlet.functions";
export const Route = createFileRoute("/$locale/dashboard/user/membership")({ loader: async () => { const [profile, outlets] = await Promise.all([getCurrentAuthenticatedUser(), getUserDashboardOutlets()]); if (!profile) throw new Error("AUTH_REQUIRED"); const enabled = outlets.filter((outlet) => outlet.membership?.isActive).sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")); return { profile, outlets, initial: enabled[0] ? await getOwnerMembership({ data: enabled[0].id }) : null }; }, component: () => { const data = Route.useLoaderData(); return <MembershipDashboardPage {...data} />; } });
