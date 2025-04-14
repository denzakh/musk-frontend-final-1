import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Props {
    onFilter: (query: string, date: string, source: string) => void;
}

const Filters: React.FC<Props> = ({ onFilter }) => {
    const [query, setQuery] = useState('');
    const [date, setDate] = useState('');
    const [source, setSource] = useState('');
    const [sourcesList, setSourcesList] = useState<
        { id: string; name: string }[]
    >([]);

    console.log(source);

    const { category } = useParams();

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const { data } = await axios.get(
                    'https://newsapi.org/v2/top-headlines/sources',
                    {
                        params: {
                            apiKey: import.meta.env.VITE_NEWS_API_KEY,
                        },
                    }
                );
                setSourcesList(data.sources);
            } catch (error) {
                console.error('Error loading sources:', error);
            }
        };
        // fetchSources();
    }, []);

    const handleApply = () => {
        onFilter(query, date, source);
    };

    const handleReset = () => {
        setQuery('');
        setDate('');
        setSource('');
        setSourcesList([]);
        onFilter(query, date, source);
    };

    return (
        <div className='p-4 flex flex-wrap sm:flex-row gap-4 items-center justify-center'>
            <input
                type='text'
                placeholder='Keyword'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='p-2 rounded border'
            />
            <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='p-2 rounded border'
            />

            {category === 'all' && (
                <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className='p-2 rounded border'
                >
                    <option value=''>All sources</option>
                    {sourcesList.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            )}

            <button
                onClick={handleApply}
                className='bg-blue-500 text-white p-2 rounded cursor-pointer'
            >
                Apply <span className='hidden md:inline'>filter</span>
            </button>
            <button
                onClick={handleReset}
                className='bg-red-800 text-white p-2 rounded cursor-pointer'
            >
                Reset
            </button>
        </div>
    );
};

export default Filters;
