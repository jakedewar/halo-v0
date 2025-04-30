import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import type { ManifestV3Export } from '@crxjs/vite-plugin';
import { crx } from '@crxjs/vite-plugin';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import manifestJson from './public/manifest.json';

const manifest = manifestJson as unknown as ManifestV3Export;

// https://vite.dev/config/
export default defineConfig({
    plugins: [
      react(),
      crx({ manifest, browser: 'chrome' }),
      viteStaticCopy({
        targets: [
          {
            src: 'src/assets/fonts/*/**/*.{woff,woff2,ttf}',
            dest: './assets/fonts',
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      }
    },
    build: {
      sourcemap: true,
      emptyOutDir: true,
      modulePreload: {
        polyfill: false,
      },
      rollupOptions: {
        input: {
          content: path.resolve(__dirname, 'src/entryPoints/main.css')
        },
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'main.css') return 'content.css';
            return 'assets/[name].[hash].[ext]';
          }
        }
      }
    },
  },
);
