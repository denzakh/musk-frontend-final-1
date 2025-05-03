export const getApiKey = () =>
    import.meta.env.VITE_NEWS_API_URL || process.env.NEWS_API_URL;

console.log('API Key:', getApiKey());
