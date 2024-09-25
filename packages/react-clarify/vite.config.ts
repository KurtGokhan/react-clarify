/// <reference types="vitest" />

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  return {
    appType: 'custom',
    plugins: [dts({ tsconfigPath: './tsconfig.app.json' })],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        preserveEntrySignatures: 'exports-only',
        external: ['react', 'jsx-middlewares'],
        input: {
          index: 'src/index.ts',
          'middlewares/index': 'src/middlewares/index.tsx',
        },
        output: [
          {
            format: 'esm',
            entryFileNames: (x) => `${x.name}.js`,
          },
          {
            format: 'cjs',
            entryFileNames: (x) => `${x.name}.cjs`,
          },
        ],
      },
    },
    test: {
      include: ['tests/**/*.spec.ts[x]'],
      globals: true,
      environment: 'jsdom',
    },
  };
});
