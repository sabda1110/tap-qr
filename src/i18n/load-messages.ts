import type { id } from "./locales/id";
import type { Language } from "./index";

type Messages = typeof id;
const pending = new Map<Language, Promise<Messages>>();

// Cache static modules only; never put request/user data in this module cache.
export function loadMessages(language: Language): Promise<Messages> {
  const cached = pending.get(language);
  if (cached) return cached;
  const promise = language === "en"
    ? import("./locales/en").then(({ en }) => en)
    : import("./locales/id").then(({ id }) => id);
  pending.set(language, promise);
  void promise.catch(() => {
    if (pending.get(language) === promise) pending.delete(language);
  });
  return promise;
}
