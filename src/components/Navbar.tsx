import { NavLink, Link } from 'react-router-dom';
import favoriteImg from '../assets/favorite.svg';
import burgerImg from '../assets/burger.svg';
import { useState } from 'react';

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

    return (
        <nav className='relative bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center gap-4'>
            <Link to={'/'}>
                <div className='flex border-blue-500 border-2 font-semibold'>
                    <div className='bg-blue-500 text-white px-2 py-1'>Musk</div>
                    <div className='text-blue-500 bg-white px-2 py-1'>News</div>
                </div>
            </Link>
            <div className={open ? 'block md:block' : 'hidden md:block'}>
                <div className='bg-white flex gap-8 md:gap-4 text-2xl md:text-base absolute md:relative flex-col md:flex-row top-18 md:top-0 right-1 md-right-0 z-10 p-8 md:p-0 shadow-xl md:shadow-none rounded-xl'>
                    {categories.map((cat) => (
                        <NavLink
                            key={cat}
                            to={`/category/${cat}`}
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-blue-500 font-semibold'
                                    : 'text-gray-600 dark:text-gray-300'
                            }
                            onClick={() => setOpen(false)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className='ml-[auto] md:ml-0'>
                <NavLink
                    to='/favorites'
                    className={({ isActive }) =>
                        isActive
                            ? 'text-blue-500 font-semibold'
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
                        <span className='hidden md:inline'>Favorites</span>
                    </div>
                </NavLink>
            </div>
            <div className='flex items-center md:hidden pl-2'>
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
