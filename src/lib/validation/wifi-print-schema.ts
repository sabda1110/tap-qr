import { z } from "zod";

export type WifiNetwork = { payload: string; ssid: string; security: string; hidden: boolean };

/** Preserve the original QR payload; only decode escapes for the display name. */
export function parseWifiPayload(value: string): WifiNetwork | null {
  const payload = value.trim();
  if (!payload.startsWith("WIFI:") || payload.length > 2048 || /[\r\n\u0000]/.test(payload)) return null;
  const fields = new Map<string, string>();
  let field = "";
  let escaped = false;
  for (const char of payload.slice(5)) {
    if (escaped) {
      field += `\\${char}`;
      escaped = false;
    } else if (char === "\\") {
      escaped = true;
    } else if (char === ";") {
      if (field) {
        const colon = field.indexOf(":");
        if (colon < 1) return null;
        const key = field.slice(0, colon);
        if (fields.has(key) || !["T", "S", "P", "H"].includes(key)) return null;
        fields.set(key, field.slice(colon + 1));
        field = "";
      }
    } else {
      field += char;
    }
  }
  if (escaped || field) return null;
  const encodedSsid = fields.get("S") ?? "";
  const unquotedSsid = encodedSsid.startsWith('"') && encodedSsid.endsWith('"')
    ? encodedSsid.slice(1, -1) : encodedSsid;
  const ssid = unquotedSsid.replace(/\\(.)/g, "$1");
  const security = fields.get("T") || "nopass";
  if (!ssid || new TextEncoder().encode(ssid).length > 32 || !["WPA", "WEP", "nopass"].includes(security)) return null;
  if (security !== "nopass" && !fields.get("P")) return null;
  if (fields.has("H") && !["true", "false"].includes(fields.get("H")!)) return null;
  return { payload, ssid, security, hidden: fields.get("H") === "true" };
}

export const wifiPrintSchema = z.object({
  payloads: z.string().min(1, "required").max(205000, "limit"),
  copies: z.number().int("copies").min(1, "copies").max(100, "copies"),
  title: z.string().trim().min(1, "required").max(65, "textLength"),
  footer: z.string().trim().max(100, "textLength"),
}).superRefine((values, context) => {
  const rows = values.payloads.split(/\r?\n/).map((row, index) => ({ row: row.trim(), line: index + 1 })).filter(({ row }) => row);
  if (!rows.length) context.addIssue({ code: "custom", path: ["payloads"], message: "required" });
  if (rows.length * values.copies > 100) context.addIssue({ code: "custom", path: ["copies"], message: "limit" });
  for (const { row, line } of rows) {
    if (!parseWifiPayload(row)) context.addIssue({ code: "custom", path: ["payloads"], message: `invalid:${line}` });
  }
});

export type WifiPrintValues = z.infer<typeof wifiPrintSchema>;

export function expandWifiPrintJobs(values: WifiPrintValues, mode: "single" | "bulk") {
  const valid = wifiPrintSchema.parse(values);
  const networks = valid.payloads.split(/\r?\n/).filter((row) => row.trim()).map((row) => parseWifiPayload(row)!);
  if (mode === "single" && (networks.length !== 1 || valid.copies !== 1)) throw new Error("single");
  return networks.flatMap((network, index) => Array.from({ length: valid.copies }, (_, copy) => ({
    ...network, id: `${index}-${copy}`,
  })));
}
