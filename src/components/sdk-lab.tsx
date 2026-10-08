import { Panel, stagger } from "@/components/ui";

const surfaces = [
  {
    name: "Authentication",
    items: ["Identity", "Certificates", "mTLS", "Passwordless login", "Device binding"],
  },
  {
    name: "Security",
    items: ["Cryptography", "Key management (Keystore)", "Digital signatures", "Hardening (DexGuard / R8)"],
  },
  {
    name: "Developer experience",
    items: ["Kotlin-first APIs", "Documentation", "Samples", "Testing", "Compatibility"],
  },
];

const qualities = [
  "API design",
  "Backwards compatibility",
  "Versioning",
  "Developer experience",
  "Documentation",
  "Testing",
  "Distribution",
  "Security",
  "Observability",
];

/** How Luis structures SDK platforms. Surfaces are a model, not named products. */
export function SdkLab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {surfaces.map((s, i) => (
          <Panel key={s.name} className="p-6 transition-transform duration-300 hover:-translate-y-1" {...stagger(i, 90)}>
            <p className="label">SDK / {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-3 font-mono text-sm tracking-[0.1em] text-ink">{s.name.toUpperCase()}</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {s.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="text-faint">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
      <Panel className="p-6">
        <p className="label mb-4">An SDK is a product. What it has to get right:</p>
        <ul className="flex flex-wrap gap-2">
          {qualities.map((q, i) => (
            <li key={q} {...stagger(i, 40)} className="rounded-md border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-ink">
              {q}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          In practice: the Android and iOS SDKs for the Ypsomed YpsoPump insulin pump, as Android Tech Lead, and the Android
          identity SDK at Digidentity.
        </p>
      </Panel>
    </div>
  );
}
