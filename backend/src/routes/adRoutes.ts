import express from 'express';
import { createAd, getAds, getAdById, getSimilarAds, getMyAds, deleteAd, updateAd } from '../controllers/adController';
import { protect } from '../middlewares/authMiddleware';
import { setCache } from '../middleware/cacheMiddleware';

const router = express.Router();

router.post('/', protect, createAd);
router.get('/', setCache(60, 300), getAds);
router.get('/mine', protect, getMyAds);
router.get('/:id', setCache(30, 120), getAdById);
router.get('/:id/similar', setCache(120, 600), getSimilarAds);
router.put('/:id', protect, updateAd);
router.delete('/:id', protect, deleteAd);

export default router;
