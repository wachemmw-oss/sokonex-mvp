import { Request, Response } from 'express';
import Ad from '../models/Ad';
import { cache } from '../utils/cache';

const getAdsByCriteria = async (req: Request, res: Response, criteria: any, limit: number, skip: number = 0, cacheKey?: string) => {
    try {
        // 1. Try Cache
        if (cacheKey) {
            const cached = cache.get(cacheKey);
            if (cached) {
                res.setHeader('X-Cache', 'HIT');
                return res.json(cached);
            }
        }

        const query = { status: 'active', ...criteria };
        const items = await Ad.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('title price priceType images city createdAt');

        const total = await Ad.countDocuments(query);
        const response = {
            success: true,
            data: {
                items,
                total,
                page: Math.floor(skip / limit) + 1,
                pages: Math.ceil(total / limit)
            }
        };

        // 2. Set Cache
        if (cacheKey) {
            cache.set(cacheKey, response, 300); // 5 min TTL for home sections
            res.setHeader('X-Cache', 'MISS');
        }

        res.json(response);
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// Home Endpoints
export const getHomeFlash = (req: Request, res: Response) => getAdsByCriteria(req, res, {}, 20, 0, 'home:flash');
export const getHomeExclusive = (req: Request, res: Response) => getAdsByCriteria(req, res, { promoted: true }, 8, 0, 'home:exclusive');
export const getHomeTrending = (req: Request, res: Response) => getAdsByCriteria(req, res, {}, 8, 0, 'home:trending');
export const getHomeMode = (req: Request, res: Response) => getAdsByCriteria(req, res, { category: 'mode' }, 8, 0, 'home:mode');
export const getHomeBeaute = (req: Request, res: Response) => getAdsByCriteria(req, res, { category: 'beaute' }, 8, 0, 'home:beaute');

export const getListFlash = (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 24;
    const page = Number(req.query.page) || 1;
    const cacheKey = `list:flash:${page}:${limit}`;
    getAdsByCriteria(req, res, {}, limit, (page - 1) * limit, cacheKey);
};

export const getListExclusive = (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 24;
    const page = Number(req.query.page) || 1;
    const cacheKey = `list:exclusive:${page}:${limit}`;
    getAdsByCriteria(req, res, { promoted: true }, limit, (page - 1) * limit, cacheKey);
};

export const getListTrending = (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 24;
    const page = Number(req.query.page) || 1;
    const cacheKey = `list:trending:${page}:${limit}`;
    getAdsByCriteria(req, res, {}, limit, (page - 1) * limit, cacheKey);
};

export const getListMode = (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 24;
    const page = Number(req.query.page) || 1;
    const cacheKey = `list:mode:${page}:${limit}`;
    getAdsByCriteria(req, res, { category: 'mode' }, limit, (page - 1) * limit, cacheKey);
};

export const getListBeaute = (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 24;
    const page = Number(req.query.page) || 1;
    const cacheKey = `list:beaute:${page}:${limit}`;
    getAdsByCriteria(req, res, { category: 'beaute' }, limit, (page - 1) * limit, cacheKey);
};
