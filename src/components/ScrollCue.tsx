"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * The hero fills the viewport and offers no visible hint that there is more
 * below it, so first-time visitors can mistake it for the whole site. This
 * points them down, then gets out of the way the moment they start scrolling.
 */
export function ScrollCue() {
  const t = useTranslations("Hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); // catch a restored scroll position on reload
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#about"
      className={`group pointer-events-auto absolute inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-10 mx-auto flex w-fit flex-col items-center gap-2.5 transition-opacity duration-500 sm:bottom-[calc(2rem+env(safe-area-inset-bottom))] sm:gap-3 ${
        scrolled ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 transition-colors group-hover:text-neutral-300 sm:text-[11px] sm:tracking-[0.3em]">
        {t("scroll_cue")}
      </span>
      <span className="relative h-9 w-px overflow-hidden bg-neutral-800 sm:h-12">
        <span className="scroll-cue-trace absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-emerald-400" />
      </span>
    </a>
  );
}
