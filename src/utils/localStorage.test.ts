import { describe, it, expect } from 'vitest';
import {
    saveToFavorites,
    getFavorites,
    removeFromFavorites,
} from './localStorage';
import { Article } from '../types/news';

// Mokeamos localStorage para los tests
const mockLocalStorage = (function () {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        length: Object.keys(store).length,
        key: (index: number) => Object.keys(store)[index] || null,
    };
})();

// Asignamos el mock a localStorage global
global.localStorage = mockLocalStorage;

describe('Funciones de localStorage', () => {
    // Limpiamos el mock después de cada prueba
    afterEach(() => {
        mockLocalStorage.clear();
    });

    it('debería guardar un artículo en favoritos', () => {
        const article: Article = {
            url: 'https://example.com',
            title: 'Test Article',
            urlToImage: 'https://placehold.co/300x200.png',
            publishedAt: '2023-01-01',
            description: 'Test description',
            source: { id: '', name: '' },
            author: '',
            content: '',
        };

        // Guardamos el artículo en favoritos
        saveToFavorites(article);

        // Obtenemos los favoritos y verificamos que el artículo fue agregado
        const favorites = getFavorites();
        expect(favorites).toHaveLength(1); // Verificamos que haya un artículo
        expect(favorites[0]).toEqual(article); // Verificamos que el artículo guardado sea el correcto
    });

    it('debería devolver un arreglo vacío si no hay artículos favoritos', () => {
        // Si no hay artículos en favoritos, getFavorites debería devolver un arreglo vacío
        const favorites = getFavorites();
        expect(favorites).toEqual([]); // Verificamos que el arreglo esté vacío
    });

    it('debería eliminar un artículo de favoritos por su URL', () => {
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

        // Guardamos dos artículos
        saveToFavorites(article1);
        saveToFavorites(article2);

        // Eliminamos el primer artículo
        removeFromFavorites('https://example.com/1');

        // Verificamos que solo quede el segundo artículo en favoritos
        const favorites = getFavorites();
        expect(favorites).toHaveLength(1);
        expect(favorites[0]).toEqual(article2);
    });

    it('debería manejar correctamente los datos inválidos en localStorage', () => {
        // Mokeamos datos inválidos en localStorage
        mockLocalStorage.setItem('favorites', '{json inválido}');

        // getFavorites debería devolver un arreglo vacío si ocurre un error de parseo
        const favorites = getFavorites();
        expect(favorites).toEqual([]); // Verificamos que el arreglo esté vacío
    });

    it('no debería fallar si localStorage no está disponible', () => {
        // Guardamos la referencia original de localStorage
        const originalLocalStorage = global.localStorage;

        // Desactivamos localStorage en el entorno de pruebas
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        global.localStorage = null as unknown as any;

        // Intentamos guardar un artículo, debería no hacer nada ya que localStorage no está disponible
        const result = saveToFavorites({
            url: 'https://example.com',
            title: 'Test',
            urlToImage: 'https://placehold.co/300x200.png',
            publishedAt: '2023-01-01',
            description: 'Test description',
            source: { id: '', name: '' },
            author: '',
            content: '',
        });

        // Verificamos que no haya habido un error (la función simplemente no hace nada)
        expect(result).toBeUndefined();

        // Restauramos localStorage para no afectar otros tests
        global.localStorage = originalLocalStorage;
    });
});
