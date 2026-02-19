import express from 'express';
import { updateUserProfile, verifyPhone } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.patch('/me', protect, updateUserProfile);
router.post('/me/verify-phone', protect, verifyPhone);

export default router;
