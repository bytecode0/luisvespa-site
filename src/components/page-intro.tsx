import { type CSSProperties, Fragment, type ReactNode } from "react";
import { Container } from "@/components/ui";
import { AgentMesh, type MeshVariant } from "@/components/agent-mesh";
import { Scramble } from "@/components/motion";
import { TypeText } from "@/components/type-text";

type Props = { label: string; title: string; variant?: MeshVariant; typed?: boolean; children?: ReactNode };

/** Page header: a mesh with the page's own character, and a title that resolves word by word. */
export function PageIntro({ label, title, variant = "quiet", typed = false, children }: Props) {
  const words = title.split(" ");
  return (
    <header className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <AgentMesh
        variant={variant}
        className="[mask-image:linear-gradient(to_right,rgba(0,0,0,0.25),black_60%),linear-gradient(to_bottom,black_60%,transparent)] [mask-composite:intersect]"
      />
      <Container className="relative pb-20 pt-16 sm:pb-28 sm:pt-28">
        <p className="label fade-up">
          <Scramble text={label.toUpperCase()} durationMs={700} />
        </p>
        <h1 className="mt-5 max-w-4xl font-mono text-3xl font-bold uppercase leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {typed ? (
            <TypeText text={title} startMs={300} stepMs={70} caret />
          ) : (
            words.map((w, i) => (
              <Fragment key={i}>
                <span className="word-in" style={{ "--d": `${80 + i * 70}ms` } as CSSProperties}>
                  {w}
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))
          )}
        </h1>
        {children ? (
          <div
            className="block-in mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
            style={{ "--d": `${typed ? 400 + title.length * 70 : 200 + words.length * 70}ms` } as CSSProperties}
          >
            {children}
          </div>
        ) : null}
      </Container>
    </header>
  );
}
