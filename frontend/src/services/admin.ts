import client from '../api/client';

export const getReports = async () => {
    const response = await client.get('/admin/reports');
    return response.data;
};

export const getStats = async () => {
    const response = await client.get('/admin/stats');
    return response.data;
};

export const getUsers = async () => {
    const response = await client.get('/admin/users');
    return response.data;
};


export const removeAd = async (id: string) => {
    const response = await client.patch(`/admin/ads/${id}/remove`);
    return response.data;
};

export const restoreAd = async (id: string) => {
    const response = await client.patch(`/admin/ads/${id}/restore`);
    return response.data;
};

export const suspendUser = async (id: string) => {
    const response = await client.patch(`/admin/users/${id}/suspend`);
    return response.data;
};

export const updateUserBadge = async (id: string, badge: string) => {
    const response = await client.patch(`/admin/users/${id}/badge`, { badge });
    return response.data;
};
