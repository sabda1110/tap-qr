import { createFileRoute, notFound } from "@tanstack/react-router";
import { OutletProfilePage } from "../components/page/outlet-profile-page";
import { getOutletProfile } from "../server/outlets/public-profile.functions";

export const Route = createFileRoute("/$locale/p/$id")({
  loader: async ({ params }) => {
    const profile = await getOutletProfile({ data: { id: params.id } });
    if (!profile) throw notFound();
    return profile;
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.name} | TapQR` : "TapQR" }] }),
  component: OutletProfileRoute,
  notFoundComponent: () => <OutletProfilePage profile={null} />,
  errorComponent: () => <OutletProfilePage profile={null} failed />,
});

function OutletProfileRoute() {
  return <OutletProfilePage profile={Route.useLoaderData()} />;
}
