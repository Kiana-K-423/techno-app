import { api } from '@/config/axios.config';
import { CategoryType } from '../types';

export const getCategorys = async ({
  page = 1,
  limit = 10,
  search = '',
  sort = 'asc',
}) => {
  const response = await api.get('/category', {
    params: {
      page,
      limit,
      search,
      sort,
    },
  });
  return response.data;
};

export const createCategory = async (
  data: Omit<CategoryType, 'id' | 'createdAt'>
) => {
  const response = await api.post('/category', data);
  return response.data;
};

export const updateCategory = async (data: Omit<CategoryType, 'createdAt'>) => {
  const response = await api.put(`/category`, data);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/category?id=${id}`);
  return response.data;
};
