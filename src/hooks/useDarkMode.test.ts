// src/hooks/useDarkMode.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from './useDarkMode';
import { vi } from 'vitest';

describe('useDarkMode', () => {
    // Mock de matchMedia para simular la preferencia del sistema
    const matchMediaMock = (matches: boolean) => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
                matches, // true si el sistema prefiere el modo oscuro
                media: query,
                onchange: null,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    };

    // Antes de cada prueba, limpiamos localStorage y removemos la clase 'dark'
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove('dark');
    });

    it('usa el modo oscuro si localStorage tiene "dark"', () => {
        localStorage.setItem('theme', 'dark');

        const { result } = renderHook(() => useDarkMode());

        expect(result.current[0]).toBe(true);
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('usa el modo claro si localStorage tiene "light"', () => {
        localStorage.setItem('theme', 'light');

        const { result } = renderHook(() => useDarkMode());

        expect(result.current[0]).toBe(false);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(localStorage.getItem('theme')).toBe('light');
    });

    it('sigue la preferencia del sistema si no hay valor en localStorage', () => {
        matchMediaMock(true); // el sistema prefiere modo oscuro

        const { result } = renderHook(() => useDarkMode());

        expect(result.current[0]).toBe(true);
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('alterna entre modo claro y oscuro', () => {
        localStorage.setItem('theme', 'light');
        const { result } = renderHook(() => useDarkMode());

        // Cambiar a modo oscuro
        act(() => {
            result.current[1](true);
        });

        expect(result.current[0]).toBe(true);
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('theme')).toBe('dark');

        // Cambiar a modo claro
        act(() => {
            result.current[1](false);
        });

        expect(result.current[0]).toBe(false);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(localStorage.getItem('theme')).toBe('light');
    });
});
