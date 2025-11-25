// @ts-check
import { envField, defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      ANALYTICS_SCRIPT: envField.string({ context: "client", access: "public", optional: true }),
      ANALYTICS_SITE_ID: envField.string({ context: "client", access: "public", optional: true }),
      FEEDBACK_ENDPOINT: envField.string({ context: "client", access: "public", optional: true }),
    }
  },
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});