import client from '../api/client';
import axios from 'axios';

export const uploadImage = async (file: File) => {
    // 1. Get presigned URL
    let presignData;
    try {
        const response = await client.post('/uploads/presign', {
            fileName: file.name,
            fileType: file.type,
        });
        presignData = response.data;
    } catch (error: any) {
        console.error("Backend Presign Error:", error);
        throw new Error(`Échec de la connexion au serveur (Presign): ${error.response?.status || error.message}`);
    }

    const { uploadUrl, publicUrl, key } = presignData.data;
    console.log("Uploading to S3 URL:", uploadUrl); // Debug: Check if bucket name is correct

    // 2. Upload to S3 directly
    try {
        await axios.put(uploadUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });
    } catch (error: any) {
        console.error("S3 Upload Error:", error);
        throw new Error(`Refusé par S3 (403). Vérifiez le NOM DU BUCKET et les CLES AWS sur Render. URL: ${uploadUrl.split('?')[0]}`);
    }

    return { url: publicUrl, key };
};
