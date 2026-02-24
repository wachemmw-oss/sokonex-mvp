import { Request, Response } from 'express';
import Ad from '../models/Ad';

const getAdsByCriteria = async (req: Request, res: Response, criteria: any, limit: number, skip: number = 0) => {
    try {
        const query = { status: 'active', ...criteria };
        const items = await Ad.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('title price priceType images city createdAt');

        const total = await Ad.countDocuments(query);

        res.json({
            success: true,
            data: {
                items,
                total,
                page: Math.floor(skip / limit) + 1,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// Home Endpoints
export const getHomeFlash = (req: Request, res: Response) => getAdsByCriteria(req, res, {}, 20); // 20 ads for flash as requested
export const getHomeExclusive = (req: Request, res: Response) => getAdsByCriteria(req, res, { promoted: true }, 8);
export const getHomeTrending = (req: Request, res: Response) => getAdsByCriteria(req, res, {}, 8);
export const getHomeMode = (req: Request, res: Response) => getAdsByCriteria(req, res, { category: 'mode' }, 8);
export const getHomeBeaute = (req: Request, res: Response) => getAdsByCriteria(req, res, { category: 'mode' }, 8); // Assuming beauty is in mode category

export const getListFlash = (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 24;
    const page = Number(req.query.page) || 1;
    getAdsByCriteria(req, res, {}, limit, (page - 1) * limit);
};

export const getListExclusive = (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 24;
    const page = Number(req.query.page) || 1;
    getAdsByCriteria(req, res, { promoted: true }, limit, (page - 1) * limit);
};

export const getListTrending = (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 24;
    const page = Number(req.query.page) || 1;
    getAdsByCriteria(req, res, {}, limit, (page - 1) * limit);
};

export const getListMode = (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 24;
    const page = Number(req.query.page) || 1;
    getAdsByCriteria(req, res, { category: 'mode' }, limit, (page - 1) * limit);
};

export const getListBeaute = (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 24;
    const page = Number(req.query.page) || 1;
    getAdsByCriteria(req, res, { category: 'mode' }, limit, (page - 1) * limit);
};
