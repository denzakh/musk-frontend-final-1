import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import favoriteImg from '../assets/favorite.svg';
import burgerImg from '../assets/burger.svg';
import searchImg from '../assets/search.svg';
import sunImg from '../assets/sun.svg';
import moonImg from '../assets/moon.svg';
import { useDarkMode } from '../hooks/useDarkMode';

const categories = [
    'general',
    'sports',
    'technology',
    'business',
    'health',
    'entertainment',
];

const Navbar = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [isDark, setIsDark] = useDarkMode();

    return (
        <nav className='relative bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center gap-4'>
            <div className='flex items-center gap-3 md:gap-4'>
                <Link to={'/'}>
                    <div className='flex border-blue-500 border-2 font-semibold dark:border-blue-300'>
                        <div className='bg-blue-500 text-white dark:text-gray-800 dark:bg-blue-300 px-2 py-1'>
                            Musk
                        </div>
                        <div className='text-blue-500 dark:text-blue-200 bg-white dark:bg-gray-800 px-2 py-1'>
                            News
                        </div>
                    </div>
                </Link>
                <div className='shrink-0'>
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className='p-0 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center'
                        title='switch theme'
                    >
                        {isDark ? (
                            <img
                                src={sunImg}
                                alt={''}
                                width={30}
                                height={30}
                                className=''
                            />
                        ) : (
                            <img
                                src={moonImg}
                                alt={''}
                                width={30}
                                height={30}
                                className=''
                            />
                        )}
                    </button>
                </div>
            </div>
            <div className={open ? 'block md:block' : 'hidden md:block'}>
                <div className='bg-white dark:bg-gray-800 flex gap-8 md:gap-4 text-2xl md:text-base absolute md:relative flex-col md:flex-row top-18 md:top-0 right-1 md-right-0 z-10 p-8 md:p-0 shadow-xl md:shadow-none rounded-xl'>
                    {categories.map((cat) => (
                        <NavLink
                            key={cat}
                            to={`/category/${cat}`}
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-blue-500 font-semibold dark:text-white'
                                    : 'text-gray-600 dark:text-gray-300'
                            }
                            onClick={() => setOpen(false)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className='ml-[auto] md:ml-0 flex items-center gap-3 md:gap-4'>
                <NavLink
                    to='/filters'
                    className={({ isActive }) =>
                        isActive
                            ? 'text-blue-500 font-semibold dark:text-white'
                            : 'text-gray-600 dark:text-gray-300'
                    }
                >
                    <div className='flex items-center gap-2'>
                        <img
                            src={searchImg}
                            alt={''}
                            width={30}
                            height={30}
                            className=''
                        />
                        <span className='hidden lg:inline'>Search</span>
                    </div>
                </NavLink>
                <NavLink
                    to='/favorites'
                    className={({ isActive }) =>
                        isActive
                            ? 'text-blue-500 font-semibold dark:text-white'
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
                        <span className='hidden lg:inline'>Favorites</span>
                    </div>
                </NavLink>
            </div>
            <div className='flex items-center md:hidden'>
                <button className='' onClick={() => setOpen((open) => !open)}>
                    <img
                        src={burgerImg}
                        alt={''}
                        width={30}
                        height={30}
                        className=''
                    />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
