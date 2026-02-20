import express from 'express';
import Report from '../models/Report';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// @desc   Create a new report
// @route  POST /api/reports
// @access Public (but we still log reporters when they are logged in)
router.post('/', async (req, res) => {
    try {
        const { adId, reason, note } = req.body;
        if (!adId || !reason) {
            return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS', message: 'adId and reason are required' } });
        }

        const report = await Report.create({
            adId,
            reason,
            text: note,
            // Safely attach the reporting user if authenticated
            reporterUserId: (req as any).user?._id
        });

        res.status(201).json({ success: true, data: report });
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
});

export default router;
