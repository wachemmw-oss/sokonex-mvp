import client from '../api/client';

export const getPublicProfile = async (id: string) => {
    const response = await client.get(`/users/${id}`);
    return response.data;
};

export const updateProfile = async (data: any) => {
    const response = await client.patch('/users/me', data);
    return response.data;
};
