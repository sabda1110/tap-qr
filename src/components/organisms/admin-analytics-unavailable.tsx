import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

type Props = { content: { title: string; description: string; retry: string; retrying: string } };

export function AdminAnalyticsUnavailable({ content }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const retry = async () => {
    setPending(true);
    try { await router.invalidate(); }
    catch { /* The unavailable state remains visible if retry fails. */ }
    finally { setPending(false); }
  };

  return (
    <section role="alert" className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <AlertTriangle aria-hidden="true" className="size-6 text-amber-700" />
      <h1 className="mt-4 text-xl font-bold text-[#172029]">{content.title}</h1>
      <p className="mt-3 text-sm leading-7 text-[#58606b]">{content.description}</p>
      <Button className="mt-5" onClick={() => void retry()} disabled={pending}>
        {pending ? content.retrying : content.retry}
      </Button>
    </section>
  );
}
