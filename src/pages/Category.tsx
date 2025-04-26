import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopHeadlines } from '../services/newsApi';
import { Article } from '../types/news';
import NewsCard from '../components/NewsCard';
import * as localStorageUtils from '../utils/localStorage';
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
        setFavorites(localStorageUtils.getFavorites());
    };

    useEffect(() => {
        updateFavorites();
    }, []);

    const handleRemoveFavorites = (article: Article) => {
        localStorageUtils.removeFromFavorites(article.url);
        updateFavorites();
    };

    const handleSaveFavorites = (article: Article) => {
        localStorageUtils.saveToFavorites(article);
        updateFavorites();
    };

    const isInFavorites = (article: Article) => {
        return favorites.some((item) => item.url === article.url);
    };

    return (
        <div className='p-4'>
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                {loading
                    ? Array(6)
                          .fill(1)
                          .map((_, i) => <NewsCardSkeleton key={i} />)
                    : articles.map((article) =>
                          isInFavorites(article) ? (
                              <NewsCard
                                  key={article.url}
                                  article={article}
                                  onSave={() => handleRemoveFavorites(article)}
                                  isFavorite
                              />
                          ) : (
                              <NewsCard
                                  key={article.url}
                                  article={article}
                                  onSave={() => handleSaveFavorites(article)}
                              />
                          )
                      )}
            </div>
        </div>
    );
};

export default Category;
