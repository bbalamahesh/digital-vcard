import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { CardData } from "@shared";
import { BusinessCard } from "../components/BusinessCard";
import { cardFromHash, encodeCard, safeUrl, sanitizeCard, viewUrl } from "../lib/cardLink";
import { downloadVCard } from "../lib/vcard";
import { useCopy } from "../lib/useCopy";

interface Form {
  firstName: string;
  lastName: string;
  title: string;
  organization: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  links: { label: string; url: string }[];
  skills: string;
  available: boolean;
  availableAs: string;
}

const DRAFT_KEY = "vcard-draft";
const MAX_LINKS = 6;

const blank: Form = {
  firstName: "",
  lastName: "",
  title: "",
  organization: "",
  city: "",
  country: "",
  phone: "",
  email: "",
  website: "",
  links: [
    { label: "LinkedIn", url: "" },
    { label: "GitHub", url: "" },
  ],
  skills: "",
  available: false,
  availableAs: "Developer",
};

const fromCard = (c: CardData): Form => ({
  firstName: c.firstName,
  lastName: c.lastName,
  title: c.title,
  organization: c.organization ?? "",
  city: c.location.city,
  country: c.location.country,
  phone: c.phone ?? "",
  email: c.email ?? "",
  website: c.website ?? "",
  links: c.links.length ? c.links : blank.links,
  skills: c.skills.join(", "),
  available: c.available,
  availableAs: c.availableAs || "Developer",
});

function toCard(f: Form): CardData | null {
  return sanitizeCard({
    firstName: f.firstName.trim(),
    lastName: f.lastName.trim(),
    initials: "",
    title: f.title.trim(),
    organization: f.organization.trim() || undefined,
    location: { city: f.city.trim(), country: f.country.trim() },
    phone: f.phone.trim() || undefined,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()) ? f.email.trim() : undefined,
    website: safeUrl(f.website) || undefined,
    links: f.links.map((l) => ({ label: l.label.trim(), url: safeUrl(l.url) })),
    skills: f.skills.split(",").map((s) => s.trim()),
    available: f.available,
    availableAs: f.availableAs.trim() || undefined,
  });
}

function initialForm(): Form {
  const fromLink = cardFromHash();
  if (fromLink) return fromCard(fromLink);
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) return { ...blank, ...JSON.parse(saved) };
  } catch {
    // Storage blocked or draft unreadable: start fresh
  }
  return blank;
}

const input =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-[15px] text-ink placeholder:text-muted/70 focus:border-accent focus:outline-2 focus:outline-offset-0 focus:outline-accent/30";
const btn =
  "cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50";

export function CreatePage() {
  const [form, setForm] = useState(initialForm);
  const data = useMemo(() => toCard(form), [form]);
  const link = data ? viewUrl(data) : "";
  const { copied, copy } = useCopy();

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const setLink = (i: number, key: "label" | "url", value: string) =>
    setForm((f) => ({ ...f, links: f.links.map((l, j) => (j === i ? { ...l, [key]: value } : l)) }));

  // Keep a draft in this browser, and the page URL in step so a refresh or bookmark keeps the card
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // Private mode or storage blocked: the hash below still keeps the card
    }
    const hash = data ? `#d=${encodeCard(data)}` : "";
    history.replaceState(null, "", `${window.location.pathname}${hash}`);
  }, [form, data]);

  const reset = () => {
    if (confirm("Clear the form and start a new card?")) setForm(blank);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="mb-8 max-w-xl">
        <a href="/" className="font-mono text-xs text-muted hover:text-accent">
          ← Back
        </a>
        <h1 className="mt-3 font-display text-[34px] leading-tight font-bold tracking-tight">
          Make your own card
        </h1>
        <p className="mt-2 text-[15.5px] text-muted">
          Fill in what you want to share. You get a link and a QR code that save your contact
          straight to any phone. No sign-up, and nothing is stored on a server: your details live
          in the link itself.
        </p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_420px]">
        <form className="grid gap-7" onSubmit={(e) => e.preventDefault()}>
          <Section title="About you">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="First name" required>
                <input className={input} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" maxLength={80} required />
              </Field>
              <Field label="Last name">
                <input className={input} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" maxLength={80} />
              </Field>
              <Field label="Job title">
                <input className={input} value={form.title} onChange={(e) => set("title", e.target.value)} autoComplete="organization-title" placeholder="Product Designer" maxLength={80} />
              </Field>
              <Field label="Company">
                <input className={input} value={form.organization} onChange={(e) => set("organization", e.target.value)} autoComplete="organization" maxLength={80} />
              </Field>
              <Field label="City or state">
                <input className={input} value={form.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" maxLength={80} />
              </Field>
              <Field label="Country">
                <input className={input} value={form.country} onChange={(e) => set("country", e.target.value)} autoComplete="country-name" maxLength={80} />
              </Field>
            </div>
          </Section>

          <Section title="Contact">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Phone">
                <input className={input} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="+91 98765 43210" maxLength={30} />
              </Field>
              <Field label="Email" hint={form.email && !data?.email ? "Check the email address" : undefined}>
                <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" maxLength={120} />
              </Field>
              <Field label="Website" className="sm:col-span-2">
                <input className={input} type="url" inputMode="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="yoursite.com" maxLength={200} />
              </Field>
            </div>
          </Section>

          <Section title="Links">
            <div className="grid gap-2">
              {form.links.map((l, i) => (
                <div key={i} className="grid grid-cols-[110px_1fr_auto] gap-2 max-[420px]:grid-cols-[90px_1fr_auto]">
                  <input className={input} aria-label={`Link ${i + 1} name`} value={l.label} onChange={(e) => setLink(i, "label", e.target.value)} placeholder="Name" maxLength={24} />
                  <input className={input} aria-label={`Link ${i + 1} address`} type="url" inputMode="url" value={l.url} onChange={(e) => setLink(i, "url", e.target.value)} placeholder="linkedin.com/in/you" maxLength={200} />
                  <button
                    type="button"
                    onClick={() => set("links", form.links.filter((_, j) => j !== i))}
                    aria-label={`Remove link ${i + 1}`}
                    className="cursor-pointer rounded-lg border border-line px-3 text-muted hover:border-accent hover:text-accent"
                  >
                    ×
                  </button>
                </div>
              ))}
              {form.links.length < MAX_LINKS && (
                <button
                  type="button"
                  onClick={() => set("links", [...form.links, { label: "", url: "" }])}
                  className="cursor-pointer justify-self-start rounded text-sm font-medium text-accent hover:underline"
                >
                  + Add a link
                </button>
              )}
            </div>
          </Section>

          <Section title="Skills and status">
            <Field label="Skills" hint="Separate with commas, up to 12">
              <input className={input} value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="Figma, Research, Prototyping" />
            </Field>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-[15px]">
                <input type="checkbox" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="size-4 accent-[var(--accent)]" />
                Show “available” badge as
              </label>
              <input
                className={`${input} w-40`}
                aria-label="Badge word"
                value={form.availableAs}
                onChange={(e) => set("availableAs", e.target.value)}
                disabled={!form.available}
                maxLength={24}
              />
            </div>
          </Section>
        </form>

        <aside className="grid gap-4 lg:sticky lg:top-6" aria-label="Preview and share">
          {data ? (
            <BusinessCard data={data} pageUrl={link} />
          ) : (
            <div className="grid min-h-60 place-items-center rounded-[20px] border border-dashed border-line p-8 text-center text-muted">
              Type your first name to see your card here.
            </div>
          )}

          <div className="grid gap-3 rounded-[20px] border border-line bg-surface p-5">
            <h2 className="font-display text-lg font-medium">Your card link</h2>
            <input
              className={`${input} font-mono text-xs`}
              readOnly
              value={link}
              placeholder="Appears once you add your name"
              aria-label="Your card link"
              onFocus={(e) => e.target.select()}
            />
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={!data} onClick={() => copy(link)} className={`${btn} flex-1 bg-accent text-surface hover:opacity-90`}>
                {copied ? "Link copied" : "Copy link"}
              </button>
              <a
                href={data ? link : undefined}
                target="_blank"
                rel="noopener"
                aria-disabled={!data}
                className={`${btn} flex-1 border border-line text-center text-ink hover:border-accent ${data ? "" : "pointer-events-none opacity-50"}`}
              >
                Open card
              </a>
              <button type="button" disabled={!data} onClick={() => data && downloadVCard(data)} className={`${btn} border border-line text-ink hover:border-accent`}>
                .vcf
              </button>
            </div>
            <p className="text-[13px] text-muted">
              Anyone with this link can see these details. To change your card later, edit it here
              and share the new link: old links keep showing the old details.
            </p>
            <button type="button" onClick={reset} className="cursor-pointer justify-self-start rounded text-[13px] text-muted hover:text-accent">
              Start over
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-[20px] border border-line bg-surface p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <h2 aria-hidden="true" className="mb-4 font-display text-lg font-medium">
        {title}
      </h2>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  hint,
  required,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <label className="grid gap-1.5">
        <span className="text-[11px] tracking-[0.08em] text-muted uppercase">
          {label}
          {required && (
            <span aria-hidden="true" className="text-accent">
              {" "}*
            </span>
          )}
        </span>
        {children}
      </label>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
