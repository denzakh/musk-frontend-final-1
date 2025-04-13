import { NavLink } from 'react-router-dom';
import favoriteImg from '../assets/favorite.svg';

const categories = [
    'general',
    'sports',
    'technology',
    'business',
    'health',
    'entertainment',
];

const Navbar = () => {
    return (
        <nav className='bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center'>
            <div className='flex border-blue-500 border-2 font-semibold'>
                <div className='bg-blue-500 text-white px-2 py-1'>Musk</div>
                <div className='text-blue-500 bg-white px-2 py-1'>News</div>
            </div>

            <div className='flex gap-4 overflow-auto'>
                {categories.map((cat) => (
                    <NavLink
                        key={cat}
                        to={`/category/${cat}`}
                        className={({ isActive }) =>
                            isActive
                                ? 'text-blue-500 font-semibold'
                                : 'text-gray-600 dark:text-gray-300'
                        }
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </NavLink>
                ))}
            </div>
            <div className=''>
                <NavLink
                    to='/favorites'
                    className={({ isActive }) =>
                        isActive
                            ? 'text-yellow-500 font-semibold'
                            : 'text-gray-600 dark:text-gray-300'
                    }
                >
                    <div className='flex items-center gap-2'>
                        <img
                            src={favoriteImg}
                            alt={''}
                            width={30}
                            height={30}
                            className=''
                        />
                        Favorites
                    </div>
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
