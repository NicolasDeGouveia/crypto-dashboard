import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      // 'server-only' is a Next.js runtime guard — no-op in tests
      'server-only': path.resolve(__dirname, './vitest.server-only-mock.ts'),
    },
  },
})
