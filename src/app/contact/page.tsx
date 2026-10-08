import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PageTransition } from "@/components/page-transition";
import { Portrait } from "@/components/portrait";
import { ContactForm } from "@/components/contact-form";
import { ContactChannels } from "@/components/contact-channels";
import { TypeText } from "@/components/type-text";
import { Scramble } from "@/components/motion";
import { siteConfig } from "@/config/site";
import { summary } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Luis Vespa, Senior Android Engineer in Madrid: send a message, email, LinkedIn or WhatsApp.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageTransition>
      <PageIntro typed label="Contact / 05" title="Get in touch.">
        Android platforms, secure systems, developer tooling, agentic engineering — tell me what you&rsquo;re
        building. The form goes straight to my inbox; you don&rsquo;t need to leave this page.
      </PageIntro>

      <section aria-labelledby="contact-name" className="psyche-bg border-t border-line py-20 sm:py-28">
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-14 lg:flex-row">
            {/* Left: who you're writing to */}
            <div className="lg:w-1/3">
              <div data-reveal data-sfx="type" data-sfx-length={10} className="lg:sticky lg:top-28">
                <div className="mx-auto mb-8 max-w-[320px] lg:mx-0 lg:max-w-none">
                  <Portrait variant="inset" />
                </div>
                <h2 id="contact-name" className="font-mono text-2xl font-bold tracking-tight text-ink">
                  <TypeText text="LUIS VESPA" startMs={500} stepMs={60} />
                </h2>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {`${siteConfig.role} // Mobile security`}
                </p>
                <dl className="mt-6 space-y-3 font-mono text-[10px]">
                  {[
                    ["LOCATION", "MADRID // EU"],
                    ["ELIGIBILITY", summary.eligibility.toUpperCase()],
                    ["LANGUAGES", summary.languages.join(" · ").toUpperCase()],
                    ["AVAILABILITY", siteConfig.availability.toUpperCase()],
                  ].map(([k, v]) => (
                    <div key={k} className={`flex justify-between gap-4 ${k === "AVAILABILITY" ? "pt-2" : "border-b border-line/50 pb-2"}`}>
                      <dt className="text-faint">{k}</dt>
                      <dd className={`text-right ${k === "AVAILABILITY" ? "font-bold text-accent" : "text-muted"}`}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Right: the form and the direct channels */}
            <div className="space-y-6 lg:w-2/3">
              <div data-reveal data-sfx="type" data-sfx-length={12} className="glass-cv tech-card p-7 sm:p-8">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] text-accent">
                      [ <Scramble text="MODULE: SEND_MESSAGE" trigger="view" durationMs={700} /> ]
                    </span>
                    <h2 className="font-mono text-sm font-bold uppercase tracking-[0.14em] text-ink">
                      <TypeText text="Send message" startMs={300} stepMs={50} />
                    </h2>
                  </div>
                  <span className="rounded-sm border border-line bg-surface-2 px-2 py-1 font-mono text-[9px] text-muted">
                    DIRECT TO INBOX
                  </span>
                </div>
                <ContactForm />
              </div>

              <div data-reveal className="glass-cv tech-card p-7 sm:p-8">
                <div className="mb-8 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[10px] text-accent">
                    [ <Scramble text="MODULE: DIRECT_ACCESS" trigger="view" durationMs={700} /> ]
                  </span>
                  <h2 className="font-mono text-sm font-bold uppercase tracking-[0.14em] text-ink">Or reach me directly</h2>
                </div>
                <ContactChannels />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
