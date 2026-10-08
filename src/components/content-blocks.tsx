import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { type CaseStudy, summary } from "@/content/profile";
import { Panel, Placeholder, Tag } from "@/components/ui";

export function CaseStudyCard({ study, expanded = false }: { study: CaseStudy; expanded?: boolean }) {
  const sections = expanded ? study.sections : study.sections.filter((s) => s.body);
  return (
    <Panel className="flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1">
      <p className="label">{study.context}</p>
      <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{study.title}</h3>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {study.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <dl className="mt-5 space-y-4">
        {sections.map((s) => (
          <div key={s.label}>
            <dt className="label">{s.label}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted">
              {s.body ?? <Placeholder>Add real {s.label.toLowerCase()} here</Placeholder>}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/** 30-second summary shown first in Recruiter mode. Facts only. */
export function RecruiterSummary() {
  const facts = [
    ["Role", `${siteConfig.role} · ${summary.years}`],
    ["Now", "Digidentity — digital identity (2025–present)"],
    ["Before", "Android Tech Lead, YpsoPump SDKs (Ypsomed, via InnoIT) · Vodafone · Unisys"],
    ["Security", "PKI, mTLS, certificate pinning, Keystore, digital signatures, passwordless login, DexGuard / R8"],
    ["AI / Agents", "Designed and runs an agentic SDLC: Claude Code, MCP (Jira, Figma, GitLab), on-device testing, human gates"],
    ["Location", `${siteConfig.location} · ${summary.eligibility}`],
    ["Availability", siteConfig.availability],
    ["Languages", summary.languages.join(" · ")],
  ];
  return (
    <Panel className="p-6 sm:p-8">
      <p className="label mb-5">At a glance</p>
      <dl className="grid gap-4">
        {facts.map(([k, v]) => (
          <div key={k} className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6">
            <dt className="font-mono text-xs tracking-[0.12em] text-faint">{k.toUpperCase()}</dt>
            <dd className="text-sm text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={siteConfig.cvPath}
          download
          className="rounded-sm bg-ink px-4 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-bg hover:bg-accent"
        >
          Download CV
        </a>
        <Link
          href="/contact"
          className="rounded-sm border border-line-strong px-4 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-ink hover:border-accent hover:text-accent"
        >
          Contact
        </Link>
      </div>
    </Panel>
  );
}

export function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-accent hover:text-ink">
      {children} <ArrowRight className="size-3.5" aria-hidden />
    </Link>
  );
}
