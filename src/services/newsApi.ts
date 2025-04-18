import axios from 'axios';
import { Article } from '../types/news';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export const getTopHeadlines = async (
    category: string = 'general',
    q: string = '',
    source: string = ''
): Promise<Article[]> => {
    const params = {
        apiKey: API_KEY,
        category: category === 'all' ? '' : category,
        q,
        sources: source,
    };

    const { data } = await axios.get(`${BASE_URL}/top-headlines`, { params });
    return data.articles;
};
