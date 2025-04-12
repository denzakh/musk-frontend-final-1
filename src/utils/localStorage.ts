import { Article } from '../types/news';

const FAVORITES_KEY = 'favorites';

export const saveToFavorites = (article: Article) => {
    console.log(article);
    const current = getFavorites();
    const updated = [...current, article];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};

export const getFavorites = (): Article[] => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const removeFromFavorites = (url: string) => {
    const current = getFavorites().filter((a) => a.url !== url);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(current));
};
