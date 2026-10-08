import type { CSSProperties } from "react";

/**
 * Text typed character by character with CSS only (fully visible without JS or with reduced motion).
 * Inside a [data-reveal] block it waits until the block scrolls into view.
 */
export function TypeText({
  text,
  startMs = 0,
  stepMs = 22,
  caret = false,
  className,
}: {
  text: string;
  startMs?: number;
  stepMs?: number;
  caret?: boolean;
  className?: string;
}) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {Array.from(text).map((c, i) => (
          <span key={i} className="type-char" style={{ "--d": `${startMs + i * stepMs}ms` } as CSSProperties}>
            {c}
          </span>
        ))}
        {caret ? <span className="caret" /> : null}
      </span>
    </span>
  );
}

/** The LV monogram: a square that draws its own border. */
export function Monogram({ size = 32, delayMs = 0 }: { size?: number; delayMs?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="shrink-0">
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        className="draw-stroke"
        style={{ "--len": 122, "--d": `${delayMs}ms` } as CSSProperties}
      />
      <text x="16" y="20.5" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--accent)" fontFamily="var(--font-plex-mono)">
        LV
      </text>
    </svg>
  );
}
