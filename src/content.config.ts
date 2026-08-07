import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    // `icon` is one of the keys in scripts/gen-doc-icons.mjs. It is painted by
    // the generated CSS mask, so a page opts in with a single frontmatter line
    // and the glyph matches the landing page's lucide set exactly.
    schema: docsSchema({
      extend: z.object({
        icon: z.string().optional(),
      }),
    }),
  }),
};
