import Link from "next/link";
import type { CSSProperties } from "react";
import { ChevronRight, GitBranch } from "lucide-react";
import { Scramble } from "@/components/motion";
import { TypeText } from "@/components/type-text";
import { CompanyMarquee } from "@/components/company-marquee";


const LABEL = "SYSTEM_INITIALIZED // SENIOR_ANDROID_ENGINEER";
const TYPE_STEP = 18;
const LINES_START = 250 + LABEL.length * TYPE_STEP * 0.5;
const LINE_STEP = 140;

/** Hero with a boot sequence: label types, headline rises line by line, ANDROID decrypts, the spine starts. */
export function Hero() {
  const line = (i: number) => ({ "--d": `${LINES_START + i * LINE_STEP}ms` }) as CSSProperties;
  const after = LINES_START + 4 * LINE_STEP;

  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-10 pt-16 text-center sm:px-8">
        <p className="inline-block rounded-sm border border-line bg-surface px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-accent sm:text-xs">
          <TypeText text={LABEL} startMs={250} stepMs={TYPE_STEP} />
        </p>

        <h1
          id="hero-title"
          className="mt-10 font-mono text-[1.9rem] font-bold uppercase leading-none tracking-tighter text-ink sm:text-6xl lg:text-8xl"
        >
          <span className="line-mask">
            <span style={line(0)}>I BUILD SECURE</span>
          </span>
          <span className="line-mask">
            <span style={line(1)}>
              <Scramble text="ANDROID" delayMs={LINES_START + LINE_STEP} durationMs={1100} className="italic text-accent" />{" "}
              SYSTEMS —
            </span>
          </span>
          <span className="line-mask">
            <span style={line(2)}>AND THE AGENTS</span>
          </span>
          <span className="line-mask">
            <span style={line(3)}>THAT BUILD THEM.</span>
          </span>
        </h1>

        <div
          className="block-in mt-12 flex flex-wrap justify-center gap-4 sm:gap-8"
          style={{ "--d": `${after + 150}ms` } as CSSProperties}
        >
          <Link
            href="/engineering"
            className="group inline-flex items-center gap-4 rounded-sm border border-ink bg-ink px-8 py-4 font-mono text-sm font-bold uppercase tracking-[0.14em] text-bg transition-colors hover:border-accent hover:bg-accent hover:text-white sm:px-10 sm:py-5"
          >
            Explore engineering
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <Link
            href="/experience"
            className="inline-flex items-center gap-3 rounded-sm border border-line bg-surface px-8 py-4 font-mono text-sm uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent sm:px-10 sm:py-5"
          >
            <GitBranch className="size-4 text-accent" aria-hidden /> View experience
          </Link>
        </div>

        <div className="block-in mt-16" style={{ "--d": `${after + 300}ms` } as CSSProperties}>
          <CompanyMarquee size="lg" />
        </div>

        {/* The spine starts here and runs into the control plane below. */}
        <div
          aria-hidden
          className="spine-draw mx-auto mt-12 hidden h-24 w-px bg-gradient-to-b from-transparent to-accent lg:block"
          style={{ "--d": `${after + 400}ms` } as CSSProperties}
        />
      </div>
    </section>
  );
}
