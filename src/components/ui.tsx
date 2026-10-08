import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Scramble } from "@/components/motion";
import { TypeText } from "@/components/type-text";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

type SectionProps = {
  id?: string;
  label: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Type the title out letter by letter instead of sliding it in. */
  typed?: boolean;
} & Omit<ComponentProps<"section">, "title">;

/** A page section with a technical label ("SECURITY / 02"), a title and optional intro. */
export function Section({ id, label, title, intro, children, className = "", typed = false, ...rest }: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`border-t border-line py-20 sm:py-28 ${className}`} {...rest}>
      <Container>
        <div data-reveal {...(typed ? { "data-sfx": "type", "data-sfx-length": title.length } : {})} className="mb-12 max-w-3xl">
          <p className="label mb-4">
            <Scramble text={label.toUpperCase()} trigger="view" durationMs={600} />
          </p>
          {typed ? (
            <h2 id={headingId} className="font-mono text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              <TypeText text={title} startMs={250} stepMs={45} caret />
            </h2>
          ) : (
            <h2 id={headingId} className="reveal-title font-mono text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              <span>{title}</span>
            </h2>
          )}
          {intro ? <div className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{intro}</div> : null}
        </div>
        <div data-reveal style={{ "--d": "120ms" } as CSSProperties}>
          {children}
        </div>
      </Container>
    </section>
  );
}

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "accent" | "human" }) {
  const tones = {
    default: "border-line text-muted",
    accent: "border-accent/30 bg-accent-soft text-accent",
    human: "border-human/30 bg-human-soft text-human",
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  download?: boolean;
};

export function ButtonLink({ href, children, variant = "primary", external, download }: ButtonLinkProps) {
  const base =
    "inline-flex items-center gap-2 rounded-sm px-4 py-2.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors";
  const styles =
    variant === "primary"
      ? "bg-ink text-bg hover:bg-accent"
      : "border border-line-strong text-ink hover:border-accent hover:text-accent";
  if (external || download) {
    return (
      <a
        href={href}
        className={`${base} ${styles}`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: true } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

/** A bordered panel used for diagrams and cards. */
export function Panel({ children, className = "", ...rest }: ComponentProps<"div">) {
  return (
    <div className={`tech-card spotlight ${className}`} {...rest}>
      {children}
    </div>
  );
}

/** Visible marker for placeholder content that Luis still has to provide. */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded border border-dashed border-line-strong px-2 py-0.5 font-mono text-xs text-faint">
      {children}
    </span>
  );
}

/** Props for an item that animates in after its section, `i` steps later. */
export function stagger(i: number, stepMs = 70) {
  return { "data-stagger": "", style: { "--d": `${i * stepMs}ms` } as CSSProperties };
}

/** Props for one step of a looping highlight that runs through `total` steps. */
export function sequence(i: number, total: number, glow?: string, stepS = 1) {
  return {
    className: "seq-glow",
    style: {
      "--i": i,
      "--step": `${stepS}s`,
      "--cycle": `${total * stepS}s`,
      ...(glow ? { "--glow": glow } : {}),
    } as CSSProperties,
  };
}

/** A vertical connector with a light travelling down it. */
export function FlowLine({ delayMs = 0, color }: { delayMs?: number; color?: string }) {
  return (
    <span
      aria-hidden
      className="flow-line mx-auto"
      style={{ "--d": `${delayMs}ms`, ...(color ? { "--flow": color } : {}) } as CSSProperties}
    />
  );
}
