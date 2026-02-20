import { Request, Response } from 'express';
import Report from '../models/Report';
import Ad from '../models/Ad';
import User from '../models/User';

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
