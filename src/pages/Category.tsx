import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopHeadlines } from '../services/newsApi';
import { Article } from '../types/news';
import NewsCard from '../components/NewsCard';
import { saveToFavorites } from '../utils/localStorage';
import { getFavorites, removeFromFavorites } from '../utils/localStorage';
import NewsCardSkeleton from '../components/NewsCardSkeleton';

const Category = () => {
    const { category } = useParams();
    const [articles, setArticles] = useState<Article[]>([]);
    const query = '';
    const source = '';
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArticles = () => {
            if (category) {
                setLoading(true);
                getTopHeadlines(category, query, source)
                    .then(setArticles)
                    .finally(() => setLoading(false));
            }
        };
        fetchArticles();
    }, [category]);

    const [favorites, setFavorites] = useState<Article[]>([]);

    const updateFavorites = () => {
        setFavorites(getFavorites());
    };

    useEffect(() => {
        updateFavorites();
    }, []);

    const handleRemoveFavorites = (article: Article) => {
        removeFromFavorites(article.url);
        updateFavorites();
    };

    const handleSaveFavorites = (article: Article) => {
        saveToFavorites(article);
        updateFavorites();
    };

    const isInFavorites = (article: Article) => {
        console.log(favorites);
        if (favorites.some((item) => item.url === article.url)) {
            return {
                onSave: () => handleRemoveFavorites(article),
                isFavorite: true,
            };
        }
        return {
            onSave: () => handleSaveFavorites(article),
            isFavorite: false,
        };
    };

    return (
        <div className='p-4'>
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                {loading
                    ? Array(6)
                          .fill(1)
                          .map((_, i) => <NewsCardSkeleton key={i} />)
                    : articles.map((article, idx) => (
                          <NewsCard
                              key={idx}
                              article={article}
                              {...isInFavorites(article)}
                          />
                      ))}
            </div>
        </div>
    );
};

export default Category;
