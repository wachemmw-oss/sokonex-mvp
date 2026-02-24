import client from '../api/client';

export const createAd = async (data: any) => {
    const response = await client.post('/ads', data);
    return response.data;
};

export const updateAd = async (id: string, data: any) => {
    const response = await client.put(`/ads/${id}`, data);
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

export const reportAd = async (data: { adId: string; reason: string; note?: string }) => {
    const response = await client.post('/reports', data);
    return response.data;
};

// Home & Specific Lists
export const getHomeSection = async (section: string) => {
    const response = await client.get(`/home/${section}`);
    return response.data;
};

export const getListSection = async (section: string, page: number = 1) => {
    const response = await client.get(`/list/${section}`, { params: { page, limit: 24 } });
    return response.data;
};
