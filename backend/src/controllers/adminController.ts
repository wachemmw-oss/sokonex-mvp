import { Request, Response } from 'express';
import Report from '../models/Report';
import Ad from '../models/Ad';
import User from '../models/User';
import Category from '../models/Category';



// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getReports = async (req: Request, res: Response) => {
    try {
        const reports = await Report.find()
            .populate('adId', 'title subCategory')
            .populate('reporterUserId', 'email')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: reports });
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// @desc    Remove an ad (Soft delete / status change)
// @route   PATCH /api/admin/ads/:id/remove
// @access  Private/Admin
export const removeAd = async (req: Request, res: Response) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (ad) {
            ad.status = 'removed';
            // Optionally store removal reason if schema supports it, for now just status
            await ad.save();

            // Update associated reports to resolved?
            await Report.updateMany({ adId: ad._id } as any, { status: 'resolved' });

            res.json({ success: true, data: ad, message: 'Ad removed successfully' });
        } else {
            res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ad not found' } });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// @desc    Restore a removed ad
// @route   PATCH /api/admin/ads/:id/restore
// @access  Private/Admin
export const restoreAd = async (req: Request, res: Response) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (ad) {
            ad.status = 'active';
            await ad.save();
            res.json({ success: true, data: ad, message: 'Ad restored successfully' });
        } else {
            res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ad not found' } });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// @desc    Suspend a user
// @route   PATCH /api/admin/users/:id/suspend
// @access  Private/Admin
export const suspendUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.status = user.status === 'active' ? 'suspended' : 'active'; // Toggle status
            await user.save();
            res.json({ success: true, data: user, message: `User ${user.status === 'active' ? 'activated' : 'suspended'}` });
        } else {
            res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};
// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req: Request, res: Response) => {
    try {
        const totalAds = await Ad.countDocuments();
        const totalUsers = await User.countDocuments();
        const pendingReports = await Report.countDocuments({ status: { $ne: 'resolved' } });

        res.json({
            success: true,
            data: {
                totalAds,
                totalUsers,
                pendingReports
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find()
            .select('-passwordHash')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().sort({ order: 1 });
        res.json({ success: true, data: categories });
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error: any) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } });
    }
};

// @desc    Update a category
// @route   PATCH /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!category) {
            return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } });
        }
        res.json({ success: true, data: category });
    } catch (error: any) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } });
    }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } });
        }
        res.json({ success: true, data: {}, message: 'Category deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

