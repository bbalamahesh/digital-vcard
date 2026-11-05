import { useCopy } from "../lib/useCopy";

interface Props {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

export function ContactRow({ label, value, href, external }: Props) {
  const { copied, copy } = useCopy();
  const shown = value.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <li className="grid grid-cols-[76px_1fr_auto] items-center gap-2.5 border-b border-line px-7 py-3 max-[380px]:grid-cols-[64px_1fr_auto] max-[380px]:px-5">
      <span className="text-[11px] tracking-[0.08em] text-muted uppercase">{label}</span>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="min-w-0 font-medium [overflow-wrap:anywhere] hover:text-accent focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {shown}
      </a>
      <button
        type="button"
        onClick={() => copy(value)}
        aria-label={`Copy ${label}`}
        className="cursor-pointer rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-accent hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </li>
  );
}
