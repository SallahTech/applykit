import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/board", "/tailor", "/settings", "/analytics", "/cv-manager"],
    },
    sitemap: "https://applykit-two.vercel.app/sitemap.xml",
  };
}
