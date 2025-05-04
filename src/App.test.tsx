import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { beforeAll, describe, it, expect, vi } from 'vitest';
import { emptyFavoritesText } from './consts';
import * as newsApi from './services/newsApi';
import * as localStorageUtils from './utils/localStorage';
import userEvent from '@testing-library/user-event';
import { wait } from './utils/helpers';

const mockArticles = [
    {
        title: 'Noticia de prueba',
        url: 'https://example.com/test',
        urlToImage: 'https://placehold.co/300x200.png',
        publishedAt: '2023-01-01',
        description: 'Descripción de prueba',
        source: { id: '', name: 'Fuente de prueba' },
        author: 'Autor de prueba',
        content: 'Contenido de prueba',
    },
];

// Mock matchMedia for Vitest
beforeAll(() => {
    global.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
    }));
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
});

// Mockeamos funciones de la API de noticias
vi.mock('./services/newsApi', async () => {
    const actual = await vi.importActual('./services/newsApi');
    return {
        ...actual,
        getTopHeadlines: vi.fn(),
    };
});

// Mockeamos funciones de localStorage
vi.mock('./utils/localStorage', async () => {
    const actual = await vi.importActual('./utils/localStorage');
    return {
        ...actual,
        getFavorites: vi.fn(() => []),
        removeFromFavorites: vi.fn(),
        saveToFavorites: vi.fn(),
    };
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

    it('debería permitir agregar una noticia a favoritos', async () => {
        // Mockeamos la API y localStorage

        vi.spyOn(newsApi, 'getTopHeadlines').mockResolvedValue(mockArticles);

        const saveSpy = vi.spyOn(localStorageUtils, 'saveToFavorites');

        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // Esperamos que la noticia se cargue
        const articleTitle = await screen.findByText('Noticia de prueba');
        expect(articleTitle).toBeInTheDocument();

        // Simulamos clic en "Add to Favorites"
        const addToFavoritesButton = screen.getByText('Add to Favorites');
        userEvent.click(addToFavoritesButton);

        await wait(500);

        // Verificamos que se haya llamado a saveToFavorites
        expect(saveSpy).toHaveBeenCalledWith(mockArticles[0]);
    });

    it('debería manejar el cambio de tema (dark mode)', async () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // Verificamos que el tema inicial sea claro
        expect(document.documentElement.classList.contains('dark')).toBe(false);

        // Simulamos clic en el botón de cambio de tema
        const toggleThemeButton = screen.getByTitle('switch theme');
        userEvent.click(toggleThemeButton);

        // Verificamos que el tema cambie a oscuro
        await waitFor(() => {
            expect(document.documentElement.classList.contains('dark')).toBe(
                true
            );
        });
    });
});
