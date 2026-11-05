import { useEffect, useState } from "react";
import { fullName } from "@shared";
import { BusinessCard } from "../components/BusinessCard";
import { PrintButton } from "../components/PrintCard";
import { cardFromHash, editUrl } from "../lib/cardLink";
import { usePageTheme } from "../lib/theme";

const link =
  "rounded text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** Shows a card someone made on /create/, read from the link's #d=... hash. */
export function ViewPage() {
  const [data, setData] = useState(cardFromHash);

  useEffect(() => {
    const onHash = () => setData(cardFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  usePageTheme(data?.theme);

  useEffect(() => {
    document.title = data ? `${fullName(data)} · Contact Card` : "Card not found";
  }, [data]);

  if (!data) {
    return (
      <main className="grid min-h-dvh place-items-center px-4 py-10">
        <div className="max-w-sm rounded-[20px] border border-line bg-surface p-7 text-center">
          <h1 className="mb-2 font-display text-2xl font-bold">This card link is broken</h1>
          <p className="mb-5 text-[15px] text-muted">
            The link may have been cut off when it was copied. Ask the sender for it again, or make
            your own card.
          </p>
          <a href="/create/" className={link}>
            Make your own card →
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh px-4 py-10 sm:py-16">
      <BusinessCard data={data} pageUrl={window.location.href} />
      <footer className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2">
        <a href="/create/" className={link}>
          Make your own card
        </a>
        <a href={editUrl(data)} className={link}>
          Edit a copy of this card
        </a>
        <PrintButton data={data} className={`cursor-pointer ${link}`} />
      </footer>
    </main>
  );
}
