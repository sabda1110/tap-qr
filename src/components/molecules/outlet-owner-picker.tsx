import { useId, useState } from "react";
import type { Messages } from "../../i18n";
import type { OutletOwnerOption } from "../../server/outlets/outlet-create.schemas";
import { useOwnerAutocomplete } from "../../hooks/use-owner-autocomplete";
import { Button } from "../ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
} from "../ui/combobox";

export function OutletOwnerPicker({
  content,
  onSelect,
  disabled,
  error,
}: {
  content: Messages["adminDashboard"]["outletCreate"];
  onSelect: (owner: OutletOwnerOption | null) => void;
  disabled: boolean;
  error?: string;
}) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<OutletOwnerOption | null>(null);
  const { owners, status, retry } = useOwnerAutocomplete(
    query,
    selected === null,
  );
  const options =
    selected && !owners.some((owner) => owner.id === selected.id)
      ? [selected, ...owners]
      : owners;
  const label = (owner: OutletOwnerOption) => `${owner.name} · ${owner.email}`;
  return (
    <section className="rounded-2xl border border-black/8 bg-white p-5">
      <h2 className="font-bold">{content.ownerTitle}</h2>
      <p className="mt-2 text-sm leading-6 text-[#69737d]">
        {content.ownerHelp}
      </p>
      <div className="mt-4 grid gap-2">
        <label htmlFor={inputId} className="text-sm font-semibold">
          {content.ownerLabel}
        </label>
        <Combobox
          items={options}
          filter={null}
          disabled={disabled}
          value={selected}
          inputValue={inputValue}
          itemToStringLabel={label}
          isItemEqualToValue={(a, b) => a.id === b.id}
          onInputValueChange={(value, details) => {
            if (details.reason !== "input-change") return;
            setInputValue(value);
            setQuery(value);
            setSelected(null);
            if (selected) onSelect(null);
          }}
          onValueChange={(owner) => {
            setSelected(owner);
            setInputValue(owner ? label(owner) : "");
            onSelect(owner);
            if (!owner) setQuery("");
          }}
        >
          <ComboboxInput
            id={inputId}
            name="owner-autocomplete"
            triggerLabel={content.ownerLabel}
            placeholder={content.ownerSearch}
            autoComplete="off"
            maxLength={150}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
          <ComboboxContent>
            <ComboboxStatus className="px-3 text-sm text-[#69737d]">
              {status === "loading" && (
                <p className="py-3">{content.loading}</p>
              )}
              {status === "error" && (
                <div className="flex items-center gap-3 py-3">
                  <p className="text-red-600">{content.loadError}</p>
                  <Button type="button" variant="outline" onClick={retry}>
                    {content.retry}
                  </Button>
                </div>
              )}
              {status === "ready" && !options.length && (
                <p className="py-3">{content.noOwners}</p>
              )}
            </ComboboxStatus>
            <ComboboxList className="max-h-[min(18rem,var(--available-height))] overflow-y-auto overscroll-contain">
              {(owner: OutletOwnerOption) => (
                <ComboboxItem
                  key={owner.id}
                  value={owner}
                  disabled={status !== "ready"}
                >
                  <span className="min-w-0">
                    <span className="block font-semibold">{owner.name}</span>
                    <span className="block truncate text-xs text-[#69737d]">
                      {owner.email}
                    </span>
                  </span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
      {selected && (
        <p className="mt-4 rounded-xl bg-[#e8f8fb] p-3 text-sm text-[#087e91]">
          {selected.name} · {selected.email} · {selected.phone || "—"}
        </p>
      )}
    </section>
  );
}
