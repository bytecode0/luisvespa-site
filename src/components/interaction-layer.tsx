"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { sound } from "@/lib/sound";

/**
 * Site-wide motion wiring, mounted once in the layout:
 * - reveals [data-reveal] elements as they scroll into view (re-scanned on every route)
 * - feeds the cursor position to .spotlight cards
 */
export function InteractionLayer() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.motion !== "on") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Optional sound cue declared on the element: data-sfx="blip" | "chord".
            const cue = (entry.target as HTMLElement).dataset.sfx;
            if (cue === "blip") sound().blip();
            else if (cue === "chord") sound().chord();
            else if (cue === "type") {
              const keys = Number((entry.target as HTMLElement).dataset.sfxLength ?? 12);
              for (let k = 0; k < keys; k++) window.setTimeout(() => sound().click(), k * 30);
            }
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const scan = () =>
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => observer.observe(el));
    scan();
    // Content can appear later (view modes, transitions): keep watching for new reveal targets.
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(".spotlight") as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  // 3D tilt for .tilt cards: a few degrees towards the cursor, reset when it leaves.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (document.documentElement.dataset.motion !== "on") return;
    let current: HTMLElement | null = null;
    const reset = (el: HTMLElement) => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(".tilt") as HTMLElement | null;
      if (current && current !== card) reset(current);
      current = card;
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--rx", `${(-py * 5).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  // Cursor radar on the background dot field (coordinates relative to the drifting layer).
  useEffect(() => {
    const radar = document.querySelector<HTMLElement>(".dot-radar");
    if (!radar || window.matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      const rect = radar.getBoundingClientRect();
      radar.style.setProperty("--cx", `${x - rect.left}px`);
      radar.style.setProperty("--cy", `${y - rect.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => radar.style.setProperty("--cx", "-999px");
    window.addEventListener("pointermove", onMove, { passive: true });
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
