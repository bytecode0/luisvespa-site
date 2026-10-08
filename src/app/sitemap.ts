import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const routes = ["", "/engineering", "/security", "/agents", "/work", "/experience"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
