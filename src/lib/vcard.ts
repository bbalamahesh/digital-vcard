import { buildVCard, vcardFileName, type CardData } from "@shared";

/** Triggers a download of the contact as a .vcf file (web only). */
export function downloadVCard(c: CardData) {
  const blob = new Blob([buildVCard(c)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = vcardFileName(c);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
