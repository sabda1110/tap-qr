const cardIdPattern = /(?:^|\/)(TQR-[A-F0-9]{32})(?:$|[?#])/i;

export function extractCardIdFromQr(value: string) {
  return value.match(cardIdPattern)?.[1]?.toUpperCase() ?? null;
}
