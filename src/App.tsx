import { Routes, Route, Navigate } from 'react-router-dom';
import Category from './pages/Category';
import Favorites from './pages/Favorites';
import Navbar from './components/Navbar';

function App() {
    return (
        <div className='min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'>
            <Navbar />
            <Routes>
                <Route
                    path='/'
                    element={<Navigate to='/category/general' replace />}
                />
                <Route path='/category/:category' element={<Category />} />
                <Route path='/favorites' element={<Favorites />} />
            </Routes>
        </div>
    );
}

export default App;
