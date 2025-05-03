import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2';

interface NewsApiParams {
    apiKey: string;
    q?: string;
    category?: string;
    country?: string;
    pageSize?: number;
    page?: number;
    language?: string;
}

interface NewsApiRequestQuery extends NewsApiParams {
    type?: string;
}

export default async function handler(
    req: { method: string; query: NewsApiRequestQuery },
    res: {
        status: (arg0: number) => {
            (): unknown;
            new (): unknown;
            json: { (arg0: { error: string }): void; new (): unknown };
        };
    }
): Promise<void> {
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
        const params: NewsApiParams = {
            apiKey: NEWS_API_KEY || '',
        };

        if (type === 'sources') {
            url = `${NEWS_API_URL}/top-headlines/sources`;
            if (category) params.category = category as string;
            if (language) params.language = language as string;
            if (country) params.country = country as string;
        } else {
            url = `${NEWS_API_URL}/top-headlines`;
            if (q) params.q = q as string;
            if (category) params.category = category as string;
            if (country) params.country = country as string;
            if (pageSize) params.pageSize = Number(pageSize);
            if (page) params.page = Number(page);
        }

        const response = await axios.get(url, { params });

        res.status(200).json(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error de NewsAPI:', error.message);
        res.status(500).json({ error: 'Error de servidor' });
    }
}
