import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Метод не разрешен' });
        return;
    }

    const {
        type = 'articles',
        q,
        category,
        country,
        pageSize,
        page,
        language,
    } = req.query;

    try {
        let url = '';
        let params = {
            apiKey: NEWS_API_KEY,
        };

        if (type === 'sources') {
            // Получение списка источников
            url = `${NEWS_API_URL}/top-headlines/sources`;
            if (category) params.category = category;
            if (language) params.language = language;
            if (country) params.country = country;
        } else {
            // Получение списка статей
            url = `${NEWS_API_URL}/top-headlines`;
            if (q) params.q = q;
            if (category) params.category = category;
            if (country) params.country = country;
            if (pageSize) params.pageSize = pageSize;
            if (page) params.page = page;
        }

        const response = await axios.get(url, { params });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Ошибка при запросе к NewsAPI:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при получении данных' });
    }
}
