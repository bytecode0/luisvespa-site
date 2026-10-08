"use client";

import { useSyncExternalStore } from "react";
import { sound } from "@/lib/sound";

const subscribe = (cb: () => void) => sound().subscribe(cb);
const getSnapshot = () => sound().getSnapshot();
const getServerSnapshot = () => false;

/** [ SOUND: OFF ] toggle. Hidden with reduced motion (see .sound-toggle in globals.css). */
export function SoundToggle({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const on = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <button
      type="button"
      onClick={() => sound().toggle()}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title="Ambient sound and interface sounds"
      className={`sound-toggle group items-center gap-2 border border-line px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:border-line-strong ${
        on ? "text-accent" : "text-faint hover:text-ink"
      } ${className}`}
    >
      <span aria-hidden className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-[2px] bg-current ${on ? "eq-bar" : ""}`}
            style={{ height: on ? undefined : "3px", animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </span>
      <span aria-hidden className={compact ? "hidden" : undefined}>
        <span className="text-faint">[</span> SOUND: {on ? "ON" : "OFF"} <span className="text-faint">]</span>
      </span>
    </button>
  );
}
