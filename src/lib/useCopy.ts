import { useCallback, useRef, useState } from "react";

/** Copies text to the clipboard and exposes a short-lived "copied" flag. */
export function useCopy(resetMs = 1400) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), resetMs);
      } catch {
        setCopied(false);
      }
    },
    [resetMs],
  );

  return { copied, copy };
}
