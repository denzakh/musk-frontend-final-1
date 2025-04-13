import { useState, useEffect } from 'react';
import axios from 'axios';

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
                console.error('Ошибка при загрузке источников:', error);
            }
        };
        fetchSources();
    }, []);

    const handleApply = () => {
        onFilter(query, date, source);
    };

    console.log(sourcesList);

    return (
        <div className='p-4 flex flex-col sm:flex-row gap-4 items-center'>
            <input
                type='text'
                placeholder='Ключевое слово'
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
            <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className='p-2 rounded border'
            >
                <option value=''>Все источники</option>
                {sourcesList.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                ))}
            </select>
            <button
                onClick={handleApply}
                className='bg-blue-500 text-white p-2 rounded'
            >
                Применить фильтры
            </button>
        </div>
    );
};

export default Filters;
