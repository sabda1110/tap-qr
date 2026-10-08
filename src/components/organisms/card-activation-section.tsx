import { ActivationOutletPreview } from "./activation-outlet-preview";
import { useOutletSlugAvailability } from "../../hooks/use-outlet-slug-availability";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Wifi } from "lucide-react";
import type { Messages } from "../../i18n";
import { ownerActivationSchema, type OwnerActivationValues } from "../../lib/validation/owner-activation-schema";
import { activateAdminCard } from "../../server/activation/activation.functions";
import { CustomInputText } from "../elements/custom-input-text";
import { ActivationOwnerFields } from "../molecules/activation-owner-fields";
import { ActivationLinksEditor } from "../molecules/activation-links-editor";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import { useToast } from "../ui/toaster";
import { useOwnerEmailAvailability } from "../../hooks/use-owner-email-availability";

const defaultValues: OwnerActivationValues = {
  cardId: "", name: "", email: "", phone: "", password: "12345678", outletName: "",
  slug: "", address: "", logoUrl: null, links: [],
};

export function CardActivationSection({ content }: { content: Messages["adminDashboard"]["activation"] }) {
  const [tab, setTab] = useState<"social" | "wifi">("social");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { showToast } = useToast();
  const form = useForm<OwnerActivationValues>({ defaultValues, resolver: zodResolver(ownerActivationSchema), mode: "onBlur" });
  const busy = form.formState.isSubmitting || uploadingLogo;
  const emailStatus = useOwnerEmailAvailability(form.watch("email"));
  const slugStatus = useOutletSlugAvailability(form.watch("slug"));
  async function submit(values: OwnerActivationValues) {
    if (uploadingLogo || emailStatus !== "available" || slugStatus !== "available") return;
    try {
      await activateAdminCard({ data: values });
      form.reset(defaultValues);
      showToast(content.onboarding.success, "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      showToast(message.includes("SLUG_ALREADY_USED") ? content.onboarding.slugUsed : message.includes("email-already-exists") ? content.onboarding.emailUsed : content.requestError, "error");
    }
  }
  return <section className="mx-auto max-w-7xl">
    <p className="text-xs font-bold tracking-[0.16em] text-[#0798ad] uppercase">{content.kicker}</p>
    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{content.onboarding.title}</h1>
    <p className="mt-3 max-w-2xl leading-7 text-[#646b75]">{content.onboarding.description}</p>
    <div className="my-7 flex gap-2 border-b border-black/10">{(["social", "wifi"] as const).map((key) => <button key={key} type="button" disabled={busy} onClick={() => setTab(key)} aria-pressed={tab === key} className={`border-b-2 px-5 py-3 font-bold ${tab === key ? "border-[#0798ad] text-[#087e91]" : "border-transparent text-[#69737d]"}`}>{content.onboarding.tabs[key]}</button>)}</div>
    {tab === "social" ? <Form {...form}><div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_320px]"><form className="min-w-0" noValidate aria-busy={busy} onSubmit={form.handleSubmit(submit)}><fieldset disabled={busy} className="grid gap-6 border-0 p-0">
      <div className="rounded-2xl border border-black/8 bg-white p-5"><FormField control={form.control} name="cardId" render={({ field, fieldState }) => <CustomInputText {...field} label={content.cardIdLabel} helpText={content.cardIdHelp} error={fieldState.error ? content.onboarding.invalid : undefined} reserveMessageSpace />} /></div>
      <ActivationOwnerFields form={form} content={content.onboarding} emailStatus={emailStatus} slugStatus={slugStatus} onUploadBusyChange={setUploadingLogo} />
      <ActivationLinksEditor form={form} content={content} />
      <Button type="submit" className="h-12 px-6 sm:justify-self-start" disabled={busy || [emailStatus, slugStatus].some((status) => status === "checking" || status === "used" || status === "error")}>{busy ? content.submitting : content.onboarding.submit}</Button>
    </fieldset></form><ActivationOutletPreview control={form.control} content={content} /></div></Form> : <div className="rounded-2xl border border-dashed border-[#bce8ef] bg-white p-12 text-center"><Wifi className="mx-auto size-8 text-[#0798ad]" /><h2 className="mt-4 text-xl font-bold">{content.onboarding.wifiTitle}</h2><p className="mt-2 text-[#69737d]">{content.onboarding.wifiDescription}</p></div>}
  </section>;
}
