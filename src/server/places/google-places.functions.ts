import { createServerFn } from "@tanstack/react-start";

import { requireAdmin } from "../auth/authorization.server";
import { searchGooglePlaces } from "./google-places.repository.server";
import { searchGooglePlacesSchema } from "./google-places.schemas";

export const searchAdminGooglePlaces = createServerFn({ method: "GET" })
  .validator(searchGooglePlacesSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    return searchGooglePlaces(data.query);
  });
