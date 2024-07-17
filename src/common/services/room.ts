import { api } from '@/config/axios.config';
import { Room } from '../types';

export const getRooms = async ({
  page = 1,
  limit = 10,
  search = '',
  sort = 'asc',
}) => {
  const response = await api.get('/room', {
    params: {
      page,
      limit,
      search,
      sort,
    },
  });
  return response.data;
};

export const createRoom = async (data: Omit<Room, 'id' | 'createdAt'>) => {
  const response = await api.post('/room', data);
  return response.data;
};

export const updateRoom = async (data: Omit<Room, 'createdAt'>) => {
  const response = await api.put(`/room`, data);
  return response.data;
};

export const deleteRoom = async (id: string) => {
  const response = await api.delete(`/room/${id}`);
  return response.data;
};
