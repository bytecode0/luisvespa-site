"use client";

import { useState } from "react";
import { askLuis } from "@/content/profile";

type Answer = { q: string; a: string | null };

/** Finds the best matching entry in the site's own knowledge base. Deterministic — no AI, no invention. */
function lookup(question: string): string | null {
  const words = question.toLowerCase().split(/[^a-z0-9.]+/).filter(Boolean);
  let best: { score: number; a: string } | null = null;
  for (const entry of askLuis) {
    const score = entry.keywords.filter((k) => words.some((w) => w === k || w.startsWith(k))).length;
    if (score > 0 && (!best || score > best.score)) best = { score, a: entry.a };
  }
  return best?.a ?? null;
}

export function AskLuis() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);

  const ask = (q: string) => {
    if (!q.trim()) return;
    setAnswer({ q, a: lookup(q) });
  };

  return (
    <div className="rounded-sm border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
        <p className="font-mono text-xs tracking-[0.14em] text-ink">ASK LUIS</p>
        <p className="font-mono text-[10px] tracking-[0.12em] text-faint">BETA · ANSWERS ONLY FROM THIS SITE · NOT AN AI</p>
      </div>
      <div className="p-5">
        <ul className="flex flex-wrap gap-2">
          {askLuis.map((e) => (
            <li key={e.q}>
              <button
                type="button"
                onClick={() => {
                  setInput(e.q);
                  ask(e.q);
                }}
                className="rounded-md border border-line px-3 py-1.5 text-left text-xs text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                {e.q}
              </button>
            </li>
          ))}
        </ul>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <label htmlFor="ask-input" className="sr-only">
            Ask a question about Luis
          </label>
          <input
            id="ask-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Android, security, SDKs, agents…"
            className="h-11 w-full rounded-sm border border-line bg-bg px-3 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-sm bg-ink px-4 font-mono text-xs uppercase tracking-[0.12em] text-bg hover:bg-accent"
          >
            Ask
          </button>
        </form>
        <div aria-live="polite" className="mt-5">
          {answer ? (
            <div className="fade-up rounded-sm border border-line bg-bg p-4">
              <p className="font-mono text-xs text-faint">&gt; {answer.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {answer.a ??
                  "That isn't covered on this site. Ask Luis directly — the contact details are at the bottom of the page."}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
