const NewsCardSkeleton = () => {
    return (
        <div
            className='rounded-xl shadow-md p-4 bg-white dark:bg-gray-800 animate-pulse'
            title='skeleton'
        >
            <div className='w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2'></div>
            <div className='h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
            <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2'></div>
            <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4'></div>
            <div className='flex justify-between items-center'>
                <div className='h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded'></div>
                <div className='h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded'></div>
            </div>
        </div>
    );
};

export default NewsCardSkeleton;
