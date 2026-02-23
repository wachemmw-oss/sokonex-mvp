import express from 'express';
import { getReports, removeAd, restoreAd, suspendUser, getStats, getUsers, updateUserBadge } from '../controllers/adminController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/stats', protect, admin, getStats);
router.get('/users', protect, admin, getUsers);
router.get('/reports', protect, admin, getReports);
router.patch('/ads/:id/remove', protect, admin, removeAd);
router.patch('/ads/:id/restore', protect, admin, restoreAd);
router.patch('/users/:id/suspend', protect, admin, suspendUser);
router.patch('/users/:id/badge', protect, admin, updateUserBadge);

export default router;
