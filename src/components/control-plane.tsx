import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Bot, Cpu, MapPin, ShieldCheck } from "lucide-react";
import { appForRole, roles } from "@/content/profile";
import { Scramble, Spine } from "@/components/motion";
import { stagger } from "@/components/ui";
import { KeyVisual } from "@/components/key-visual";
import { AppThumb } from "@/components/apps";
import { Portrait } from "@/components/portrait";
import { AgentTrace } from "@/components/agent-trace";

/* ---------- Building blocks ---------- */

/** Node on the spine at the top edge of a section; lights up and pings when the section is in view. */
function TopNode() {
  return (
    <span
      aria-hidden
      className="spine-node absolute left-1/2 top-0 z-20 block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-bg"
    />
  );
}

function ModuleLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group/link inline-flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-accent transition-colors hover:text-accent-bright"
    >
      [ {children} ] <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-2" aria-hidden />
    </Link>
  );
}

type ModuleProps = {
  id: string;
  n: string;
  visual: { src: string; alt: string; label: string };
  moduleLabel: string;
  icon: ReactNode;
  cardTitle: string;
  cardText: string;
  bullets: string[];
  title: [string, string];
  text: string;
  link: { href: string; label: string };
  visualSide: "left" | "right";
  sfx?: "blip" | "chord";
};

/** Control Plane module: a glass card with the category key visual on one side, the statement on the other. */
function VisualModule(m: ModuleProps) {
  const cardLeft = m.visualSide === "left";
  return (
    <section id={m.id} aria-labelledby={`${m.id}-title`} data-reveal data-sfx={m.sfx ?? "blip"} className="relative z-10 py-24 lg:py-40">
      <TopNode />
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
        {/* The card */}
        <div className={`relative order-2 ${cardLeft ? "enter-left lg:order-1" : "enter-right lg:order-2"}`}>
          <div className="glass-cv tech-card spotlight group relative p-4">
            <KeyVisual {...m.visual} className="mb-8" />
            <div className="px-4 pb-4">
              <div className="mb-6 flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  [ <Scramble text={m.moduleLabel} trigger="view" durationMs={700} /> ]
                </span>
                <span className="text-line-strong transition-colors group-hover:text-accent">{m.icon}</span>
              </div>
              <h3 className="mb-6 font-mono text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">{m.cardTitle}</h3>
              <p className="mb-8 text-sm leading-relaxed text-muted">{m.cardText}</p>
              <ul className="grid grid-cols-1 gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-faint sm:grid-cols-2">
                {m.bullets.map((b, i) => (
                  <li key={b} className="flex items-center gap-2" {...stagger(i + 2, 90)}>
                    <span aria-hidden className="size-1 bg-accent" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* The statement (opaque on mobile so the spine passes behind it) */}
        <div
          className={`relative order-1 space-y-8 bg-bg py-2 lg:bg-transparent ${cardLeft ? "enter-right lg:order-2" : "enter-left lg:order-1"}`}
          style={{ "--d": "150ms" } as CSSProperties}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-muted">SYSTEM / {m.n}</p>
          <h2 id={`${m.id}-title`} className="reveal-title font-mono text-4xl font-bold uppercase leading-[1.05] tracking-tighter text-ink lg:text-6xl">
            <span>
              {m.title[0]}
              <br />
              {m.title[1]}
            </span>
          </h2>
          <p className="max-w-md text-lg text-muted">{m.text}</p>
          <div className="pt-4">
            <ModuleLink href={m.link.href}>{m.link.label}</ModuleLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- The control plane ---------- */

/** Home: modules hanging off the central spine (apps are shown in the experience log below). */
export function ControlPlane() {
  return (
    <>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Spine />
        <VisualModule
          id="engineering"
          n="01"
          visual={{ src: "/visuals/engineering.jpg", alt: "Glowing Android robot outline between circuit traces", label: "SYSTEM / 01_CORE" }}
          moduleLabel="MODULE: SYS_ARCH"
          icon={<Cpu className="size-4" aria-hidden />}
          cardTitle="ENGINEERING_STACK"
          cardText="Android engineering for regulated products: modular apps and SDKs in Kotlin and Jetpack Compose, built with TDD, XP practices and CI/CD."
          bullets={["SDK_DEVELOPMENT", "MODULAR_SYSTEMS", "CI_CD_PIPELINES", "PERFORMANCE_PROFILING"]}
          title={["Architectural", "Integrity"]}
          text="Foundations that hold up in regulated products — from Android and iOS SDK lifecycles to Compose UI and performance profiling."
          link={{ href: "/engineering", label: "DETAILED_SPECS" }}
          visualSide="left"
        />

        <VisualModule
          id="security"
          n="02"
          visual={{ src: "/visuals/security.jpg", alt: "Glowing padlock inside concentric security rings and circuit traces", label: "SYSTEM / 02_SECURITY" }}
          moduleLabel="MODULE: HARDENING"
          icon={<ShieldCheck className="size-4" aria-hidden />}
          cardTitle="SECURITY_ENGINEERING"
          cardText="PKI and certificate-based mTLS for a medical device channel (Ypsomed); X.509 signatures, passwordless login and DexGuard hardening for digital identity (Digidentity)."
          bullets={["PKI_X509", "mTLS_CHANNELS", "DEXGUARD_R8", "ANDROID_KEYSTORE"]}
          title={["Defense in", "Depth"]}
          text="Hardening Android apps against reverse engineering, and building trust with certificates, mTLS, pinning and the Android Keystore."
          link={{ href: "/security", label: "SECURITY_PROTOCOLS" }}
          visualSide="right"
        />
        <VisualModule
          id="agents"
          n="03"
          visual={{ src: "/visuals/agents.jpg", alt: "Network of glowing interconnected nodes", label: "SYSTEM / 03_AGENTS" }}
          moduleLabel="MODULE: AGENTIC_SDLC"
          icon={<Bot className="size-4" aria-hidden />}
          cardTitle="AGENT_ORCHESTRATION"
          cardText="Claude Code agents connected to Jira, Figma and GitLab through MCP: they refine, develop, test on emulators and physical devices, and review — with two human approval gates."
          bullets={["MCP_SERVERS", "AGENTIC_SDLC", "ON_DEVICE_TESTING", "HUMAN_GATES"]}
          title={["Intelligent", "Automation"]}
          text="A pipeline that takes a Jira ticket to a reviewed merge request, with engineers approving the plan and the merge."
          link={{ href: "/agents", label: "AGENT_CAPABILITIES" }}
          visualSide="left"
          sfx="chord"
        />
        <div className="view-only-deep relative z-10 pb-16">
          <AgentTrace />
        </div>
      </div>
    </>
  );
}

/* ---------- Experience on the home page ---------- */

const token = (t: string) => t.toUpperCase().replace(/[^A-Z0-9+]+/g, "_").replace(/^_|_$/g, "");

export function ExperienceLog() {
  const recent = roles.slice(0, 4);
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative border-t border-line py-24 lg:py-40">
      <TopNode />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div data-reveal className="mb-20 text-center">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
            <Scramble text="EXPERIENCE_LOG / 04" trigger="view" />
          </p>
          <h2 id="experience-title" className="reveal-title font-mono text-4xl font-bold uppercase tracking-tighter text-ink lg:text-6xl">
            <span>Track Record</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Sticky portrait */}
          <div className="lg:col-span-4">
            <div data-reveal className="space-y-6 lg:sticky lg:top-28">
              <div className="mx-auto max-w-[320px] lg:max-w-none">
                <Portrait variant="inset" />
              </div>
              <div>
                <h3 className="font-mono text-2xl font-bold uppercase tracking-tight text-ink">Luis Vespa</h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted">Senior Android Engineer</p>
                <p className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  <MapPin className="size-3 text-accent" aria-hidden /> Madrid // EU
                </p>
              </div>
            </div>
          </div>

          {/* Glass role cards */}
          <ol className="space-y-8 lg:col-span-8">
            {recent.map((r, i) => {
              const app = appForRole(r.company);
              return (
                <li key={r.company} data-reveal style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                  <article className="glass-cv tech-card spotlight group p-6 sm:p-8">
                    <div className="flex flex-col items-start gap-8 md:flex-row">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h3 className="font-mono text-lg font-bold uppercase text-ink sm:text-xl">{r.title}</h3>
                          <span className={`px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${i === 0 ? "bg-accent/10 text-accent" : "text-faint"}`}>
                            {r.period}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">[ {r.company} ]</p>
                        <p className="text-sm leading-relaxed text-muted">{r.points[0]}</p>
                        <ul className="space-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                          {r.tags.slice(0, 4).map((t) => (
                            <li key={t}>— {token(t)}</li>
                          ))}
                        </ul>
                      </div>
                      {app ? <AppThumb app={app} /> : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
        <div data-reveal className="mt-14 text-center">
          <ModuleLink href="/experience">FULL_EXPERIENCE</ModuleLink>
        </div>
      </div>
    </section>
  );
}
