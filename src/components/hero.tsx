import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, FileText } from "lucide-react";
import { siteConfig } from "@/config/site";
import { AgentMesh } from "@/components/agent-mesh";
import { Scramble } from "@/components/motion";
import { TypeText } from "@/components/type-text";

/** Plain-text, monochrome company names: recognisable without using anyone's trademarks. */
const companies = ["Digidentity", "Ypsomed (via InnoIT)", "Vodafone", "Unisys", "EVO Banco", "Wallbox"];

const LABEL = "SENIOR ANDROID ENGINEER // SECURITY & SDKs // AI AGENTS";
const TYPE_STEP = 18;
const LINES_START = 250 + LABEL.length * TYPE_STEP * 0.5;
const LINE_STEP = 140;

/** Hero with a boot sequence: label types, headline rises line by line, ANDROID decrypts, the spine starts. */
export function Hero() {
  const line = (i: number) => ({ "--d": `${LINES_START + i * LINE_STEP}ms` }) as CSSProperties;
  const after = LINES_START + 4 * LINE_STEP;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <AgentMesh className="[mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,0.25)_25%,black_75%),linear-gradient(to_bottom,black_70%,transparent)] [mask-composite:intersect]" />
      <div className="relative mx-auto max-w-5xl px-5 pb-10 pt-20 text-center sm:px-8 sm:pt-28 lg:pt-32">
        <p className="inline-block border-b border-accent pb-1 font-mono text-[10px] tracking-[0.2em] text-accent sm:text-xs">
          <TypeText text={LABEL} startMs={250} stepMs={TYPE_STEP} />
        </p>

        <h1
          id="hero-title"
          className="mt-8 font-mono text-[1.9rem] font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-7xl"
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

        <p
          className="block-in mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          style={{ "--d": `${after}ms` } as CSSProperties}
        >
          High-stakes Android architecture, application hardening and an end-to-end agentic SDLC — with engineers
          approving every plan and every merge.
        </p>

        <div
          className="block-in mt-10 flex flex-wrap justify-center gap-4"
          style={{ "--d": `${after + 150}ms` } as CSSProperties}
        >
          <Link
            href="/engineering"
            className="group inline-flex items-center gap-2 border border-ink bg-ink px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:border-accent hover:bg-accent hover:text-white"
          >
            Explore engineering
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <a
            href={siteConfig.cvPath}
            download
            className="inline-flex items-center gap-2 border border-line bg-surface-2 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.08em] text-ink transition-colors hover:border-accent"
          >
            <FileText className="size-4 text-accent" aria-hidden /> Download CV
          </a>
        </div>

        <div className="block-in mt-14" style={{ "--d": `${after + 300}ms` } as CSSProperties}>
          <p className="label">Worked with</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs tracking-[0.06em] text-muted">
            {companies.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
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
