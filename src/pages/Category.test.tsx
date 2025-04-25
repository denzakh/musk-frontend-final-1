// src/pages/Category.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import Category from './Category';
import { BrowserRouter } from 'react-router-dom';
import * as newsApi from '../services/newsApi';
import * as localStorageUtils from '../utils/localStorage';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const mockArticles = [
    {
        title: 'Test Article',
        url: 'https://example.com/test',
        urlToImage: 'https://example.com/image.jpg',
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
        getFavorites: () => vi.fn().mockReturnValue([]),
        saveToFavorites: () => vi.fn(),
        removeFromFavorites: vi.fn(),
    };
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
        // const saveSpy = vi.spyOn(localStorageUtils, 'saveToFavorites');

        render(
            <BrowserRouter>
                <Category />
            </BrowserRouter>
        );

        await screen.findByText('Test Article');
        const btn = screen.getByText('Add to Favorites');
        userEvent.click(btn);

        console.log(localStorageUtils);

        // expect(saveSpy).toHaveBeenCalledWith(mockArticles[0]);
    });
});
