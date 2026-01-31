export function normalizeCountryCode(code?: string | null): string | null {
  const normalized = code?.trim().slice(0, 2).toUpperCase();
  if (!normalized || normalized.length !== 2) return null;
  if (!/^[A-Z]{2}$/.test(normalized)) return null;
  return normalized;
}

export function getFlagUrl(code?: string | null, width: 20 | 40 = 40): string | null {
  const normalized = normalizeCountryCode(code);
  if (!normalized) return null;

  const cc = normalized.toLowerCase();
  // flagcdn.com supports many sizes; w40 is a good default for UI icons.
  return `https://flagcdn.com/w${width}/${cc}.png`;
}
