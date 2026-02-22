import express from 'express';
import { updateUserProfile, verifyPhone, getPublicProfile } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:id', getPublicProfile);
router.patch('/me', protect, updateUserProfile);
router.post('/me/verify-phone', protect, verifyPhone);

export default router;
