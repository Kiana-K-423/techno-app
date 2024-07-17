import { api } from '@/config/axios.config';
import { Itemtype } from '../types';

export const getItems = async ({
  page = 1,
  limit = 10,
  search = '',
  sort = 'asc',
  roomId = '',
}) => {
  const response = await api.get('/item', {
    params: {
      page,
      limit,
      search,
      sort,
      roomId,
    },
  });
  return response.data;
};

export const createItem = async (data: Omit<Itemtype, 'id' | 'createdAt'>) => {
  const response = await api.post('/item', data);
  return response.data;
};

export const updateItem = async (data: Omit<Itemtype, 'createdAt'>) => {
  const response = await api.put(`/item`, data);
  return response.data;
};

export const deleteItem = async (id: string) => {
  const response = await api.delete(`/item?id=${id}`);
  return response.data;
};
