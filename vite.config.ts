/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { UserConfigExport } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const config: UserConfigExport = defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        coverage: {
            provider: 'v8',
            include: ['src/**'],
            exclude: ['src/main.tsx'],
            reporter: ['text', 'json-summary', 'json'],
            reportOnFailure: true,
        },
    },
});

export default config;
