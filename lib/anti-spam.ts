import { DiagnosticFormValues } from "@/lib/types";

const VOWEL = /[aeiouáéíóúüy]/i;
// Five characters keeps the signal useful without rejecting common names such
// as Schneider or Schwartz, a false-positive risk noted in the playbook.
const CONSONANT_RUN = /[bcdfghjklmnpqrstvwxyzñ]{5,}/i;
const URL_OR_HTML = /https?:\/\/|\[url=|<a\s+href|<[a-z][^>]*>/i;
const DISPOSABLE_EMAIL_MARKERS = [
  "10minutemail",
  "guerrillamail",
  "mailinator.com",
  "tempmail",
  "throwaway",
  "yopmail",
];

function hasAnomalousUppercase(value: string) {
  const letters = [...value].filter((character) => /\p{L}/u.test(character));

  if (!letters.length) return false;

  const hasLowercase = letters.some(
    (character) =>
      character === character.toLowerCase() &&
      character !== character.toUpperCase(),
  );

  // Preserve legitimate acronyms such as AARIAC, FEMSA or RH.
  if (!hasLowercase) return false;

  let interiorUppercase = 0;

  for (const word of value.split(/\s+/).filter(Boolean)) {
    let foundFirstLetter = false;

    for (const character of word) {
      if (!/\p{L}/u.test(character)) continue;

      const isUppercase =
        character === character.toUpperCase() &&
        character !== character.toLowerCase();

      if (!foundFirstLetter) {
        foundFirstLetter = true;
      } else if (isUppercase) {
        interiorUppercase += 1;
      }
    }
  }

  return interiorUppercase / letters.length > 0.3;
}

function checkText(field: string, raw: string) {
  const value = raw.trim();
  const letters = [...value].filter((character) => /\p{L}/u.test(character));
  const isUppercaseAcronym =
    letters.length > 0 &&
    letters.every(
      (character) =>
        character === character.toUpperCase() &&
        character !== character.toLowerCase(),
    );

  if (value.length < 2 || value.length > 120) return `${field}: longitud`;
  if (URL_OR_HTML.test(value)) return `${field}: URL o HTML`;
  if (!VOWEL.test(value) && !isUppercaseAcronym) return `${field}: sin vocales`;
  if (CONSONANT_RUN.test(value) && !isUppercaseAcronym) {
    return `${field}: cinco o más consonantes consecutivas`;
  }
  if (hasAnomalousUppercase(value)) return `${field}: mayúsculas anómalas`;

  return null;
}

export function validateAntiSpamFields(data: DiagnosticFormValues): {
  valid: boolean;
  reason?: string;
} {
  const textFields: Array<[string, string]> = [
    ["nombre", data.name],
    ["empresa", data.company],
    ["cargo", data.role],
    ["región", data.region],
  ];

  for (const [field, value] of textFields) {
    const reason = checkText(field, value);
    if (reason) return { valid: false, reason };
  }

  const domain = data.email.toLowerCase().split("@")[1] ?? "";
  if (DISPOSABLE_EMAIL_MARKERS.some((marker) => domain.includes(marker))) {
    return { valid: false, reason: "correo desechable" };
  }

  return { valid: true };
}
