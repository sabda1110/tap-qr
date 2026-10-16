import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag, Wifi, Link2 } from "lucide-react";
import { useI18n } from "../../i18n";
import type { UserProfile } from "../../lib/auth/user-profile";
import { orderDraftSchema, type OrderDraft } from "../../server/orders/order.schemas";
import { submitCardOrder, submitOwnerOrder } from "../../server/orders/order.functions";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { OrderDesignSelector } from "../molecules/order-design-selector";
import { OrderShippingFields } from "../molecules/order-shipping-fields";
import { useToast } from "../ui/toaster";
import type { OrderDetail } from "../../server/orders/order.types";
import { editAdminOrder, editOwnerOrder } from "../../server/orders/order-management.functions";

export function CardOrderForm({ user, available, context = "public", editing }: { user: UserProfile | null; available: boolean; context?: "public" | "owner" | "admin"; editing?: OrderDetail }) {
  const { language, messages } = useI18n();
  const content = messages.orders;
  const { showToast } = useToast();
  const navigate = useNavigate();
  const request = useRef<{ token: string; draft: string } | null>(null);
  const [error, setError] = useState<string>();
  const [reason, setReason] = useState("");
  const form = useForm<OrderDraft>({ resolver: zodResolver(orderDraftSchema), defaultValues: editing ? {
    ...editing.customer, shippingRegion: editing.customer.shippingRegion ?? { province: "", city: "", district: "", village: "" },
    material: editing.material, quantity: editing.quantity,
    ...(editing.product === "wifi" ? { product: "wifi" as const, theme: orderDraftSchema.options[1].shape.theme.parse(editing.theme) }
      : { product: "social" as const, theme: orderDraftSchema.options[0].shape.theme.parse(editing.theme) }),
  } : {
    name: user?.name ?? "", email: user?.email ?? "", phone: "", address: "",
    shippingRegion: { province: "", city: "", district: "", village: "" },
    product: "social", theme: "google", material: "acrylic", quantity: 1,
  } });
  const draft = form.watch();
  const busy = form.formState.isSubmitting;
  const submit = form.handleSubmit(async (order) => {
    setError(undefined);
    try {
      if (editing) {
        if (context === "admin" && reason.trim().length < 5) { setError(content.management.reasonHelp); return; }
        const result = await (context === "admin" ? editAdminOrder : editOwnerOrder)({ data: { id: editing.id, expectedRevision: editing.revision, order, reason } });
        if (!result.success) { setError(content.management.error); showToast(content.management.error, "error"); return; }
        await navigate({ to: context === "admin" ? "/$locale/dashboard/admin/orders" : "/$locale/dashboard/user/orders", params: { locale: language }, search: { code: editing.code, updated: true } });
        return;
      }
      if (context === "admin") { setError(content.error); return; }
      const draft = JSON.stringify(order);
      if (!request.current || request.current.draft !== draft) request.current = {
        token: Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join(""), draft,
      };
      const data = { token: request.current.token, order };
      if (context === "owner") {
        const result = await submitOwnerOrder({ data });
        if (!result.success) { setError(content[result.reason]); showToast(content[result.reason], "error"); return; }
        await navigate({ to: "/$locale/dashboard/user/orders", params: { locale: language }, search: { code: result.code, created: true } });
      } else {
        const result = await submitCardOrder({ data });
        if (!result.success) { setError(content[result.reason]); showToast(content[result.reason], "error"); return; }
        showToast(content.created, "success");
        await navigate({ to: "/$locale/orders/$token", params: { locale: language, token: result.token } });
      }
    } catch { setError(content.error); showToast(content.error, "error"); }
  }, () => { setError(content.invalid); });

  return (
    <form onSubmit={submit} noValidate className="mt-7">
      <fieldset disabled={busy} className="grid min-w-0 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="min-w-0 space-y-5">
          <section className="rounded-2xl border border-black/8 bg-white p-5 sm:p-6">
            <h2 className="font-bold">{content.product}</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {(["social", "wifi"] as const).map((product) => {
                const Icon = product === "wifi" ? Wifi : Link2;
                return <button key={product} type="button" aria-pressed={draft.product === product} onClick={() => { form.setValue("product", product); form.setValue("theme", product === "wifi" ? "monster" : "google"); }} className={`flex min-h-14 items-center gap-2 rounded-xl border px-3 text-left text-sm font-bold focus-visible:outline-2 focus-visible:outline-ring ${draft.product === product ? "border-[#087e91] bg-[#e8f8fb] text-[#087e91]" : "border-black/10"}`}><Icon aria-hidden="true" className="size-5 shrink-0" />{content[product]}</button>;
              })}
            </div>
            <p className="mt-3 text-xs leading-5 text-[#69737d]">{draft.product === "wifi" ? content.wifiHelp : content.socialHelp}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="order-material" className="mb-2 block text-sm font-semibold">{content.material}</label><Select value={draft.material} onValueChange={(value) => { if (value === "acrylic" || value === "pvc") form.setValue("material", value); }}><SelectTrigger id="order-material" className="w-full min-w-0"><SelectValue>{content[draft.material]}</SelectValue></SelectTrigger><SelectContent><SelectItem value="acrylic">{content.acrylic}</SelectItem><SelectItem value="pvc">{content.pvc}</SelectItem></SelectContent></Select></div>
              <div><label htmlFor="order-quantity" className="mb-2 block text-sm font-semibold">{content.quantity}</label><Input id="order-quantity" type="number" min={1} max={100} aria-invalid={!!form.formState.errors.quantity} {...form.register("quantity", { valueAsNumber: true })} /></div>
            </div>
          </section>
          <section className="space-y-4 rounded-2xl border border-black/8 bg-white p-5 sm:p-6">
            <h2 className="font-bold">{content.contact}</h2>
            {(["name", "email", "phone"] as const).map((name) => <div key={name}>
              <label className="mb-2 block text-sm font-semibold" htmlFor={`order-${name}`}>{content[name]}</label>
              <Input id={`order-${name}`} type={name === "email" ? "email" : name === "phone" ? "tel" : "text"} autoComplete={name === "phone" ? "tel" : name} maxLength={name === "email" ? 254 : name === "phone" ? 24 : 100} aria-invalid={!!form.formState.errors[name]} {...form.register(name)} />
              {name === "email" && <p className="mt-1.5 text-xs leading-5 text-[#69737d]">{context === "owner" ? content.ownerEmailHelp : content.emailHelp}</p>}
            </div>)}
          </section>
          <OrderShippingFields form={form} content={content} />
        </div>
        <OrderDesignSelector value={draft} onChange={(theme) => form.setValue("theme", theme)} messages={messages} />
        <div className="rounded-2xl border border-black/8 bg-white p-5 lg:col-span-2">
            {context === "admin" && <label className="mb-4 block text-sm font-semibold">{content.management.reason}<Input className="mt-2" value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} /><span className="mt-1 block text-xs font-normal text-[#69737d]">{content.management.reasonHelp}</span></label>}
            <p className="text-xs leading-5 text-[#69737d]">{editing ? content.management.editDescription : content.consent}</p>
            {!available && <p role="status" className="mt-3 text-sm text-amber-800">{content.unavailable}</p>}
            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
            <Button disabled={!available || busy} className="mt-4 min-h-12 w-full" type="submit"><ShoppingBag aria-hidden="true" />{busy ? content.saving : editing ? content.management.save : content.create}</Button>
            <Link to={context === "admin" ? "/$locale/dashboard/admin/orders" : context === "owner" ? "/$locale/dashboard/user/orders" : "/$locale/orders"} params={{ locale: language }} className="mt-4 block text-center text-sm font-semibold text-[#087e91]">{context === "admin" ? content.adminOrders : context === "owner" ? content.myOrders : content.checkOrder}</Link>
        </div>
      </fieldset>
    </form>
  );
}
