import { render, screen, fireEvent } from '@testing-library/react';
import Favorites from '../pages/Favorites';
import { vi, Mock } from 'vitest';
import * as localStorageUtils from '../utils/localStorage';
import { Article } from '../types/news';

// Mockeamos funciones de localStorage
vi.mock('../utils/localStorage', async () => {
    const actual = await vi.importActual('../utils/localStorage');
    return {
        ...actual,
        getFavorites: vi.fn(),
        removeFromFavorites: vi.fn(),
    };
});

const emptyText =
    'No hay noticias destacadas. Agrega algunas a tus favoritos para verlas aquí.';

describe('Favorites', () => {
    const mockArticles: Article[] = [
        {
            title: 'Noticia de prueba',
            description: 'Descripción de prueba',
            url: 'https://example.com',
            urlToImage: 'https://example.com/image.jpg',
            publishedAt: '2025-04-26T00:00:00Z',
            source: { id: '1', name: 'Fuente de prueba' },
            author: '',
            content: '',
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('muestra las noticias favoritas', () => {
        // Simulamos que getFavorites devuelve una noticia
        (localStorageUtils.getFavorites as Mock).mockReturnValue(mockArticles);

        render(<Favorites />);

        // Verificamos que el título de la noticia se muestre
        expect(screen.getByText('Noticia de prueba')).toBeInTheDocument();
    });

    it('muestra mensaje cuando no hay favoritos', () => {
        // Simulamos que getFavorites devuelve un array vacío
        (localStorageUtils.getFavorites as Mock).mockReturnValue([]);

        render(<Favorites />);

        // Verificamos que el mensaje se muestre
        expect(screen.getByText(emptyText)).toBeInTheDocument();
    });

    it('elimina una noticia favorita al hacer clic en eliminar', () => {
        (localStorageUtils.getFavorites as Mock)
            .mockReturnValueOnce(mockArticles) // Inicialmente hay una noticia
            .mockReturnValueOnce([]); // Después de eliminar, no hay ninguna

        render(<Favorites />);

        // Simulamos clic en el botón de guardar (que aquí es usado para eliminar)
        const removeButton = screen.getByRole('button');
        fireEvent.click(removeButton);

        // Verificamos que después de eliminar, se muestra el mensaje de vacío
        expect(screen.getByText(emptyText)).toBeInTheDocument();
    });
});
