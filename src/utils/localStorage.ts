import { Article } from '../types/news';

const FAVORITES_KEY = 'favorites';

/**
 * Verifica si localStorage está disponible.
 */
const isLocalStorageAvailable = (): boolean => {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

/**
 * Guarda un artículo en la lista de favoritos.
 */
export const saveToFavorites = (article: Article) => {
    if (!isLocalStorageAvailable()) return; // Evitar errores si localStorage no está disponible.

    const current = getFavorites();
    const updated = [...current, article];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};

/**
 * Obtiene la lista actual de artículos favoritos.
 */
export const getFavorites = (): Article[] => {
    if (!isLocalStorageAvailable()) return []; // Evitar errores si localStorage no está disponible.

    const stored = localStorage.getItem(FAVORITES_KEY);
    try {
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error al leer favoritos de localStorage:', e);
        return []; // Retorna un arreglo vacío si ocurre un error al parsear.
    }
};

/**
 * Elimina un artículo de favoritos usando su URL.
 */
export const removeFromFavorites = (url: string) => {
    if (!isLocalStorageAvailable()) return; // Evitar errores si localStorage no está disponible.

    const current = getFavorites().filter((a) => a.url !== url);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(current));
};
