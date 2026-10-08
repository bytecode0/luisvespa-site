import type { MetadataRoute } from "next";
import { isPreproduction, siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (isPreproduction) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
