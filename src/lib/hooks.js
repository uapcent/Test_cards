import { useEffect, useState } from "react";

// Motion the page adds on its own (shaking, tilting, flashes) is skipped for anyone
// who asked their system for less of it
export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

// The phone layout breakpoint the stylesheets use
export const useNarrow = () => useMediaQuery("(max-width: 640px)");
