/** Top-of-page call to action that leads to the card editor. */
export function MakeOwnCta() {
  return (
    <nav className="mx-auto mb-4 flex max-w-md justify-end" aria-label="Make a card">
      <a
        href="/create/"
        className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent shadow-sm hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span aria-hidden="true" className="text-base leading-none">+</span>
        Make your own card
      </a>
    </nav>
  );
}
