import type { Messages } from "../../i18n";
import type { OrderStatus } from "../../server/orders/order.schemas";
import { buttonVariants } from "../ui/button";
import { cn } from "../../lib/utils";

export function OrderChangeRequests({ order, number, content }: {
  order: { code: string; status: OrderStatus }; number: string | null; content: Messages["orders"]["management"];
}) {
  if (!number || !["on_progress", "confirmed"].includes(order.status)) return null;
  return <section className="mt-4">
    <div className="grid gap-2 sm:grid-cols-2">
      {(["edit", "cancel"] as const).map((kind) => <a key={kind} target="_blank" rel="noreferrer"
        href={`https://wa.me/${number}?text=${encodeURIComponent((kind === "edit" ? content.editMessage : content.cancelMessage).replace("{code}", order.code))}`}
        className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl px-3 text-xs")}>
        {kind === "edit" ? content.requestEdit : content.requestCancel}
      </a>)}
    </div>
    <p className="mt-2 text-xs leading-5 text-[#69737d]">{content.requestHelp}</p>
  </section>;
}
