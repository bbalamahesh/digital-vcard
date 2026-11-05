import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { initialsOf, themes, type CardData } from "@shared";

// Cards people make on /create/ live entirely in the link: the details are
// compressed into the URL hash (#d=...), so nothing is stored on a server and
// the hash never reaches it either.

const VERSION = 1;

/** Compact wire format: short keys keep the link (and its QR code) small. */
interface Wire {
  v: number;
  f: string; // first name
  l?: string; // last name
  t?: string; // title
  o?: string; // organization
  c?: string; // city
  n?: string; // country
  p?: string; // phone
  e?: string; // email
  w?: string; // website
  k?: [string, string][]; // links: [label, url]
  s?: string[]; // skills
  a?: string; // availability badge word; absent = not shown
  h?: string; // theme id; absent = classic
}

export const MAX = { text: 80, url: 200, links: 10, skills: 12, skill: 30 };

const str = (v: unknown, max = MAX.text) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Only http(s) links are allowed, so a crafted link can't inject javascript: URLs. */
export function safeUrl(v: unknown): string {
  const raw = str(v, MAX.url);
  if (!raw) return "";
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : "";
  } catch {
    return "";
  }
}

const safePhone = (v: unknown) => str(v, 30).replace(/[^\d+\s()-]/g, "");
const safeEmail = (v: unknown) => {
  const e = str(v, 120);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : "";
};

export function encodeCard(c: CardData): string {
  const w: Wire = { v: VERSION, f: c.firstName };
  if (c.lastName) w.l = c.lastName;
  if (c.title) w.t = c.title;
  if (c.organization) w.o = c.organization;
  if (c.location.city) w.c = c.location.city;
  if (c.location.country) w.n = c.location.country;
  if (c.phone) w.p = c.phone;
  if (c.email) w.e = c.email;
  if (c.website) w.w = c.website;
  if (c.links.length) w.k = c.links.map((l) => [l.label, l.url]);
  if (c.skills.length) w.s = c.skills;
  if (c.available) w.a = c.availableAs || "";
  if (c.theme && c.theme !== "classic") w.h = c.theme;
  return compressToEncodedURIComponent(JSON.stringify(w));
}

/** Parses and cleans a card from a link. Returns null when the link is broken. */
export function decodeCard(encoded: string): CardData | null {
  let w: Partial<Wire>;
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    w = JSON.parse(json);
  } catch {
    return null;
  }
  if (!w || typeof w !== "object" || w.v !== VERSION) return null;

  return sanitizeCard({
    firstName: str(w.f),
    lastName: str(w.l),
    initials: "",
    title: str(w.t),
    organization: str(w.o) || undefined,
    location: { city: str(w.c), country: str(w.n) },
    phone: safePhone(w.p) || undefined,
    email: safeEmail(w.e) || undefined,
    website: safeUrl(w.w) || undefined,
    links: Array.isArray(w.k)
      ? w.k.map((pair) => ({ label: str(pair?.[0], 24), url: safeUrl(pair?.[1]) }))
      : [],
    skills: Array.isArray(w.s) ? w.s.map((s) => str(s, MAX.skill)) : [],
    available: typeof w.a === "string",
    availableAs: str(w.a, 24) || undefined,
    theme: themes.some((t) => t.id === w.h) ? w.h : undefined,
  });
}

/** Drops empty and invalid entries and fills in the initials. Null if there's no name. */
export function sanitizeCard(c: CardData): CardData | null {
  const name = [c.firstName, c.lastName].filter(Boolean).join(" ");
  if (!c.firstName.trim()) return null;
  return {
    ...c,
    initials: initialsOf(name),
    links: c.links.filter((l) => l.label && l.url).slice(0, MAX.links),
    skills: [...new Set(c.skills.filter(Boolean))].slice(0, MAX.skills),
  };
}

const origin = () => window.location.origin;
export const viewUrl = (c: CardData) => `${origin()}/card/#d=${encodeCard(c)}`;
export const editUrl = (c: CardData) => `${origin()}/create/#d=${encodeCard(c)}`;

/** Reads the card from the current page's #d=... hash. */
export function cardFromHash(): CardData | null {
  // Read the hash as-is: URLSearchParams would turn the encoding's "+" into a space
  const m = window.location.hash.match(/^#d=(.+)$/);
  return m ? decodeCard(m[1]!) : null;
}
