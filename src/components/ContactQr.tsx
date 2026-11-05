import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { buildVCard, fullName, type CardData } from "@shared";

type Mode = "contact" | "link";

const copy: Record<Mode, { title: string; body: string; label: string }> = {
  contact: {
    title: "Scan to save",
    body: "Point your phone camera here. It opens a new contact with these details filled in.",
    label: "QR code that adds this contact to your phone",
  },
  link: {
    title: "Scan to open",
    body: "Point your phone camera here. It opens this card page in the browser.",
    label: "QR code that opens this card page",
  },
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ContactQr({ data, pageUrl }: { data: CardData; pageUrl?: string }) {
  const [mode, setMode] = useState<Mode>("contact");
  const dialog = useRef<HTMLDialogElement>(null);
  const vcard = useMemo(() => buildVCard(data), [data]);
  const value = mode === "link" && pageUrl ? pageUrl : vcard;
  const text = copy[mode];

  // Close the full-screen view when the backdrop is clicked
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    d.addEventListener("click", onClick);
    return () => d.removeEventListener("click", onClick);
  }, []);

  return (
    <section className="grid grid-cols-[auto_1fr] items-center gap-[18px] px-7 pt-[22px] pb-[26px] max-[380px]:grid-cols-1 max-[380px]:px-5">
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label="Show QR code full screen"
        className={`cursor-zoom-in justify-self-start rounded-[10px] border border-line bg-white p-2 leading-none hover:border-accent ${focusRing}`}
      >
        <QRCodeSVG
          value={value}
          size={128}
          level="M"
          bgColor="#ffffff"
          fgColor="#15203a"
          role="img"
          aria-label={text.label}
        />
      </button>
      <div>
        <h2 className="mb-1 font-display text-lg font-medium">{text.title}</h2>
        <p className="text-[13.5px] text-muted">{text.body}</p>
        {pageUrl && <ModeToggle mode={mode} onChange={setMode} />}
      </div>

      <dialog
        ref={dialog}
        aria-label={`QR code for ${fullName(data)}`}
        className="m-auto w-[min(92vw,420px)] rounded-[20px] bg-white p-6 text-[#15203a] backdrop:bg-[rgb(15_20_32/0.7)]"
      >
        <div className="grid justify-items-center gap-1 text-center">
          <p className="font-display text-2xl font-bold tracking-tight">{fullName(data)}</p>
          <p className="mb-4 text-[15px] text-[#5b6478]">{data.title}</p>
          <QRCodeSVG
            value={value}
            size={340}
            level="M"
            bgColor="#ffffff"
            fgColor="#15203a"
            role="img"
            aria-label={text.label}
            className="h-auto w-full max-w-[340px]"
          />
          <p className="mt-4 text-sm text-[#5b6478]">{text.body}</p>
        </div>
        <form method="dialog" className="mt-5">
          <button
            className={`w-full cursor-pointer rounded-xl bg-[#2a5bd7] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 ${focusRing}`}
          >
            Done
          </button>
        </form>
      </dialog>
    </section>
  );
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="QR code contents"
      className="mt-3 inline-flex rounded-lg bg-page p-0.5 text-xs font-medium"
    >
      {(["contact", "link"] as const).map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={mode === m}
          onClick={() => onChange(m)}
          className={`cursor-pointer rounded-md px-2.5 py-1 whitespace-nowrap ${focusRing} ${
            mode === m ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          {m === "contact" ? "Contact" : "Card page"}
        </button>
      ))}
    </div>
  );
}
