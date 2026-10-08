"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { sound } from "@/lib/sound";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/\\=";

/**
 * Text that "decrypts": letters cycle through random glyphs, then resolve to the real text.
 * Server-rendered with the final text, so it is readable without JS and by screen readers.
 * `trigger="view"` waits until the element scrolls into view.
 */
export function Scramble({
  text,
  delayMs = 0,
  durationMs = 900,
  trigger = "load",
  className,
}: {
  text: string;
  delayMs?: number;
  durationMs?: number;
  trigger?: "load" | "view";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.documentElement.dataset.motion !== "on") return;
    let frame = 0;
    let timer = 0;

    const run = () => {
      const start = performance.now();
      let lastResolved = -1;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const resolved = Math.floor(t * text.length);
        if (resolved !== lastResolved) {
          lastResolved = resolved;
          sound().click();
        }
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const c = text.charAt(i);
          out += i < resolved || c === " " ? c : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
        }
        el.textContent = out;
        if (t < 1) frame = requestAnimationFrame(tick);
        else el.textContent = text;
      };
      frame = requestAnimationFrame(tick);
    };

    let observer: IntersectionObserver | null = null;
    if (trigger === "view") {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          observer?.disconnect();
          timer = window.setTimeout(run, delayMs);
        }
      });
      observer.observe(el);
    } else {
      timer = window.setTimeout(run, delayMs);
    }

    return () => {
      observer?.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      el.textContent = text;
    };
  }, [text, delayMs, durationMs, trigger]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden>
        {text}
      </span>
    </span>
  );
}

/** The control-plane spine: a vertical bus that fills with the reader's progress through its parent. */
export function Spine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = host.getBoundingClientRect();
      const reading = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (reading - rect.top) / rect.height));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className={`spine ${className}`}>
      <div className="spine-fill" />
      {[0, 2.4, 4.8].map((d) => (
        <span key={d} className="spine-packet" style={{ "--d": `${d}s` } as CSSProperties} />
      ))}
    </div>
  );
}

/**
 * Text that re-decrypts when its closest link or button is hovered or focused (menus).
 * The real text is always in the DOM for assistive tech.
 */
export function HoverScramble({ text, durationMs = 380 }: { text: string; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest("a, button");
    if (!el || !host || document.documentElement.dataset.motion !== "on") return;
    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      sound().hover();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const resolved = Math.floor(t * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const c = text.charAt(i);
          out += i < resolved || c === "_" || c === " " ? c : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
        }
        el.textContent = out;
        if (t < 1) frame = requestAnimationFrame(tick);
        else el.textContent = text;
      };
      frame = requestAnimationFrame(tick);
    };
    host.addEventListener("pointerenter", run);
    host.addEventListener("focus", run);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointerenter", run);
      host.removeEventListener("focus", run);
      el.textContent = text;
    };
  }, [text, durationMs]);

  return (
    <span ref={ref} aria-hidden>
      {text}
    </span>
  );
}
