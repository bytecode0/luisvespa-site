"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { siteConfig } from "@/config/site";

export const OPEN_PALETTE_EVENT = "open-command-palette";

type Item = { label: string; hint: string; href: string; keywords?: string };

const items: Item[] = [
  { label: "Android", hint: "Engineering", href: "/engineering#android", keywords: "kotlin compose architecture" },
  { label: "SDK Lab", hint: "Engineering", href: "/engineering#sdk-lab", keywords: "sdk api library" },
  { label: "Security", hint: "Security", href: "/security", keywords: "mobile security" },
  { label: "mTLS", hint: "Security", href: "/security#network", keywords: "tls certificate pinning" },
  { label: "PKI & certificates", hint: "Security", href: "/security#identity", keywords: "x.509 signature identity passwordless" },
  { label: "Android Keystore", hint: "Security", href: "/security#crypto", keywords: "keys crypto storage" },
  { label: "DexGuard / R8", hint: "Security", href: "/security#hardening", keywords: "obfuscation proguard hardening" },
  { label: "Agentic SDLC", hint: "AI / Agents", href: "/agents#pipeline", keywords: "pipeline claude agents" },
  { label: "MCP", hint: "AI / Agents", href: "/agents#mcp", keywords: "model context protocol jira figma gitlab" },
  { label: "Agent boundaries", hint: "AI / Agents", href: "/agents#boundaries", keywords: "safety permissions" },
  { label: "Agent trace demo", hint: "AI / Agents", href: "/agents#trace", keywords: "simulated" },
  { label: "Engineering principles", hint: "Home", href: "/#principles", keywords: "manifesto" },
  { label: "Selected work", hint: "Case studies", href: "/work", keywords: "projects case studies" },
  { label: "Ask Luis", hint: "Experience", href: "/experience#ask", keywords: "questions assistant about" },
  { label: "Experience", hint: "Profile", href: "/experience", keywords: "about career timeline cv profile" },
  { label: "Download CV", hint: "PDF", href: siteConfig.cvPath, keywords: "resume curriculum" },
  { label: "Contact", hint: "Contact", href: "/contact", keywords: "email linkedin github whatsapp phone message form" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.hint} ${i.keywords ?? ""}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const show = () => {
      restoreFocus.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setActive(0);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else restoreFocus.current?.focus?.();
  }, [open]);

  if (!open) return null;

  const close = () => setOpen(false);
  const go = (item: Item) => {
    close();
    if (item.href.endsWith(".pdf")) window.open(item.href, "_blank", "noopener");
    else router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        className="fade-up w-full max-w-lg overflow-hidden rounded-sm border border-line-strong bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 text-faint" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search engineering..."
            className="h-12 w-full bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
          />
          <kbd className="font-mono text-[10px] text-faint">ESC</kbd>
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-faint">No results</li>
          ) : (
            results.map((item, i) => (
              <li
                key={item.href + item.label}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(item)}
                className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm ${
                  i === active ? "bg-surface-2 text-ink" : "text-muted"
                }`}
              >
                <span>
                  <span className="mr-2 font-mono text-faint">&gt;</span>
                  {item.label}
                </span>
                <span className="label">{item.hint}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
