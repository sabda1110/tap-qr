import { createFileRoute, notFound } from "@tanstack/react-router";
import { MembershipPassPage } from "../components/page/membership-pass-page";
import { getPublicMembershipPass } from "../server/membership/membership.functions";
export const Route = createFileRoute("/$locale/m/$token")({
  loader: async ({ params }) => { try { return await getPublicMembershipPass({ data: { token: params.token } }); } catch { throw notFound(); } },
  component: () => <MembershipPassPage pass={Route.useLoaderData()} />,
  notFoundComponent: () => <MembershipPassPage pass={null} />,
});
