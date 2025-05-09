import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiltersPage from './FilterPage';
import { vi, Mock } from 'vitest';
import * as newsApi from '../services/newsApi';
import { emptyFiltersText } from '../consts';
import axios from 'axios';
import { wait } from '../utils/helpers';
import * as localStorageUtils from '../utils/localStorage';

const mockArticles = [
    {
        title: 'Test Article',
        url: 'https://example.com/test',
        urlToImage: 'https://placehold.co/300x200.png',
        publishedAt: '2023-01-01',
        description: 'Test description',
        source: { id: '', name: '' },
        author: '',
        content: '',
    },
];

// Mockeamos axios
vi.mock('axios');

// Mockeamos funciones de la API de noticias
vi.mock('../services/newsApi', async () => {
    const actual = await vi.importActual('../services/newsApi');
    return {
        ...actual,
        getTopHeadlines: vi.fn(),
    };
});

// Mockeamos funciones de localStorage
vi.mock('../utils/localStorage', async () => {
    const actual = await vi.importActual('../utils/localStorage');
    return {
        ...actual,
        getFavorites: vi.fn(() => []),
        removeFromFavorites: vi.fn(),
        saveToFavorites: vi.fn(),
    };
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
});

describe('FiltersPage (con userEvent)', () => {
    it('muestra los filtros de búsqueda', () => {
        render(<FiltersPage />);

        expect(screen.getByPlaceholderText('Keyword')).toBeInTheDocument();
        expect(screen.getByText('All sources')).toBeInTheDocument();
    });

    it('permite aplicar filtros y muestra artículos', async () => {
        (newsApi.getTopHeadlines as Mock).mockResolvedValue([
            {
                title: 'Artículo de prueba',
                description: 'Descripción de prueba',
                url: 'https://example.com',
                urlToImage: 'https://example.com/image.jpg',
                publishedAt: '2025-04-26T00:00:00Z',
                source: { name: 'Fuente de prueba' },
                author: '',
                content: '',
            },
        ]);

        render(<FiltersPage />);
        const user = userEvent.setup();

        const applyButton = screen.getByRole('button', { name: /Apply/i });
        await user.click(applyButton);

        await waitFor(() => {
            expect(screen.getByText('Artículo de prueba')).toBeInTheDocument();
        });
    });

    it('resetea los filtros correctamente', async () => {
        render(<FiltersPage />);
        const user = userEvent.setup();

        const input = screen.getByPlaceholderText('Keyword');
        await user.type(input, 'Test');

        expect((input as HTMLInputElement).value).toBe('Test');

        const resetButton = screen.getByRole('button', { name: /Reset/i });
        await user.click(resetButton);

        expect((input as HTMLInputElement).value).toBe('');
    });

    it('muestra los skeletons mientras carga', async () => {
        (newsApi.getTopHeadlines as Mock).mockImplementation(
            () => new Promise(() => {})
        );

        render(<FiltersPage />);
        const user = userEvent.setup();

        const applyButton = screen.getByRole('button', { name: /Apply/i });
        await user.click(applyButton);

        expect(await screen.findAllByTestId('news-card-skeleton')).toHaveLength(
            6
        );
    });

    it('resetea los filtros y limpia los artículos mostrados', async () => {
        (newsApi.getTopHeadlines as Mock).mockResolvedValue([
            {
                title: 'Artículo de prueba para reset',
                description: 'Descripción de prueba',
                url: 'https://example.com/reset',
                urlToImage: 'https://example.com/image-reset.jpg',
                publishedAt: '2025-04-26T00:00:00Z',
                source: { name: 'Fuente de reset' },
            },
        ]);

        render(<FiltersPage />);
        const user = userEvent.setup();

        // Aplicamos un filtro para cargar un artículo
        const applyButton = screen.getByRole('button', { name: /Apply/i });
        await user.click(applyButton);

        // Esperamos a que aparezca el artículo
        await waitFor(() => {
            expect(
                screen.getByText('Artículo de prueba para reset')
            ).toBeInTheDocument();
        });

        // Hacemos clic en "Reset"
        const resetButton = screen.getByRole('button', { name: /Reset/i });
        await user.click(resetButton);

        // Verificamos que el input esté vacío
        const input = screen.getByPlaceholderText('Keyword');
        expect((input as HTMLInputElement).value).toBe('');

        // Verificamos que el artículo ya no esté en el documento
        await waitFor(() => {
            expect(
                screen.queryByText('Artículo de prueba para reset')
            ).not.toBeInTheDocument();
        });
    });

    // Verifica que se muestre el texto cuando no hay artículos
    it('debería mostrar el texto cuando no hay artículos', async () => {
        render(<FiltersPage />);
        expect(screen.getByText(emptyFiltersText)).toBeInTheDocument();
    });

    // Verifica que se muestren los esqueletos mientras se cargan los artículos
    it('debería mostrar esqueletos mientras se cargan los artículos', async () => {
        (newsApi.getTopHeadlines as Mock).mockImplementation(
            () => new Promise(() => {}) // Simula una carga infinita
        );

        render(<FiltersPage />);
        const user = userEvent.setup();

        const applyButton = screen.getByRole('button', {
            name: /Apply filter/i,
        });
        await user.click(applyButton);

        expect(await screen.findAllByTestId('news-card-skeleton')).toHaveLength(
            6
        );
    });

    // Verifica que los artículos se muestren correctamente
    it('debería mostrar los artículos correctamente', async () => {
        const mockArticles = [
            {
                url: 'https://example.com/1',
                title: 'Artículo de prueba 1',
                urlToImage: 'https://placehold.co/300x200.png',
                publishedAt: '2023-01-01',
                description: 'Descripción de prueba',
                source: { id: '', name: '' },
                author: '',
                content: '',
            },
        ];

        (newsApi.getTopHeadlines as Mock).mockResolvedValue(mockArticles);

        render(<FiltersPage />);
        const user = userEvent.setup();

        const applyButton = screen.getByRole('button', {
            name: /Apply filter/i,
        });
        await user.click(applyButton);

        expect(
            await screen.findByText('Artículo de prueba 1')
        ).toBeInTheDocument();
    });

    it('debería cargar y mostrar las fuentes correctamente', async () => {
        // Mockeamos la respuesta de axios.get para las fuentes
        (axios.get as Mock).mockResolvedValue({
            data: {
                sources: [
                    { id: 'source1', name: 'Fuente 1' },
                    { id: 'source2', name: 'Fuente 2' },
                ],
            },
        });

        render(<FiltersPage />);

        // Esperamos a que las fuentes se carguen y se muestren en el select
        await waitFor(() => {
            expect(screen.getByText('Fuente 1')).toBeInTheDocument();
            expect(screen.getByText('Fuente 2')).toBeInTheDocument();
        });
    });

    it('debería manejar errores al cargar las fuentes', async () => {
        // Mockeamos un error en axios.get
        (axios.get as Mock).mockRejectedValue(
            new Error('Error al cargar fuentes')
        );

        render(<FiltersPage />);

        // Verificamos que no se muestren opciones adicionales en el select
        await waitFor(() => {
            expect(screen.queryByText('Fuente 1')).not.toBeInTheDocument();
            expect(screen.queryByText('Fuente 2')).not.toBeInTheDocument();
        });
    });

    it('se guarda en favoritos al hacer clic', async () => {
        // Mockeamos getTopHeadlines para devolver artículos
        vi.spyOn(newsApi, 'getTopHeadlines').mockResolvedValue(mockArticles);

        // Mockeamos saveToFavorites
        const saveSpy = vi.spyOn(localStorageUtils, 'saveToFavorites');

        render(<FiltersPage />);

        const user = userEvent.setup();

        const applyButton = screen.getByRole('button', {
            name: /Apply filter/i,
        });
        await user.click(applyButton);

        await wait(500);

        // Verificamos que el artículo se muestra desde getTopHeadlines
        const articleText = await screen.findByText('Test Article');
        expect(articleText).toBeInTheDocument();

        // Simulamos clic en el botón "Add to Favorites"
        const btn = screen.getByText('Add to Favorites');
        expect(btn).toBeInTheDocument();

        userEvent.click(btn);

        // Esperamos que saveToFavorites sea llamado con el artículo correcto
        await wait(500);
        expect(saveSpy).toHaveBeenCalledWith(mockArticles[0]);
    });

    it('eliminar tarjeta de favoritos', async () => {
        // Mockeamos getTopHeadlines para devolver artículos
        vi.spyOn(newsApi, 'getTopHeadlines').mockResolvedValue(mockArticles);

        // Mockeamos getFavorites para devolver el mismo artículo
        vi.spyOn(localStorageUtils, 'getFavorites').mockReturnValue([
            mockArticles[0],
        ]);

        const removeFn = vi.spyOn(localStorageUtils, 'removeFromFavorites');

        render(<FiltersPage />);

        const user = userEvent.setup();

        const applyButton = screen.getByRole('button', {
            name: /Apply filter/i,
        });
        await user.click(applyButton);

        await wait(500);

        // Verificamos que el artículo se muestra desde getTopHeadlines
        const articleFromApi = await screen.findByText('Test Article');
        expect(articleFromApi).toBeInTheDocument();

        // Verificamos que el artículo también se muestra desde localStorage
        const articleFromFavorites = screen.getByText('Test Article');
        expect(articleFromFavorites).toBeInTheDocument();

        // Comparamos que ambos artículos son el mismo
        expect(articleFromApi).toEqual(articleFromFavorites);

        const removeButton = screen.getByText('Remove from favorites');
        expect(removeButton).toBeInTheDocument();

        fireEvent.click(removeButton);

        await wait(500);

        expect(removeFn).toHaveBeenCalledWith(mockArticles[0].url);
        expect(removeFn).toHaveBeenCalledTimes(1);
    });
});
