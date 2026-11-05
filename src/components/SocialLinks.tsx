import type { CardLink } from "@shared";
import { iconFor } from "../lib/social";

export function SocialIcon({ label, className = "size-4" }: { label: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`shrink-0 fill-current ${className}`}>
      <path d={iconFor(label)} />
    </svg>
  );
}

/** Social and other links as a wrap of icon buttons. */
export function SocialLinks({ links }: { links: CardLink[] }) {
  if (!links.length) return null;
  return (
    <ul
      aria-label="Links"
      className="flex flex-wrap gap-2 border-b border-line px-7 py-4 max-[380px]:px-5"
    >
      {links.map((l) => (
        <li key={`${l.label}-${l.url}`}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[13.5px] font-medium hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <SocialIcon label={l.label} />
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
