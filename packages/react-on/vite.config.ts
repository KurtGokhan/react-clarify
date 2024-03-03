import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    appType: 'custom',
    plugins: [dts()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        preserveEntrySignatures: 'exports-only',
        external: ['react', 'react-is', 'jsx-middlewares'],
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
  };
});
