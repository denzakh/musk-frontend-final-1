import { useEffect, useState } from 'react';
import { Article } from '../types/news';
import { getFavorites, removeFromFavorites } from '../utils/localStorage';
import NewsCard from '../components/NewsCard';
import { motion, AnimatePresence } from 'framer-motion';
import { emptyFavoritesText } from '../consts';

const Favorites = () => {
    const [favorites, setFavorites] = useState<Article[]>([]);

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    const handleRemove = (url: string) => {
        removeFromFavorites(url);
        setFavorites((prevFavorites) =>
            prevFavorites.filter((article) => article.url !== url)
        );
    };

    return (
        <div className='p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            <AnimatePresence>
                {favorites.length > 0 ? (
                    favorites.map((article, index) => (
                        <motion.div
                            key={article.url}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <NewsCard
                                article={article}
                                onSave={() => handleRemove(article.url)}
                                isFavorite
                            />
                        </motion.div>
                    ))
                ) : (
                    <motion.p
                        className='text-center col-span-full'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {emptyFavoritesText}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Favorites;
