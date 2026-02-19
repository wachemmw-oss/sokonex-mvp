import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Update user profile
// @route   PATCH /api/users/me
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);

        if (user) {
            // If phone is being updated to a different number, reset verification
            if (req.body.phone && req.body.phone !== user.phone) {
                user.isPhoneVerified = false;
                user.phone = req.body.phone;
            }

            if (req.body.whatsapp !== undefined) user.whatsapp = req.body.whatsapp;
            if (req.body.showPhone !== undefined) user.showPhone = req.body.showPhone;
            // Prevent updating role, email, password here directly if strictly MVP

            const updatedUser = await user.save();

            res.json({
                success: true,
                data: {
                    _id: updatedUser._id,
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

        const mode = process.env.PHONE_VERIFICATION_MODE || 'otp';

        if (mode === 'test') {
            user.isPhoneVerified = true;
            await user.save();
            return res.json({ success: true, data: { isPhoneVerified: true, message: 'Phone verified successfully (Test Mode)' } });
        } else {
            // OTP Mode Placeholder
            return res.status(400).json({ success: false, error: { code: 'OTP_REQUIRED', message: 'OTP verification not implemented yet' } });
        }

    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};
