# Firebase server architecture

TapQR replaces PostgreSQL/Drizzle with Firebase Authentication and Firestore.

```text
React form → Firebase Authentication → Firebase ID token
                                      ↓
                         TanStack createServerFn
                                      ↓
                         Firebase Admin SDK
                                      ↓
                               Firestore users
```

## Folder responsibilities

- `src/lib/firebase/client.ts`: Firebase Web SDK for the browser.
- `src/lib/firebase/admin.server.ts`: Firebase Admin SDK for server-only code.
- `src/server/auth`: Zod input validation, identity verification, and server functions.
- `src/server/users`: Firestore queries for the `users` collection.

`syncAuthenticatedUser` is the Firestore equivalent of an insert/update query.
`getAuthenticatedUser` is the equivalent of a detail query. Both receive a
Firebase ID token, verify it on the server, then access Firestore through the
Admin SDK.

## Required Firebase Console setup

1. Enable Email/Password and Google in Authentication → Sign-in method.
2. Create a Firestore database.
3. Create a new Firebase Admin service-account key.
   - For both local dev (`.env.local`) and Vercel/Production: set
     `FIREBASE_SERVICE_ACCOUNT_KEY` with the minified JSON or Base64 string of the service account.
   - Alternatively for local dev: save it as `server-token.json` in the project root,
     then set `GOOGLE_APPLICATION_CREDENTIALS=./server-token.json` in `.env.local`.
   The `server-token.json` file and `.env.local` are ignored by Git and must never be committed.
4. Deploy `firestore.rules` when Firestore is ready. Client reads/writes are
   denied because trusted access happens through TanStack server functions.
