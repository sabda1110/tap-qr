import { useEffect, useState } from "react";
import type { Messages } from "../../i18n";
import { searchAdminGooglePlaces } from "../../server/places/google-places.functions";
import { CustomInputText } from "../elements/custom-input-text";

type Content = Messages["adminDashboard"]["activation"];
type Place = { name: string; placeId: string; address: string };

export function ActivationGoogleSearch({ content, value, onSelect, error, inputId = "google-business" }: { content: Content; value: string; onSelect: (id: string) => void; error?: string; inputId?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (query.trim().length < 2 || value) return;
    let current = true;
    const timer = window.setTimeout(() => {
      setNotice(content.googleSearch.searching);
      void searchAdminGooglePlaces({ data: { query } }).then((places) => {
        if (!current) return;
        setResults(places); setNotice(places.length ? "" : content.onboarding.noResults);
      }).catch(() => { if (current) setNotice(content.googleSearch.error); });
    }, 350);
    return () => { current = false; window.clearTimeout(timer); };
  }, [query, value, content]);
  return <div className="grid gap-3">
    <CustomInputText id={inputId} name="google-business" label={content.googleSearch.label} value={query} reserveMessageSpace
      error={error} helpText={notice || content.googleSearch.helpText}
      onChange={(event) => { setQuery(event.target.value); onSelect(""); setResults([]); setNotice(""); }} />
    {results.length > 0 && <div className="overflow-hidden rounded-xl border border-black/10 bg-white">{results.map((place) => <button key={place.placeId} type="button" className="block w-full px-4 py-3 text-left hover:bg-[#eaf9fb]" onClick={() => { onSelect(place.placeId); setQuery(place.name); setResults([]); setNotice(""); }}><span className="block text-sm font-bold">{place.name}</span><span className="text-xs text-[#69737d]">{place.address}</span></button>)}<p className="px-4 py-2 text-xs text-[#69737d]">Google Maps</p></div>}
    {value && <CustomInputText id={`${inputId}-place-id`} name="place-id" label={content.onboarding.placeId} readOnly value={value} />}
  </div>;
}
