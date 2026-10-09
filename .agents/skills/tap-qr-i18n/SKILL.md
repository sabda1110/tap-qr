---
name: tap-qr-i18n
description: Add or change localized UI, routes, navigation, metadata, and copy for TapQR. Use whenever user-facing content or locale-aware behavior changes.
---

# TapQR Internationalization

TapQR supports Indonesian (`id`) and English (`en`) with the locale in the URL.

## Required behavior

- Keep `/id` and `/en` working for every localized page.
- `/` redirects to `/id`. Unsupported locale codes fall back to the default
  locale through the existing locale route validation.
- Preserve the current path, query, and hash when switching languages.
- Keep the document `lang` attribute synchronized with the URL locale for SSR
  and client navigation.
- Keep owner account settings at `/$locale/dashboard/user/account`. Its visible
  navigation and page copy must use account settings terminology in both
  languages.

## Translation content

- Add the same key and object shape to `src/i18n/locales/id.ts` and
  `src/i18n/locales/en.ts` in one change. Domain modules such as
  `admin-dashboard-*.ts`, `outlets-*.ts`, and `outlet-create-*.ts`
  remain part of that typed locale tree and must be updated as a pair.
- Indonesian is the default and source shape; English must remain typed against
  it.
- Never place visible product copy directly in an organism, layout, or route.
  Pages obtain locale messages and inject the relevant content through props.
- Translate meaning and tone instead of performing rigid word-for-word
  translation. Keep CTA labels short and natural in both languages.
- Include accessible labels, alt text, empty states, errors, and navigation text
  in the locale files when they are user-facing.
- Keep server error codes internal. Map them to localized field errors or toast
  messages in the UI.

## Creating a localized page

- Place the route under `/$locale`, for example
  `src/routes/$locale.pricing.tsx` for `/id/pricing` and `/en/pricing`.
- Keep the route thin and render a Page component.
- Use locale-aware TanStack Router links with the active `language` parameter.
- Add page content beneath a clear namespace such as `pricing`, `dashboard`, or
  `onboarding`; do not accumulate unrelated strings under `home`.

## Verification

- Validate localized route generation and navigation through types, route
  definitions, and builds. Leave browser-based URL and language-switch checks
  to the user unless they explicitly request browser inspection in the current
  request.
- Run TypeScript to catch missing or mismatched translation keys.
