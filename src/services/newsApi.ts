import axios from 'axios';
import { Article } from '../types/news';
import { getApiKey } from './config';

const API_KEY = getApiKey();
const BASE_URL = import.meta.env.VITE_NEWS_API_URL;

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
        const response = await axios.get(`${BASE_URL}`, {
            params,
        });
        return response.data.articles || [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        throw new Error(
            'No se pudieron obtener las noticias. Intenta nuevamente más tarde.'
        );
    }
};
