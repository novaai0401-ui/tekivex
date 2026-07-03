import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.{mjs,ts}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      // src/ai-support/** is the WebGPU / @mlc-ai/web-llm in-browser chat: it is
      // externalized from the build (see vite.config.ts rollupOptions.external)
      // and cannot run in jsdom, so it is not unit-tested. Vitest 4's coverage-v8
      // now counts never-imported files (vitest 2 did not), so excluding it keeps
      // the coverage metric scoped to testable code, as it was before the upgrade.
      // pdfCompress.ts additionally needs a real <canvas> and the pdf.js web
      // worker, neither of which exists in jsdom — same category as ai-support.
      exclude: ['src/main.tsx', 'src/**/*.d.ts', 'src/ai-support/**', 'src/tools/lib/pdfCompress.ts', 'src/tools/lib/pdfRender.ts'],
      thresholds: {
        lines: 65,
        functions: 60,
        branches: 55,
      },
    },
  },
});
