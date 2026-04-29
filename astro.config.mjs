// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import clerk from '@clerk/astro';

// Switch to @astrojs/cloudflare for Cloudflare Pages deployment
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://quietthemowers.com',
  vite: {
    plugins: [tailwindcss()]
  },
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [clerk()],
});