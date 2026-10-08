import Image from "next/image";
import type { CSSProperties } from "react";
import { siteConfig } from "@/config/site";

/**
 * About-page portrait: breathing blue glow, technical corner marks and an ID plate overlapping the corner.
 * Until a photo is set in src/config/site.ts, the frame holds the LV monogram instead.
 */
export function Portrait({ variant = "frame" }: { variant?: "frame" | "inset" }) {
  const photo: string = siteConfig.photo;
  if (variant === "inset") return <InsetPortrait photo={photo} />;
  return (
    <figure className="group relative">
      <div aria-hidden className="portrait-glow absolute inset-6 rounded-full bg-accent/25 blur-3xl group-hover:bg-accent/40" />
      <div className="glass-cv relative aspect-[4/5] w-full overflow-hidden border border-line">
        <span aria-hidden className="absolute -left-px -top-px z-10 size-4 border-l-2 border-t-2 border-accent" />
        <span aria-hidden className="absolute -right-px -top-px z-10 size-4 border-r-2 border-t-2 border-accent" />
        <span aria-hidden className="absolute -bottom-px -left-px z-10 size-4 border-b-2 border-l-2 border-accent" />
        <span aria-hidden className="absolute -bottom-px -right-px z-10 size-4 border-b-2 border-r-2 border-accent" />
        {photo ? (
          <Image
            src={photo}
            alt={siteConfig.photoAlt}
            fill
            sizes="(min-width: 1024px) 360px, 90vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-7xl font-bold text-accent/70" aria-label={siteConfig.name}>
            LV
          </div>
        )}
      </div>
      {/* ID plate overlapping the bottom-right corner */}
      <figcaption
        className="word-in absolute -bottom-4 -right-4 border border-line bg-bg p-4 font-mono text-[10px] shadow-2xl"
        style={{ "--d": "700ms" } as CSSProperties}
      >
        <span className="block text-accent">ID: LUIS_VESPA</span>
        <span className="block text-ink">MADRID // EU</span>
      </figcaption>
    </figure>
  );
}

/**
 * Contact-page variant (from the Contact design): monochrome photo that warms to colour on hover,
 * hairline corner marks inside the frame, a breathing blue glow and an ID plate inside the corner.
 */
function InsetPortrait({ photo }: { photo: string }) {
  return (
    <figure className="group relative">
      <div className="portrait-glow-shadow relative aspect-[4/5] w-full overflow-hidden border border-line">
        {photo ? (
          <Image
            src={photo}
            alt={siteConfig.photoAlt}
            fill
            sizes="(min-width: 1024px) 400px, 90vw"
            className="object-cover object-top contrast-110 brightness-90 grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-7xl font-bold text-accent/70" aria-label={siteConfig.name}>
            LV
          </div>
        )}
        <span aria-hidden className="absolute left-2 top-2 size-4 border-l border-t border-accent/60 transition-all duration-500 group-hover:left-3 group-hover:top-3" />
        <span aria-hidden className="absolute right-2 top-2 size-4 border-r border-t border-accent/60 transition-all duration-500 group-hover:right-3 group-hover:top-3" />
        <span aria-hidden className="absolute bottom-2 left-2 size-4 border-b border-l border-accent/60 transition-all duration-500 group-hover:bottom-3 group-hover:left-3" />
        <span aria-hidden className="absolute bottom-2 right-2 size-4 border-b border-r border-accent/60 transition-all duration-500 group-hover:bottom-3 group-hover:right-3" />
        <figcaption
          className="block-in absolute bottom-4 right-4 border border-line bg-bg/90 p-3 font-mono text-[9px] tracking-[0.14em] backdrop-blur-sm"
          style={{ "--d": "700ms" } as CSSProperties}
        >
          <span className="block text-accent">ID: LUIS_VESPA / MADRID // EU</span>
          <span className="mt-1 block font-bold text-ink">SENIOR_ANDROID_ENGINEER</span>
        </figcaption>
      </div>
    </figure>
  );
}
