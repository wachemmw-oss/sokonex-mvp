import express from 'express';
import { getReports, removeAd, restoreAd, suspendUser } from '../controllers/adminController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/reports', protect, admin, getReports);
router.patch('/ads/:id/remove', protect, admin, removeAd);
router.patch('/ads/:id/restore', protect, admin, restoreAd);
router.patch('/users/:id/suspend', protect, admin, suspendUser);

export default router;
