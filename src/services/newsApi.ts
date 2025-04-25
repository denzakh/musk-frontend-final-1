import axios from 'axios';
import { Article } from '../types/news';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

/**
 * Obtiene las noticias más recientes de una categoría o búsqueda.
 * @param category - La categoría de noticias (por ejemplo, 'business', 'entertainment', 'general', etc.).
 * @param q - La palabra clave para la búsqueda.
 * @param source - El origen de las noticias.
 * @returns Una lista de artículos de noticias.
 */
export const getTopHeadlines = async (
    category: string = 'general',
    q: string = '',
    source: string = ''
): Promise<Article[]> => {
    if (!API_KEY) {
        throw new Error('API_KEY no está definido.');
    }

    const params = {
        apiKey: API_KEY,
        category: category === 'all' ? '' : category,
        q,
        sources: source,
    };

    try {
        const response = await axios.get(`${BASE_URL}/top-headlines`, {
            params,
        });
        return response.data.articles || [];
    } catch (error: unknown) {
        console.error('Error al obtener noticias:', error);

        if (!API_KEY) {
            throw new Error('API_KEY no está definido.');
        }

        throw new Error(
            'No se pudieron obtener las noticias. Intenta nuevamente más tarde.'
        );
    }
};
