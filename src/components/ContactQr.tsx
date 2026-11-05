import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { CardData } from "@shared";
import { buildVCard } from "@shared";

export function ContactQr({ data }: { data: CardData }) {
  const vcard = useMemo(() => buildVCard(data), [data]);

  return (
    <section className="grid grid-cols-[auto_1fr] items-center gap-[18px] px-7 pt-[22px] pb-[26px] max-[380px]:grid-cols-1 max-[380px]:px-5">
      <div className="rounded-[10px] border border-line bg-white p-2 leading-none">
        <QRCodeSVG
          value={vcard}
          size={128}
          level="M"
          bgColor="#ffffff"
          fgColor="#15203a"
          role="img"
          aria-label="QR code that adds this contact to your phone"
        />
      </div>
      <div>
        <h2 className="mb-1 font-display text-lg font-medium">Scan to save</h2>
        <p className="text-[13.5px] text-muted">
          Point your phone camera here. It opens a new contact with these details filled in.
        </p>
      </div>
    </section>
  );
}
