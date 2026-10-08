import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PageTransition } from "@/components/page-transition";
import { Section } from "@/components/ui";
import { ExperienceProfile } from "@/components/experience-profile";
import { AskLuis } from "@/components/ask-luis";
import { siteConfig } from "@/config/site";
import { summary } from "@/content/profile";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Luis Vespa's experience: Senior Android Engineer in Madrid — Digidentity, Ypsomed (InnoIT), Vodafone, Unisys. Secure mobile systems, SDKs, identity and AI agents.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <PageTransition>
      <PageIntro typed label="Experience / 04" title="My experience.">
        {summary.short} {siteConfig.location} · {summary.eligibility} · {summary.languages.join(" · ")}.
      </PageIntro>

      <ExperienceProfile />

      <Section
        id="ask"
        typed
        label="Ask / 01"
        title="Ask Luis"
        intro="Common questions, answered only from what this site states."
      >
        <AskLuis />
      </Section>
    </PageTransition>
  );
}
