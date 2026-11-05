import { BusinessCard } from "./components/BusinessCard";
import { card } from "@shared";

export default function App() {
  return (
    <main className="min-h-dvh px-4 py-10 sm:py-16">
      <BusinessCard data={card} />
      <p className="mx-auto mt-4 max-w-md text-center font-mono text-[11.5px] text-muted">
        vCard 3.0 · works with iOS and Android cameras
      </p>
    </main>
  );
}
