import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { beforeAll, describe, it, expect, vi } from 'vitest';
import { emptyFavoritesText } from './consts';

// Мокаем matchMedia для Vitest
beforeAll(() => {
    global.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
    }));
});

describe('App', () => {
    it('renderiza el Navbar siempre', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('redirige de "/" a "/category/general"', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(await screen.findByText(/General/i)).toBeInTheDocument();
    });

    it('renderiza Favorites en "/favorites"', async () => {
        render(
            <MemoryRouter initialEntries={['/favorites']}>
                <App />
            </MemoryRouter>
        );
        expect(await screen.findByText(emptyFavoritesText)).toBeInTheDocument();
    });

    it('renderiza FiltersPage en "/filters"', async () => {
        render(
            <MemoryRouter initialEntries={['/filters']}>
                <App />
            </MemoryRouter>
        );
        expect(
            await screen.findByPlaceholderText('Keyword')
        ).toBeInTheDocument();
    });

    it('renderiza Category en "/category/:category"', async () => {
        render(
            <MemoryRouter initialEntries={['/category/technology']}>
                <App />
            </MemoryRouter>
        );
        expect(await screen.findByText(/Technology/i)).toBeInTheDocument();
    });
});
