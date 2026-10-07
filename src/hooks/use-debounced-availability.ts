import { useEffect, useState } from "react";

export type AvailabilityStatus = "idle" | "checking" | "available" | "used" | "error";

export function useDebouncedAvailability(value: string, valid: boolean, check: (value: string) => Promise<{ available: boolean }>) {
  const [result, setResult] = useState<{ value: string; status: AvailabilityStatus }>({ value: "", status: "idle" });
  useEffect(() => {
    if (!valid) return;
    let current = true;
    setResult({ value, status: "checking" });
    const timer = window.setTimeout(() => {
      void check(value).then(({ available }) => {
        if (current) setResult({ value, status: available ? "available" : "used" });
      }).catch(() => { if (current) setResult({ value, status: "error" }); });
    }, 500);
    return () => { current = false; window.clearTimeout(timer); };
  }, [value, valid, check]);
  return !valid ? "idle" : result.value === value ? result.status : "checking";
}
