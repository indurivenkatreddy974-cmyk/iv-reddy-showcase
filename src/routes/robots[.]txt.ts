import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = [
          "# robots.txt — IV Reddy Portfolio",
          "User-agent: *",
          "Allow: /",
          "",
          "# Private / admin / auth surfaces",
          "Disallow: /atelier",
          "Disallow: /atelier/",
          "Disallow: /admin",
          "Disallow: /admin/",
          "Disallow: /auth",
          "Disallow: /auth/",
          "Disallow: /login",
          "Disallow: /signin",
          "",
          "# API and internal routes",
          "Disallow: /api/",
          "Disallow: /lovable/",
          "",
          "# Allow major crawlers full access to public pages",
          "User-agent: Googlebot",
          "Allow: /",
          "Disallow: /atelier",
          "Disallow: /api/",
          "",
          "User-agent: Bingbot",
          "Allow: /",
          "Disallow: /atelier",
          "Disallow: /api/",
          "",
          "Sitemap: https://iv-reddy-showcase.lovable.app/sitemap.xml",
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
