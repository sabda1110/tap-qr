import { createFileRoute } from "@tanstack/react-router";
import { CashierPage } from "../components/page/cashier-page";
import { getCashierSession } from "../server/membership/membership.functions";
export const Route = createFileRoute("/$locale/cashier/$outletId")({ loader: async ({ params }) => { try { return await getCashierSession({ data: params.outletId }); } catch { return null; } }, component: () => <CashierPage outletId={Route.useParams().outletId} initialSession={Route.useLoaderData()} /> });
