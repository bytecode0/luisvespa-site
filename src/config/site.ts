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
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_GIT_COMMIT_REF === "preprod" ? "https://pre.luisvespa.com" : "https://www.luisvespa.com"),

  name: "Luis Vespa",
  fullName: "Luis Manuel Vespa Peralta",
  role: "Senior Android Engineer",
  location: "Madrid, Spain",

  /** Contact */
  email: "contact@luisvespa.com",
  linkedin: "https://www.linkedin.com/in/luis-vespa-b6351447",
  github: "https://github.com/bytecode0",

  /** Path of the CV inside /public. Replace public/cv/luis-vespa-cv.pdf with your latest CV. */
  cvPath: "/cv/luis-vespa-cv.pdf",

  /**
   * Phone for WhatsApp / call buttons on /contact, obfuscated so scrapers don't harvest it from the HTML:
   * base64 of the number written backwards. It is only decoded when a visitor clicks.
   * To change it: run  node -e "console.log(Buffer.from('+34XXXXXXXXX'.split('').reverse().join('')).toString('base64'))"
   */
  phoneObfuscated: "NDUwOTU2NjY2NDMr",

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
 * Pre-production: never indexed by search engines, and a small visible badge so nobody mistakes it
 * for the real site. On Vercel this is automatic for every non-production deploy (VERCEL_ENV=preview,
 * e.g. the preprod branch); elsewhere set NEXT_PUBLIC_SITE_ENV=preproduction.
 */
export const isPreproduction =
  process.env.NEXT_PUBLIC_SITE_ENV === "preproduction" || process.env.VERCEL_ENV === "preview";

/** True when a config URL still holds its placeholder value. */
export function isPlaceholder(value: string): boolean {
  return value === "" || value.includes("REPLACE-ME");
}
