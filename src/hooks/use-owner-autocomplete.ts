import { useEffect, useRef, useState } from "react";
import { getAdminOutletOwners } from "../server/outlets/outlet-create.functions";
import type { OutletOwnerOption } from "../server/outlets/outlet-create.schemas";

export function useOwnerAutocomplete(query: string, enabled: boolean) {
  const normalizedQuery = query.trim().toLowerCase();
  const cache = useRef(
    new Map<string, { owners: OutletOwnerOption[]; expiresAt: number }>(),
  );
  const [owners, setOwners] = useState<OutletOwnerOption[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let current = true;
    const cached = cache.current.get(normalizedQuery);
    if (cached && cached.expiresAt > Date.now()) {
      setOwners(cached.owners);
      setStatus("ready");
      return;
    }
    setOwners([]);
    setStatus("loading");
    const timer = window.setTimeout(() => {
      void getAdminOutletOwners({ data: { query: normalizedQuery } })
        .then((options) => {
          cache.current.set(normalizedQuery, {
            owners: options,
            expiresAt: Date.now() + 60_000,
          });
          if (current) {
            setOwners(options);
            setStatus("ready");
          }
        })
        .catch(() => {
          if (current) setStatus("error");
        });
    }, 500);
    return () => {
      current = false;
      window.clearTimeout(timer);
    };
  }, [normalizedQuery, enabled, retry]);
  return {
    owners,
    status: enabled ? status : ("ready" as const),
    retry: () => {
      cache.current.delete(normalizedQuery);
      setRetry((value) => value + 1);
    },
  };
}
