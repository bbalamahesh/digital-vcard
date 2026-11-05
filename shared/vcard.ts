import { fullName, type CardData } from "./card";

const escape = (value: string) => value.replace(/([,;\\])/g, "\\$1");

/** Builds a vCard 3.0 string, the format iOS and Android contacts both import. */
export function buildVCard(c: CardData): string {
  const lines: (string | false | undefined)[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escape(c.lastName)};${escape(c.firstName)};;;`,
    `FN:${escape(fullName(c))}`,
    c.organization && `ORG:${escape(c.organization)}`,
    `TITLE:${escape(c.title)}`,
    c.phone && `TEL;TYPE=CELL:${c.phone.replace(/\s/g, "")}`,
    c.email && `EMAIL;TYPE=INTERNET:${c.email}`,
    c.website && `URL:${c.website}`,
    ...c.links.map((l) => `URL;TYPE=${escape(l.label)}:${l.url}`),
    `ADR:;;;${escape(c.location.city)};;;${escape(c.location.country)}`,
    "END:VCARD",
  ];
  // CRLF line endings per the vCard spec
  return lines.filter(Boolean).join("\r\n");
}

export const vcardFileName = (c: CardData) => `${fullName(c).replace(/\s+/g, "-")}.vcf`;
