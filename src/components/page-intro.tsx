import Image from "next/image";
import { type CSSProperties, Fragment, type ReactNode } from "react";
import { Container } from "@/components/ui";
import { Scramble } from "@/components/motion";
import { TypeText } from "@/components/type-text";

type Props = {
  label: string;
  title: string;
  typed?: boolean;
  /** Category key visual: the header becomes a tall, centred "detailed spec" banner over the image. */
  visual?: { src: string; alt: string };
  children?: ReactNode;
};

/** Page header: dot grid and a title that resolves word by word (the animated mesh is site-wide, see GlobalMesh). */
export function PageIntro({ label, title, typed = false, visual, children }: Props) {
  const words = title.split(" ");
  if (visual)
    return (
      <VisualIntro label={label} title={title} visual={visual}>
        {children}
      </VisualIntro>
    );
  return (
    <header className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
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

/** Banner header over a category key visual, with a scan line sweeping it on load (Control Plane design). */
function VisualIntro({
  label,
  title,
  visual,
  children,
}: {
  label: string;
  title: string;
  visual: { src: string; alt: string };
  children?: ReactNode;
}) {
  const words = title.split(" ");
  return (
    <header className="relative flex min-h-[60vh] items-center overflow-hidden border-b border-line">
      <Image src={visual.src} alt={visual.alt} fill priority sizes="100vw" className="object-cover opacity-40 grayscale" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-bg via-bg/40 to-bg" />
      <span aria-hidden className="scan-line scan-now" />
      <Container className="relative py-24 text-center">
        <p className="label fade-up text-accent">
          <Scramble text={label.toUpperCase()} durationMs={700} />
        </p>
        <h1 className="mx-auto mt-6 max-w-5xl font-mono text-4xl font-bold uppercase leading-none tracking-tighter text-ink sm:text-6xl lg:text-8xl">
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className="word-in" style={{ "--d": `${120 + i * 90}ms` } as CSSProperties}>
                {w}
              </span>
              {i < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h1>
        {children ? (
          <div
            className="block-in mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
            style={{ "--d": `${300 + words.length * 90}ms` } as CSSProperties}
          >
            {children}
          </div>
        ) : null}
      </Container>
    </header>
  );
}
