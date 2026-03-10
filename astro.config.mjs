// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://matheuscabral.dev',
  integrations: [sitemap()],
  vite: {
    server: {
      // Allow Vite to serve files from parent node_modules when running
      // inside a git worktree, where node_modules resolves to the main repo.
      fs: { strict: false },
    },
  },
});
