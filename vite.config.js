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
  },
})
