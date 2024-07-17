import { api } from '@/config/axios.config';

export const getDashboard = async ({ from = '', to = '' }) => {
  const response = await api.get('/dashboard', {
    params: {
      from,
      to,
    },
  });
  return response.data;
};
