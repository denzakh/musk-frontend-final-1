import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopHeadlines } from '../services/newsApi';
import { Article } from '../types/news';
import NewsCard from '../components/NewsCard';
import { saveToFavorites } from '../utils/localStorage';

const Category = () => {
    const { category } = useParams();
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        if (category) {
            getTopHeadlines(category).then(setArticles);
        }
    }, [category]);

    return (
        <div className='p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            {articles.map((article, idx) => (
                <NewsCard
                    key={idx}
                    article={article}
                    onSave={saveToFavorites}
                />
            ))}
        </div>
    );
};

export default Category;
