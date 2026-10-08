import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PageTransition } from "@/components/page-transition";
import { Section } from "@/components/ui";
import { AgentBoundaries, AgentDirection, AgenticPipeline, McpArchitecture } from "@/components/agents";
import { AgentTrace } from "@/components/agent-trace";

export const metadata: Metadata = {
  title: "AI Agents & Agentic SDLC",
  description:
    "An end-to-end AI-agentic SDLC for Android: Claude Code agents, MCP connections to Jira, Figma and GitLab, on-device testing and human approval gates.",
  alternates: { canonical: "/agents" },
};

export default function AgentsPage() {
  return (
    <PageTransition>
      <PageIntro variant="agents" visual={{ src: "/visuals/agents.jpg", alt: "Network of glowing interconnected nodes" }} label="Detailed spec / 03" title="Intelligent automation">
        Not &ldquo;AI writes my code&rdquo;. An engineering system where agents refine, implement, test and review —
        and humans approve the plan and the merge.
      </PageIntro>

      <Section
        id="pipeline"
        label="Agents / 01"
        title="End-to-end AI-agentic SDLC for Android"
        intro="The pipeline I designed and run at Digidentity. A Jira ticket goes in; a reviewed merge request comes out."
      >
        <AgenticPipeline />
      </Section>

      <Section id="mcp" label="Agents / 02" title="MCP: controlled capabilities" intro="Agents are only as useful as the systems they can reach — and only as safe as the way they reach them.">
        <McpArchitecture />
      </Section>

      <Section id="boundaries" label="Agents / 03" title="Agent boundaries" intro="Every agent needs boundaries. These are the ones I design for.">
        <AgentBoundaries />
      </Section>

      <Section id="trace" label="Agents / 04" title="Agent trace" intro="What a run looks like, step by step. A simulated replay that mirrors the real stages.">
        <AgentTrace />
      </Section>

      <Section id="direction" label="Agents / 05" title="Where this goes next" intro="Specialised agents with their own tools and evaluations, still ending at a human.">
        <AgentDirection />
      </Section>
    </PageTransition>
  );
}
