import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { PageTransition } from "@/components/page-transition";
import { Container } from "@/components/ui";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How luisvespa.com handles the data you send through the contact form. No analytics, no tracking cookies.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "8 October 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who is responsible",
    body: (
      <>
        {siteConfig.fullName}, {siteConfig.location}. Contact:{" "}
        <a className="text-accent hover:text-ink" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        .
      </>
    ),
  },
  {
    title: "What the contact form collects",
    body: "Only what you type: your name, email address, company (optional), the topic and your message.",
  },
  {
    title: "What happens to it",
    body: "Your message is forwarded by email to my personal inbox through Cloudflare Email Service, so I can read it and reply to you. This website has no database: the message is not stored on the site.",
  },
  {
    title: "Why (legal basis)",
    body: "Your consent, which you give by ticking the box in the form (Article 6(1)(a) GDPR). I only use your details to reply to your message.",
  },
  {
    title: "How long",
    body: "The email stays in my inbox for as long as the conversation is relevant, and is deleted when it no longer is, or earlier if you ask me to.",
  },
  {
    title: "Who else processes it",
    body: "Vercel hosts the website and Cloudflare delivers the email; both act only as technical service providers. Your details are never sold or shared for marketing.",
  },
  {
    title: "Cookies and tracking",
    body: "None. There is no analytics and no advertising. Your browser only keeps two local preferences of this site — the selected view mode and whether sound is on — which never leave your device.",
  },
  {
    title: "Your rights",
    body: (
      <>
        You can ask to access, correct or delete your data, or withdraw your consent, by writing to{" "}
        <a className="text-accent hover:text-ink" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        . You can also complain to the Spanish data protection authority (
        <a className="text-accent hover:text-ink" href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          AEPD
        </a>
        ).
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <PageTransition>
      <PageIntro label="Privacy / 06" title="Privacy.">
        Short and plain: what happens to the details you send me, and nothing else. Last updated {LAST_UPDATED}.
      </PageIntro>
      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <dl data-reveal className="max-w-3xl divide-y divide-line border-y border-line">
            {sections.map((s) => (
              <div key={s.title} className="grid gap-2 py-6 sm:grid-cols-[220px_1fr] sm:gap-8">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">{s.title}</dt>
                <dd className="text-sm leading-relaxed text-muted">{s.body}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/contact"
            className="mt-10 inline-flex font-mono text-xs uppercase tracking-[0.12em] text-accent hover:text-ink"
          >
            ← Back to contact
          </Link>
        </Container>
      </section>
    </PageTransition>
  );
}
