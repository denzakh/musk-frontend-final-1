import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import NewsCard from './NewsCard';
import { Article } from '../types/news';

// Моки изображений
vi.mock('../assets/bookmark.svg', () => ({ default: 'mocked-bookmark.svg' }));

const mockOnSave = vi.fn();
const mockArticle: Article = {
    title: 'Test Article',
    description: 'This is a test description.',
    publishedAt: '2025-04-10T00:00:00Z',
    urlToImage: 'https://via.placeholder.com/150',
    url: 'https://example.com',
    source: { id: 'id', name: 'name' },
    author: '',
    content: '',
};

describe('NewsCard', () => {
    it('debe renderizar la tarjeta de noticia correctamente', () => {
        render(<NewsCard article={mockArticle} />);

        expect(screen.getByText(mockArticle.title)).toBeInTheDocument();

        expect(
            screen.getByText(
                new Date(mockArticle.publishedAt).toLocaleDateString()
            )
        ).toBeInTheDocument();

        expect(screen.getByText(mockArticle.description)).toBeInTheDocument();

        expect(screen.getByText('Read the article')).toHaveAttribute(
            'href',
            mockArticle.url
        );

        expect(screen.getByRole('img')).toHaveAttribute(
            'src',
            mockArticle.urlToImage
        );
    });

    it('debe llamar a onSave cuando se haga clic en el botón "Add to Favorites"', () => {
        render(<NewsCard article={mockArticle} onSave={mockOnSave} />);

        const button = screen.getByText('Add to Favorites');
        fireEvent.click(button);

        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledWith(mockArticle);
    });

    it('debe cambiar el texto del botón a "Remove from favorites" cuando el artículo es favorito', () => {
        render(
            <NewsCard
                article={mockArticle}
                isFavorite={true}
                onSave={mockOnSave}
            />
        );

        const button = screen.getByText('Remove from favorites');
        expect(button).toBeInTheDocument();
    });

    it('debe mostrar el icono de favorito cuando el artículo es favorito', () => {
        render(<NewsCard article={mockArticle} isFavorite={true} />);

        const bookmarkIcon = screen.getByRole('img');
        expect(bookmarkIcon).toHaveAttribute('src', 'mocked-bookmark.svg');
    });

    it('debe mostrar la imagen del artículo si existe', () => {
        render(<NewsCard article={mockArticle} />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', mockArticle.urlToImage);
    });

    it('no debe mostrar la imagen si no existe', () => {
        const articleWithoutImage = { ...mockArticle, urlToImage: null };
        render(<NewsCard article={articleWithoutImage} />);

        const image = screen.queryByRole('img');
        expect(image).toBeNull();
    });

    it('snapshot', () => {
        const { asFragment } = render(<NewsCard article={mockArticle} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
