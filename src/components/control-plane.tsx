import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Bot, ChevronRight, Cpu, ShieldCheck, User } from "lucide-react";
import { pipeline, roles } from "@/content/profile";
import { Scramble, Spine } from "@/components/motion";
import { sequence, stagger } from "@/components/ui";
import { AgentTrace } from "@/components/agent-trace";

/* ---------- Building blocks ---------- */

function ModuleLabel({ children }: { children: string }) {
  return (
    <span className="font-mono text-[10px] tracking-[0.1em] text-accent">
      [ <Scramble text={children} trigger="view" durationMs={700} /> ]
    </span>
  );
}

/** A title that rises from behind a mask when its section is revealed. */
function RevealTitle({ id, children, className = "" }: { id?: string; children: string; className?: string }) {
  return (
    <h2 id={id} className={`reveal-title font-mono text-ink ${className}`}>
      <span>{children}</span>
    </h2>
  );
}

/** Glass card: border light on hover, slight 3D tilt towards the cursor. */
function TechCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`tech-card spotlight tilt group p-7 sm:p-8 ${className}`}>{children}</div>;
}

function OpenModule({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group/link mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent hover:text-ink"
    >
      {children}
      <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-1" aria-hidden />
    </Link>
  );
}

const iconMotion = "transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125";

/** A node on the spine. Lights up and pings when its module is in view. */
function SpineNode() {
  return (
    <div
      aria-hidden
      className="spine-node absolute left-1/2 top-1/2 z-20 hidden size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-line-strong bg-bg lg:flex"
    >
      <span className="size-2 rounded-full bg-accent" />
    </div>
  );
}

/**
 * Mobile/tablet version of the node: below lg the spine runs down the left gutter, so each module
 * gets a small node on it plus a short connector that draws out to the card.
 */
function MobileSpineNode() {
  return (
    <>
      <div
        aria-hidden
        className="spine-node absolute -left-[35px] top-[5.25rem] z-20 flex size-5 items-center justify-center rounded-full border-2 border-line-strong bg-bg lg:hidden"
      >
        <span className="size-1.5 rounded-full bg-accent" />
      </div>
      <span aria-hidden className="connector-mobile absolute -left-[15px] top-[calc(5.25rem+9.5px)] h-px w-[15px] lg:hidden" />
    </>
  );
}

/** Two columns around the spine. Each side enters from its own edge; connectors draw out from the node. */
function SpineModule({
  id,
  label,
  card,
  aside,
  reverse = false,
  sfx = "blip",
}: {
  id: string;
  label: string;
  card: ReactNode;
  aside: ReactNode;
  reverse?: boolean;
  sfx?: "blip" | "chord";
}) {
  const cardSide = reverse ? "enter-right" : "enter-left";
  const asideSide = reverse ? "enter-left" : "enter-right";
  return (
    <section id={id} aria-label={label} data-reveal data-sfx={sfx} className="relative z-10 py-16 lg:py-32">
      <span aria-hidden className="connector to-left hidden lg:block" />
      <span aria-hidden className="connector to-right hidden lg:block" />
      <MobileSpineNode />
      <div className={`items-center justify-between gap-16 lg:flex ${reverse ? "lg:flex-row-reverse" : ""}`}>
        <div className={`mb-10 lg:mb-0 lg:w-[45%] ${cardSide}`}>{card}</div>
        <SpineNode />
        <div className={`lg:w-[45%] ${asideSide}`} style={{ "--d": "180ms" } as CSSProperties}>
          {aside}
        </div>
      </div>
    </section>
  );
}

/* ---------- Modules ---------- */

const stackLines: { text: string; accent?: boolean; indent?: number }[] = [
  { text: "$ tree android_stack" },
  { text: "ANDROID_STACK", accent: true },
  { text: "├── SECURITY", indent: 1 },
  { text: "├── mTLS / PKI", indent: 2 },
  { text: "├── Keystore", indent: 2 },
  { text: "└── DexGuard / R8", indent: 2 },
  { text: "└── PLATFORM", indent: 1 },
  { text: "├── SDK core", indent: 2 },
  { text: "└── Compose UI", indent: 2 },
  { text: "AGENTIC_LAYER (MCP)", accent: true },
  { text: ">> Jira · Figma · GitLab" },
];

function EngineeringModule() {
  const items = ["Multi-layered modular architecture", "SDK development and lifecycles (Android + iOS)", "Performance profiling and optimization"];
  return (
    <SpineModule
      id="engineering"
      label="Engineering"
      card={
        <TechCard>
          <div className="mb-6 flex items-start justify-between">
            <ModuleLabel>MODULE: SYS_ARCH</ModuleLabel>
            <Cpu className={`size-4 text-accent/60 group-hover:text-accent ${iconMotion}`} aria-hidden />
          </div>
          <RevealTitle className="text-2xl">SYSTEM ARCHITECTURE</RevealTitle>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Resilient, modular Android apps and SDKs for regulated products — from secure storage and networking to
            Compose UI.
          </p>
          <ul className="mt-6 space-y-2.5 font-mono text-[11px] text-muted">
            {items.map((item, i) => (
              <li key={item} className="flex items-center gap-2" {...stagger(i + 2, 110)}>
                <ChevronRight className="size-3 text-accent" aria-hidden /> {item}
              </li>
            ))}
          </ul>
          <OpenModule href="/engineering">Open module</OpenModule>
        </TechCard>
      }
      aside={
        <div>
          <p className="label mb-4">Visualizing the stack</p>
          <div className="relative overflow-hidden border border-line bg-surface-2 p-6 font-mono text-[12px] leading-relaxed text-ink/80">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)]" />
            <div className="relative" aria-label="Android stack: security (mTLS / PKI, Keystore, DexGuard / R8), platform (SDK core, Compose UI), agentic layer over MCP (Jira, Figma, GitLab)">
              {stackLines.map((l, i) => (
                <p
                  key={l.text}
                  aria-hidden
                  className={`term-line ${l.accent ? "text-accent" : i === 0 ? "text-faint" : ""} ${i === stackLines.length - 1 ? "text-[10px] text-muted" : ""}`}
                  style={{ "--d": `${500 + i * 110}ms`, paddingLeft: `${(l.indent ?? 0) * 1}rem` } as CSSProperties}
                >
                  {l.text}
                  {i === stackLines.length - 1 ? <span className="caret" /> : null}
                </p>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}

const securitySteps = [
  { code: "01_IDENTITY", name: "PKI / mTLS", detail: "Mutual trust between client and server, proven with certificates." },
  { code: "02_STORAGE", name: "ANDROID KEYSTORE", detail: "Hardware-backed protection for keys that never leave the device." },
  { code: "03_CODE", name: "DEXGUARD / R8", detail: "Obfuscation and hardening that raise the cost of reverse engineering." },
  { code: "04_RELEASE", name: "SIGNED RELEASE", detail: "Cryptographically verified production builds." },
];

function SecurityModule() {
  return (
    <section id="security" aria-labelledby="security-title" data-reveal data-sfx="blip" className="relative z-10 py-16 lg:py-32">
      <MobileSpineNode />
      <div className="relative mx-auto mb-14 max-w-md bg-bg py-2 text-center">
        <ShieldCheck className="mx-auto mb-4 size-5 text-accent" aria-hidden />
        <RevealTitle id="security-title" className="text-3xl">
          SECURITY PIPELINE
        </RevealTitle>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          <Scramble text="DEFENSE IN DEPTH FOR ANDROID" trigger="view" delayMs={300} />
        </p>
      </div>

      {/* The bus: a packet crosses the four stages; each stage lights up as it passes. */}
      <div aria-hidden className="relative mb-4 hidden h-px bg-line lg:block">
        <span className="bus-packet" />
      </div>
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {securitySteps.map((s, i) => {
          const seq = sequence(i, securitySteps.length);
          return (
            <li key={s.code} {...stagger(i, 110)}>
              <div
                style={seq.style}
                className={`${seq.className} tech-card spotlight tilt group h-full p-6 ${i === 3 ? "border-accent/60" : ""}`}
              >
                <p className="font-mono text-[10px] text-accent">{s.code}</p>
                <h3 className="mt-2 font-mono text-sm text-ink">{s.name}</h3>
                <p className="mt-3 text-xs leading-relaxed text-muted transition-colors group-hover:text-ink">{s.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mx-auto mt-8 max-w-2xl bg-bg py-1 text-center text-sm text-muted">
        In production: a PKI and mTLS channel to a medical device (Ypsomed), and X.509 signatures with DexGuard
        hardening for digital identity (Digidentity).
      </p>
      <div className="text-center">
        <OpenModule href="/security">Open module</OpenModule>
      </div>
    </section>
  );
}

function AgentsModule() {
  return (
    <SpineModule
      id="agents"
      label="AI agents"
      reverse
      sfx="chord"
      card={
        <TechCard className="border-accent/50">
          <div className="mb-6 flex items-start justify-between">
            <ModuleLabel>MODULE: AGENT_ORCH</ModuleLabel>
            <Bot className={`size-4 text-accent ${iconMotion}`} aria-hidden />
          </div>
          <RevealTitle className="text-2xl">AGENTIC SDLC</RevealTitle>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            The pipeline I designed and run at Digidentity: a Jira ticket goes in, a reviewed merge request comes out.
            Tested on emulators and physical devices.
          </p>
          <div className="mt-6 space-y-3">
            <div className="border border-line bg-bg/50 p-3 transition-colors hover:border-accent/60" {...stagger(2)}>
              <p className="font-mono text-[10px] italic text-ink/60">Agents: Claude Code</p>
              <p className="mt-1 text-[11px] text-muted">Connected to Jira, Figma and GitLab through MCP servers.</p>
            </div>
            <div className="border border-human/30 bg-human-soft p-3 transition-colors hover:border-human/70" {...stagger(3)}>
              <p className="font-mono text-[10px] italic text-human">Human gates: 2</p>
              <p className="mt-1 text-[11px] text-muted">Engineers approve the plan before coding and the merge before it lands.</p>
            </div>
          </div>
          <OpenModule href="/agents">Open module</OpenModule>
        </TechCard>
      }
      aside={
        <div className="border border-line bg-surface-2 p-6 sm:p-8">
          <ol className="flex flex-col items-center gap-2 text-center font-mono text-[11px]">
            <li className="text-ink/40">JIRA TICKET</li>
            {pipeline.map((stage, i) => {
              const human = stage.actor === "human";
              const seq = sequence(i, pipeline.length, human ? "var(--human)" : undefined, 0.9);
              return (
                <li key={stage.id} className="flex w-full flex-col items-center gap-2" {...stagger(i, 90)}>
                  <span aria-hidden className="flow-line" style={{ height: "1rem", "--d": `${i * 300}ms` } as CSSProperties} />
                  <span
                    style={seq.style}
                    className={`${seq.className} inline-flex items-center gap-2 border px-4 py-2 ${
                      human ? "border-human/50 text-human" : "border-line text-ink"
                    }`}
                  >
                    {human ? <User className="size-3" aria-hidden /> : <Bot className="size-3 text-accent" aria-hidden />}
                    {stage.name.toUpperCase()}
                  </span>
                </li>
              );
            })}
            <li className="flex flex-col items-center gap-2">
              <span aria-hidden className="flow-line" style={{ height: "1rem" }} />
              <span className="font-bold text-ink/50">MERGE REQUEST</span>
            </li>
          </ol>
        </div>
      }
    />
  );
}

/* ---------- The control plane ---------- */

/** Home: modules hanging off a vertical spine that fills as you read. */
export function ControlPlane() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      {/* Below lg the modules leave a left gutter for the spine; from lg up it runs down the centre. */}
      <div className="relative pl-9 lg:pl-0">
      <Spine className="spine-responsive" />
      <EngineeringModule />
      <SecurityModule />
      <AgentsModule />
      <div className="view-only-deep relative z-10 pb-16">
        <AgentTrace />
      </div>
      </div>
    </div>
  );
}

export function ExperienceLog() {
  const recent = roles.slice(0, 4);
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-t border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div data-reveal className="mb-14 flex items-center gap-4">
          <RevealTitle id="experience-title" className="text-3xl">
            EXPERIENCE_LOG
          </RevealTitle>
          <div className="h-px flex-1 origin-left bg-line" />
        </div>
        {/* The timeline line fills with the reader's progress, like the spine. */}
        <ol data-reveal className="relative space-y-12">
          <Spine className="spine-left" />
          {recent.map((r, i) => (
            <li key={r.company} className="from-left relative pl-8" {...stagger(i, 140)}>
              <span
                aria-hidden
                className={`ping-once absolute -left-1 top-0.5 size-[9px] rounded-full ${i === 0 ? "bg-accent" : "bg-line-strong"}`}
                style={{ "--d": `${i * 140}ms` } as CSSProperties}
              />
              <p className={`font-mono text-xs ${i === 0 ? "text-accent" : "text-faint"}`}>{r.period.toUpperCase()}</p>
              <h3 className="mt-1 text-xl font-semibold text-ink">
                {r.title.toUpperCase()} <span className="font-normal text-muted">· {r.company}</span>
              </h3>
              <ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted">
                {r.points.slice(0, 2).map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div data-reveal>
          <OpenModule href="/experience#experience">Full experience</OpenModule>
        </div>
      </div>
    </section>
  );
}
