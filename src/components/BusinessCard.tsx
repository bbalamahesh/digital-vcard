import { fullName, type CardData } from "@shared";
import { themeVars } from "../lib/theme";
import { ActionBar } from "./ActionBar";
import { ContactRow } from "./ContactRow";
import { ContactQr } from "./ContactQr";
import { SkillList } from "./SkillList";
import { SocialLinks } from "./SocialLinks";

interface Props {
  data: CardData;
  /** Link to this card's own page, used by Share and the "Card page" QR. */
  pageUrl?: string;
}

export function BusinessCard({ data, pageUrl = data.website }: Props) {
  const rows = [
    data.phone && {
      label: "Phone",
      value: data.phone,
      href: `tel:${data.phone.replace(/\s/g, "")}`,
    },
    data.email && { label: "Email", value: data.email, href: `mailto:${data.email}` },
    data.website && { label: "Website", value: data.website, href: data.website, external: true },
  ].filter(Boolean) as { label: string; value: string; href: string; external?: boolean }[];

  const place = [data.location.city, data.location.country].filter(Boolean).join(", ");

  return (
    <article
      style={themeVars(data.theme)}
      className="mx-auto max-w-md overflow-hidden rounded-[20px] border border-line bg-surface text-ink shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_rgb(20_30_60/0.08)]"
      aria-label={`Contact card for ${fullName(data)}`}
    >
      <header className="grid gap-3.5 px-7 pt-7 pb-5 max-[380px]:px-5">
        <div
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-[14px] bg-accent font-display text-[22px] font-bold text-on-accent"
        >
          {data.initials}
        </div>
        {data.available && (
          <p className="font-mono text-[12.5px] text-muted">
            &lt;<span className="text-accent">{data.availableAs || "Developer"}</span> available /&gt;
          </p>
        )}
        <h1 className="font-display text-[34px] leading-[1.05] font-bold tracking-tight text-balance">
          {fullName(data)}
        </h1>
        <p className="text-[15.5px] text-muted">
          {[data.title, data.organization, place].filter(Boolean).join(" · ")}
        </p>
        {data.skills.length > 0 && <SkillList skills={data.skills} />}
      </header>

      <ActionBar data={data} pageUrl={pageUrl} />

      <div className="border-t border-line">
        {rows.length > 0 && (
          <ul>
            {rows.map((r) => (
              <ContactRow key={r.label} {...r} />
            ))}
          </ul>
        )}
        <SocialLinks links={data.links} />
      </div>

      <ContactQr data={data} pageUrl={pageUrl} />
    </article>
  );
}
