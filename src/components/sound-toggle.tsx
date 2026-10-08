"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
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
      title={on ? "Sound on — click to mute" : "Turn on ambient and interface sounds"}
      className={`sound-toggle group items-center gap-2 border border-line px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:border-line-strong ${
        on ? "text-accent" : "text-faint hover:text-ink"
      } ${className}`}
    >
      {/* A speaker reads at a glance; when on, the equaliser bars animate next to it. */}
      {on ? <Volume2 aria-hidden className="size-4" /> : <VolumeX aria-hidden className="size-4" />}
      {on ? (
        <span aria-hidden className="flex h-3 items-end gap-[2px]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="eq-bar w-[2px] bg-current" style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </span>
      ) : null}
      <span aria-hidden className={compact ? "hidden" : undefined}>
        <span className="text-faint">[</span> SOUND: {on ? "ON" : "OFF"} <span className="text-faint">]</span>
      </span>
    </button>
  );
}
