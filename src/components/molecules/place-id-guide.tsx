import { useI18n } from "../../i18n";
import { cn } from "../../lib/utils";

export function PlaceIdGuide({ className }: { className?: string } = {}) {
  const { language, messages } = useI18n();
  const claim = messages.cardClaim;

  return (
    <p className={cn("text-xs leading-5 text-[#69737d]", className)}>
      {claim.placeIdGuide.quick}{" "}
      <a
        href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-[#087e91] underline"
      >
        {claim.placeIdGuide.googleDocs}
      </a>
      .{" "}
      <a
        href={`/${language}/tutorial/google-place-id`}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-[#087e91] underline"
      >
        {claim.placeIdGuide.tutorial}
      </a>
      .
    </p>
  );
}
