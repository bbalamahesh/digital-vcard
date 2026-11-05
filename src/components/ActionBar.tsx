import { fullName, type CardData } from "@shared";
import { downloadVCard } from "../lib/vcard";
import { useCopy } from "../lib/useCopy";

const btn =
  "flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ActionBar({ data, pageUrl }: { data: CardData; pageUrl?: string }) {
  const { copied, copy } = useCopy();

  const share = async () => {
    // Share the card's public URL, not whatever preview or local URL this page is on
    const url = pageUrl ?? window.location.href;
    const shareData = {
      title: fullName(data),
      text: [fullName(data), data.title].filter(Boolean).join(" · "),
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed: fall back to copying the link
      }
    }
    copy(url);
  };

  return (
    <div className="flex gap-2 px-7 pb-6 max-[380px]:px-5">
      <button
        type="button"
        onClick={() => downloadVCard(data)}
        className={`${btn} bg-accent text-on-accent hover:opacity-90`}
      >
        Save contact
      </button>
      <button
        type="button"
        onClick={share}
        className={`${btn} border border-line text-ink hover:border-accent`}
      >
        {copied ? "Link copied" : "Share"}
      </button>
    </div>
  );
}
