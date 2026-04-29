// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://quietthemowers.com',
  vite: {
    plugins: [tailwindcss()]
  },
  adapter: cloudflare({
    imageService: 'compile',
  }),
  integrations: [clerk()],
});