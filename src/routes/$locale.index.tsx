import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "../components/page/home-page";

export const Route = createFileRoute("/$locale/")({ component: HomePage });
