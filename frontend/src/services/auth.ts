import client from '../api/client';

export const login = async (data: any) => {
    const response = await client.post('/auth/login', data);
    return response.data;
};

export const register = async (data: any) => {
    const response = await client.post('/auth/register', data);
    return response.data;
};

export const getMe = async () => {
    const response = await client.get('/auth/me');
    return response.data;
};

export const updateProfile = async (data: any) => {
    const response = await client.patch('/users/me', data);
    return response.data;
};

export const verifyPhone = async () => {
    const response = await client.post('/users/me/verify-phone');
    return response.data;
};
