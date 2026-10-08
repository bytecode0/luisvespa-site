import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PageTransition } from "@/components/page-transition";
import { Panel, Section, Tag, stagger } from "@/components/ui";
import { SecurityArchitecture, SecurityPipeline } from "@/components/security";
import { securityAreas } from "@/content/profile";

export const metadata: Metadata = {
  title: "Mobile Security Engineering",
  description:
    "Android security: PKI, X.509 certificates, mTLS, certificate pinning, Android Keystore, digital signatures, passwordless login and DexGuard / R8 hardening.",
  alternates: { canonical: "/security" },
};

export default function SecurityPage() {
  return (
    <PageTransition>
      <PageIntro variant="security" visual={{ src: "/visuals/security.jpg", alt: "Glowing padlock inside concentric security rings and circuit traces" }} label="Detailed spec / 02" title="Security is architecture">
        I design trust boundaries and protect application assets — from a PKI-authenticated mTLS channel to a
        medical device, to certificate-based signatures in a digital identity wallet.
      </PageIntro>

      <Section
        id="areas"
        label="Security / 01"
        title="Where I work"
        intro="Four areas, each solving a different part of the problem."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {securityAreas.map((area, i) => (
            <Panel key={area.id} className="p-6 transition-transform duration-300 hover:-translate-y-1" {...stagger(i, 90)}>
              <div id={area.id} className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-mono text-sm tracking-[0.1em] text-ink">{area.label.toUpperCase()}</h3>
                <Tag>{area.evidence}</Tag>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {area.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden className="text-faint">—</span>
                    {i}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </Section>

      <Section
        id="architecture"
        label="Security / 02"
        title="Trust architecture"
        intro="Each layer of the client protects something different. Select one to see what it is for."
      >
        <SecurityArchitecture />
      </Section>

      <Section
        id="hardening-pipeline"
        label="Security / 03"
        title="Code obfuscation & application hardening"
        intro="Hardening happens at build time, between the source and the signed release."
      >
        <SecurityPipeline />
      </Section>
    </PageTransition>
  );
}
