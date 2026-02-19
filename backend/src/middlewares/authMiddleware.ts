import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';

// Extend Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

            req.user = await User.findById(decoded.id).select('-passwordHash') as IUser;

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, error: { code: 'AUTH_FAILED', message: 'Not authorized, token failed' } });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, error: { code: 'NO_TOKEN', message: 'Not authorized, no token' } });
    }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized as admin' } });
    }
};
