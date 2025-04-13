import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopHeadlines } from '../services/newsApi';
import { Article } from '../types/news';
import NewsCard from '../components/NewsCard';
import { saveToFavorites } from '../utils/localStorage';
import Filters from '../components/Filters';
import { getFavorites, removeFromFavorites } from '../utils/localStorage';
import NewsCardSkeleton from '../components/NewsCardSkeleton';

const Category = () => {
    const { category } = useParams();
    const [articles, setArticles] = useState<Article[]>([]);
    const [query, setQuery] = useState('');
    const [date, setDate] = useState('');
    const [source, setSource] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchArticles = () => {
        if (category) {
            setLoading(true);
            getTopHeadlines(category, query, date, source)
                .then(setArticles)
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetchArticles();
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
            <Filters
                onFilter={(q, d, s) => {
                    setQuery(q);
                    setDate(d);
                    setSource(s);
                    setTimeout(fetchArticles, 0);
                }}
            />
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
