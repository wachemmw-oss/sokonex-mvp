import express from 'express';
import { createAd, getAds, getAdById, getSimilarAds, getMyAds, deleteAd } from '../controllers/adController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, createAd);
router.get('/', getAds);
router.get('/mine', protect, getMyAds);
router.get('/:id', getAdById);
router.get('/:id/similar', getSimilarAds);
router.delete('/:id', protect, deleteAd);
// PATCH /:id for update to be implemented

export default router;
