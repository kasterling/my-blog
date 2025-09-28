// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://kasterling.github.io',
  base: '/my-blog',
  output: 'static',
  build: {
    assets: 'assets'
  }
});
