import client from '../api/client';

export const createAd = async (data: any) => {
    const response = await client.post('/ads', data);
    return response.data;
};

export const getAds = async (params: any) => {
    const response = await client.get('/ads', { params });
    return response.data;
};

export const getAdById = async (id: string) => {
    const response = await client.get(`/ads/${id}`);
    return response.data;
};

export const getSimilarAds = async (id: string) => {
    const response = await client.get(`/ads/${id}/similar`);
    return response.data;
};

export const getMyAds = async () => {
    const response = await client.get('/ads/mine');
    return response.data;
};

export const deleteAd = async (id: string) => {
    const response = await client.delete(`/ads/${id}`);
    return response.data;
};
