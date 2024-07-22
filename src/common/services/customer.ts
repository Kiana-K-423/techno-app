import { api } from '@/config/axios.config';
import { CustomerType } from '../types';

export const getCustomers = async ({
  page = 1,
  limit = 10,
  search = '',
  sort = 'asc',
}) => {
  const response = await api.get('/customer', {
    params: {
      page,
      limit,
      search,
      sort,
    },
  });
  return response.data;
};

export const createCustomer = async (
  data: Omit<CustomerType, 'id' | 'createdAt'>
) => {
  const response = await api.post('/customer', data);
  return response.data;
};

export const updateCustomer = async (data: Omit<CustomerType, 'createdAt'>) => {
  const response = await api.put(`/customer`, data);
  return response.data;
};

export const deleteCustomer = async (id: string) => {
  const response = await api.delete(`/customer?id=${id}`);
  return response.data;
};
