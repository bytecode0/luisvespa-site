import { companies } from "@/content/profile";

/**
 * Endless band of the companies Luis worked at, as plain text (no logos, no implied endorsements).
 * The list is rendered twice and the track moves by exactly half its width, so the loop is seamless
 * (spacing is padding on each item, never `gap`, which would make the halves unequal).
 * Pauses on hover; static with reduced motion.
 */
export function CompanyMarquee({ size = "lg", label = "Worked with" }: { size?: "sm" | "lg"; label?: string }) {
  const lg = size === "lg";
  return (
    <div>
      <p
        className={`text-center font-mono uppercase tracking-[0.2em] ${
          lg ? "mb-8 text-[10px] text-accent" : "label mb-4"
        }`}
      >
        {label}
      </p>
      <div className="marquee overflow-hidden">
        <ul
          className={`marquee-track transition-opacity ${lg ? "opacity-50 hover:opacity-90" : "opacity-70 hover:opacity-100"}`}
          aria-label={`${label}: ${companies.join(", ")}`}
        >
          {[...companies, ...companies].map((c, i) => (
            <li
              key={`${c}-${i}`}
              aria-hidden={i >= companies.length}
              className={`whitespace-nowrap font-mono font-bold ${
                lg ? "pr-14 text-lg text-ink md:pr-24 md:text-xl" : "pr-10 text-xs tracking-[0.08em] text-muted md:pr-14"
              }`}
            >
              {c.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
