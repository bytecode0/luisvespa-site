"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { FlowLine, Panel, sequence, stagger } from "@/components/ui";

const hardeningSteps = [
  { name: "Source", detail: "Kotlin code, resources, dependencies" },
  { name: "R8", detail: "Shrinking and name obfuscation" },
  { name: "DexGuard", detail: "Obfuscation, string protection, hardening" },
  { name: "Signing", detail: "Release key, integrity" },
  { name: "Release", detail: "Distribution" },
];

/** Build-time hardening as one layer of defense in depth. */
export function SecurityPipeline() {
  return (
    <div>
      <ol className="grid gap-3 lg:grid-cols-5" aria-label="Application hardening pipeline">
        {hardeningSteps.map((s, i) => {
          const key = s.name === "R8" || s.name === "DexGuard";
          const seq = sequence(i, hardeningSteps.length, undefined, 0.9);
          return (
            <li key={s.name} className="relative" {...stagger(i)}>
              <div
                style={seq.style}
                className={`${seq.className} h-full rounded-sm border p-4 transition-transform duration-300 hover:-translate-y-0.5 ${
                  key ? "border-accent/40 bg-accent-soft" : "border-line bg-surface"
                }`}
              >
                <p className="label">Step {String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-mono text-sm text-ink">{s.name}</p>
                <p className="mt-1 text-sm text-muted">{s.detail}</p>
              </div>
              {i < hardeningSteps.length - 1 ? (
                <>
                  <ArrowRight className="nudge-x absolute -right-3 top-1/2 z-10 hidden size-4 -translate-y-1/2 text-faint lg:block" aria-hidden />
                  <span className="my-1 block lg:hidden">
                    <FlowLine delayMs={i * 200} />
                  </span>
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
      <Panel className="mt-6 p-5 sm:p-6">
        <p className="text-base font-medium text-ink sm:text-lg">
          Obfuscation is not security by itself. It is one layer of defense in depth.
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          R8 and DexGuard raise the cost of reverse engineering. They do not protect keys that should never have been
          in the APK, or an API that trusts any client. That is the job of the architecture: keys in the Android
          Keystore, identity through certificates, mTLS and pinning on the wire.
        </p>
      </Panel>
    </div>
  );
}

const layers = [
  { id: "keystore", name: "Android Keystore", detail: "Private keys are generated and kept in hardware-backed storage and never leave the device." },
  { id: "certificate", name: "Certificate identity", detail: "An X.509 client certificate identifies the device or user; it also signs documents and challenges." },
  { id: "mtls", name: "mTLS", detail: "Both sides present certificates. The server knows which client is calling, not only that the channel is encrypted." },
  { id: "pinning", name: "Certificate pinning", detail: "The app only trusts the expected server keys, closing the door to interception with rogue CAs." },
  { id: "storage", name: "Secure storage", detail: "Secrets and tokens are encrypted at rest with Keystore-backed keys." },
  { id: "hardening", name: "App hardening", detail: "DexGuard and R8 make the binary harder to analyse and tamper with." },
] as const;

const serverPath = ["mTLS", "API gateway", "Identity / PKI", "Backend APIs"];

/** Client trust stack plus the path a request takes. Readable without interaction; selecting a layer explains it. */
export function SecurityArchitecture() {
  const [selected, setSelected] = useState<(typeof layers)[number]["id"]>("mtls");
  const current = layers.find((l) => l.id === selected)!;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <Panel className="p-5 sm:p-6">
        <p className="label mb-4">Android client · trust stack</p>
        <div role="group" aria-label="Security layers of the Android client" className="flex flex-col gap-2">
          {layers.map((l, i) => {
            const on = l.id === selected;
            return (
              <button
                key={l.id}
                {...stagger(i, 60)}
                type="button"
                aria-pressed={on}
                onClick={() => setSelected(l.id)}
                className={`flex items-center justify-between rounded-sm border px-4 py-3 text-left font-mono text-xs tracking-[0.1em] transition-colors ${
                  on ? "border-accent bg-accent-soft text-ink" : "border-line text-muted hover:border-line-strong hover:text-ink"
                }`}
              >
                {l.name.toUpperCase()}
                <span aria-hidden className={on ? "text-accent" : "text-faint"}>
                  {on ? "●" : "○"}
                </span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="mt-5 min-h-16 text-sm leading-relaxed text-muted">
          <span className="text-ink">{current.name}.</span> {current.detail}
        </p>
      </Panel>

      <Panel className="p-5 sm:p-6">
        <p className="label mb-4">Request path</p>
        <ol className="flex flex-col items-stretch">
          <li className="rounded-sm border border-accent/40 bg-accent-soft px-4 py-3 text-center font-mono text-xs tracking-[0.12em] text-ink">
            ANDROID CLIENT
          </li>
          {serverPath.map((step, i) => (
            <li key={step} className="flex flex-col items-center">
              <span className="relative py-1">
                <FlowLine delayMs={i * 450} color="var(--ok)" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.12em] text-faint">
                  {i === 0 ? "certificate identity" : i === 2 ? "trust established" : ""}
                </span>
              </span>
              <span
                className={`mt-1 w-full rounded-sm border px-4 py-3 text-center font-mono text-xs tracking-[0.12em] ${
                  step === "mTLS" && selected === "mtls" ? "border-accent text-ink" : "border-line text-muted"
                }`}
              >
                {step.toUpperCase()}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs leading-relaxed text-faint">
          Conceptual reference architecture — not a diagram of a specific employer&rsquo;s system.
        </p>
      </Panel>
    </div>
  );
}
