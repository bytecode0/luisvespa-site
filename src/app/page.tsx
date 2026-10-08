import { Hero } from "@/components/hero";
import { PageTransition } from "@/components/page-transition";
import { Container, Section, stagger } from "@/components/ui";
import { ViewModeSwitch } from "@/components/view-mode";
import { CaseStudyCard, EngineeringPrinciples, MoreLink, RecruiterSummary } from "@/components/content-blocks";
import { ControlPlane, ExperienceLog } from "@/components/control-plane";
import { caseStudies } from "@/content/profile";

export default function HomePage() {
  return (
    <PageTransition className="flex flex-col">
      <div data-order-recruiter="1">
        <Hero />
      </div>

      <div data-order-recruiter="2" className="border-y border-line bg-bg/70 backdrop-blur-sm">
        <Container className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <ViewModeSwitch />
          <p className="text-xs text-faint">Changes what this page puts first. Nothing is hidden for good.</p>
        </Container>
      </div>

      <div data-order-recruiter="3" className="view-only-recruiter">
        <Section id="summary" label="Summary / 00" title="Who, what and why — in 30 seconds.">
          <RecruiterSummary />
        </Section>
      </div>

      <div data-order-recruiter="5">
        <ControlPlane />
      </div>

      <div data-order-recruiter="4">
        <ExperienceLog />
      </div>

      <div data-order-recruiter="7">
        <Section id="principles" label="Principles / 05" title="Engineering principles">
          <EngineeringPrinciples />
        </Section>
      </div>

      <div data-order-recruiter="6">
        <Section
          id="work"
          label="Work / 06"
          title="Selected work"
          intro="Real projects. What I can state is filled in; the rest is marked until it is written."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {caseStudies.map((s, i) => (
              <div key={s.id} {...stagger(i, 100)}>
                <CaseStudyCard study={s} />
              </div>
            ))}
          </div>
          <MoreLink href="/work">All case studies</MoreLink>
        </Section>
      </div>
    </PageTransition>
  );
}
