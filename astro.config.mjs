// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

// The landing page is a hand-built Astro page at src/pages/index.astro.
// Starlight owns everything under /docs — its content lives in
// src/content/docs/docs/, because Starlight maps src/content/docs/<path> to
// /<path>. Astro pages take precedence over Starlight's injected routes, which
// is what keeps "/" ours.
export default defineConfig({
  site: "https://rookery.sh",
  integrations: [
    react(),
    starlight({
      title: "Rookery",
      description:
        "Self-hosted agents that live on your knowledge and act through the apps you already use.",
      logo: { src: "./src/assets/mark.svg", replacesTitle: false },
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/ilijad1/rookery" },
      ],
      // Pagefind builds a static search index at build time. No third-party
      // request — see the no-tracker rule in the spec.
      pagefind: true,
      customCss: ["./src/styles/brand.css"],
      sidebar: [
        {
          label: "Getting started",
          items: [
            { label: "What Rookery is", slug: "docs/getting-started/what-rookery-is" },
            { label: "Your first 15 minutes", slug: "docs/getting-started/first-15-minutes" },
            { label: "Choosing a model", slug: "docs/getting-started/choosing-a-model" },
          ],
        },
        {
          label: "Installation",
          items: [
            { label: "Linux server", slug: "docs/installation/linux-server" },
            { label: "Docker", slug: "docs/installation/docker" },
          ],
        },
        {
          label: "Concepts",
          items: [{ label: "Workspaces", slug: "docs/concepts/workspaces" }],
        },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
