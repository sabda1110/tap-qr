---
name: tap-qr-frontend-architecture
description: Structure TapQR frontend features, route loading, state ownership, and shared state. Use when adding application state, TanStack Router data flow, stores, or cross-page frontend architecture.
---

# TapQR Frontend Architecture

Preserve simple data flow and add architecture only when the feature requires it.

## Current stack

- TanStack Start and TanStack Router.
- React 19 with strict TypeScript.
- Tailwind CSS and shadcn/ui primitives.
- URL-based internationalization for Indonesian and English.
- Firebase Authentication on the client and Firestore through TanStack server
  functions.
- Atomic design component boundaries documented in `AGENTS.md`.

## State placement

Choose the narrowest durable owner:

1. Keep ephemeral UI state inside the component when only that component uses
   it, such as a mobile menu toggle.
2. Lift state to the nearest shared parent when a small subtree coordinates it.
3. Put shareable navigation state in the URL when users should be able to link,
   reload, or use browser history with it.
4. Use server loaders or server functions for server-owned data.
5. Use Zustand only for client state shared across distant components or routes
   when URL state, props, and a focused provider are no longer suitable.

For the owner dashboard outlet selector, keep the selected outlet ID in the
owning section component. Derive the initial and fallback selection from the
largest valid `createdAt`; do not copy the outlet collection into Zustand.

## Zustand direction

- Zustand is used for client authentication state in
  `src/store/auth/auth-store.ts`. Keep its profile and status synchronized with
  the Firebase/session flow; do not place Firestore collections in this store.
- Zustand remains the preferred global client-state library for a justified new
  cross-route client concern. Split stores by domain.
- Split stores by domain rather than creating one application-wide bag of state.
- Expose focused selectors so components subscribe only to the values they use.
- Keep server data out of Zustand unless an explicit offline or optimistic
  workflow requires a client-owned copy.
- Keep actions next to their domain state and avoid direct state mutation from
  UI components.
- Persist only values that must survive reloads; version persisted state and
  never persist secrets or sensitive customer data.

## Boundaries and performance

- Avoid global context or stores for static translations, props, or data already
  owned by the router.
- Keep customer-facing pages lightweight and SSR-friendly. Do not move them to a
  heavy client-only flow for convenience.
- Prefer derived selectors over duplicated state.
- Keep store and architecture files within the repository-wide 300-line limit.
- Document a non-obvious state ownership decision near the store or feature,
  especially when choosing global state over URL or server state.

## Route and server data flow

- Validate route search state with Zod. Use `loaderDeps` to pass only the
  search or parameter values that affect a loader.
- Route loaders call the matching GET `createServerFn` and pass their result
  to a thin Page component. Do not refetch the same initial data in an effect.
- After a successful server mutation, call `router.invalidate()` before
  relying on loader data again. Keep modal, selected-card, and draft state local
  to the page or form that owns it.
- Owner account settings use `/$locale/dashboard/user/account`. Keep its route
  loader and Page boundary thin, and use the semantic `accountSettings` name in
  component state and navigation.
- Use debounced availability hooks for server-checked inputs such as email,
  slug, and owner search. Normalize the query, guard stale requests, and cache
  short-lived lookup results when the existing hook supports it.
