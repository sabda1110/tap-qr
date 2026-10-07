import { getGoogleReviewUrl } from "../../lib/google-review";

type GooglePlaceSuggestion = { address: string; name: string; placeId: string };

type AutocompleteResponse = {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      structuredFormat?: { secondaryText?: { text?: string } };
      text?: { text?: string };
    };
  }>;
};

export async function searchGooglePlaces(query: string): Promise<GooglePlaceSuggestion[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY_MISSING");

  const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.secondaryText.text",
    },
    body: JSON.stringify({ input: query, includedRegionCodes: ["id"], languageCode: "id" }),
  });

  if (!response.ok) throw new Error("GOOGLE_PLACES_SEARCH_FAILED");

  const payload = await response.json() as AutocompleteResponse;
  return (payload.suggestions ?? []).flatMap(({ placePrediction }) => {
    if (!placePrediction?.placeId || !placePrediction.text?.text) return [];
    return [{ placeId: placePrediction.placeId, name: placePrediction.text.text, address: placePrediction.structuredFormat?.secondaryText?.text ?? "" }];
  });
}

export { getGoogleReviewUrl };
