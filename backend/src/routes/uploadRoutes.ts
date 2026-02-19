import express from 'express';
import { getPresignedUrl } from '../controllers/uploadController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/presign', protect, getPresignedUrl);

export default router;
