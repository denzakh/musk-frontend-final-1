import { getTopHeadlines } from '../services/newsApi';
import { Article } from '../types/news';
import NewsCard from '../components/NewsCard';
import { saveToFavorites } from '../utils/localStorage';
import { getFavorites, removeFromFavorites } from '../utils/localStorage';
import NewsCardSkeleton from '../components/NewsCardSkeleton';
import axios from 'axios';
import { useEffect, useState } from 'react';

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
    }, []);

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

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    const handleRemove = (url: string) => {
        removeFromFavorites(url);
        setFavorites(getFavorites());
    };

    const isInFavorites = (article: Article) => {
        if (
            favorites.some((item) => item.publishedAt === article.publishedAt)
        ) {
            return {
                onSave: () => handleRemove(article.url),
                isFavorite: true,
            };
        }
        return {
            onSave: saveToFavorites,
            isFavorite: false,
        };
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
                    Select one or more filters. Empty queries will be ignored.
                </div>
            )}
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

export default FiltersPage;
