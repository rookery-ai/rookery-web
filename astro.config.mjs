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
  site: "https://rookery.cloud",
  // Backup and restore moved from Concepts to Operations — it is a procedure
  // you follow, not an idea you read. The old URL was public, so it redirects
  // rather than 404s.
  redirects: {
    "/docs/concepts/backup-and-restore": "/docs/operations/backup-and-restore/",
  },
  integrations: [
    react(),
    starlight({
      title: "rookery",
      description:
        "Documentation for Rookery — self-hosted agents that live on your knowledge and act through the apps you already use.",
      // No `logo:` here on purpose. Starlight renders a configured logo as an
      // <img>, which cannot inherit currentColor — that is exactly why the mark
      // painted black and vanished on the dark theme. src/overrides/SiteTitle.astro
      // inlines the SVG instead, and is the only consumer of the mark in the
      // header.
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/ilijad1/rookery" },
      ],
      // Pagefind builds a static search index at build time. No third-party
      // request — see the no-tracker rule in the spec.
      pagefind: true,
      customCss: ["./src/styles/brand.css", "./src/styles/doc-icons.css"],
      components: {
        PageTitle: "./src/overrides/PageTitle.astro",
        SiteTitle: "./src/overrides/SiteTitle.astro",
      },
      sidebar: [
        {
          label: "Getting started",
          items: [
            { label: "What Rookery is", slug: "docs/getting-started/what-rookery-is", attrs: { "data-icon": "overview" } },
            { label: "Your first 15 minutes", slug: "docs/getting-started/first-15-minutes", attrs: { "data-icon": "start" } },
            { label: "Choosing a model", slug: "docs/getting-started/choosing-a-model", attrs: { "data-icon": "models" } },
          ],
        },
        {
          label: "Installation",
          items: [
            { label: "Linux server", slug: "docs/installation/linux-server", attrs: { "data-icon": "linux" } },
            { label: "Docker", slug: "docs/installation/docker", attrs: { "data-icon": "docker" } },
            { label: "macOS", slug: "docs/installation/macos", attrs: { "data-icon": "macos" } },
            { label: "Windows", slug: "docs/installation/windows", attrs: { "data-icon": "windows" } },
            { label: "Binary and packages", slug: "docs/installation/binary", attrs: { "data-icon": "binary" } },
          ],
        },
        {
          // Ordered as a sequence, not alphabetically: this is the order the
          // concepts build on each other.
          label: "Concepts",
          items: [
            { label: "Workspaces", slug: "docs/concepts/workspaces", attrs: { "data-icon": "workspaces" } },
            { label: "Knowledge base", slug: "docs/concepts/knowledge-base", attrs: { "data-icon": "knowledge" } },
            { label: "Agents", slug: "docs/concepts/agents", attrs: { "data-icon": "agents" } },
            { label: "Skills", slug: "docs/concepts/skills", attrs: { "data-icon": "skills" } },
            { label: "Chat", slug: "docs/concepts/chat", attrs: { "data-icon": "chat" } },
            { label: "Secrets", slug: "docs/concepts/secrets", attrs: { "data-icon": "secrets" } },
            { label: "Connections", slug: "docs/concepts/connections", attrs: { "data-icon": "connections" } },
            { label: "Notifications and chat apps", slug: "docs/concepts/notifications", attrs: { "data-icon": "notifications" } },
            { label: "Scheduling and reminders", slug: "docs/concepts/scheduling", attrs: { "data-icon": "scheduling" } },
            { label: "Models", slug: "docs/concepts/models", attrs: { "data-icon": "models" } },
          ],
        },
        {
          label: "Operations",
          items: [
            { label: "Configuration", slug: "docs/operations/configuration", attrs: { "data-icon": "config" } },
            { label: "Backup and restore", slug: "docs/operations/backup-and-restore", attrs: { "data-icon": "backup" } },
            { label: "Health and troubleshooting", slug: "docs/operations/troubleshooting", attrs: { "data-icon": "health" } },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "CLI commands", slug: "docs/reference/cli", attrs: { "data-icon": "cli" } },
            { label: "HTTP API", slug: "docs/reference/api", attrs: { "data-icon": "cli" } },
            { label: "Connected services", slug: "docs/reference/connected-services", attrs: { "data-icon": "services" } },
          ],
        },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
