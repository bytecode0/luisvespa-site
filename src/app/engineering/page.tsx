import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PageTransition } from "@/components/page-transition";
import { Section, Tag } from "@/components/ui";
import { AndroidLayers } from "@/components/android-layers";
import { SdkLab } from "@/components/sdk-lab";
import { androidStack } from "@/content/profile";

export const metadata: Metadata = {
  title: "Android & SDK Engineering",
  description: "Android architecture, modularization, testing and SDK engineering: Kotlin, Jetpack Compose, Coroutines, Clean Architecture.",
  alternates: { canonical: "/engineering" },
};

export default function EngineeringPage() {
  return (
    <PageTransition>
      <PageIntro variant="engineering" label="Engineering / 01" title="Android platforms built to last.">
        I design Android apps and SDKs for regulated products, where a bug is a compliance problem and an API change
        breaks someone else&rsquo;s release.
      </PageIntro>

      <Section
        id="android"
        label="Android / 01"
        title="Android engineering"
        intro="A layered architecture keeps features independent, the domain testable and security in one place. Select a layer."
      >
        <AndroidLayers />
        <ul className="mt-10 flex flex-wrap gap-2" aria-label="Android stack">
          {androidStack.map((s) => (
            <li key={s}>
              <Tag>{s}</Tag>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="sdk-lab"
        label="SDK / 02"
        title="SDK Lab"
        intro="SDKs are products, not reusable folders. Their users are other engineers, and their contract is the public API."
      >
        <SdkLab />
      </Section>
    </PageTransition>
  );
}
