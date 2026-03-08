import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to set Cache-Control headers.
 * Tells browsers and Cloudflare how long to keep the data.
 * 
 * @param seconds - max-age for browser
 * @param sMaxSeconds - s-maxage for shared caches (Cloudflare)
 */
export const setCache = (seconds: number, sMaxSeconds?: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.method === 'GET') {
            const sMax = sMaxSeconds || seconds;
            res.setHeader('Cache-Control', `public, max-age=${seconds}, s-maxage=${sMax}`);
        }
        next();
    };
};
