import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/board", "/tailor", "/settings", "/analytics", "/cv-manager"],
    },
    sitemap: "https://tailormicv.com/sitemap.xml",
  };
}
