/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { UserConfigExport } from 'vite'; // Добавляем тип
import tailwindcss from '@tailwindcss/vite';

const config: UserConfigExport = defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
    },
});

export default config;
