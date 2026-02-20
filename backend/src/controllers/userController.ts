import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Update user profile
// @route   PATCH /api/users/me
// @access  Private
// @desc    Update user profile
// @route   PATCH /api/users/me
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);

        if (user) {
            // Update fields if provided
            if (req.body.name) user.name = req.body.name || user.name; // user.name might not exist on interface yet, check model
            if (req.body.email) user.email = req.body.email;

            // Phone update logic: Reset verification if phone changes
            if (req.body.phone && req.body.phone !== user.phone) {
                user.phone = req.body.phone;
                user.isPhoneVerified = false; // RESET VERIFICATION
            }

            if (req.body.whatsapp !== undefined) user.whatsapp = req.body.whatsapp;
            if (req.body.showPhone !== undefined) user.showPhone = req.body.showPhone;

            const updatedUser = await user.save();

            res.json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    name: (updatedUser as any).name, // Cast as any if interface not updated yet
                    email: updatedUser.email,
                    role: updatedUser.role,
                    phone: updatedUser.phone,
                    whatsapp: updatedUser.whatsapp,
                    showPhone: updatedUser.showPhone,
                    isPhoneVerified: updatedUser.isPhoneVerified,
                },
            });
        } else {
            res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// @desc    Verify phone number
// @route   POST /api/users/me/verify-phone
// @access  Private
export const verifyPhone = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            return res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
        }

        if (!user.phone) {
            return res.status(400).json({ success: false, error: { code: 'NO_PHONE', message: 'Please add a phone number first' } });
        }

        // Check environment variable for mode
        const mode = process.env.PHONE_VERIFICATION_MODE || 'otp';

        if (mode === 'test') {
            user.isPhoneVerified = true;
            await user.save();
            return res.json({ success: true, data: { isPhoneVerified: true, message: 'Phone verified successfully (Test Mode)' } });
        } else {
            // OTP Logic Placeholder
            // In a real app, generate OTP, send, and wait for verification
            // For MVP strict requirement: standard response needed
            return res.status(400).json({ success: false, error: { code: 'OTP_REQUIRED', message: 'OTP verification is required' } });
        }

    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};
