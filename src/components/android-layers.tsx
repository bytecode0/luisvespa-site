"use client";

import { useState } from "react";
import { androidLayers } from "@/content/profile";
import { Panel, Tag, stagger } from "@/components/ui";

/** Layered Android architecture. Each layer is a button; the panel explains the selected one. */
export function AndroidLayers() {
  const [selected, setSelected] = useState<string>("domain");
  const current = androidLayers.find((l) => l.id === selected) ?? androidLayers[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div role="group" aria-label="Android architecture layers" className="flex flex-col gap-1.5">
        {androidLayers.map((layer, i) => {
          const on = layer.id === current.id;
          return (
            <button
              key={layer.id}
              {...stagger(i, 60)}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(layer.id)}
              onMouseEnter={() => setSelected(layer.id)}
              className={`flex items-center justify-between rounded-sm border px-5 py-4 text-left transition-[background-color,border-color,padding] duration-300 ${on ? "pl-7" : ""} ${
                on
                  ? layer.id === "security"
                    ? "border-accent bg-accent-soft"
                    : "border-line-strong bg-surface-2"
                  : "border-line bg-surface hover:border-line-strong"
              }`}
            >
              <span className="font-mono text-xs tracking-[0.14em] text-ink">{layer.name.toUpperCase()}</span>
              <span className="font-mono text-[10px] text-faint">L{androidLayers.length - i}</span>
            </button>
          );
        })}
      </div>
      <Panel className="flex flex-col p-6">
        <p className="label">Layer</p>
        <div aria-live="polite">
          <h3 key={current.id} className="fade-up mt-2 text-xl font-semibold text-ink">{current.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{current.detail}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {current.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
