import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiltersPage from './FilterPage';
import { vi, Mock } from 'vitest';
import * as newsApi from '../services/newsApi';

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

describe('FiltersPage (con userEvent)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

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

        // Aquí depende si en tu NewsCardSkeleton tienes data-testid
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
});
