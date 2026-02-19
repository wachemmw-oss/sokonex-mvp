import client from '../api/client';
import axios from 'axios';

export const uploadImage = async (file: File) => {
    // 1. Get presigned URL
    const { data: presignData } = await client.post('/uploads/presign', {
        fileName: file.name,
        fileType: file.type,
    });

    const { uploadUrl, publicUrl, key } = presignData.data;

    // 2. Upload to S3 directly
    await axios.put(uploadUrl, file, {
        headers: {
            'Content-Type': file.type,
        },
    });

    return { url: publicUrl, key };
};
