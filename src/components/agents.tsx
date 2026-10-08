import { ArrowRight, User, Bot } from "lucide-react";
import { agentBoundaries, mcpConnections, pipeline } from "@/content/profile";
import { FlowLine, Panel, Tag, sequence, stagger } from "@/components/ui";

/** The real pipeline running at Digidentity: six stages, two human gates. */
export function AgenticPipeline() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone="accent">IN USE · DIGIDENTITY · 2026</Tag>
        <Tag>CLAUDE CODE</Tag>
        <Tag>MCP · JIRA · FIGMA · GITLAB</Tag>
      </div>
      <ol className="grid gap-3 lg:grid-cols-6" aria-label="Agentic SDLC stages">
        {pipeline.map((stage, i) => {
          const human = stage.actor === "human";
          const seq = sequence(i, pipeline.length, human ? "var(--human)" : undefined, 1.1);
          return (
            <li key={stage.id} className="relative" {...stagger(i)}>
              <div
                style={seq.style}
                className={`${seq.className} flex h-full flex-col rounded-sm border p-4 transition-transform duration-300 hover:-translate-y-0.5 ${
                  human ? "border-human/50 bg-human-soft" : "border-line bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-faint">{stage.n}</span>
                  {human ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-human">
                      <User className="size-3" aria-hidden /> HUMAN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-accent">
                      <Bot className="size-3" aria-hidden /> AGENT
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm font-medium text-ink">{stage.name}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{stage.detail}</p>
              </div>
              {i < pipeline.length - 1 ? (
                <>
                  <ArrowRight className="nudge-x absolute -right-3 top-1/2 z-10 hidden size-4 -translate-y-1/2 text-faint lg:block" aria-hidden />
                  <span className="my-1 block lg:hidden">
                    <FlowLine delayMs={i * 200} />
                  </span>
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="grid gap-3 lg:grid-cols-6">
        <div className="rounded-sm border border-dashed border-line-strong p-4 lg:col-span-6">
          <p className="label">Runtime</p>
          <p className="mt-2 text-sm text-muted">
            A dedicated server with <span className="text-ink">Android emulators</span> and{" "}
            <span className="text-ink">physical devices</span>. Agents reach Jira, Figma and GitLab through MCP
            servers. Engineers approve the plan before coding and the merge request before it lands.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Agent → MCP → tools → systems, separating what is connected today from what is being explored. */
export function McpArchitecture() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <Panel className="p-6">
        <ol className="flex flex-col items-stretch gap-1 font-mono text-xs tracking-[0.12em]">
          {["AGENT", "MCP", "TOOLS", "SYSTEMS"].map((s, i, all) => (
            <li key={s} className="flex flex-col items-center">
              <span
                className={`w-full rounded-sm border px-4 py-3 text-center ${
                  s === "MCP" ? "border-accent bg-accent-soft text-ink" : "border-line text-muted"
                }`}
              >
                {s}
              </span>
              {i < all.length - 1 ? <FlowLine delayMs={i * 400} /> : null}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          Agents become useful when they can safely interact with real engineering systems. MCP gives them those
          capabilities through explicit, reviewable interfaces.
        </p>
      </Panel>
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel className="p-6">
          <p className="label mb-4">Connected via MCP</p>
          <ul className="space-y-3">
            {mcpConnections.connected.map((c, i) => (
              <li key={c.name} {...stagger(i)} className="flex items-baseline justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                <span className="font-mono text-sm text-ink">{c.name}</span>
                <span className="text-right text-xs text-muted">{c.role}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel className="p-6">
          <p className="label mb-4">Test environment</p>
          <ul className="space-y-3">
            {mcpConnections.environment.map((c, i) => (
              <li key={c.name} {...stagger(i + 3)} className="flex items-baseline justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                <span className="font-mono text-sm text-ink">{c.name}</span>
                <span className="text-right text-xs text-muted">{c.role}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <div className="rounded-sm border border-dashed border-line-strong p-6 sm:col-span-2">
          <p className="label mb-3">Exploring next</p>
          <ul className="flex flex-wrap gap-2">
            {mcpConnections.exploring.map((e, i) => (
              <li key={e} {...stagger(i + 5, 50)} className="rounded-md border border-line px-3 py-1.5 font-mono text-xs text-faint">
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Controls that constrain an agent before anything executes. */
export function AgentBoundaries() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <Panel className="p-6">
        <p className="font-mono text-xs tracking-[0.14em] text-ink">AGENT</p>
        <ul className="mt-3 border-l border-line-strong pl-5">
          {agentBoundaries.map((b, i) => (
            <li key={b.name} className="relative py-2.5" {...stagger(i, 90)}>
              <span aria-hidden className="absolute -left-5 top-[1.15rem] h-px w-4 bg-line-strong" />
              <p className="font-mono text-xs tracking-[0.12em] text-accent">{b.name.toUpperCase()}</p>
              <p className="mt-1 text-sm text-muted">{b.detail}</p>
            </li>
          ))}
        </ul>
      </Panel>
      <ol className="flex flex-col items-stretch font-mono text-xs tracking-[0.12em]">
        {[
          { s: "EXECUTION", t: "Agent acts within its permissions" },
          { s: "VALIDATION", t: "Deterministic checks: build, tests, devices" },
          { s: "HUMAN APPROVAL", t: "An engineer accepts or rejects" },
        ].map((x, i, all) => (
          <li key={x.s} className="flex flex-col items-center">
            <div
              className={`w-full rounded-sm border p-4 ${
                x.s === "HUMAN APPROVAL" ? "border-human/50 bg-human-soft text-ink" : "border-line bg-surface text-ink"
              }`}
            >
              {x.s}
              <p className="mt-1 font-sans text-xs tracking-normal text-muted">{x.t}</p>
            </div>
            {i < all.length - 1 ? <FlowLine delayMs={i * 500} color={i === 1 ? "var(--human)" : undefined} /> : null}
          </li>
        ))}
        <li className="mt-4 font-sans text-sm tracking-normal text-muted">
          Also: auditability, traceability, rollback and explicit failure handling. This is what separates agentic
          engineering from vibe coding.
        </li>
      </ol>
    </div>
  );
}

const directionRoles = ["Product agent", "Architect agent", "Feature agent", "Test agent", "Security agent", "Review agent", "Docs agent"];

/** Where the system could go next. Clearly labelled as exploration, not as something in production. */
export function AgentDirection() {
  return (
    <div className="rounded-sm border border-dashed border-line-strong p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Tag>DIRECTION · EXPLORING</Tag>
        <span className="text-xs text-faint">Not in production. A model for where the pipeline could go.</span>
      </div>
      <div className="mt-6 flex flex-col items-center gap-1.5 font-mono text-xs tracking-[0.12em] text-muted">
        <span className="rounded-sm border border-human/50 bg-human-soft px-4 py-2 text-ink">HUMAN INTENT</span>
        <FlowLine />
        <ul className="flex flex-wrap justify-center gap-2">
          {directionRoles.map((r, i) => (
            <li key={r} className="rounded-sm border border-line px-3 py-2" {...stagger(i, 60)}>
              {r.toUpperCase()}
            </li>
          ))}
        </ul>
        <FlowLine />
        <span className="rounded-sm border border-accent/50 bg-accent-soft px-4 py-2 text-ink">MCP · TOOLS</span>
        <FlowLine />
        <span className="rounded-sm border border-line px-4 py-2">BUILD / TEST → SECURITY GATE → EVALUATION</span>
        <FlowLine />
        <span className="rounded-sm border border-human/50 bg-human-soft px-4 py-2 text-ink">HUMAN APPROVAL → RELEASE</span>
      </div>
    </div>
  );
}
