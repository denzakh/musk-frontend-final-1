/* eslint-disable @typescript-eslint/no-explicit-any */
import handler from './news';
import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';

vi.mock('axios');

describe('API news handler', () => {
    const mockRes = () => {
        const res: any = {};
        res.status = vi.fn().mockReturnValue(res);
        res.json = vi.fn().mockReturnValue(res);
        return res;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe rechazar métodos distintos de GET', async () => {
        const req = { method: 'POST', query: {} };
        const res = mockRes();

        await handler(req as any, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ error: 'Метод не разрешен' });
    });

    it('debe retornar fuentes cuando type=sources', async () => {
        (axios.get as any).mockResolvedValue({
            data: { sources: ['fuente1'] },
        });

        const req = {
            method: 'GET',
            query: {
                type: 'sources',
                category: 'business',
                language: 'es',
                country: 'es',
            },
        };
        const res = mockRes();

        await handler(req as any, res);

        expect(axios.get).toHaveBeenCalledWith(
            'https://newsapi.org/v2/top-headlines/sources',
            expect.objectContaining({
                params: expect.objectContaining({
                    apiKey: expect.any(String),
                    category: 'business',
                    language: 'es',
                    country: 'es',
                }),
            })
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ sources: ['fuente1'] });
    });

    it('debe retornar artículos cuando type=articles', async () => {
        (axios.get as any).mockResolvedValue({
            data: { articles: ['articulo1'] },
        });

        const req = {
            method: 'GET',
            query: {
                q: 'test',
                category: 'sports',
                country: 'es',
                pageSize: 5,
                page: 1,
            },
        };
        const res = mockRes();

        await handler(req as any, res);

        expect(axios.get).toHaveBeenCalledWith(
            'https://newsapi.org/v2/top-headlines',
            expect.objectContaining({
                params: expect.objectContaining({
                    apiKey: expect.any(String),
                    q: 'test',
                    category: 'sports',
                    country: 'es',
                    pageSize: 5,
                    page: 1,
                }),
            })
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ articles: ['articulo1'] });
    });

    it('debe manejar errores de la API', async () => {
        (axios.get as any).mockRejectedValue(new Error('fallo'));

        const req = {
            method: 'GET',
            query: { q: 'test' },
        };
        const res = mockRes();

        await handler(req as any, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error de servidor' });
    });

    it('debe retornar error si falta apiKey', async () => {
        // Guardamos el valor original de la variable de entorno
        const originalApiKey = process.env.NEWS_API_KEY;
        // Eliminamos apiKey
        delete process.env.NEWS_API_KEY;

        const req = {
            method: 'GET',
            query: { q: 'test' },
        };
        const res = mockRes();

        await handler(req as any, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error de servidor' });

        // Restauramos la variable de entorno
        process.env.NEWS_API_KEY = originalApiKey;
    });
});
