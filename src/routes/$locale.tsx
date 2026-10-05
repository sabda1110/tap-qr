import {
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";

import {
  defaultLanguage,
  I18nProvider,
  isLanguage,
  type Language,
} from "../i18n";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLanguage(params.locale)) {
      throw redirect({
        to: "/$locale",
        params: { locale: defaultLanguage },
        replace: true,
      });
    }

    return { locale: params.locale };
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = Route.useRouteContext();
  const router = useRouter();
  const currentHref = useRouterState({
    select: (state) => state.location.href,
  });

  function changeLanguage(language: Language) {
    const nextHref = currentHref.replace(
      /^\/(id|en)(?=\/|\?|#|$)/,
      `/${language}`,
    );
    void router.navigate({ href: nextHref });
  }

  return (
    <I18nProvider language={locale} onLanguageChange={changeLanguage}>
      <Outlet />
    </I18nProvider>
  );
}
