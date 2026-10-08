/**
 * Site configuration — edit these values freely.
 *
 * Every link and contact detail on the site is read from here.
 * Leave a value as an empty string ("") to hide that link everywhere.
 */
export const siteConfig = {
  /**
   * Public URL of the site, without trailing slash. Used for SEO, sitemap and OpenGraph.
   * Each environment can override it with NEXT_PUBLIC_SITE_URL (e.g. https://pre.luisvespa.com).
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.luisvespa.com",

  name: "Luis Vespa",
  fullName: "Luis Manuel Vespa Peralta",
  role: "Senior Android Engineer",
  location: "Madrid, Spain",

  /** Contact */
  email: "luis.vespa@outlook.es",
  linkedin: "https://www.linkedin.com/in/REPLACE-ME",
  github: "https://github.com/REPLACE-ME",

  /** Path of the CV inside /public. Replace public/cv/luis-vespa-cv.pdf with your latest CV. */
  cvPath: "/cv/luis-vespa-cv.pdf",

  /** Shown in the footer status panel and the recruiter summary. */
  availability: "Open for new opportunities",

  /**
   * Portrait shown only on the About page. Put the image in /public (e.g. public/photo/luis.jpg)
   * and set the path here, e.g. "/photo/luis.jpg". Empty = the LV monogram frame is shown instead.
   */
  photo: "/photo/luis.jpg",
  photoAlt: "Luis Vespa",
} as const;

/**
 * Pre-production (NEXT_PUBLIC_SITE_ENV=preproduction): never indexed by search engines,
 * and a small visible badge so nobody mistakes it for the real site.
 */
export const isPreproduction = process.env.NEXT_PUBLIC_SITE_ENV === "preproduction";

/** True when a config URL still holds its placeholder value. */
export function isPlaceholder(value: string): boolean {
  return value === "" || value.includes("REPLACE-ME");
}
