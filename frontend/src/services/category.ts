import client from '../api/client';

export const getCategories = async () => {
    const response = await client.get('/categories');
    return response.data;
};

export const createCategory = async (data: any) => {
    const response = await client.post('/admin/categories', data);
    return response.data;
};

export const updateCategory = async (id: string, data: any) => {
    const response = await client.patch(`/admin/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: string) => {
    const response = await client.delete(`/admin/categories/${id}`);
    return response.data;
};
