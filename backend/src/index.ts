import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

import dns from 'node:dns';

dotenv.config();
dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // Allow any localhost origin in development
        if (origin.startsWith('http://localhost')) {
            return callback(null, true);
        }
        // Allow specific FRONTEND_URL
        if (origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }
        // Allow Vercel deployments (previews and production)
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        console.log('Blocked by CORS:', origin); // Log blocked origins for debugging
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
connectDB();

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adRoutes from './routes/adRoutes';

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/uploads', uploadRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
