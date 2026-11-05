import { BusinessCard } from "./components/BusinessCard";
import { card } from "@shared";
import { MakeOwnCta } from "./components/MakeOwnCta";
import { PrintButton } from "./components/PrintCard";

const link =
  "rounded text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function App() {
  return (
    <main className="min-h-dvh px-4 pt-5 pb-10 sm:pt-8 sm:pb-16">
      <MakeOwnCta />
      <BusinessCard data={card} />
      <footer className="mx-auto mt-4 grid max-w-md justify-items-center gap-2 text-center">
        <p className="font-mono text-[11.5px] text-muted">
          vCard 3.0 · works with iOS and Android cameras
        </p>
        <PrintButton data={card} className={`cursor-pointer ${link}`} />
      </footer>
    </main>
  );
}
