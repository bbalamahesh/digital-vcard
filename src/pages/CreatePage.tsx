import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_THEME, themes, type CardData } from "@shared";
import { BusinessCard } from "../components/BusinessCard";
import { PrintButton } from "../components/PrintCard";
import { SocialIcon } from "../components/SocialLinks";
import { cardFromHash, encodeCard, MAX, safeUrl, sanitizeCard, viewUrl } from "../lib/cardLink";
import { OTHER, platformByLabel, platforms, profileUrl } from "../lib/social";
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
  /** platform is a platform id or "other"; value is a handle or a full link */
  links: FormLink[];
  skills: string;
  available: boolean;
  availableAs: string;
  theme: string;
}

interface FormLink {
  platform: string;
  label: string;
  value: string;
}

const DRAFT_KEY = "vcard-draft";


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
    { platform: "linkedin", label: "", value: "" },
    { platform: "instagram", label: "", value: "" },
  ],
  skills: "",
  available: false,
  availableAs: "Developer",
  theme: DEFAULT_THEME,
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
  links: c.links.length
    ? c.links.map((l) => {
        const p = platformByLabel(l.label);
        return p ? { platform: p.id, label: "", value: l.url } : { platform: OTHER, label: l.label, value: l.url };
      })
    : blank.links,
  skills: c.skills.join(", "),
  available: c.available,
  availableAs: c.availableAs || "Developer",
  theme: c.theme || DEFAULT_THEME,
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
    links: f.links.map((l) => {
      const p = platforms.find((x) => x.id === l.platform);
      return { label: p ? p.label : l.label.trim(), url: safeUrl(profileUrl(p, l.value)) };
    }),
    skills: f.skills.split(",").map((s) => s.trim()),
    available: f.available,
    availableAs: f.availableAs.trim() || undefined,
    theme: f.theme === DEFAULT_THEME ? undefined : f.theme,
  });
}

function initialForm(): Form {
  const fromLink = cardFromHash();
  if (fromLink) return fromCard(fromLink);
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const draft = { ...blank, ...JSON.parse(saved) } as Form;
      // Drafts from before the platform picker had { label, url } links
      draft.links = draft.links.map((l: Partial<FormLink> & { url?: string }) =>
        "platform" in l ? (l as FormLink) : { platform: OTHER, label: l.label ?? "", value: l.url ?? "" },
      );
      return draft;
    }
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
  const setLink = (i: number, key: keyof FormLink, value: string) =>
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

          <Section title="Social and links">
            <div className="grid gap-2">
              {form.links.map((l, i) => {
                const p = platforms.find((x) => x.id === l.platform);
                return (
                  <div key={i} className="grid grid-cols-[150px_1fr_auto] gap-2 max-[480px]:grid-cols-[1fr_auto]">
                    <div className="relative max-[480px]:col-span-2">
                      <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-accent">
                        <SocialIcon label={p?.label ?? ""} />
                      </span>
                      <select
                        className={`${input} appearance-none pl-9`}
                        aria-label={`Link ${i + 1} type`}
                        value={l.platform}
                        onChange={(e) => setLink(i, "platform", e.target.value)}
                      >
                        {platforms.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.label}
                          </option>
                        ))}
                        <option value={OTHER}>Other link…</option>
                      </select>
                    </div>
                    {p ? (
                      <input className={`${input} max-[480px]:col-span-1`} aria-label={`${p.label} handle or link`} value={l.value} onChange={(e) => setLink(i, "value", e.target.value)} placeholder={p.placeholder} maxLength={200} autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                    ) : (
                      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2">
                        <input className={input} aria-label={`Link ${i + 1} name`} value={l.label} onChange={(e) => setLink(i, "label", e.target.value)} placeholder="Name" maxLength={24} />
                        <input className={input} aria-label={`Link ${i + 1} address`} type="url" inputMode="url" value={l.value} onChange={(e) => setLink(i, "value", e.target.value)} placeholder="example.com" maxLength={200} autoCapitalize="none" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => set("links", form.links.filter((_, j) => j !== i))}
                      aria-label={`Remove link ${i + 1}`}
                      className="cursor-pointer rounded-lg border border-line px-3 text-muted hover:border-accent hover:text-accent"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
              {form.links.length < MAX.links && (
                <button
                  type="button"
                  onClick={() => {
                    const used = new Set(form.links.map((l) => l.platform));
                    const next = platforms.find((x) => !used.has(x.id))?.id ?? OTHER;
                    set("links", [...form.links, { platform: next, label: "", value: "" }]);
                  }}
                  className="cursor-pointer justify-self-start rounded text-sm font-medium text-accent hover:underline"
                >
                  + Add a link
                </button>
              )}
              <p className="text-xs text-muted">Type a handle like @yourname or paste a full link.</p>
            </div>
          </Section>

          <Section title="Theme">
            <div role="radiogroup" aria-label="Card theme" className="grid grid-cols-5 gap-2 max-[560px]:grid-cols-2">
              {themes.map((t) => {
                const on = form.theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => set("theme", t.id)}
                    className={`grid cursor-pointer gap-1.5 rounded-xl border p-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      on ? "border-accent ring-2 ring-accent/40" : "border-line hover:border-accent"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="grid h-12 grid-cols-[1fr_auto] items-end gap-1 rounded-lg border p-1.5"
                      style={{ background: t.colors.surface, borderColor: t.colors.line }}
                    >
                      <span className="grid gap-1">
                        <span className="h-1.5 w-3/4 rounded-full" style={{ background: t.colors.ink }} />
                        <span className="h-1 w-1/2 rounded-full" style={{ background: t.colors.muted }} />
                      </span>
                      <span className="size-4 rounded" style={{ background: t.colors.accent }} />
                    </span>
                    <span className="truncate px-0.5 text-xs font-medium">{t.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted">Classic follows the viewer's light or dark mode.</p>
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
            <div className="grid grid-cols-2 gap-2">
              <button type="button" disabled={!data} onClick={() => copy(link)} className={`${btn} bg-accent text-on-accent hover:opacity-90`}>
                {copied ? "Link copied" : "Copy link"}
              </button>
              <a
                href={data ? link : undefined}
                target="_blank"
                rel="noopener"
                aria-disabled={!data}
                className={`${btn} border border-line text-center text-ink hover:border-accent ${data ? "" : "pointer-events-none opacity-50"}`}
              >
                Open card
              </a>
              <button type="button" disabled={!data} onClick={() => data && downloadVCard(data)} className={`${btn} border border-line text-ink hover:border-accent`}>
                Save .vcf
              </button>
              {data && <PrintButton data={data} className={`${btn} border border-line text-ink hover:border-accent`} />}
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
