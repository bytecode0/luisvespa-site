"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { sound } from "@/lib/sound";

type Step = { label: string; tool?: string; human?: boolean };

const steps: Step[] = [
  { label: "Read ticket and designs", tool: "MCP · Jira, Figma" },
  { label: "Plan proposal" },
  { label: "Human approval · plan", human: true },
  { label: "Implementation", tool: "Kotlin · Compose" },
  { label: "Unit tests" },
  { label: "Instrumented tests", tool: "Emulator" },
  { label: "On-device tests", tool: "Physical device" },
  { label: "Agent review" },
  { label: "Open merge request", tool: "MCP · GitLab" },
];

const STEP_MS = 420;

/** A replay of what a run looks like. Simulated: no real output, no invented numbers. */
export function AgentTrace() {
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(steps.length);
      return;
    }
    setShown(0);
    setRunning(true);
    steps.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setShown(i + 1);
          // Each step clicks; a human approval plays the gate chord.
          if (steps[i].human) sound().chord();
          else sound().click();
        }, STEP_MS * (i + 1)),
      );
    });
    timers.current.push(
      window.setTimeout(() => {
        setRunning(false);
        sound().blip();
      }, STEP_MS * (steps.length + 1)),
    );
  };

  const done = shown === steps.length;

  return (
    <div className="overflow-hidden rounded-sm border border-line bg-[#07080a]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="rounded border border-human/40 bg-human-soft px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-human">
            SIMULATED
          </span>
          <span className="hidden font-mono text-[11px] text-faint sm:inline">Illustrative replay · not real output</span>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="inline-flex items-center gap-1.5 rounded-md border border-line-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {shown > 0 ? <RotateCcw className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
          {shown > 0 ? "Replay" : "Run"}
        </button>
      </div>
      <div className="p-5 font-mono text-xs leading-7 sm:text-[13px]" aria-live="polite">
        <p className="text-muted">
          <span className="text-faint">$</span> agent run <span className="text-ink">&quot;Add biometric authentication to sign-in&quot;</span>
        </p>
        {shown === 0 ? <p className="mt-2 text-faint">Press Run to replay a pipeline run.</p> : null}
        <ol className="mt-2">
          {steps.slice(0, shown).map((s, i) => (
            <li key={s.label} className="fade-up grid grid-cols-[2.5rem_1fr_auto] gap-2">
              <span className="text-faint">[{String(i + 1).padStart(2, "0")}]</span>
              <span className={s.human ? "text-human" : "text-ink"}>
                {s.label}
                {s.tool ? <span className="ml-2 text-faint">· {s.tool}</span> : null}
              </span>
              <span className={s.human ? "text-human" : "text-ok"}>{s.human ? "APPROVED" : "✓"}</span>
            </li>
          ))}
        </ol>
        {done ? (
          <div className="fade-up mt-4 border-t border-line pt-4">
            <p className="text-faint">RESULT</p>
            <p className="mt-1 grid grid-cols-[1fr_auto] text-ink">
              <span>Merge request</span>
              <span>OPEN</span>
            </p>
            <p className="grid grid-cols-[1fr_auto] text-human">
              <span>Human approval · merge</span>
              <span>REQUIRED</span>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
