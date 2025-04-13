import { useEffect, useState } from 'react';
import { Article } from '../types/news';
import { getFavorites, removeFromFavorites } from '../utils/localStorage';
import NewsCard from '../components/NewsCard';

const Favorites = () => {
    const [favorites, setFavorites] = useState<Article[]>([]);

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    const handleRemove = (url: string) => {
        removeFromFavorites(url);
        setFavorites(getFavorites());
    };

    console.log(favorites);

    return (
        <div className='p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            {favorites.length > 0 ? (
                favorites.map((article, idx) => (
                    <NewsCard
                        key={idx}
                        article={article}
                        onSave={() => handleRemove(article.url)}
                        isFavorite
                    />
                ))
            ) : (
                <p className='text-center col-span-full'>
                    Нет избранных новостей
                </p>
            )}
        </div>
    );
};

export default Favorites;
