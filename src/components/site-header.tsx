"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Command, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { OPEN_PALETTE_EVENT } from "@/components/command-palette";
import { Monogram } from "@/components/type-text";
import { HoverScramble } from "@/components/motion";
import { SoundToggle } from "@/components/sound-toggle";

export const navItems = [
  { href: "/engineering", label: "Engineering", code: "01_ENGINEERING", spy: "engineering" },
  { href: "/security", label: "Security", code: "02_SECURITY", spy: "security" },
  { href: "/agents", label: "AI / Agents", code: "03_AI_AGENTS", spy: "agents" },
  { href: "/experience", label: "Experience", code: "04_EXPERIENCE" },
  { href: "/contact", label: "Contact", code: "05_CONTACT" },
];

function openPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the drawer on navigation (state derived during render, no effect needed).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const routeHref = navItems.find((i) => isActive(i.href))?.href ?? null;

  // On the home page, the nav follows the control-plane module in view (scrollspy).
  const [spyHref, setSpyHref] = useState<string | null>(null);
  useEffect(() => {
    if (pathname !== "/") return;
    const targets = navItems
      .map((item) => ({ item, el: "spy" in item ? document.getElementById(item.spy as string) : null }))
      .filter((t): t is { item: (typeof navItems)[number]; el: HTMLElement } => Boolean(t.el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const hit = targets.find((t) => t.el === entry.target);
          if (!hit) continue;
          if (entry.isIntersecting) setSpyHref(hit.item.href);
          else setSpyHref((cur) => (cur === hit.item.href ? null : cur));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    targets.forEach((t) => observer.observe(t.el));
    return () => observer.disconnect();
  }, [pathname]);
  const activeHref = routeHref ?? (pathname === "/" ? spyHref : null);

  // Compact header once the page scrolls.
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (headerRef.current) headerRef.current.dataset.scrolled = String(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sliding pill: sits behind the active link and follows the hovered one.
  const pillRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const placed = useRef(false);
  const movePill = useCallback((href: string | null) => {
    const pill = pillRef.current;
    if (!pill) return;
    const link = href ? linkRefs.current[href] : null;
    if (!link) {
      pill.style.opacity = "0";
      return;
    }
    if (!placed.current) pill.style.transition = "none";
    pill.style.opacity = "1";
    pill.style.width = `${link.offsetWidth}px`;
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
    if (!placed.current) {
      void pill.offsetWidth; // apply the first position without animating from 0
      pill.style.transition = "";
      placed.current = true;
    }
  }, []);

  useEffect(() => {
    movePill(activeHref);
    const onResize = () => movePill(activeHref);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeHref, movePill]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md transition-colors duration-300">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-ink focus:px-3 focus:py-1.5 focus:text-bg"
      >
        Skip to content
      </a>
      <div className="site-header-inner mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Luis Vespa — home">
          <Monogram />
          <span className="font-mono text-sm font-bold tracking-tight text-ink">LUIS_VESPA</span>
        </Link>

        <nav
          aria-label="Primary"
          className="relative hidden items-center gap-0.5 xl:flex"
          onMouseLeave={() => movePill(activeHref)}
        >
          <span
            ref={pillRef}
            aria-hidden
            className="absolute left-0 top-0 h-full rounded-md border border-line bg-surface-2 opacity-0 transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          />
          {navItems.map((item) => (
            <Link
              key={item.href}
              ref={(el) => {
                linkRefs.current[item.href] = el;
              }}
              href={item.href}
              onMouseEnter={() => movePill(item.href)}
              onFocus={() => movePill(item.href)}
              aria-current={isActive(item.href) ? "page" : undefined}
              aria-label={item.label}
              className={`group relative rounded-md px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:text-ink ${
                item.href === activeHref ? "text-ink" : "text-muted"
              }`}
            >
              {/* Brackets open outwards on hover; the code re-decrypts. */}
              <span
                aria-hidden
                className="inline-block text-faint transition-[translate,color] duration-300 group-hover:-translate-x-1 group-hover:text-accent"
              >
                [
              </span>{" "}
              <HoverScramble text={item.code} />{" "}
              <span
                aria-hidden
                className="inline-block text-faint transition-[translate,color] duration-300 group-hover:translate-x-1 group-hover:text-accent"
              >
                ]
              </span>
              {item.href === activeHref ? (
                <span aria-hidden className="draw-x absolute inset-x-3 -bottom-[11px] h-px bg-accent" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <SoundToggle compact className="py-2" />
          <button
            type="button"
            onClick={openPalette}
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-xs text-faint transition-colors hover:border-line-strong hover:text-ink"
            aria-label="Open command palette"
          >
            <Command className="size-3.5" aria-hidden /> K
          </button>
          <a
            href={siteConfig.cvPath}
            download
            className="rounded-md border border-line-strong px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            CV
          </a>
          <Link
            href="/contact"
            className="bg-accent px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent-bright"
          >
            Connect
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md border border-line text-ink xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      <span aria-hidden className="scroll-progress absolute inset-x-0 -bottom-px h-px bg-accent/70" />

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-bg xl:hidden">
          <span aria-hidden className="draw-x block h-px bg-accent" />
          <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col px-5 py-4">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="fade-up flex items-center gap-4 border-b border-line py-4 text-ink"
                style={{ animationDelay: `${120 + i * 60}ms` } as CSSProperties}
              >
                <span className="font-mono text-xs text-accent">{item.code.slice(0, 2)}</span>
                <span className="text-lg">{item.label}</span>
                <span className="ml-auto font-mono text-[10px] tracking-[0.12em] text-faint">
                  {isActive(item.href) ? "● CURRENT" : item.code.slice(3)}
                </span>
              </Link>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href={siteConfig.cvPath}
                download
                className="border border-line-strong py-3 text-center font-mono text-xs uppercase tracking-[0.12em] text-ink"
              >
                Download CV
              </a>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="bg-accent py-3 text-center font-mono text-xs uppercase tracking-[0.12em] text-white"
              >
                Connect
              </Link>
            </div>
            <SoundToggle className="mt-3 justify-center py-3" />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openPalette();
              }}
              className="mt-3 rounded-sm border border-line py-3 font-mono text-xs uppercase tracking-[0.12em] text-muted"
            >
              Search the site
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
