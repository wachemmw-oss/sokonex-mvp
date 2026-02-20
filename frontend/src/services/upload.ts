import client from '../api/client';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

export const uploadImage = async (originalFile: File, isAvatar: boolean = false) => {
    // 0. Compress the image before uploading
    let file = originalFile;
    try {
        const options = {
            maxSizeMB: isAvatar ? 0.1 : 0.5,           // Compress to max 100KB for avatars, 500KB for normal
            maxWidthOrHeight: isAvatar ? 400 : 1024,   // 400px for avatars, 1024px for normal
            useWebWorker: true,
            fileType: 'image/webp'    // Force modern light format if possible, otherwise falls back
        };
        const compressedFile = await imageCompression(originalFile, options);
        // Cast back to File to maintain the original filename (optional, but good for backend parsing)
        file = new File([compressedFile], originalFile.name, {
            type: compressedFile.type,
            lastModified: Date.now(),
        });
        console.log(`Compression: ${originalFile.size / 1024 / 1024} MB -> ${file.size / 1024 / 1024} MB`);
    } catch (error) {
        console.warn("Image compression failed, falling back to original file:", error);
    }

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
