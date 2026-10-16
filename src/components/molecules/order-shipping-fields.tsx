import type { UseFormReturn } from "react-hook-form";
import type { Messages } from "../../i18n";
import type { OrderDraft } from "../../server/orders/order.schemas";
import { Input } from "../ui/input";

export function OrderShippingFields({ form, content }: {
  form: UseFormReturn<OrderDraft>;
  content: Messages["orders"];
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-black/8 bg-white p-5 sm:p-6">
      <h2 className="font-bold">{content.shippingTitle}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {(["province", "city", "district", "village"] as const).map((field, index) => {
          const invalid = !!form.formState.errors.shippingRegion?.[field];
          return (
            <div key={field}>
              <label htmlFor={`shipping-${field}`} className="mb-2 block text-sm font-semibold">{content.regions[field]}</label>
              <Input
                id={`shipping-${field}`}
                autoComplete={`address-level${index + 1}`}
                maxLength={100}
                aria-invalid={invalid}
                aria-describedby={invalid ? `shipping-${field}-error` : undefined}
                {...form.register(`shippingRegion.${field}`)}
              />
              {invalid && <p id={`shipping-${field}-error`} className="mt-1.5 text-xs text-red-700">{content.regionRequired}</p>}
            </div>
          );
        })}
      </div>
      <div>
        <label htmlFor="order-address" className="mb-2 block text-sm font-semibold">{content.address}</label>
        <textarea
          id="order-address"
          rows={3}
          autoComplete="street-address"
          maxLength={600}
          aria-invalid={!!form.formState.errors.address}
          aria-describedby="order-address-help"
          className="w-full resize-y rounded-xl border border-black/10 bg-[#f8fafc] px-4 py-3 text-base text-[#252a32] outline-none focus:border-[#0798ad] focus:bg-white focus:ring-4 focus:ring-[#0798ad]/10 disabled:opacity-50 aria-invalid:border-red-500 md:text-sm"
          {...form.register("address")}
        />
        <p id="order-address-help" className="mt-1.5 text-xs leading-5 text-[#69737d]">{content.addressHelp}</p>
      </div>
    </section>
  );
}
