import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { Messages } from "../i18n";
import { claimUserCard } from "../server/cards/card-entry.functions";
import {
  claimCardSchema,
  newClaimOutletSchema,
} from "../server/cards/card-entry.schemas";
import {
  updateOutletCardLinksSchema,
  type CardLinksEditValues,
} from "../server/outlets/outlet.schemas";
import type { OutletOption } from "../components/molecules/card-claim-outlet-step";
import { useToast } from "../components/ui/toaster";

type UseCardClaimOptions = {
  cardId?: string;
  initialOutletId?: string;
  initialMode?: "new" | "existing";
  outlets: OutletOption[];
  content: Messages["cardClaim"];
  googleReviewTitle: string;
  onSaved: () => Promise<void>;
};

export function useCardClaim({
  cardId,
  initialOutletId,
  initialMode,
  outlets,
  content,
  googleReviewTitle,
  onSaved,
}: UseCardClaimOptions) {
  const { showToast } = useToast();
  const [card, setCard] = useState(cardId ?? "");
  const [step, setStep] = useState<1 | 2>(1);
  const [outletMode, setOutletMode] = useState<"new" | "existing">(
    initialMode ?? (outlets.length ? "existing" : "new")
  );
  const [selectedOutletId, setSelectedOutletId] = useState(
    initialOutletId ?? outlets[0]?.id ?? ""
  );
  const [outlet, setOutlet] = useState({ outletName: "", slug: "", address: "" });
  const hasManualSlug = useRef(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [error, setError] = useState("");

  const form = useForm<CardLinksEditValues>({
    resolver: zodResolver(updateOutletCardLinksSchema),
    defaultValues: {
      outletId: "new",
      cardId: "new",
      links: [
        {
          id: "google-review",
          type: "google_review",
          label: googleReviewTitle,
          value: "",
          isActive: true,
        },
      ],
    },
  });

  const busy = form.formState.isSubmitting || uploadingLogo;

  function nextStep() {
    setError("");
    setInvalidFields([]);
    if (outletMode === "existing") {
      if (!selectedOutletId) {
        setError(content.outletRequired);
        return;
      }
      setStep(2);
      return;
    }
    const parsed = newClaimOutletSchema.safeParse({ ...outlet, logoUrl });
    if (!parsed.success) {
      setInvalidFields(parsed.error.issues.map((issue) => String(issue.path[0])));
      setError(content.outletInvalid);
      return;
    }
    setStep(2);
  }

  async function save(values: CardLinksEditValues) {
    if (uploadingLogo) return;
    setError("");
    setInvalidFields([]);
    const payload =
      outletMode === "existing"
        ? { outletMode, outletId: selectedOutletId, cardId: card, links: values.links }
        : { outletMode, cardId: card, ...outlet, logoUrl, links: values.links };
    const parsed = claimCardSchema.safeParse(payload);
    if (!parsed.success) {
      setInvalidFields(parsed.error.issues.map((issue) => String(issue.path[0])));
      setError(content.invalid);
      return;
    }
    try {
      await claimUserCard({ data: parsed.data });
      showToast(content.success, "success");
      await onSaved();
    } catch (caught) {
      const message =
        caught instanceof Error && caught.message.includes("SLUG_ALREADY_USED")
          ? content.slugError
          : content.error;
      setError(message);
      showToast(message, "error");
    }
  }

  return {
    card,
    setCard,
    step,
    setStep,
    outletMode,
    setOutletMode,
    selectedOutletId,
    setSelectedOutletId,
    outlet,
    setOutlet,
    hasManualSlug,
    logoUrl,
    setLogoUrl,
    uploadingLogo,
    setUploadingLogo,
    invalidFields,
    setInvalidFields,
    error,
    setError,
    form,
    busy,
    nextStep,
    save,
  };
}
