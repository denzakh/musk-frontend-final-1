import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Category from './Category';
import { BrowserRouter } from 'react-router-dom';
import * as newsApi from '../services/newsApi';
import * as localStorageUtils from '../utils/localStorage';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { wait } from '../utils/helpers';

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

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ category: 'general' }),
    };
});

vi.mock('../utils/localStorage', async () => {
    const actual = await vi.importActual('../utils/localStorage');
    return {
        ...actual,
        getFavorites: vi.fn().mockReturnValue([]),
        saveToFavorites: vi.fn(),
        removeFromFavorites: vi.fn(),
    };
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
});

describe('Category', () => {
    it('renderiza y muestra artículos', async () => {
        vi.spyOn(newsApi, 'getTopHeadlines').mockResolvedValue(mockArticles);

        render(
            <BrowserRouter>
                <Category />
            </BrowserRouter>
        );

        expect(screen.getAllByTitle(/skeleton/i).length).toBeGreaterThan(0);

        await waitFor(() =>
            expect(screen.getByText('Test Article')).toBeInTheDocument()
        );
    });

    it('se guarda en favoritos al hacer clic', async () => {
        vi.spyOn(newsApi, 'getTopHeadlines').mockResolvedValue(mockArticles);
        const saveSpy = vi.spyOn(localStorageUtils, 'saveToFavorites');

        render(
            <BrowserRouter>
                <Category />
            </BrowserRouter>
        );

        const articleText = await screen.findByText('Test Article');
        expect(articleText).toBeInTheDocument();

        const btn = screen.getByText('Add to Favorites');
        expect(btn).toBeInTheDocument();

        userEvent.click(btn);

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

        render(
            <BrowserRouter>
                <Category />
            </BrowserRouter>
        );

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
