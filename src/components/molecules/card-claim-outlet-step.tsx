import { Link2, MapPin, Store } from "lucide-react";

import type { Messages } from "../../i18n";
import { cn } from "../../lib/utils";
import { toOutletSlug } from "../../lib/validation/outlet-slug";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CardClaimChoiceCards } from "./card-claim-choice-cards";
import { CardClaimLogoCard } from "./card-claim-logo-card";

export type OutletOption = { id: string; name: string };

type CardClaimOutletStepProps = {
  content: Messages["cardClaim"];
  onboarding: Messages["adminDashboard"]["activation"]["onboarding"];
  outlets: OutletOption[];
  outlet: { outletName: string; slug: string; address: string };
  outletMode: "new" | "existing";
  selectedOutletId: string;
  logoUrl: string | null;
  invalidFields: string[];
  onModeChange: (mode: "new" | "existing") => void;
  onOutletSelect: (id: string) => void;
  onLogoChange: (value: string | null) => void;
  onUploadBusyChange: (busy: boolean) => void;
  onOutletChange: (name: "outletName" | "address", value: string) => void;
  onSlugChange: (value: string) => void;
};

export function CardClaimOutletStep({
  content,
  onboarding,
  outlets,
  outlet,
  outletMode,
  selectedOutletId,
  logoUrl,
  invalidFields,
  onModeChange,
  onOutletSelect,
  onLogoChange,
  onUploadBusyChange,
  onOutletChange,
  onSlugChange,
}: CardClaimOutletStepProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e8f8fb] text-[#087e91]">
          <Store className="size-4" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            {content.outletSelectTitle}
          </h3>
          <p className="text-xs text-slate-500">{content.outletDescription}</p>
        </div>
      </div>

      {/* Choice Cards */}
      <CardClaimChoiceCards
        content={content}
        onModeChange={onModeChange}
        outletMode={outletMode}
      />

      {outletMode === "existing" ? (
        <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4">
          <label className="text-xs font-bold text-slate-700" id="claim-outlet">
            {content.selectOutlet}
          </label>
          {outlets.length > 0 ? (
            <Select
              items={Object.fromEntries(outlets.map((item) => [item.id, item.name]))}
              value={selectedOutletId}
              onValueChange={(value) => value && onOutletSelect(value)}
            >
              <SelectTrigger className="w-full" aria-labelledby="claim-outlet">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {outlets.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="rounded-xl border border-[#bce8ef] bg-[#e8f8fb] p-3 text-xs text-[#087e91]">
              {content.noOutlets}
            </p>
          )}
          {invalidFields.includes("outletId") && (
            <p className="text-xs text-red-600">{content.outletRequired}</p>
          )}
        </div>
      ) : (
        <>
          {outlets.length === 0 && (
            <p className="rounded-xl border border-[#bce8ef] bg-[#e8f8fb] p-3 text-xs text-[#087e91]">
              {content.noOutlets}
            </p>
          )}

          {/* Logo Upload Card */}
          <CardClaimLogoCard
            content={content}
            logoUrl={logoUrl}
            onLogoChange={onLogoChange}
            onUploadBusyChange={onUploadBusyChange}
            onboardingLogo={onboarding.logo}
          />

          {/* Form Fields: Perfectly Aligned Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Nama outlet */}
            <div className="flex flex-col">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Store className="size-3.5 text-[#0798ad]" />
                <span>{onboarding.fields.outletName}</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan nama outlet"
                value={outlet.outletName}
                onChange={(e) => onOutletChange("outletName", e.target.value)}
                className={cn(
                  "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0798ad] focus:ring-2 focus:ring-[#0798ad]/15",
                  invalidFields.includes("outletName") ? "border-red-500 ring-1 ring-red-500/20" : "border-slate-200"
                )}
              />
              {invalidFields.includes("outletName") && (
                <p className="mt-1 text-xs text-red-600 font-medium">Nama outlet wajib diisi.</p>
              )}
            </div>

            {/* Slug outlet */}
            <div className="flex flex-col">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Link2 className="size-3.5 text-[#0798ad]" />
                <span>{onboarding.fields.slug}</span>
              </label>
              <input
                type="text"
                maxLength={80}
                placeholder="Contoh: nama-outlet"
                value={outlet.slug}
                onChange={(e) => onSlugChange(toOutletSlug(e.target.value))}
                className={cn(
                  "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0798ad] focus:ring-2 focus:ring-[#0798ad]/15",
                  invalidFields.includes("slug") ? "border-red-500 ring-1 ring-red-500/20" : "border-slate-200"
                )}
              />
              {invalidFields.includes("slug") ? (
                <p className="mt-1 text-xs text-red-600 font-medium">Slug profil wajib diisi.</p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">{content.help}</p>
              )}
            </div>

            {/* Alamat operasional */}
            <div className="flex flex-col sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <MapPin className="size-3.5 text-[#0798ad]" />
                <span>{onboarding.fields.address}</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Jl. Sudirman No. 123, Jakarta"
                value={outlet.address}
                onChange={(e) => onOutletChange("address", e.target.value)}
                className={cn(
                  "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0798ad] focus:ring-2 focus:ring-[#0798ad]/15",
                  invalidFields.includes("address") ? "border-red-500 ring-1 ring-red-500/20" : "border-slate-200"
                )}
              />
              {invalidFields.includes("address") && (
                <p className="mt-1 text-xs text-red-600 font-medium">Alamat operasional wajib diisi.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
