"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X, ZoomIn } from "lucide-react";
import type { ShippedApp } from "@/content/profile";
import { sound } from "@/lib/sound";

/* ---------- Lightbox gallery ---------- */

function Lightbox({ app, start, onClose }: { app: ShippedApp; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const closeRef = useRef<HTMLButtonElement>(null);
  const n = app.screens.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [go, onClose]);

  const screen = app.screens[i];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${app.name} screenshots`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/95 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="fade-up relative flex w-full max-w-md flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-12 right-0 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:text-accent"
        >
          [ Close ] <X className="size-4" aria-hidden />
        </button>
        <div className="relative aspect-[1/2] h-[78vh] max-h-[820px] overflow-hidden rounded-2xl border border-line shadow-[0_0_60px_rgba(59,130,246,0.25)]">
          <Image key={screen.src} src={screen.src} alt={screen.alt} fill sizes="420px" className="fade-up object-cover" />
        </div>
        <div className="mt-5 flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          <button type="button" onClick={() => go(-1)} aria-label="Previous screenshot" className="p-2 hover:text-accent">
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <span aria-live="polite">
            {app.name} · {i + 1}/{n}
          </span>
          <button type="button" onClick={() => go(1)} aria-label="Next screenshot" className="p-2 hover:text-accent">
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-faint">{app.credit}</p>
      </div>
    </div>
  );
}

function useLightbox(app: ShippedApp) {
  const [open, setOpen] = useState<number | null>(null);
  const node = open === null ? null : <Lightbox app={app} start={open} onClose={() => setOpen(null)} />;
  const show = (i = 0) => {
    sound().blip();
    setOpen(i);
  };
  return { show, node };
}

/* ---------- Store screenshot card (no phone frame: the listing graphics already include one) ---------- */

function ScreenCard({ src, alt, className = "", sizes = "240px" }: { src: string; alt: string; className?: string; sizes?: string }) {
  return (
    <div className={`relative aspect-[1/2] overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_0_30px_rgba(59,130,246,0.15)] ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-accent/5 to-transparent" />
    </div>
  );
}

/** Google Play link in the site's style (text, not Google's badge artwork). */
export function PlayLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 border border-line-strong bg-surface-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent"
    >
      <Play className="size-4 fill-accent text-accent transition-transform group-hover:scale-110" aria-hidden />
      <span>
        <span className="block text-[8px] text-faint">Get it on</span>Google Play
      </span>
    </a>
  );
}

/* ---------- Home: SHIPPED_APPS strip ---------- */

const floats = ["float-slow", "float-mid mt-8 lg:mt-16", "float-fast mt-4 lg:mt-8"];

function StripItem({ app, i }: { app: ShippedApp; i: number }) {
  const { show, node } = useLightbox(app);
  return (
    <li className={`flex flex-col items-center gap-6 ${floats[i % floats.length]}`}>
      <button type="button" onClick={() => show(0)} className="group relative block w-[200px] sm:w-[220px]" aria-label={`Open ${app.name} screenshots`}>
        <ScreenCard src={app.screens[0].src} alt={app.screens[0].alt} className="transition-transform duration-500 group-hover:-translate-y-1" />
        <span className="absolute inset-0 flex items-center justify-center rounded-[22px] bg-accent/20 opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="size-7 text-white" aria-hidden />
        </span>
      </button>
      <div className="text-center font-mono">
        <p className="text-xs font-bold uppercase text-ink">{app.name}</p>
        <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-faint">
          {app.company} · {app.period}
        </p>
      </div>
      {node}
    </li>
  );
}

export function ShippedAppsStrip({ apps }: { apps: ShippedApp[] }) {
  if (!apps.length) return null;
  return (
    <ul className="flex flex-wrap items-start justify-center gap-12 lg:gap-24">
      {apps.map((a, i) => (
        <StripItem key={a.slug} app={a} i={i} />
      ))}
    </ul>
  );
}

/* ---------- Experience: compact phone thumbnail that opens the gallery ---------- */

export function AppThumb({ app }: { app: ShippedApp }) {
  const { show, node } = useLightbox(app);
  return (
    <>
      <button
        type="button"
        onClick={() => show(0)}
        className="group relative block w-28 shrink-0 sm:w-32"
        aria-label={`Open ${app.name} screenshots`}
      >
        <ScreenCard src={app.screens[0].src} alt={app.screens[0].alt} sizes="128px" className="!rounded-[16px]" />
        <span className="absolute inset-0 flex items-center justify-center rounded-[16px] bg-accent/20 opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="size-6 text-white" aria-hidden />
        </span>
      </button>
      {node}
    </>
  );
}

/* ---------- Large showcase: carousel + details ---------- */

export function AppShowcase({ app, reverse = false }: { app: ShippedApp; reverse?: boolean }) {
  const [i, setI] = useState(0);
  const { show, node } = useLightbox(app);
  const n = app.screens.length;
  return (
    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
      <div className={`flex flex-col items-center lg:col-span-5 ${reverse ? "lg:order-2" : ""}`}>
        <button
          type="button"
          onClick={() => show(i)}
          className="group relative w-[240px] sm:w-[280px]"
          aria-label={`Enlarge ${app.screens[i].alt}`}
        >
          <ScreenCard key={app.screens[i].src} src={app.screens[i].src} alt={app.screens[i].alt} sizes="300px" className="fade-up !rounded-[30px] shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
          <span className="absolute inset-0 flex items-center justify-center rounded-[30px] bg-accent/15 opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="size-8 text-white" aria-hidden />
          </span>
        </button>
        <div className="mt-6 flex gap-3" role="tablist" aria-label={`${app.name} screenshots`}>
          {app.screens.map((s, k) => (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`Screenshot ${k + 1} of ${n}`}
              onClick={() => {
                setI(k);
                sound().click();
              }}
              className={`h-2 rounded-full transition-all ${k === i ? "w-6 bg-accent" : "w-2 bg-line-strong hover:bg-muted"}`}
            />
          ))}
        </div>
      </div>
      <div className={`space-y-6 lg:col-span-7 ${reverse ? "lg:order-1" : ""}`}>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">[ {app.company} ]</p>
          <h3 className="mt-2 font-mono text-3xl font-bold uppercase text-ink sm:text-4xl">{app.name}</h3>
          <p className="mt-2 font-mono text-xs uppercase italic tracking-[0.12em] text-accent">
            Android app I worked on · {app.period}
          </p>
        </div>
        <div className="flex items-start gap-4">
          <span aria-hidden className="mt-2 size-1.5 shrink-0 bg-accent" />
          <p className="text-sm leading-relaxed text-muted">{app.contribution}</p>
        </div>
        <div className="flex flex-wrap items-center gap-6 pt-4">
          <PlayLink href={app.storeUrl} />
          <p className="font-mono text-[9px] uppercase italic text-faint">{app.credit}</p>
        </div>
      </div>
      {node}
    </div>
  );
}

