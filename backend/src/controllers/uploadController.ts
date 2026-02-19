import { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

// @desc    Get presigned URL for S3 upload
// @route   POST /api/uploads/presign
// @access  Private
export const getPresignedUrl = async (req: Request, res: Response) => {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
        return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'fileName and fileType are required' } });
    }

    // Allow only images
    if (!fileType.startsWith('image/')) {
        return res.status(400).json({ success: false, error: { code: 'INVALID_TYPE', message: 'Only images are allowed' } });
    }

    const fileExtension = fileName.split('.').pop();
    const key = `ads/${req.user?._id}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    });

    try {
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
        // Public URL depends on bucket config (public-read or CloudFront)
        // Assuming standard S3 public URL format for now
        const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        res.json({
            success: true,
            data: {
                uploadUrl,
                publicUrl,
                key,
            },
        });
    } catch (error: any) {
        console.error('S3 Presign Error:', error);
        res.status(500).json({ success: false, error: { code: 'UPLOAD_ERROR', message: 'Could not generate upload URL' } });
    }
};
