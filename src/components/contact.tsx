import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { isPlaceholder, siteConfig } from "@/config/site";
import { Container } from "@/components/ui";
import { Scramble } from "@/components/motion";
import { Monogram, TypeText } from "@/components/type-text";

/** Real contact links only: entries still holding a placeholder in src/config/site.ts are hidden. */
export function contactLinks() {
  return [
    { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}`, external: false },
    { label: "LinkedIn", value: "LinkedIn", href: siteConfig.linkedin, external: true },
    { label: "GitHub", value: "GitHub", href: siteConfig.github, external: true },
  ].filter((l) => !isPlaceholder(l.href.replace("mailto:", "")));
}

export function ContactSection(props: React.ComponentProps<"section">) {
  const lines = ["Android platforms.", "Secure systems.", "Developer tooling.", "Agentic engineering."];
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden border-t border-line py-24 sm:py-32"
      {...props}
    >
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative">
        <div data-reveal>
          <p className="label mb-6">
            <Scramble text="CONTACT / 08" trigger="view" />
          </p>
          <h2 id="contact-title" className="reveal-title max-w-3xl font-mono text-3xl font-bold text-ink sm:text-5xl">
            <span>LET&rsquo;S BUILD SOMETHING DIFFICULT.</span>
          </h2>
          <ul className="mt-8 space-y-1 font-mono text-sm text-muted">
            {lines.map((l, i) => (
              <li key={l} className="term-line" style={{ "--d": `${400 + i * 160}ms` } as CSSProperties}>
                <span className="text-accent">›</span> {l}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-accent px-6 py-3.5 font-mono text-xs uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent-bright"
            >
              <Mail className="size-4 transition-transform group-hover:-rotate-12" aria-hidden /> Get in touch
            </Link>
            <a
              href={siteConfig.cvPath}
              download
              className="group inline-flex items-center gap-2 border border-line-strong px-6 py-3.5 font-mono text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Download className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden /> Download CV
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

const footerNav = [
  { href: "/engineering", label: "Engineering" },
  { href: "/security", label: "Security" },
  { href: "/agents", label: "AI Agents" },
  { href: "/work", label: "Selected work" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

function buildDate() {
  const d = new Date();
  return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(d.getUTCDate()).padStart(2, "0")}`;
}

/** Footer from the Control Plane design, with real data only. Status rows type out when the footer appears. */
export function SiteFooter() {
  const status = [
    { k: "LOCATION", v: "MADRID // EU", accent: false },
    { k: "AVAILABILITY", v: siteConfig.availability.toUpperCase(), accent: true },
    { k: "LAST_UPDATE", v: buildDate(), accent: false },
  ];
  return (
    <footer className="border-t border-line bg-bg py-20">
      <Container>
        <div data-reveal className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <Monogram />
              <span className="font-mono text-sm font-bold tracking-tight text-ink">LUIS_VESPA</span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              &ldquo;I build secure Android systems — and the agents that build them.&rdquo;
              <br />
              <br />
              Bridging mobile security engineering and the future of agentic software development.
            </p>
            <ul className="mt-8 flex gap-3">
              {contactLinks().map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex h-10 items-center gap-1.5 border border-line px-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    {l.label}
                    {l.external ? <ArrowUpRight className="size-3.5" aria-hidden /> : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Footer">
            <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.14em] text-ink">Navigation</h2>
            <ul className="space-y-4 font-mono text-xs text-muted">
              {footerNav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="group inline-flex items-center transition-colors hover:text-accent">
                    <span aria-hidden className="w-0 overflow-hidden text-accent transition-[width] duration-300 group-hover:w-4">
                      ›
                    </span>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.14em] text-ink">Status</h2>
            <dl className="space-y-2 font-mono text-[10px]">
              {status.map((row, i) => (
                <div key={row.k} className="flex justify-between gap-4">
                  <dt className="text-faint">{row.k}</dt>
                  <dd className={`text-right ${row.accent ? "text-accent" : "text-ink"}`}>
                    <TypeText text={row.v} startMs={300 + i * 450} stepMs={20} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-8 md:flex-row">
          <p className="font-mono text-[10px] text-faint">
            © {new Date().getFullYear()} LUIS VESPA · {siteConfig.location.toUpperCase()} ·{" "}
            <Link href="/privacy" className="hover:text-accent">
              PRIVACY
            </Link>
          </p>
          <p className="font-mono text-[10px] text-faint">
            Press <kbd className="border border-line px-1.5 py-0.5">⌘</kbd>{" "}
            <kbd className="border border-line px-1.5 py-0.5">K</kbd> to search
          </p>
        </div>
      </Container>
    </footer>
  );
}
