"use client";

import { useSyncExternalStore } from "react";

export const VIEW_MODES = [
  { id: "engineer", label: "Engineer" },
  { id: "recruiter", label: "Recruiter" },
  { id: "deep", label: "Deep dive" },
] as const;

type ViewMode = (typeof VIEW_MODES)[number]["id"];
const STORAGE_KEY = "view-mode";

/**
 * Runs before paint (inlined in <head>) so the chosen mode never flashes.
 * Priority: ?view= in the URL, then the stored choice, then "engineer".
 * Also enables scroll reveals, only when motion is allowed (no JS or reduced motion = content simply visible).
 */
export const viewModeBootScript = `(function(){try{var m=new URLSearchParams(location.search).get('view');if(!/^(engineer|recruiter|deep)$/.test(m||'')){m=localStorage.getItem('${STORAGE_KEY}')}if(!/^(engineer|recruiter|deep)$/.test(m||'')){m='engineer'}document.documentElement.dataset.view=m}catch(e){document.documentElement.dataset.view='engineer'}try{if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.motion='on'}}catch(e){}})();`;

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getMode(): ViewMode {
  return (document.documentElement.dataset.view as ViewMode) || "engineer";
}

function setMode(mode: ViewMode) {
  document.documentElement.dataset.view = mode;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Storage blocked: the mode still applies for this visit.
  }
  const url = new URL(window.location.href);
  url.searchParams.set("view", mode);
  window.history.replaceState(null, "", url);
  listeners.forEach((l) => l());
}

export function ViewModeSwitch() {
  const mode = useSyncExternalStore(subscribe, getMode, () => "engineer" as ViewMode);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="label" id="view-as">
        View as
      </span>
      <div role="radiogroup" aria-labelledby="view-as" className="inline-flex rounded-sm border border-line p-1">
        {VIEW_MODES.map((m) => {
          const on = m.id === mode;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMode(m.id)}
              className={`rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                on ? "bg-surface-2 text-ink" : "text-faint hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
