import Image from "next/image";

/** Category key visual (Control Plane design): monochrome image that warms to colour on hover,
 *  hairline corner marks, a gradient for legibility, a label overlay and a scan line on reveal. */
export function KeyVisual({
  src,
  alt,
  label,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  label: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative aspect-video overflow-hidden rounded-sm border border-line ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 600px, 100vw"
        className="object-cover opacity-80 grayscale transition-[filter,opacity,transform] duration-700 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
      />
      <span aria-hidden className="absolute left-2 top-2 size-3 border-l border-t border-line-strong" />
      <span aria-hidden className="absolute right-2 top-2 size-3 border-r border-t border-line-strong" />
      <span aria-hidden className="absolute bottom-2 left-2 size-3 border-b border-l border-line-strong" />
      <span aria-hidden className="absolute bottom-2 right-2 size-3 border-b border-r border-line-strong" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
      <span aria-hidden className="scan-line" />
      <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.3em] text-accent">{label}</span>
    </div>
  );
}
