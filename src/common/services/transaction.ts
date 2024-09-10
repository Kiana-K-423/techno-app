import { api } from '@/config/axios.config';
import { TransactionType } from '../types';

export const getTransactions = async ({
  page = 1,
  limit = 10,
  search = '',
  sort = 'asc',
  itemId = '',
  type = 'IN',
}) => {
  const response = await api.get('/transaction', {
    params: {
      page,
      limit,
      search,
      sort,
      itemId,
      type,
    },
  });
  return response.data;
};

export const createTransaction = async (
  data: Omit<TransactionType, 'id' | 'createdAt' | 'uuid'> & {
    name: string;
    phone: string;
    address: string;
  }
) => {
  const response = await api.post('/transaction', data);
  return response.data;
};

export const updateTransaction = async (
  data: Omit<TransactionType, 'createdAt' | 'uuid'>
) => {
  const response = await api.put(`/transaction`, data);
  return response.data;
};

export const deleteTransaction = async (id: string) => {
  const response = await api.delete(`/transaction?id=${id}`);
  return response.data;
};
