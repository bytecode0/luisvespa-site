import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PageTransition } from "@/components/page-transition";
import { Section, stagger } from "@/components/ui";
import { CaseStudyCard } from "@/components/content-blocks";
import { caseStudies } from "@/content/profile";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Case studies: an agentic SDLC for Android, a secure mTLS channel to a medical device, and an identity SDK and wallet.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <PageTransition>
      <PageIntro variant="quiet" label="Work / 04" title="Selected work.">
        Each case study follows the same structure: problem, constraints, architecture, decisions, implementation,
        security, result and lessons. Sections still to be written are marked.
      </PageIntro>
      <Section id="case-studies" label="Case studies" title="Case studies">
        <div className="grid gap-4 lg:grid-cols-3">
          {caseStudies.map((s, i) => (
            <div key={s.id} {...stagger(i, 100)}>
              <CaseStudyCard study={s} expanded />
            </div>
          ))}
        </div>
      </Section>
    </PageTransition>
  );
}
