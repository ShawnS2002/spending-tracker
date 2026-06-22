import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vitest transforms test files with esbuild, which defaults to the classic JSX
  // runtime. Force the automatic runtime there. Scope it to test runs only so it
  // doesn't clash with the oxc-based dev/build pipeline (which the React plugin
  // already configures).
  ...(globalThis.process?.env?.VITEST ? { esbuild: { jsx: 'automatic' } } : {}),
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
    // Unit + integration tests live under src/ as *.test.jsx / *.integration.test.jsx
    // (both end in .test.*). Playwright e2e specs live in e2e/ as *.spec.js and must
    // NOT be collected by Vitest.
    include: ['src/**/*.test.{js,jsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
})
