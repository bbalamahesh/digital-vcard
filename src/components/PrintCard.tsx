import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { buildVCard, fullName, type CardData } from "@shared";
import { themeVars } from "../lib/theme";
import { SocialIcon } from "./SocialLinks";

type Layout = "single" | "sheet";

const SHEET_COUNT = 8;
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** "Print card" button with a choice of layouts. Prints real-size 85 x 55 mm cards. */
export function PrintButton({ data, className = "" }: { data: CardData; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [choice, setChoice] = useState<Layout>("single");
  const [printing, setPrinting] = useState<Layout | null>(null);

  // Print once the sheet is in the page, and remove it afterwards
  useEffect(() => {
    if (!printing) return;
    const done = () => setPrinting(null);
    window.addEventListener("afterprint", done);
    const id = requestAnimationFrame(() => window.print());
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("afterprint", done);
    };
  }, [printing]);

  const start = () => {
    dialog.current?.close();
    setPrinting(choice);
  };

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className={className}>
        Print card
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="print-title"
        className="m-auto w-[min(92vw,400px)] rounded-[20px] border border-line bg-surface p-6 text-ink backdrop:bg-[rgb(15_20_32/0.6)]"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        <h2 id="print-title" className="mb-1 font-display text-xl font-bold">
          Print your card
        </h2>
        <p className="mb-4 text-sm text-muted">Standard business card size, 85 × 55 mm.</p>

        <fieldset className="mb-4 grid gap-2">
          <legend className="sr-only">Layout</legend>
          {(
            [
              ["single", "One card", "Front and back side by side on one page. Cut out and fold or glue."],
              ["sheet", `Sheet of ${SHEET_COUNT}`, "Page 1 has the fronts and page 2 the backs. Print double-sided, flip on the long edge."],
            ] as const
          ).map(([value, title, desc]) => (
            <label
              key={value}
              className="flex cursor-pointer gap-3 rounded-xl border border-line p-3 has-[:checked]:border-accent has-[:checked]:bg-accent-soft"
            >
              <input
                type="radio"
                name="layout"
                value={value}
                checked={choice === value}
                onChange={() => setChoice(value)}
                className="mt-1 accent-[var(--accent)]"
              />
              <span>
                <span className="block text-[15px] font-medium">{title}</span>
                <span className="block text-[13px] text-muted">{desc}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <p className="mb-5 text-[13px] text-muted">
          Set scale to 100% and turn on <b>Background graphics</b> in the print settings so the
          colors print.
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className={`flex-1 cursor-pointer rounded-xl border border-line px-4 py-2.5 text-sm font-medium hover:border-accent ${focusRing}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={start}
            className={`flex-1 cursor-pointer rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-on-accent hover:opacity-90 ${focusRing}`}
          >
            Print
          </button>
        </div>
      </dialog>

      {printing && createPortal(<PrintSheet data={data} layout={printing} />, document.body)}
    </>
  );
}

function PrintSheet({ data, layout }: { data: CardData; layout: Layout }) {
  // Always print the light palette of a theme, whatever the screen is set to
  const style = themeVars(data.theme, true);
  const vcard = buildVCard(data);

  if (layout === "single") {
    return (
      <div className="print-root" style={style}>
        <div className="flex justify-center gap-[6mm]">
          <Front data={data} cut />
          <Back data={data} vcard={vcard} cut />
        </div>
      </div>
    );
  }

  const grid = (face: (i: number) => React.ReactNode) => (
    <div className="mx-auto grid w-max grid-cols-2">{Array.from({ length: SHEET_COUNT }, (_, i) => face(i))}</div>
  );
  return (
    <div className="print-root" style={style}>
      {grid((i) => <Front key={i} data={data} cut />)}
      <div className="break-before-page">{grid((i) => <Back key={i} data={data} vcard={vcard} cut />)}</div>
    </div>
  );
}

const face = "relative h-[55mm] w-[85mm] overflow-hidden";
// A border (inside the 85 x 55 mm box) rather than an outline, which spills past the edges
const cutLine = "border-[0.2mm] border-dashed border-[#9aa0aa]";

function Front({ data, cut }: { data: CardData; cut?: boolean }) {
  const lines = [
    data.phone && { icon: "", text: data.phone },
    data.email && { icon: "", text: data.email },
    data.website && { icon: "", text: data.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") },
    ...data.links.map((l) => ({ icon: l.label, text: l.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") })),
  ]
    .filter(Boolean)
    .slice(0, 5) as { icon: string; text: string }[];
  const role = [data.title, data.organization].filter(Boolean).join(" · ");
  const place = [data.location.city, data.location.country].filter(Boolean).join(", ");

  return (
    <div className={`${face} ${cut ? cutLine : ""} flex flex-col bg-surface p-[5mm] text-ink`}>
      <div className="absolute inset-y-0 left-0 w-[1.6mm] bg-accent" />
      <div className="flex items-center gap-[3mm]">
        <div className="grid size-[10mm] shrink-0 place-items-center rounded-[2.2mm] bg-accent font-display text-[11pt] font-bold text-on-accent">
          {data.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-[13pt] leading-tight font-bold tracking-tight">{fullName(data)}</p>
          {role && <p className="truncate text-[7.5pt] text-muted">{role}</p>}
        </div>
      </div>
      <ul className="mt-auto grid gap-[0.9mm] text-[7pt] leading-tight">
        {lines.map((l, i) => (
          <li key={i} className="flex min-w-0 items-center gap-[1.5mm]">
            {l.icon ? (
              <SocialIcon label={l.icon} className="size-[2.6mm] text-accent" />
            ) : (
              <span className="size-[1.2mm] shrink-0 rounded-full bg-accent" style={{ margin: "0 0.7mm" }} />
            )}
            <span className="truncate">{l.text}</span>
          </li>
        ))}
        {place && <li className="mt-[0.6mm] text-[6.5pt] text-muted">{place}</li>}
      </ul>
    </div>
  );
}

function Back({ data, vcard, cut }: { data: CardData; vcard: string; cut?: boolean }) {
  return (
    <div className={`${face} ${cut ? cutLine : ""} flex items-center gap-[5mm] bg-accent p-[5mm] text-on-accent`}>
      <div className="shrink-0 rounded-[1.5mm] bg-white p-[1.5mm] leading-none">
        <QRCodeSVG value={vcard} size={256} level="L" bgColor="#ffffff" fgColor="#111111" style={{ width: "36mm", height: "36mm" }} />
      </div>
      <div className="min-w-0">
        <p className="font-display text-[11pt] leading-tight font-bold">{fullName(data)}</p>
        <p className="mt-[2mm] text-[7.5pt] leading-snug opacity-90">
          Scan with your phone camera to save my contact.
        </p>
      </div>
    </div>
  );
}
