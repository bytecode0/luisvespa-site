import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { appForRole, roles, summary } from "@/content/profile";
import { AppThumb } from "@/components/apps";
import { CompanyMarquee } from "@/components/company-marquee";
import { Portrait } from "@/components/portrait";
import { Spine } from "@/components/motion";
import { TypeText } from "@/components/type-text";
import { contactLinks } from "@/components/contact";
import { stagger } from "@/components/ui";

const careAbout = ["Android", "Security", "SDKs", "Identity", "Automation", "AI agents"];

/** Experience page: sticky portrait + bio, glass CV timeline with typed titles, company band. */
export function ExperienceProfile() {
  return (
    <section aria-labelledby="profile-name" className="psyche-bg border-t border-line pt-24 sm:pt-32">
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-16 lg:flex-row">
          {/* Left: portrait and bio */}
          <div className="lg:w-1/3">
            <div data-reveal data-sfx="type" data-sfx-length={10} className="lg:sticky lg:top-28">
              <div className="mx-auto mb-10 max-w-[280px] pr-4 lg:mx-0 lg:max-w-none">
                <Portrait />
              </div>
              <h2 id="profile-name" className="font-mono text-3xl font-bold text-ink">
                <TypeText text="LUIS VESPA" startMs={500} stepMs={60} />
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {summary.years} engineering secure, regulated mobile products — Android security, PKI and SDK
                architecture. Today I design an agentic SDLC that automates the repetitive and keeps engineers in
                charge of every decision.
              </p>
              <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="What I care about">
                {careAbout.map((c, i) => (
                  <li
                    key={c}
                    className="border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-ink/70"
                    {...stagger(i, 60)}
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-faint">
                <span className="font-mono text-accent">EXPLORING_NOW › </span>
                How AI agents can take part in the whole software lifecycle without sacrificing security, quality or
                engineering judgment.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {contactLinks().map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex h-9 items-center gap-1.5 border border-line px-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      {l.label}
                      {l.external ? <ArrowUpRight className="size-3.5" aria-hidden /> : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: glass CV timeline */}
          <div className="lg:w-2/3">
            <div id="experience" data-reveal data-sfx="type" data-sfx-length={19} className="glass-cv scroll-mt-24 p-7 sm:p-12">
              <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-mono text-2xl text-ink">
                  <TypeText text="EXPERIENCE_TIMELINE" startMs={300} stepMs={45} caret />
                </h3>
                <span className="border border-accent/25 bg-accent/10 px-3 py-1 font-mono text-[10px] text-accent">
                  TOTAL_EXP: 13Y+
                </span>
              </div>

              <ol className="relative space-y-14">
                <Spine className="spine-left" />
                {roles.map((r, i) => {
                  const current = i === 0;
                  return (
                    <li key={r.company} className="from-left relative pl-10" {...stagger(i, 110)}>
                      <span
                        aria-hidden
                        className={`ping-once absolute -left-2 top-1 size-4 rounded-full border-4 border-bg ${
                          current ? "bg-accent shadow-[0_0_15px_rgba(59,130,246,0.6)]" : "bg-line-strong"
                        }`}
                        style={{ "--d": `${i * 110}ms` } as CSSProperties}
                      />
                      {/* Each role title types out when the role scrolls into view. */}
                      <div
                        data-reveal
                        data-sfx="type"
                        data-sfx-length={r.title.length}
                        className="flex flex-col justify-between gap-2 md:flex-row md:items-center"
                      >
                        <h4 className="font-mono text-lg font-bold text-ink">
                          <TypeText text={r.title.toUpperCase()} startMs={150} stepMs={28} />
                        </h4>
                        <span
                          className={`self-start whitespace-nowrap px-2 py-1 font-mono text-xs md:self-auto ${
                            current ? "bg-accent/10 text-accent" : "text-faint"
                          }`}
                        >
                          {r.period.toUpperCase()}
                        </span>
                      </div>
                      <p
                        className={`mt-1 text-sm font-medium uppercase tracking-wider ${current ? "text-accent" : "text-faint"}`}
                      >
                        {r.company} / {r.domain}
                      </p>
                      <ul className={`mt-4 space-y-1.5 text-sm leading-relaxed ${current ? "text-muted" : "text-muted/80"}`}>
                        {r.points.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${r.company} keywords`}>
                        {r.tags.map((t) => (
                          <li
                            key={t}
                            className={`border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] transition-colors hover:border-accent/50 hover:text-ink ${
                              current ? "text-ink/70" : "text-ink/45"
                            }`}
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                      {appForRole(r.company) ? (
                        <div className="mt-6 flex items-end gap-4">
                          <AppThumb app={appForRole(r.company)!} />
                          <p className="pb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                            {appForRole(r.company)!.name}
                            <br />
                            Tap to view screens
                          </p>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ol>

            </div>
          </div>
        </div>
      </div>

      {/* Companies band: full screen width, below both columns. */}
      <div data-reveal className="relative z-10 mt-24 border-t border-white/5 bg-bg/30 py-12 backdrop-blur-sm">
        <CompanyMarquee size="lg" />
      </div>
    </section>
  );
}
