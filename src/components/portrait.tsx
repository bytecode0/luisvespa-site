import Image from "next/image";
import type { CSSProperties } from "react";
import { siteConfig } from "@/config/site";

/**
 * About-page portrait: breathing blue glow, technical corner marks and an ID plate overlapping the corner.
 * Until a photo is set in src/config/site.ts, the frame holds the LV monogram instead.
 */
export function Portrait() {
  const photo: string = siteConfig.photo;
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
