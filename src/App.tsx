import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

const Category = lazy(() => import('./pages/Category'));
const Favorites = lazy(() => import('./pages/Favorites'));
const FilterPage = lazy(() => import('./pages/FilterPage'));

function App() {
    return (
        <div className='min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'>
            <Navbar />
            <Suspense
                fallback={<div className='text-center p-8'>Loading...</div>}
            >
                <Routes>
                    <Route
                        path='/'
                        element={<Navigate to='/category/general' replace />}
                    />
                    <Route path='/category/:category' element={<Category />} />
                    <Route path='/favorites' element={<Favorites />} />
                    <Route path='/filters' element={<FilterPage />} />
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;
