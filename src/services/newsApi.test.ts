import { describe, it, expect, vi, Mock } from 'vitest';
import axios from 'axios';
import { getTopHeadlines } from './newsApi';
import { Article } from '../types/news';
import { getApiKey } from '../config';

const article1: Article = {
    url: 'https://example.com/1',
    title: 'Test Article 1',
    urlToImage: 'https://placehold.co/300x200.png',
    publishedAt: '2023-01-01',
    description: 'Test description',
    source: { id: '', name: '' },
    author: '',
    content: '',
};
const article2: Article = {
    url: 'https://example.com/2',
    title: 'Test Article 2',
    urlToImage: 'https://placehold.co/300x200.png',
    publishedAt: '2023-01-01',
    description: 'Test description',
    source: { id: '', name: '' },
    author: '',
    content: '',
};
vi.mock('axios', async (importOriginal) => {
    const actual = await importOriginal();

    if (typeof actual !== 'object' || actual === null) {
        throw new Error('Axios mock failed to load correctly.');
    }

    if (!('default' in actual)) {
        throw new Error('Axios mock does not have a default export.');
    }

    return {
        ...actual,
        default: {
            ...(typeof actual.default === 'object' && actual.default !== null
                ? actual.default
                : {}),
            get: vi.fn(), // Creamos una función falsa para axios.get
        },
    };
});

afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
});

describe('getTopHeadlines', () => {
    it('debería devolver una lista de artículos', async () => {
        // Datos simulados para el test
        const mockArticles: Article[] = [article1, article2];

        // Mokeamos la respuesta de axios
        (axios.get as Mock).mockResolvedValue({
            data: { articles: mockArticles },
        });

        // Llamamos a la función getTopHeadlines
        const articles = await getTopHeadlines();

        // Verificamos que la respuesta sea la esperada
        expect(articles).toEqual(mockArticles);
    });

    it('debería devolver una lista vacía si no hay artículos', async () => {
        // Mokeamos la respuesta de axios con una lista vacía
        (axios.get as Mock).mockResolvedValue({
            data: { articles: [] },
        });

        // Llamamos a la función getTopHeadlines
        const articles = await getTopHeadlines();

        // Verificamos que la respuesta sea una lista vacía
        expect(articles).toEqual([]);
    });

    it('debería manejar un error 404 correctamente', async () => {
        // Mokeamos un error 404 en axios
        (axios.get as Mock).mockRejectedValue({
            response: { status: 404, statusText: 'Not Found' },
        });

        // Llamamos a la función y esperamos que lance un error
        await expect(getTopHeadlines()).rejects.toThrow(
            'No se pudieron obtener las noticias. Intenta nuevamente más tarde.'
        );
    });

    it('debería manejar un error de red correctamente', async () => {
        // Mokeamos un error de red
        (axios.get as Mock).mockRejectedValue(new Error('Network Error'));

        // Llamamos a la función y esperamos que lance un error
        await expect(getTopHeadlines()).rejects.toThrow(
            'No se pudieron obtener las noticias. Intenta nuevamente más tarde.'
        );
    });

    it('debería manejar un error de tiempo de espera correctamente', async () => {
        // Mokeamos un error de tiempo de espera en axios
        (axios.get as Mock).mockRejectedValue({
            code: 'ECONNABORTED',
            message: 'timeout of 0ms exceeded',
        });

        // Llamamos a la función y esperamos que lance un error
        await expect(getTopHeadlines()).rejects.toThrow(
            'No se pudieron obtener las noticias. Intenta nuevamente más tarde.'
        );
    });

    it('debería manejar un error de respuesta sin datos correctamente', async () => {
        // Mokeamos ответ без данных
        (axios.get as Mock).mockResolvedValue({});

        // Ожидаем, что функция выбросит ошибку
        await expect(getTopHeadlines()).rejects.toThrow(
            'No se pudieron obtener las noticias. Intenta nuevamente más tarde.'
        );
    });

    it('debería manejar un error genérico correctamente', async () => {
        // Mokeamos un error genérico en axios
        (axios.get as Mock).mockRejectedValue(new Error('Generic Error'));

        // Llamamos a la función y verificamos que lance un error genérico
        await expect(getTopHeadlines()).rejects.toThrow(
            'No se pudieron obtener las noticias. Intenta nuevamente más tarde.'
        );
    });

    it('debería manejar un error sin mensaje correctamente', async () => {
        // Mokeamos un error sin mensaje en axios
        (axios.get as Mock).mockRejectedValue({});

        // Llamamos a la función y verificamos que lance un error genérico
        await expect(getTopHeadlines()).rejects.toThrow(
            'No se pudieron obtener las noticias. Intenta nuevamente más tarde.'
        );
    });

    it('debería manejar un error con código de estado desconocido', async () => {
        // Mokeamos un error con un código de estado desconocido
        (axios.get as Mock).mockRejectedValue({
            response: {
                status: 500,
                statusText: 'Internal Server Error',
            },
        });

        // Llamamos a la función y verificamos que lance un error genérico
        await expect(getTopHeadlines()).rejects.toThrow(
            'No se pudieron obtener las noticias. Intenta nuevamente más tarde.'
        );
    });

    it('debería devolver una lista vacía si la respuesta no contiene artículos', async () => {
        // Mokeamos una respuesta sin artículos
        (axios.get as Mock).mockResolvedValue({
            data: { articles: null },
        });

        // Llamamos a la función y verificamos que devuelva una lista vacía
        const articles = await getTopHeadlines();
        expect(articles).toEqual([]);
    });

    // it('debería manejar errores correctamente', async () => {
    //     // Mokeamos un error en axios (por ejemplo, un error de red)
    //     (axios.get as Mock).mockRejectedValue(new Error('Network Error'));

    //     // Llamamos a la función y esperamos que lance un error
    //     try {
    //         await getTopHeadlines();
    //     } catch (error) {
    //         // Verificamos que el error sea de tipo Error y que el mensaje sea el esperado
    //         expect(error).toBeInstanceOf(Error);
    //     }
    // });

    it('debería lanzar un error si la API_KEY no está definida', async () => {
        // Мокаем getApiKey ТОЛЬКО для этого теста
        vi.doMock('./config', () => ({
            getApiKey: () => '', // Возвращаем пустую строку
        }));

        // Импортируем модуль заново, чтобы подхватился мок
        const { getTopHeadlines } = await import('./newsApi');

        await expect(getTopHeadlines()).rejects.toThrow(
            'API_KEY no está definido.'
        );

        // Сброс моков и модулей после теста
        vi.resetModules();
        vi.clearAllMocks();
    });
});
