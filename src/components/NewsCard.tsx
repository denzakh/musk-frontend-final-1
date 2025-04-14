import { Article } from '../types/news';
import bookmarkImg from '../assets/bookmark.svg';

interface Props {
    article: Article;
    onSave?: (article: Article) => void;
    isFavorite?: boolean;
}

const NewsCard: React.FC<Props> = ({
    article,
    onSave = () => {},
    isFavorite = false,
}) => (
    <div className='relative rounded-xl shadow-md p-4 bg-white dark:bg-gray-800 transition flex flex-col'>
        {article.urlToImage && (
            <img
                src={article.urlToImage}
                alt={article.title}
                className='rounded-lg mb-2'
                data-testid='img'
            />
        )}
        <h2 className='text-xl font-semibold'>{article.title}</h2>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
            {new Date(article.publishedAt).toLocaleDateString()}
        </p>
        <p className='text-sm mt-2'>{article.description}</p>
        <div
            className='pt-4 flex justify-between items-center'
            style={{ marginTop: 'auto' }}
        >
            <a
                href={article.url}
                target='_blank'
                className='text-blue-500 dark:text-blue-300'
            >
                Read the article
            </a>
            {onSave && (
                <button
                    onClick={() => onSave(article)}
                    className={`cursor-pointer ${
                        isFavorite
                            ? 'text-red-600 dark:text-red-300'
                            : 'text-blue-500 dark:text-blue-300'
                    } `}
                >
                    {isFavorite ? 'Remove from favorites' : 'Add to Favorites'}
                </button>
            )}
        </div>
        <div className='absolute right-4 -top-1'>
            {isFavorite && (
                <img
                    src={bookmarkImg}
                    alt={''}
                    width={60}
                    height={60}
                    className='drop-shadow-sm brightness-120 dark:brightness-100'
                    data-testid='favoriteIcon'
                />
            )}
        </div>
    </div>
);

export default NewsCard;
