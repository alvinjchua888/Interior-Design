import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['components/**/*.tsx', 'services/**/*.ts'],
    },
    include: ['**/*.test.ts', '**/*.test.tsx'],
  },
});