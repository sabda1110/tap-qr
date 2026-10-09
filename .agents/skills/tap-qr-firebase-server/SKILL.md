---
name: tap-qr-firebase-server
description: Build TapQR Firebase Authentication and Firestore features through TanStack Start server functions. Use for authentication, authorization, Firestore reads or writes, card inventory, outlet data, and Firebase configuration.
---

# TapQR Firebase Server

Use Firebase as a server-owned data source. Read
[`docs/firestore-schema.md`](../../../docs/firestore-schema.md) before changing
data models, and read
[`docs/firebase-server-architecture.md`](../../../docs/firebase-server-architecture.md)
when changing Firebase setup or authentication flow.

## Boundaries

- Browser code may use `src/lib/firebase/client.ts` only for Firebase
  Authentication. It must not directly read or write Firestore.
- Server-only Firebase access goes through
  `src/lib/firebase/admin.server.ts`. Never import it into a client component.
- Put request validation in a feature schema, expose validated operations from
  `createServerFn`, and keep Firestore reads, writes, and transactions in a
  `*.repository.server.ts` file.
- Use GET server functions for loader-backed reads and POST for mutations.
  Validate every input with Zod before its handler uses it.

## Identity and authorization

- Firebase client login obtains an ID token; auth server functions verify it,
  synchronize the user profile, and establish the HTTP-only session.
- Password changes are Firebase Authentication client operations. For a
  password-provider user, reauthenticate with the current password immediately
  before `updatePassword`; never send either password through a Firestore
  server function or persist it in application state beyond the form.
- Do not show password-change controls for Google-provider users. Direct them
  to their Google Account settings instead of adding a separate TapQR password.
- Use `requireAdmin()` before every admin card, activation, outlet, owner
  lookup, image upload, or place-search operation. Add a focused owner guard
  when an owner-only feature is introduced.
- Do not trust a role, UID, card ID, outlet ID, or owner ID from the browser
  without checking it on the server.

## Firestore invariants

- Use a transaction for operations that reserve a slug, create an outlet,
  assign a card, or otherwise change dependent documents together.
- A card link belongs to `cards/{cardId}.config.social.links`, never to the
  outlet. Editing one card must not modify another card from the same outlet.
- Cards use opaque random identifiers and only unclaimed cards can be deleted
  or newly assigned. Keep claim tokens hashed and never send stored hashes to
  the browser.
- Duplicating a link copies its current fields to a new link ID. It never stores
  a source relation and never synchronizes future edits.

## Configuration and errors

- Keep service-account values only in ignored environment files or deployment
  secrets. Never add `server-token.json`, private keys, access tokens, or
  `.env.local` contents to source control or tool output.
- Keep Firebase Admin initialization lazy and idempotent using the existing
  helper.
- Throw stable internal error codes from repositories where useful; map them to
  localized UI messages at the feature boundary. Do not expose raw Firebase
  errors or credential details to users.

## Verification

- Cover pure transformations and transactional edge cases with meaningful unit
  tests when they protect ownership, uniqueness, or copy isolation.
- Run TypeScript and the production build after changing server functions,
  schemas, loaders, or Firebase boundaries. Do not use a browser unless the
  user explicitly asks for browser inspection.
