import { getTopHeadlines } from '../services/newsApi';
import { Article } from '../types/news';
import NewsCard from '../components/NewsCard';
import * as localStorageUtils from '../utils/localStorage';
import NewsCardSkeleton from '../components/NewsCardSkeleton';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { emptyFavoritesText } from '../consts';

const FiltersPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [query, setQuery] = useState('');
    const [source, setSource] = useState('');
    const [loading, setLoading] = useState(false);
    const [sourcesList, setSourcesList] = useState<
        { id: string; name: string }[]
    >([]);

    const category = '';

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const { data } = await axios.get(
                    'https://newsapi.org/v2/top-headlines/sources',
                    {
                        params: {
                            apiKey: import.meta.env.VITE_NEWS_API_KEY,
                        },
                    }
                );
                setSourcesList(data.sources);
            } catch (error) {
                console.error('Error loading sources:', error);
            }
        };
        if (sourcesList.length === 0) {
            fetchSources();
        }
    }, [sourcesList.length]);

    const fetchArticles = () => {
        setLoading(true);
        getTopHeadlines(category, query, source)
            .then(setArticles)
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    };

    const handleApply = () => {
        fetchArticles();
    };

    const handleReset = () => {
        setQuery('');
        setSource('');
        setArticles([]);
    };

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
            <div className='p-4 pt-0 flex flex-wrap sm:flex-row gap-4 items-center justify-center'>
                <input
                    type='text'
                    placeholder='Keyword'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className='p-2 rounded border'
                />

                <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className='p-2 rounded border'
                >
                    <option value='' className='text-black'>
                        All sources
                    </option>
                    {sourcesList.map((s) => (
                        <option key={s.id} value={s.id} className='text-black'>
                            {s.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleApply}
                    className='bg-blue-500 text-white p-2 rounded cursor-pointer'
                >
                    Apply <span className='hidden md:inline'>filter</span>
                </button>
                <button
                    onClick={handleReset}
                    className='bg-red-800 text-white p-2 rounded cursor-pointer'
                >
                    Reset
                </button>
            </div>
            {articles.length === 0 && (
                <div className='mb-4 flex justify-center text-sm text-neutral-500'>
                    {emptyFavoritesText}
                </div>
            )}
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

export default FiltersPage;
