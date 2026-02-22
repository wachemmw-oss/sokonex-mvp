import express from 'express';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/adminController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);

// Admin routes
router.post('/', protect, admin, createCategory);
router.patch('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
