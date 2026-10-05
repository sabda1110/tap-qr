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

## Translation content

- Add the same key and object shape to `src/i18n/locales/id.ts` and
  `src/i18n/locales/en.ts` in one change.
- Indonesian is the default and source shape; English must remain typed against
  it.
- Never place visible product copy directly in an organism, layout, or route.
  Pages obtain locale messages and inject the relevant content through props.
- Translate meaning and tone instead of performing rigid word-for-word
  translation. Keep CTA labels short and natural in both languages.
- Include accessible labels, alt text, empty states, errors, and navigation text
  in the locale files when they are user-facing.

## Creating a localized page

- Place the route under `/$locale`, for example
  `src/routes/$locale.pricing.tsx` for `/id/pricing` and `/en/pricing`.
- Keep the route thin and render a Page component.
- Use locale-aware TanStack Router links with the active `language` parameter.
- Add page content beneath a clear namespace such as `pricing`, `dashboard`, or
  `onboarding`; do not accumulate unrelated strings under `home`.

## Verification

- Check both locale URLs after changing copy or navigation.
- Confirm switching language changes the URL and retains the current page.
- Run TypeScript to catch missing or mismatched translation keys.
