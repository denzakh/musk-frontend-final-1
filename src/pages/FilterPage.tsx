import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopHeadlines } from '../services/newsApi';
import { Article } from '../types/news';
import NewsCard from '../components/NewsCard';
import { saveToFavorites } from '../utils/localStorage';
import { getFavorites, removeFromFavorites } from '../utils/localStorage';
import NewsCardSkeleton from '../components/NewsCardSkeleton';
import axios from 'axios';

const FiltersPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const query = '';
    const date = '';
    const source = '';
    const [loading, setLoading] = useState(false);
    const [sourcesList, setSourcesList] = useState<
        { id: string; name: string }[]
    >([]);

    const category = '';

    console.log(source);

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
        // fetchSources();
    }, []);

    const handleApply = () => {
        // onFilter(query, date, source);
    };

    const handleReset = () => {
        setQuery('');
        setDate('');
        setSource('');
        setSourcesList([]);
        // onFilter(query, date, source);
    };

    const fetchArticles = () => {
        if (category) {
            setLoading(true);
            getTopHeadlines(category, query, date, source)
                .then(setArticles)
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        // fetchArticles();
    }, [category]);

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
            <div className='p-4 flex flex-wrap sm:flex-row gap-4 items-center justify-center'>
                <input
                    type='text'
                    placeholder='Keyword'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className='p-2 rounded border'
                />
                <input
                    type='date'
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className='p-2 rounded border'
                />

                {category === 'all' && (
                    <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className='p-2 rounded border'
                    >
                        <option value=''>All sources</option>
                        {sourcesList.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                )}

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
